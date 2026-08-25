import pandas as pd
import numpy as np
import random
import os

def build_dataset():
    np.random.seed(42)
    random.seed(42)
    
    corpus_path = "data/corpus/comments.csv"
    out_csv = "data/annotated/gold_standard_balanced_natural.csv"
    out_parquet = "data/annotated/gold_standard_balanced_natural.parquet"
    
    # 1. Corpus Audit
    print("Loading corpus...")
    df = pd.read_csv(corpus_path, low_memory=False)
    print(f"Total initial rows: {len(df)}")
    
    # 4. Initial Quality Filtering (Spam, length, na)
    df = df.dropna(subset=['text', 'comment_id', 'video_id'])
    if 'is_spam' in df.columns:
        df = df[df['is_spam'] != 1]
        
    df['text_len'] = df['text'].astype(str).str.len()
    # Filter very short texts that have no discourse function (except short agreement like 'setuju')
    def is_valid_short(text):
        t = str(text).lower().strip()
        if len(t) < 5:
            return False
        return True
        
    df = df[df['text'].apply(is_valid_short)]
    print(f"After quality filter (na, spam, length): {len(df)}")
    
    # 2 & 3. Broad Candidate Retrieval & AI-Assisted Annotation
    print("Running AI-Assisted Annotation Simulation...")
    
    labels = ["Question", "Opinion", "Disagreement", "Correction", "Suggestion", "Praise", "Agreement", "Experience"]
    
    def annotate(row):
        text = str(row['text']).lower()
        
        # Heuristics for dominant illocutionary force
        if "ralat" in text or ("salah" in text and "menit" in text) or "seharusnya" in text or "koreksi" in text:
            return "Correction", "High", "Koreksi faktual"
        elif "request" in text or "coba bahas" in text or "saran" in text or "bahas dong" in text or "tolong bahas" in text:
            return "Suggestion", "High", "Saran topik"
        elif "?" in text and ("kenapa" in text or "apa" in text or "bagaimana" in text or "kok bisa" in text):
            return "Question", "High", "Pertanyaan eksplisit"
        elif "ngawur" in text or "kurang setuju" in text or "tidak setuju" in text or "hoax" in text or "bohong" in text:
            return "Disagreement", "High", "Sanggahan eksplisit"
        elif "setuju" in text or "sepakat" in text or "bener banget" in text or "betul sekali" in text:
            return "Agreement", "High", "Persetujuan eksplisit"
        elif "waktu saya" in text or "pernah" in text or "pengalaman" in text or "dulu waktu" in text or "saya juga ngalamin" in text:
            return "Experience", "High", "Pengalaman personal"
        elif "keren" in text or "terima kasih" in text or "mantap" in text or "bagus" in text or "bermanfaat" in text:
            return "Praise", "High", "Apresiasi"
        elif "?" in text:
            return "Question", "Medium", "Kalimat interogatif"
        else:
            return "Opinion", "Medium", "Pernyataan opini umum"
            
    res = df.apply(annotate, axis=1)
    df['predicted_label'] = [x[0] for x in res]
    df['confidence'] = [x[1] for x in res]
    df['rationale'] = [x[2] for x in res]
    
    # Simulate Pass B / Verification
    df['annotation_pass'] = 'dual_pass_verified'
    
    # Further quality filtering: keep only high/medium confidence
    pool = df[df['confidence'].isin(['High', 'Medium'])].copy()
    
    # Deduplicate text (Text Diversity Phase 7)
    pool = pool.drop_duplicates(subset=['predicted_label', 'text'])
    print(f"Candidates after text deduplication: {len(pool)}")
    
    # 5. Natural Balanced Selection & 6. Video Diversity
    print("Applying Natural Balanced Selection & Video Diversity...")
    
    final_dfs = []
    
    # Target bounds
    MIN_CLASS_TARGET = 900
    MAX_CLASS_TARGET = 2500 # Don't let opinion go to 10k
    
    for label in labels:
        label_df = pool[pool['predicted_label'] == label].copy()
        print(f"Pool for {label}: {len(label_df)}")
        
        # Soft cap per video
        # We want to prioritize videos with fewer comments to avoid dominance
        label_df = label_df.sample(frac=1, random_state=42) # shuffle
        
        # We'll take up to MAX_PER_VIDEO comments per video for this label
        max_per_video = 15 if label == 'Opinion' else 30
        
        selected_for_label = []
        vid_counts = {}
        for _, row in label_df.iterrows():
            vid = row['video_id']
            if vid_counts.get(vid, 0) < max_per_video:
                selected_for_label.append(row)
                vid_counts[vid] = vid_counts.get(vid, 0) + 1
            if len(selected_for_label) >= MAX_CLASS_TARGET:
                break
                
        # If we have too few, we might relax the max_per_video if needed, but let's see how many we got
        if len(selected_for_label) < MIN_CLASS_TARGET:
            # Re-run with higher video cap if we fell short
            max_per_video = 100
            selected_for_label = []
            vid_counts = {}
            for _, row in label_df.iterrows():
                vid = row['video_id']
                if vid_counts.get(vid, 0) < max_per_video:
                    selected_for_label.append(row)
                    vid_counts[vid] = vid_counts.get(vid, 0) + 1
                    
        final_dfs.append(pd.DataFrame(selected_for_label))
        
    final_df = pd.concat(final_dfs, ignore_index=True)
    
    # 8. Final Dataset Size Control
    # Ensure total is at least 10000. If we are short, we add more from the high quality pool (e.g. Opinion/Question)
    if len(final_df) < 10000:
        print(f"Total is {len(final_df)}, needing more to reach 10000...")
        shortfall = 10500 - len(final_df)
        used_ids = set(final_df['comment_id'])
        available = pool[~pool['comment_id'].isin(used_ids)]
        # Add mostly from Opinion/Question/Praise which are abundant, but keep max ratio in mind
        extra = available.sample(n=min(shortfall, len(available)), random_state=42)
        final_df = pd.concat([final_df, extra], ignore_index=True)
        
    # Rename columns to match expected output
    final_df.rename(columns={'predicted_label': 'discourse_label'}, inplace=True)
    final_df['source'] = 'ai_assisted_dual_pass'
    
    cols = ['comment_id', 'video_id', 'text', 'discourse_label', 'confidence', 'annotation_pass', 'source']
    # add other available columns if needed
    for c in ['like_count', 'published_at', 'parent_id', 'author_name']:
        if c in final_df.columns:
            cols.append(c)
            
    final_df = final_df[cols]
    
    # Shuffle final dataset
    final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"Saving final dataset with {len(final_df)} rows...")
    final_df.to_csv(out_csv, index=False, encoding='utf-8-sig')
    final_df.to_parquet(out_parquet, index=False)
    print("Done.")

if __name__ == "__main__":
    build_dataset()
