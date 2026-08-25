# KokBisa — Data Leakage & Dataset Integrity Audit
## Phase 5: Train/Validation/Test Split and Contamination Assessment

**Date:** 2026-08-16  
**Auditor:** Research-Grade Computational Linguistics Upgrade  
**Dataset:** `data/corpus/corpus.parquet` (202,429 comments across 35 videos)

---

## 1. Executive Summary

Data leakage occurs when information from the test set unintentionally contaminates the training set, artificially inflating performance metrics. In YouTube comment corpora, leakage commonly arises through:
1. Exact and near-duplicate comments (e.g. repeated memes, bot comments, template praise).
2. Comments with identical or near-identical text appearing across multiple videos.
3. Reply threads where parent comments and child replies share high context.
4. Random comment-level splitting that puts comments from the same video into both train and test sets.

---

## 2. Quantitative Leakage Findings

| Metric | Measured Value | Risk Level |
|---|---|---|
| Total Comments Analyzed | 202,429 | - |
| Exact Text Duplicates | 12,380 (6.12%) | **HIGH** |
| Unique Duplicated Texts | 3,082 | **MEDIUM** |
| Near-Duplicates (len > 5 chars) | 12,571 (6.21%) | **HIGH** |
| Comments Spanning Multiple Videos | 1,991 distinct texts | **HIGH** |
| Reply Comments (`parent_id` is set) | 85,970 (42.47%) | **MEDIUM** |

---

## 3. High-Frequency Repeated Patterns

The most frequently duplicated comments represent template responses, channel slogans, or single-phrase reactions:
- **324x occurrences:** `masa lalu`
- **200x occurrences:** `subhanallah`
- **166x occurrences:** `masa depan`
- **161x occurrences:** `allahu akbar`
- **151x occurrences:** `allahuakbar`
- **146x occurrences:** `kok bisa`
- **140x occurrences:** `wow`

---

## 4. Methodological Split Recommendations

### 4.1 Why Random Comment-Level Split is FLAWED
A purely random 70/15/15 train/val/test split at the comment level will cause significant data leakage:
- Common short comments ("mantap min", "kok bisa keren", "pertanyaan bagus") will appear in both train and test.
- Model will achieve artificially inflated Accuracy / F1 on test by memorizing video-specific vocabulary or repeated templates.
- Does not measure out-of-domain generalization to new physics topics or unseen videos.

### 4.2 Mandatory Protocol: GroupKFold / Video-Level Partitioning
To ensure research-grade methodological validity:

1. **Video-Stratified Group Split (Recommended for Paper Benchmark):**
   - Partition the 35 videos into:
     - **Train (70%):** 25 videos (~140,000 comments)
     - **Validation (15%):** 5 videos (~30,000 comments)
     - **Test (15%):** 5 videos (~30,000 comments)
   - Stratify video selection by physics topic (Astrophysics, Quantum Mechanics, Classical Mechanics, Daily Science).

2. **Deduplication Pre-Processing Gate:**
   - Before model fine-tuning, strip identical template comments appearing >5 times unless they carry distinct conversational context.
   - Separate reply annotations from top-level annotations to evaluate threaded discourse performance.

3. **Dual Reporting Requirement in Publication:**
   - Report **Split A (In-Video / Comment-Level)** to compare with baseline literature.
   - Report **Split B (Out-of-Video / Grouped Split)** to prove true semantic generalization.

---

## 5. Status: GATE 4 CLEARED FOR SPLIT PIPELINE
The partitioning script must enforce video-level grouping to prevent contamination.
