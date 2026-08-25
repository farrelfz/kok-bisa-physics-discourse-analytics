import pandas as pd
import os

def run_adjudication():
    adj_path = "data/annotated/calibration_adjudicated.csv"
    report_path = "reports/calibration_adjudication_report.md"
    
    df = pd.read_csv(adj_path)
    
    # Decisions mapping: sample_id -> (adjudicated_label, adjudication_reason)
    decisions = {
        'CALIB_007': ('Experience', 'Menceritakan perubahan keyakinan personal masa lalu (priority over Opinion).'),
        'CALIB_012': ('Correction', 'Mengoreksi/menambahkan info fakta menit 1:10 (priority over Opinion).'),
        'CALIB_031': ('Question', 'Terdapat pertanyaan substantif, Question prioritas di atas Praise.'),
        'CALIB_039': ('Question', 'Terdapat pertanyaan ilmiah tulus, Question prioritas di atas Suggestion.'),
        'CALIB_056': ('Praise', 'Mengapresiasi channel, Praise prioritas di atas Opinion.'),
        'CALIB_080': ('Question', 'Terdapat pertanyaan keberadaan alien, Question prioritas di atas Suggestion.'),
        'CALIB_089': ('Correction', 'Mengkoreksi pengertian gravitasi, Correction prioritas di atas Opinion.')
    }
    
    for idx, row in df.iterrows():
        sid = row['sample_id']
        if sid in decisions:
            df.at[idx, 'adjudicated_label'] = decisions[sid][0]
            df.at[idx, 'adjudication_status'] = 'ADJUDICATED_MANUAL'
            
    df.to_csv(adj_path, index=False, encoding='utf-8-sig')
    
    # Write report
    report = f"""# Calibration Adjudication Report

## Summary
- **Total Disagreements Resolved:** {len(decisions)}

## Disagreement Resolutions
"""
    for sid, (label, reason) in decisions.items():
        report += f"- **{sid}**: Resolved as **{label}**. *Reason*: {reason}\n"
        
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    
    print("Adjudication completed.")

if __name__ == '__main__':
    run_adjudication()
