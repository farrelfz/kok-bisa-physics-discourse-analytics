"""
generate_calibration_batch.py
Pipeline to sample 100 challenging boundary comments from KokBisa corpus for dual-annotator calibration.
Ensures annotator files are completely blind (no case_type or hints).
"""

import os
import re
import pandas as pd
import numpy as np

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def sample_calibration_batch(
    corpus_path: str = "data/corpus/corpus.parquet",
    pilot_path: str = "data/annotated/pilot_gold_520.csv",
    output_dir: str = "data/annotated",
    target_count: int = 100,
    random_seed: int = 42
):
    np.random.seed(random_seed)
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Loading corpus from {corpus_path}...")
    df = pd.read_parquet(corpus_path)
    
    # Exclude pilot comments
    if os.path.exists(pilot_path):
        pilot_df = pd.read_csv(pilot_path)
        pilot_ids = set(pilot_df['comment_id'].dropna().astype(str))
        df = df[~df['comment_id'].astype(str).isin(pilot_ids)].copy()
        print(f"Excluded {len(pilot_ids)} pilot comments. Remaining candidate pool: {len(df)}")
    
    # Filter valid indonesian non-spam comments with meaningful length (10 - 300 chars)
    valid_mask = (
        (df['lang_detected'] == 'id') & 
        (df['is_spam'] == 0) & 
        (df['text'].str.len() >= 12) & 
        (df['text'].str.len() <= 350)
    )
    candidates = df[valid_mask].copy()
    candidates['clean_text'] = candidates['text'].apply(clean_text)
    # Deduplicate exact text
    candidates = candidates.drop_duplicates(subset=['clean_text'])
    
    print(f"Filtered candidate pool: {len(candidates)} unique comments.")
    
    # Define strategic linguistic regex patterns for difficult boundary cases
    patterns = {
        "Rhetorical_Question_vs_Disagreement": (
            r"(?i)\b(masa|apa iya|kok bisa|gimana sih|bukannya|bukankah)\b.*\?+"
        ),
        "Praise_Plus_Question": (
            r"(?i)\b(keren|mantap|bagus|terima kasih|makasih|salut|hebat|suka)\b.*\b(tapi|mau nanya|kira-kira|kenapa|bagaimana|gimana|apakah)\b.*\?"
        ),
        "Praise_Plus_Correction": (
            r"(?i)\b(keren|mantap|bagus|suka)\b.*\b(tapi|namun|ralat|salah|bukan|menit|kurang tepat)\b"
        ),
        "Correction_vs_Disagreement": (
            r"(?i)(\bmenit\s+\d+|\bdetik\s+\d+|\bharusnya\b|\bkurang tepat\b|\btypo\b|\bdi ralat\b|\brumusnya\b|\bangkanya\b|\bbukan\s+\w+\s+tapi\b)"
        ),
        "Explicit_Agreement_vs_Opinion": (
            r"(?i)\b(setuju banget|sangat setuju|sepakat|benar kata|bener banget|masuk akal|sependapat|valid banget)\b"
        ),
        "Implicit_Suggestion": (
            r"(?i)\b(coba min|tolong bahas|request|next video|bahas dong|bisa gak bahas|pengen tau tentang|saran min|usul)\b"
        ),
        "Personal_Experience": (
            r"(?i)\b(waktu saya|dulu saya|pernah mengalami|pengalaman saya|pas sd|pas smp|pas sma|pas kuliah|di kantor saya|waktu kecil)\b"
        ),
        "Hard_Disagreement_Skepticism": (
            r"(?i)\b(gak masuk akal|ngaco|ngawur|salah besar|pembodohan|hoax|teori palsu|gak percaya|gak setuju|keliru)\b"
        ),
        "Genuine_Scientific_Question": (
            r"(?i)^(kenapa|bagaimana|mengapa|apakah|bagaimanakah|apa yang terjadi jika|gimana caranya)\b.*\?"
        ),
        "Philosophical_General_Opinion": (
            r"(?i)\b(menurut saya|menurutku|pandangan saya|bisa jadi|mungkin saja|pada dasarnya manusia|alam semesta ini)\b"
        )
    }
    
    strata_samples = []
    used_ids = set()
    
    # Stratified target per category: ~10 per boundary category = 100 total
    target_per_pattern = 10
    
    for category_name, regex in patterns.items():
        matched = candidates[
            (~candidates['comment_id'].astype(str).isin(used_ids)) & 
            candidates['clean_text'].str.contains(regex, regex=True, na=False)
        ]
        sample_size = min(len(matched), target_per_pattern)
        if sample_size > 0:
            sampled = matched.sample(n=sample_size, random_state=random_seed)
            sampled['target_boundary_category'] = category_name
            used_ids.update(sampled['comment_id'].astype(str).tolist())
            strata_samples.append(sampled)
            
    combined = pd.concat(strata_samples, ignore_index=True)
    
    # If less than 100, fill with diverse comments
    if len(combined) < target_count:
        needed = target_count - len(combined)
        extra = candidates[~candidates['comment_id'].astype(str).isin(used_ids)].sample(n=needed, random_state=random_seed)
        extra['target_boundary_category'] = "Diverse_General"
        combined = pd.concat([combined, extra], ignore_index=True)
        
    # Shuffle order
    combined = combined.sample(frac=1.0, random_state=random_seed).reset_index(drop=True)
    combined['sample_id'] = [f"CALIB_{i+1:03d}" for i in range(len(combined))]
    
    # Master dataset (retains internal audit columns)
    master_cols = [
        'sample_id',
        'comment_id',
        'video_id',
        'parent_id',
        'text',
        'target_boundary_category',
        'human_annotator_1',
        'human_annotator_2',
        'adjudicated_label',
        'confidence_1',
        'confidence_2',
        'notes_1',
        'notes_2'
    ]
    for col in master_cols:
        if col not in combined.columns:
            combined[col] = ""
            
    master_df = combined[master_cols].copy()
    master_path = os.path.join(output_dir, "calibration_batch_100.csv")
    master_df.to_csv(master_path, index=False, encoding='utf-8-sig')
    print(f"Saved master calibration batch ({len(master_df)} rows) to {master_path}")
    
    # Blind templates for Annotator 1 and Annotator 2 (NO target_boundary_category)
    blind_cols = ['sample_id', 'comment_id', 'video_id', 'parent_id', 'text', 'discourse_label', 'confidence', 'notes']
    
    ann1_df = master_df[['sample_id', 'comment_id', 'video_id', 'parent_id', 'text']].copy()
    for col in ['discourse_label', 'confidence', 'notes']:
        ann1_df[col] = ""
    ann1_path = os.path.join(output_dir, "calibration_annotator_1.csv")
    ann1_df[blind_cols].to_csv(ann1_path, index=False, encoding='utf-8-sig')
    
    ann2_df = master_df[['sample_id', 'comment_id', 'video_id', 'parent_id', 'text']].copy()
    for col in ['discourse_label', 'confidence', 'notes']:
        ann2_df[col] = ""
    ann2_path = os.path.join(output_dir, "calibration_annotator_2.csv")
    ann2_df[blind_cols].to_csv(ann2_path, index=False, encoding='utf-8-sig')
    
    print(f"Saved Blind Annotator 1 template to {ann1_path}")
    print(f"Saved Blind Annotator 2 template to {ann2_path}")
    
    return master_df

if __name__ == "__main__":
    sample_calibration_batch()
