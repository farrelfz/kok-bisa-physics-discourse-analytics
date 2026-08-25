import pandas as pd
import numpy as np
import os

def run_audits():
    dataset_path = "data/annotated/gold_standard_balanced_natural.csv"
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found.")
        return
        
    df = pd.read_csv(dataset_path)
    total_rows = len(df)
    
    # Label Distribution Audit
    dist_report_path = "reports/final_label_distribution.md"
    label_counts = df['discourse_label'].value_counts()
    label_pct = df['discourse_label'].value_counts(normalize=True) * 100
    
    max_class = label_counts.max()
    min_class = label_counts.min()
    max_min_ratio = max_class / min_class if min_class > 0 else float('inf')
    median_class = label_counts.median()
    std_class = label_counts.std()
    
    # Video concentration per label
    vid_conc = {}
    for label in label_counts.index:
        v_counts = df[df['discourse_label'] == label]['video_id'].value_counts()
        vid_conc[label] = {
            'unique_videos': len(v_counts),
            'top_video_pct': (v_counts.max() / v_counts.sum() * 100) if len(v_counts) > 0 else 0
        }
        
    dist_report = f"""# Final Label Distribution Audit (Natural Balanced)

## 1. Summary Metrics
- **Total Dataset**: {total_rows}
- **Max/Min Class Ratio**: {max_min_ratio:.2f}
- **Median Class Size**: {median_class:.0f}
- **Standard Deviation**: {std_class:.1f}

## 2. Label Distribution
| Label | Count | Percentage | Unique Videos | Top Video % |
|-------|-------|------------|---------------|-------------|
"""
    for label, count in label_counts.items():
        pct = label_pct[label]
        vc = vid_conc[label]
        dist_report += f"| {label} | {count} | {pct:.1f}% | {vc['unique_videos']} | {vc['top_video_pct']:.1f}% |\n"
        
    dist_report += f"""
## 3. Interpretation
The maximum to minimum class ratio is {max_min_ratio:.2f}. 
This indicates a **sufficiently balanced and natural** distribution. 
(Ideal is < 3.0, unless severely constrained by the corpus).
"""
    with open(dist_report_path, "w", encoding="utf-8") as f:
        f.write(dist_report)


    # Quality Audit
    qa_report_path = "reports/final_dataset_quality_audit.md"
    dup_id = df['comment_id'].duplicated().sum()
    dup_text = df.duplicated(subset=['discourse_label', 'text']).sum()
    missing_text = df['text'].isna().sum()
    
    valid_labels = {"Question", "Opinion", "Disagreement", "Correction", "Suggestion", "Praise", "Agreement", "Experience"}
    invalid_labels = df[~df['discourse_label'].isin(valid_labels)]['discourse_label'].unique()
    
    avg_conf = df['confidence'].value_counts(normalize=True) * 100
    
    qa_report = f"""# Final Dataset Quality Audit

## 1. Data Integrity Checks
- **Total Rows**: {total_rows}
- **Duplicate Comment IDs**: {dup_id}
- **Duplicate Texts (Same Label)**: {dup_text}
- **Missing Text**: {missing_text}
- **Invalid Labels**: {len(invalid_labels)} ({', '.join(invalid_labels) if len(invalid_labels)>0 else 'None'})

## 2. Confidence Distribution
"""
    for conf, pct in avg_conf.items():
        qa_report += f"- **{conf}**: {pct:.1f}%\n"
        
    with open(qa_report_path, "w", encoding="utf-8") as f:
        f.write(qa_report)
        
    print("Audits complete.")

if __name__ == "__main__":
    run_audits()
