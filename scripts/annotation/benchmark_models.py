import pandas as pd
import numpy as np
import os
import time
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

def benchmark():
    os.makedirs("reports/model_benchmark", exist_ok=True)
    
    # Check if GPU is available in PyTorch, but we know it's not. 
    # To keep runtime feasible on CPU, we will sample the dataset down heavily for benchmarking.
    # We explicitly state this limitation.
    
    print("Loading data...")
    df_train = pd.read_parquet("data/processed/train_balanced.parquet").sample(n=100, random_state=42)
    df_val = pd.read_parquet("data/processed/validation_balanced.parquet").sample(n=50, random_state=42)
    
    models = ["indobenchmark/indobert-base-p1", "microsoft/mdeberta-v3-base"]
    
    results = []
    
    for model_name in models:
        print(f"Benchmarking {model_name}...")
        start_time = time.time()
        
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        if "deberta" in model_name.lower() and tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        def tokenize(batch):
            return tokenizer(batch['text'], padding="max_length", truncation=True, max_length=128)
            
        ds_train = Dataset.from_pandas(df_train)
        ds_val = Dataset.from_pandas(df_val)
        
        ds_train = ds_train.map(tokenize, batched=True)
        ds_val = ds_val.map(tokenize, batched=True)
        
        ds_train = ds_train.rename_column("label_id", "label")
        ds_val = ds_val.rename_column("label_id", "label")
        
        ds_train.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
        ds_val.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
        
        model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=8)
        
        # Fast configuration for CPU constraint
        args = TrainingArguments(
            output_dir=f"models/temp_{model_name.replace('/', '_')}",
            evaluation_strategy="epoch",
            learning_rate=2e-5,
            per_device_train_batch_size=4,
            num_train_epochs=1,
            max_steps=5, # Extreme constraint for CPU
            use_cpu=True
        )
        
        trainer = Trainer(
            model=model,
            args=args,
            train_dataset=ds_train,
            eval_dataset=ds_val
        )
        
        print("Training...")
        trainer.train()
        
        print("Evaluating...")
        preds = trainer.predict(ds_val)
        y_pred = np.argmax(preds.predictions, axis=1)
        y_true = preds.label_ids
        
        mac_f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)
        wt_f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
        acc = accuracy_score(y_true, y_pred)
        
        end_time = time.time()
        
        results.append({
            "Model": model_name,
            "Macro F1": f"{mac_f1:.4f}",
            "Weighted F1": f"{wt_f1:.4f}",
            "Accuracy": f"{acc:.4f}",
            "Training Time (s)": f"{end_time - start_time:.1f}"
        })
        
        # Phase 8: Error Analysis prep
        # Find some errors
        errors = []
        for i in range(len(y_true)):
            if y_true[i] != y_pred[i]:
                errors.append({
                    "Text": df_val.iloc[i]['text'],
                    "True Label ID": y_true[i],
                    "Predicted Label ID": y_pred[i]
                })
        
        # Save errors for analysis
        pd.DataFrame(errors).to_csv(f"reports/model_benchmark/{model_name.replace('/', '_')}_errors.csv", index=False)
        
    df_res = pd.DataFrame(results)
    df_res.to_csv("reports/model_benchmark/model_comparison.csv", index=False)
    
    with open("reports/model_benchmark/benchmark_summary.md", "w", encoding="utf-8") as f:
        f.write("# Model Benchmark Summary\\n\\n")
        f.write(df_res.to_markdown(index=False))
        f.write("\\n\\n**Note**: Due to local execution on CPU, training was constrained to a minuscule sample size (100 train, 50 val) and 5 max_steps. The metrics reflect this random-baseline performance limit.")
        
    print("Benchmarking complete.")

if __name__ == "__main__":
    benchmark()
