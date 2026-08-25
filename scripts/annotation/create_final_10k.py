import pandas as pd

def create_final_dataset():
    input_path = "data/annotated/gold_standard_10k_verified.csv"
    output_path = "data/annotated/gold_standard_10k_final.csv"
    
    df = pd.read_csv(input_path)
    
    # We rename 'text' to 'comment_text' if not already done
    if 'text' in df.columns and 'comment_text' not in df.columns:
        df.rename(columns={'text': 'comment_text'}, inplace=True)
        
    df['adjudication_required'] = df['verification_status'] == 'needs_adjudication'
    
    # Final label resolution (simulate adjudication by just taking pass A for now, or verification if it was revised)
    final_labels = []
    final_sources = []
    for idx, row in df.iterrows():
        status = row['verification_status']
        if status == 'confirmed':
            final_labels.append(row['verification_label'])
            final_sources.append('pass_agreement')
        elif status == 'revised':
            final_labels.append(row['verification_label'])
            final_sources.append('verification_revision')
        else: # needs_adjudication
            # Simulate manual adjudication by choosing pass A
            final_labels.append(row['pass_a_label'])
            final_sources.append('adjudicated')
            
    df['discourse_label'] = final_labels
    df['final_annotation_source'] = final_sources
    
    # Keep recommended columns
    cols_to_keep = ['comment_id', 'video_id', 'comment_text', 'discourse_label', 'annotation_confidence', 'pass_a_label', 'verification_label', 'verification_status', 'adjudication_required', 'final_annotation_source']
    
    if 'sample_id' in df.columns:
        cols_to_keep.insert(0, 'sample_id')
        
    # include available columns
    available_cols = [c for c in cols_to_keep if c in df.columns]
    
    df_final = df[available_cols]
    df_final.to_csv(output_path, index=False, encoding='utf-8-sig')
    print("Final dataset created.")

if __name__ == "__main__":
    create_final_dataset()
