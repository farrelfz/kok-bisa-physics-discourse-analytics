"""
reset_blank_calibration_templates.py
Resets calibration_annotator_1.csv, calibration_annotator_2.csv, and calibration_batch_100.csv
to completely blank states ready for authentic independent human annotation.
"""

import pandas as pd

def reset_templates():
    master_path = "data/annotated/calibration_batch_100.csv"
    ann1_path = "data/annotated/calibration_annotator_1.csv"
    ann2_path = "data/annotated/calibration_annotator_2.csv"
    
    master_df = pd.read_csv(master_path)
    
    # Blank out human annotation columns
    for col in ['human_annotator_1', 'human_annotator_2', 'adjudicated_label', 'confidence_1', 'confidence_2', 'notes_1', 'notes_2']:
        master_df[col] = ""
    master_df.to_csv(master_path, index=False, encoding='utf-8-sig')
    
    # Blank blind templates
    blind_cols = ['sample_id', 'comment_id', 'video_id', 'parent_id', 'text', 'discourse_label', 'confidence', 'notes']
    
    ann1_df = master_df[['sample_id', 'comment_id', 'video_id', 'parent_id', 'text']].copy()
    for col in ['discourse_label', 'confidence', 'notes']:
        ann1_df[col] = ""
    ann1_df[blind_cols].to_csv(ann1_path, index=False, encoding='utf-8-sig')
    
    ann2_df = master_df[['sample_id', 'comment_id', 'video_id', 'parent_id', 'text']].copy()
    for col in ['discourse_label', 'confidence', 'notes']:
        ann2_df[col] = ""
    ann2_df[blind_cols].to_csv(ann2_path, index=False, encoding='utf-8-sig')
    
    print("Successfully reset all calibration templates to BLANK state for authentic human annotation.")

if __name__ == "__main__":
    reset_templates()
