"""
evaluate_calibration.py
Evaluates AI-Assisted Dual-Pass Annotation Consistency:
1. Raw Agreement
2. Cohen's Kappa (Dual-pass consistency index)
3. Confusion Matrix Pass 1 vs Pass 2
4. Agreement & Support per Label
5. Top Confused Label Pairs
6. Exports:
   - reports/calibration_report.md
   - reports/calibration_confusion_matrix.csv
   - reports/calibration_disagreements.csv
   - data/annotated/calibration_adjudicated.csv
"""

import os
import pandas as pd
import numpy as np
from collections import Counter
from sklearn.metrics import cohen_kappa_score, confusion_matrix

TAXONOMY = [
    "Question",
    "Opinion",
    "Disagreement",
    "Correction",
    "Suggestion",
    "Praise",
    "Agreement",
    "Experience"
]

def evaluate_calibration(
    master_path: str = "data/annotated/calibration_batch_100.csv",
    ann1_path: str = "data/annotated/calibration_annotator_1.csv",
    ann2_path: str = "data/annotated/calibration_annotator_2.csv",
    output_report_path: str = "reports/calibration_report.md",
    output_cm_path: str = "reports/calibration_confusion_matrix.csv",
    output_disagreements_path: str = "reports/calibration_disagreements.csv",
    output_adjudicated_path: str = "data/annotated/calibration_adjudicated.csv"
):
    os.makedirs(os.path.dirname(output_report_path), exist_ok=True)
    os.makedirs(os.path.dirname(output_adjudicated_path), exist_ok=True)
    
    # Load Annotations
    if os.path.exists(ann1_path) and os.path.exists(ann2_path):
        df1 = pd.read_csv(ann1_path)
        df2 = pd.read_csv(ann2_path)
        
        id_col = 'sample_id' if 'sample_id' in df1.columns else ('calibration_id' if 'calibration_id' in df1.columns else df1.columns[0])
        
        merged = pd.merge(
            df1[[id_col, 'comment_id', 'video_id', 'parent_id', 'text', 'discourse_label', 'confidence', 'notes']],
            df2[[id_col, 'discourse_label', 'confidence', 'notes']],
            on=id_col,
            suffixes=('_pass1', '_pass2')
        )
        merged.rename(columns={
            id_col: 'sample_id',
            'discourse_label_pass1': 'pass_1_label',
            'discourse_label_pass2': 'pass_2_label',
            'confidence_pass1': 'confidence_1',
            'confidence_pass2': 'confidence_2',
            'notes_pass1': 'notes_1',
            'notes_pass2': 'notes_2'
        }, inplace=True)
        
        if os.path.exists(master_path):
            master_df = pd.read_csv(master_path)
            master_id = 'sample_id' if 'sample_id' in master_df.columns else ('calibration_id' if 'calibration_id' in master_df.columns else master_df.columns[0])
            if 'target_boundary_category' in master_df.columns:
                merged = pd.merge(merged, master_df[[master_id, 'target_boundary_category']], left_on='sample_id', right_on=master_id, how='left')
    elif os.path.exists(master_path):
        merged = pd.read_csv(master_path)
        if 'calibration_id' in merged.columns and 'sample_id' not in merged.columns:
            merged.rename(columns={'calibration_id': 'sample_id'}, inplace=True)
        merged.rename(columns={
            'human_annotator_1': 'pass_1_label',
            'human_annotator_2': 'pass_2_label'
        }, inplace=True)
    else:
        raise FileNotFoundError(f"Annotation files not found.")
        
    # Check non-empty annotations
    annotated_mask = merged['pass_1_label'].notna() & (merged['pass_1_label'].astype(str).str.strip() != "") & \
                     merged['pass_2_label'].notna() & (merged['pass_2_label'].astype(str).str.strip() != "")
    
    eval_df = merged[annotated_mask].copy()
    n_samples = len(eval_df)
    
    if n_samples == 0:
        print("⚠️ Warning: No dual annotations found in dataset yet.")
        with open(output_report_path, "w", encoding="utf-8") as f:
            f.write("# AI-Assisted Dual-Pass Calibration Consistency Report\n\n*Status: Awaiting dual-pass annotations.*\n")
        return None
        
    y1 = eval_df['pass_1_label'].astype(str).str.strip()
    y2 = eval_df['pass_2_label'].astype(str).str.strip()
    
    # 1. Raw Agreement
    exact_matches = (y1 == y2)
    raw_agreement = np.mean(exact_matches) * 100.0
    
    # 2. Cohen's Kappa
    all_labels = [lbl for lbl in TAXONOMY if lbl in set(y1.unique()).union(set(y2.unique()))]
    extra_labels = sorted(list(set(y1.unique()).union(set(y2.unique())) - set(TAXONOMY)))
    all_labels.extend(extra_labels)
    
    kappa = cohen_kappa_score(y1, y2, labels=all_labels)
    
    # 4-Tier Decision Gate
    if kappa >= 0.70:
        gate_status = "STRONG (Lanjut ke Gold Candidate Sampling & Annotation)"
        status_code = "PASSED ✓"
    elif 0.60 <= kappa < 0.70:
        gate_status = "ACCEPTABLE BUT REVIEW (Review Disagreement Utama Sebelum Scaling)"
        status_code = "REVIEW ⚠️"
    elif 0.40 <= kappa < 0.60:
        gate_status = "MODERATE (Codebook Perlu Diperbaiki & Kalibrasi Ulang)"
        status_code = "NEEDS REVISION ⚠️"
    else:
        gate_status = "WEAK (Rombak Definisi/Contoh Batas)"
        status_code = "FAILED ❌"
        
    # 3. Confusion Matrix
    cm = confusion_matrix(y1, y2, labels=all_labels)
    cm_df = pd.DataFrame(cm, index=[f"Pass1_{l}" for l in all_labels], columns=[f"Pass2_{l}" for l in all_labels])
    cm_df.to_csv(output_cm_path)
    
    # 4. Agreement per Label
    label_stats = []
    for lbl in all_labels:
        p1_count = np.sum(y1 == lbl)
        p2_count = np.sum(y2 == lbl)
        both_count = np.sum((y1 == lbl) & (y2 == lbl))
        union_count = np.sum((y1 == lbl) | (y2 == lbl))
        iou = (both_count / union_count * 100.0) if union_count > 0 else 0.0
        disagree_lbl = union_count - both_count
        label_stats.append({
            "Label": lbl,
            "Pass1_Count": p1_count,
            "Pass2_Count": p2_count,
            "Agreed_Count": both_count,
            "Disagreed_Count": disagree_lbl,
            "Label_Agreement_IoU": f"{iou:.1f}%"
        })
    label_stats_df = pd.DataFrame(label_stats)
    
    # 5. Top Confused Label Pairs
    confused_pairs = []
    disagreements = eval_df[~exact_matches].copy()
    for _, row in disagreements.iterrows():
        pair = tuple(sorted([row['pass_1_label'], row['pass_2_label']]))
        confused_pairs.append(pair)
    top_confusions = Counter(confused_pairs).most_common()
    
    # Export Disagreements CSV
    disagreements.to_csv(output_disagreements_path, index=False, encoding='utf-8-sig')
    
    # Create Adjudicated Dataset Template
    adjudicated_df = eval_df.copy()
    adjudicated_df['adjudicated_label'] = np.where(
        adjudicated_df['pass_1_label'] == adjudicated_df['pass_2_label'],
        adjudicated_df['pass_1_label'],
        ""
    )
    adjudicated_df['adjudication_status'] = np.where(
        adjudicated_df['pass_1_label'] == adjudicated_df['pass_2_label'],
        "AUTO_RESOLVED_CONSISTENT",
        "NEEDS_ADJUDICATION"
    )
    adjudicated_df.to_csv(output_adjudicated_path, index=False, encoding='utf-8-sig')
    
    # Confidence Summary
    conf_stats_str = "N/A"
    if 'confidence_1' in eval_df.columns and 'confidence_2' in eval_df.columns:
        c1 = eval_df['confidence_1'].fillna('High').astype(str).str.strip()
        c2 = eval_df['confidence_2'].fillna('High').astype(str).str.strip()
        conf_agree = np.mean(c1 == c2) * 100.0
        conf_stats_str = f"Pass 1 High: {np.sum(c1 == 'High')}, Pass 2 High: {np.sum(c2 == 'High')}, Exact Confidence Match: {conf_agree:.1f}%"
        
    # Build Markdown Report
    report = f"""# KokBisa — Calibration Evaluation Report
## AI-Assisted Dual-Pass Annotation Consistency (Codebook v1.1 Validation)

**Methodological Provenance Note:**  
Evaluasi ini mengukur **AI-assisted dual-pass annotation consistency** (konsistensi intra-annotator terstandarisasi dengan adjudikasi kasus ambigu), bukan reliabilitas dua manusia independen terpisah.

**Date:** 2026-08-22  
**Total Samples Evaluated:** {n_samples}  
**Raw Dual-Pass Agreement ($P_o$):** **{raw_agreement:.2f}%**  
**Cohen's Kappa ($\kappa$):** **{kappa:.4f}**  
**Consistency Gate Status:** **{status_code}** — {gate_status}  

---

## 1. Executive Quantitative Summary

| Metric | Measured Value | Benchmark / Threshold | Status |
|---|---|---|---|
| **Evaluated Samples** | **{n_samples}** | 100 challenging boundary comments | Complete |
| **Raw Dual-Pass Agreement** | **{raw_agreement:.2f}%** | Target $\ge 75\%$ | {'Optimal' if raw_agreement >= 75 else 'Under Target'} |
| **Cohen's Kappa ($\kappa$)** | **{kappa:.4f}** | $\ge 0.70$ (Strong) / $0.60-0.69$ (Review) | **{status_code}** |
| **Disagreement Cases** | **{len(disagreements)}** / {n_samples} | {(len(disagreements)/n_samples*100):.1f}% disagreement rate | {'Low' if len(disagreements) <= 25 else 'Moderate/High'} |
| **Confidence Concordance** | {conf_stats_str} | - | - |

---

## 2. Agreement & Support per Label

| Discourse Label | Pass 1 Count | Pass 2 Count | Agreed Count ($N$) | Disagreed Cases ($N$) | Agreement IoU |
|---|:---:|:---:|:---:|:---:|:---:|
"""
    for row in label_stats:
        report += f"| **{row['Label']}** | {row['Pass1_Count']} | {row['Pass2_Count']} | {row['Agreed_Count']} | {row['Disagreed_Count']} | {row['Label_Agreement_IoU']} |\n"

    report += f"""
---

## 3. Top Confused Label Pairs (Disagreement Patterns)

| Peringkat | Pasangan Label | Frekuensi | Actionable Review Guidance |
|:---:|---|:---:|---|
"""
    for rank, (pair, count) in enumerate(top_confusions, 1):
        report += f"| {rank} | **{pair[0]} ↔ {pair[1]}** | **{count} kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |\n"

    report += f"""
---

## 4. Confusion Matrix (Pass 1 [Baris] vs Pass 2 [Kolom])

```text
{cm_df.to_string()}
```

---

## 5. Detailed Disagreement Log ({len(disagreements)} Kasus)

| Sample ID | Teks Komentar | Pass 1 Label | Pass 2 Label | Strata Asal | Catatan Pass 1 / Pass 2 |
|---|---|:---:|:---:|---|---|
"""
    for _, row in disagreements.iterrows():
        sid = row.get('sample_id', '-')
        txt = row['text'].replace('|', '-').replace('\n', ' ')
        if len(txt) > 85:
            txt = txt[:82] + "..."
        p1_lbl = row['pass_1_label']
        p2_lbl = row['pass_2_label']
        strata = row.get('target_boundary_category', '-')
        n1 = row.get('notes_1', '')
        n2 = row.get('notes_2', '')
        note_combined = f"P1: {n1} | P2: {n2}".strip(" |") if (n1 or n2) else "-"
        report += f"| `{sid}` | {txt} | **{p1_lbl}** | **{p2_lbl}** | {strata} | {note_combined} |\n"

    report += f"""
---

## 6. Generated Artifacts
1. **Laporan Evaluasi:** `{output_report_path}`
2. **Matriks Konfusi:** `{output_cm_path}`
3. **Daftar Disagreement:** `{output_disagreements_path}`
4. **Dataset Ter-adjudikasi:** `{output_adjudicated_path}`
"""
    with open(output_report_path, "w", encoding="utf-8") as f:
        f.write(report)
        
    print("=" * 60)
    print("AI-ASSISTED DUAL-PASS CALIBRATION COMPLETE")
    print("=" * 60)
    print(f"Total Samples  : {n_samples}")
    print(f"Raw Agreement  : {raw_agreement:.2f}%")
    print(f"Cohen's Kappa  : {kappa:.4f}")
    print(f"Status Gate    : {status_code} ({gate_status})")
    print("-" * 60)
    print(f"Disagreements  : {len(disagreements)} cases exported to {output_disagreements_path}")
    print(f"Adjudicated DB : {output_adjudicated_path}")
    print("=" * 60)

if __name__ == "__main__":
    evaluate_calibration()
