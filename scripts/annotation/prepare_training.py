import pandas as pd
import json
import os

def prepare_training_data():
    input_path = "data/annotated/gold_standard_10k_final.csv"
    output_parquet = "data/processed/discourse_training_dataset.parquet"
    mapping_path = "config/discourse_label_mapping.json"
    
    os.makedirs(os.path.dirname(mapping_path), exist_ok=True)
    os.makedirs(os.path.dirname(output_parquet), exist_ok=True)
    
    df = pd.read_csv(input_path)
    
    mapping = {
        "Question": 0,
        "Opinion": 1,
        "Disagreement": 2,
        "Correction": 3,
        "Suggestion": 4,
        "Praise": 5,
        "Agreement": 6,
        "Experience": 7
    }
    
    with open(mapping_path, "w") as f:
        json.dump(mapping, f, indent=2)
        
    df['label_id'] = df['discourse_label'].map(mapping)
    df.to_parquet(output_parquet, index=False)
    
    print("Training dataset prepared.")

if __name__ == "__main__":
    prepare_training_data()
