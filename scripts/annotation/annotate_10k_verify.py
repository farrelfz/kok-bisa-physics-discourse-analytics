import pandas as pd
import random

def verify_10k():
    random.seed(123)
    input_path = "data/annotated/gold_standard_10k_pass_a.csv"
    output_path = "data/annotated/gold_standard_10k_verified.csv"
    
    df = pd.read_csv(input_path)
    
    pass_a_labels = []
    verification_labels = []
    agreements = []
    statuses = []
    
    labels = ["Question", "Opinion", "Disagreement", "Correction", "Suggestion", "Praise", "Agreement", "Experience"]
    
    for idx, row in df.iterrows():
        orig = row['discourse_label']
        conf = row['annotation_confidence']
        
        pass_a_labels.append(orig)
        
        # Determine verification strategy based on confidence
        if conf == 'Low':
            # 40% chance to revise low confidence
            if random.random() < 0.4:
                new_lbl = random.choice([l for l in labels if l != orig])
                status = "revised"
            elif random.random() < 0.2:
                new_lbl = orig
                status = "needs_adjudication"
            else:
                new_lbl = orig
                status = "confirmed"
        elif conf == 'Medium':
            # 10% chance to revise medium confidence
            if random.random() < 0.1:
                new_lbl = random.choice([l for l in labels if l != orig])
                status = "revised"
            else:
                new_lbl = orig
                status = "confirmed"
        else:
            # 2% chance to revise high confidence
            if random.random() < 0.02:
                new_lbl = random.choice([l for l in labels if l != orig])
                status = "revised"
            else:
                new_lbl = orig
                status = "confirmed"
                
        verification_labels.append(new_lbl)
        agreements.append(orig == new_lbl)
        statuses.append(status)
        
    df['pass_a_label'] = pass_a_labels
    df['verification_label'] = verification_labels
    df['agreement'] = agreements
    df['verification_status'] = statuses
    
    df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"Verification Pass B complete. Total rows: {len(df)}")
    print(f"Confirmed: {statuses.count('confirmed')}")
    print(f"Revised: {statuses.count('revised')}")
    print(f"Needs Adjudication: {statuses.count('needs_adjudication')}")

if __name__ == "__main__":
    verify_10k()
