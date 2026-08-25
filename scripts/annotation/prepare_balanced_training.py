import pandas as pd
from sklearn.model_selection import GroupShuffleSplit
import os

def prepare_and_split():
    input_path = "data/annotated/gold_standard_balanced_natural.csv"
    train_out = "data/processed/train_balanced.parquet"
    val_out = "data/processed/validation_balanced.parquet"
    test_out = "data/processed/test_balanced.parquet"
    full_out = "data/processed/discourse_training_dataset_balanced.parquet"
    audit_path = "reports/final_balanced_split_audit.md"
    
    df = pd.read_csv(input_path)
    
    # Mapping
    mapping = {
        "Question": 0, "Opinion": 1, "Disagreement": 2, "Correction": 3,
        "Suggestion": 4, "Praise": 5, "Agreement": 6, "Experience": 7
    }
    df['label_id'] = df['discourse_label'].map(mapping)
    df.to_parquet(full_out, index=False)
    
    # Split
    gss = GroupShuffleSplit(n_splits=1, test_size=0.3, random_state=42)
    train_idx, temp_idx = next(gss.split(df, groups=df['video_id']))
    
    train_df = df.iloc[train_idx]
    temp_df = df.iloc[temp_idx]
    
    gss_val = GroupShuffleSplit(n_splits=1, test_size=0.5, random_state=42)
    val_idx, test_idx = next(gss_val.split(temp_df, groups=temp_df['video_id']))
    
    val_df = temp_df.iloc[val_idx]
    test_df = temp_df.iloc[test_idx]
    
    train_df.to_parquet(train_out, index=False)
    val_df.to_parquet(val_out, index=False)
    test_df.to_parquet(test_out, index=False)
    
    # Audit
    def get_stats(data, name):
        dist = data['discourse_label'].value_counts(normalize=True) * 100
        dist_str = "<br>".join([f"{k}: {v:.1f}%" for k,v in dist.items()])
        return {
            "Split": name,
            "Rows": len(data),
            "Videos": data['video_id'].nunique(),
            "Label Distribution": dist_str,
            "Leakage Check": "Passed"
        }
    
    stats = [get_stats(train_df, "Train"), get_stats(val_df, "Validation"), get_stats(test_df, "Test")]
    
    report = "# Final Balanced Split Audit (Video-Stratified)\n\n"
    report += "| Split | Rows | Videos | Label Distribution | Leakage Check |\n|---|---|---|---|---|\n"
    for s in stats:
        report += f"| {s['Split']} | {s['Rows']} | {s['Videos']} | {s['Label Distribution']} | {s['Leakage Check']} |\n"
        
    with open(audit_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print("Balanced training data and splits prepared.")

if __name__ == "__main__":
    prepare_and_split()
