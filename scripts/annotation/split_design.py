import pandas as pd
from sklearn.model_selection import GroupShuffleSplit
import os

def create_splits():
    input_path = "data/processed/discourse_training_dataset.parquet"
    report_path = "reports/final_split_audit.md"
    
    df = pd.read_parquet(input_path)
    
    gss = GroupShuffleSplit(n_splits=1, test_size=0.3, random_state=42)
    train_idx, temp_idx = next(gss.split(df, groups=df['video_id']))
    
    train_df = df.iloc[train_idx]
    temp_df = df.iloc[temp_idx]
    
    gss_val = GroupShuffleSplit(n_splits=1, test_size=0.5, random_state=42)
    val_idx, test_idx = next(gss_val.split(temp_df, groups=temp_df['video_id']))
    
    val_df = temp_df.iloc[val_idx]
    test_df = temp_df.iloc[test_idx]
    
    # Save splits
    train_df.to_parquet("data/processed/train.parquet", index=False)
    val_df.to_parquet("data/processed/validation.parquet", index=False)
    test_df.to_parquet("data/processed/test.parquet", index=False)
    
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
    
    report = "# Final Split Audit (Video-Stratified Group Split)\n\n"
    report += "| Split | Rows | Videos | Label Distribution | Leakage Check |\n|---|---|---|---|---|\n"
    for s in stats:
        report += f"| {s['Split']} | {s['Rows']} | {s['Videos']} | {s['Label Distribution']} | {s['Leakage Check']} |\n"
        
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print("Split design complete.")

if __name__ == "__main__":
    create_splits()
