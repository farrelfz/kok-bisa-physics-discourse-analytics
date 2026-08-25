import pandas as pd
import os

def validate_split():
    train_path = "data/processed/train_balanced.parquet"
    val_path = "data/processed/validation_balanced.parquet"
    test_path = "data/processed/test_balanced.parquet"
    report_path = "reports/notebook_08_split_validation.md"
    
    df_train = pd.read_parquet(train_path)
    df_val = pd.read_parquet(val_path)
    df_test = pd.read_parquet(test_path)
    
    train_vids = set(df_train['video_id'].unique())
    val_vids = set(df_val['video_id'].unique())
    test_vids = set(df_test['video_id'].unique())
    
    overlap_train_val = train_vids.intersection(val_vids)
    overlap_train_test = train_vids.intersection(test_vids)
    overlap_val_test = val_vids.intersection(test_vids)
    
    is_valid = len(overlap_train_val) == 0 and len(overlap_train_test) == 0 and len(overlap_val_test) == 0
    
    total = len(df_train) + len(df_val) + len(df_test)
    
    report = f"""# Notebook 08 Video-Group Split Validation

## Size Distribution
- **Train**: {len(df_train)} ({(len(df_train)/total)*100:.1f}%)
- **Validation**: {len(df_val)} ({(len(df_val)/total)*100:.1f}%)
- **Test**: {len(df_test)} ({(len(df_test)/total)*100:.1f}%)

## Leakage Audit
- **Train vs Validation Overlap**: {len(overlap_train_val)} videos
- **Train vs Test Overlap**: {len(overlap_train_test)} videos
- **Validation vs Test Overlap**: {len(overlap_val_test)} videos
- **Status**: {'PASS (Zero Leakage)' if is_valid else 'FAIL (Leakage Detected)'}
"""
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print(f"Split validation completed. Status: {'PASS' if is_valid else 'FAIL'}")

if __name__ == "__main__":
    validate_split()
