import pandas as pd
import os

def qa_10k():
    verified_path = "data/annotated/gold_standard_10k_verified.csv"
    report_path = "reports/gold_annotation_qa_report.md"
    
    df = pd.read_csv(verified_path)
    
    total_rows = len(df)
    missing_labels = df['verification_label'].isna().sum()
    duplicate_ids = df['comment_id'].duplicated().sum() if 'comment_id' in df.columns else 0
    
    valid_labels = {"Question", "Opinion", "Disagreement", "Correction", "Suggestion", "Praise", "Agreement", "Experience"}
    invalid_labels = df[~df['verification_label'].isin(valid_labels)]['verification_label'].unique()
    
    # Distributions
    label_dist = df['verification_label'].value_counts()
    
    conf_col = 'annotation_confidence'
    if conf_col in df.columns:
        low_conf = (df[conf_col] == 'Low').sum()
        low_conf_rate = (low_conf / total_rows) * 100
    else:
        low_conf = 0
        low_conf_rate = 0.0
        
    disagreements = (df['agreement'] == False).sum()
    disagreement_rate = (disagreements / total_rows) * 100
    
    # Breakdown table
    breakdown = []
    for lbl in valid_labels:
        count = (df['verification_label'] == lbl).sum()
        perc = (count / total_rows) * 100 if total_rows > 0 else 0
        if conf_col in df.columns:
            h = ((df['verification_label'] == lbl) & (df[conf_col] == 'High')).sum()
            m = ((df['verification_label'] == lbl) & (df[conf_col] == 'Medium')).sum()
            l = ((df['verification_label'] == lbl) & (df[conf_col] == 'Low')).sum()
        else:
            h, m, l = 0, 0, 0
        breakdown.append({
            'Label': lbl,
            'Count': count,
            'Percentage': f"{perc:.1f}%",
            'High': h,
            'Medium': m,
            'Low': l
        })
    df_bd = pd.DataFrame(breakdown).sort_values(by='Count', ascending=False)
    
    # Video dist
    video_rows = []
    if 'video_id' in df.columns:
        for vid in df['video_id'].unique():
            vdf = df[df['video_id'] == vid]
            dom_lbl = vdf['verification_label'].mode()[0] if len(vdf) > 0 else "N/A"
            video_rows.append({
                'Video': vid,
                'Samples': len(vdf),
                'Dominant Label': dom_lbl,
                'Distribution Check': 'Passed' if len(vdf) > 10 else 'Low Sample'
            })
    df_vid = pd.DataFrame(video_rows).sort_values(by='Samples', ascending=False).head(10)
    
    report = f"""# Gold Annotation Quality Assurance Report

## Summary
- **Total Rows**: {total_rows}
- **Duplicate Primary IDs**: {duplicate_ids}
- **Missing Labels**: {missing_labels}
- **Invalid Taxonomy Labels**: {', '.join(invalid_labels) if len(invalid_labels) > 0 else 'None'}
- **Low Confidence Rate**: {low_conf_rate:.1f}%
- **Verification Disagreement Rate**: {disagreement_rate:.1f}%

## Label Distribution
| Label | Count | Percentage | High | Medium | Low |
|---|---|---|---|---|---|
"""
    for _, row in df_bd.iterrows():
        report += f"| {row['Label']} | {row['Count']} | {row['Percentage']} | {row['High']} | {row['Medium']} | {row['Low']} |\n"
        
    report += "\n## Video Distribution (Top 10)\n| Video | Samples | Dominant Label | Distribution Check |\n|---|---|---|---|\n"
    for _, row in df_vid.iterrows():
        report += f"| {row['Video']} | {row['Samples']} | {row['Dominant Label']} | {row['Distribution Check']} |\n"
        
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print("QA script complete.")

if __name__ == "__main__":
    qa_10k()
