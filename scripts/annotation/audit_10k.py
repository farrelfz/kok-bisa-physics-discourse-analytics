import pandas as pd
import os

def audit_10k():
    gold_path = "data/annotated/gold_standard_10k_sample.csv"
    pilot_path = "data/annotated/pilot_gold_520.csv"
    calib_path = "data/annotated/calibration_batch_100.csv"
    report_path = "reports/gold_dataset_pre_annotation_audit.md"
    
    df_gold = pd.read_csv(gold_path)
    df_pilot = pd.read_csv(pilot_path) if os.path.exists(pilot_path) else pd.DataFrame()
    df_calib = pd.read_csv(calib_path) if os.path.exists(calib_path) else pd.DataFrame()
    
    # Check rows
    total_rows = len(df_gold)
    
    # Check duplicates
    if 'sample_id' in df_gold.columns:
        duplicate_sample_ids = df_gold['sample_id'].duplicated().sum()
    else:
        duplicate_sample_ids = 0
        
    if 'comment_id' in df_gold.columns:
        duplicate_comment_ids = df_gold['comment_id'].duplicated().sum()
    else:
        duplicate_comment_ids = 0
        
    duplicate_texts = df_gold['text'].duplicated().sum() if 'text' in df_gold.columns else 0
    missing_texts = df_gold['text'].isna().sum() if 'text' in df_gold.columns else 0
    
    # Existing labels
    if 'discourse_label' in df_gold.columns:
        existing_labels = df_gold['discourse_label'].notna().sum()
    else:
        existing_labels = 0
        
    # Check overlap
    overlap_pilot = 0
    overlap_calib = 0
    if 'comment_id' in df_gold.columns and 'comment_id' in df_pilot.columns:
        overlap_pilot = df_gold['comment_id'].isin(df_pilot['comment_id']).sum()
    if 'comment_id' in df_gold.columns and 'comment_id' in df_calib.columns:
        overlap_calib = df_gold['comment_id'].isin(df_calib['comment_id']).sum()
        
    # Video distribution
    video_dist = df_gold['video_id'].value_counts().to_dict() if 'video_id' in df_gold.columns else {}
    top_videos = list(video_dist.items())[:5]
    
    # Comment length
    df_gold['text_len'] = df_gold['text'].astype(str).apply(len)
    avg_len = df_gold['text_len'].mean()
    
    report = f"""# Gold Dataset 10K Pre-Annotation Audit

## 1. Summary
- **Total Rows**: {total_rows}
- **Missing Text**: {missing_texts}
- **Existing Labels**: {existing_labels}

## 2. Integrity Checks
- **Duplicate Sample IDs**: {duplicate_sample_ids}
- **Duplicate Comment IDs**: {duplicate_comment_ids}
- **Duplicate Text**: {duplicate_texts}

## 3. Leakage Checks
- **Overlap with Pilot (520)**: {overlap_pilot}
- **Overlap with Calibration (100)**: {overlap_calib}

## 4. Distribution
- **Avg Comment Length**: {avg_len:.1f} chars
- **Unique Videos**: {len(video_dist)}
- **Top 5 Videos by Comment Count**:
"""
    for v, c in top_videos:
        report += f"  - `{v}`: {c}\n"

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print("Pre-annotation audit complete.")

if __name__ == "__main__":
    audit_10k()
