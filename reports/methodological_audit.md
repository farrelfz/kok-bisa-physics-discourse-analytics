# KokBisa — Methodological Audit Report
## Phase 0: Pre-Modification System Audit

**Audit Date:** 2026-08-16  
**Auditor:** Research-Grade Upgrade Process  
**Scope:** Full repository — no production code was modified during this audit

---

## 1. Corpus Statistics (VERIFIED)

| Metric | Value | Source |
|---|---|---|
| Total videos | 35 | `07_corpus_stats.json` |
| Total transcript segments | 4,408 | `07_corpus_stats.json` |
| Total comments (raw) | 202,429 | `07_corpus_stats.json` |
| Top-level comments | 116,459 | `07_corpus_stats.json` |
| Replies | 85,970 | `07_corpus_stats.json` |
| Spam-flagged | 2,574 | `07_corpus_stats.json` |
| Total clean words | 3,059,944 | `07_corpus_stats.json` |
| **Comments with discourse labels** | **136,587** | `comments_analyzed.parquet` |
| Embeddings computed | ~199,855 | `comments_embeddings.npy` |

> **DISCREPANCY:** 199,855 clean comments reported, but only 136,587 in analyzed parquet. ~63,268 comments (31.7%) lack discourse labels. Reason undocumented.

---

## 2. Discourse Distribution (VERIFIED FROM DATA)

All labels are ZERO-SHOT model predictions. No human validation exists.

| Label | Count | Percentage |
|---|---|---|
| Question | 54,076 | 39.59% |
| Suggestion | 38,276 | 28.02% |
| Praise | 12,850 | 9.41% |
| Off-topic | 8,254 | 6.04% |
| Disagreement | 6,713 | 4.91% |
| Others | 4,504 | 3.30% |
| Correction | 3,596 | 2.63% |
| Opinion | 2,487 | 1.82% |
| Experience | 2,204 | 1.61% |
| Answer | 1,988 | 1.46% |
| Agreement | 1,639 | 1.20% |
| **TOTAL** | **136,587** | **100%** |

**CRITICAL:** Question+Suggestion = 67.6%. This pattern is almost certainly model bias, not corpus reality. The zero-shot model heavily favors these two labels for informal short Indonesian text.

---

## 3. Model Configuration (VERIFIED)

| Component | Configuration |
|---|---|
| Discourse classifier | `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` |
| Task | Zero-shot NLI (`pipeline("zero-shot-classification")`, `multi_label=False`) |
| SBERT model | `paraphrase-multilingual-MiniLM-L12-v2` |
| Fallback | Rule-based Indonesian keyword classifier |
| Topic models | LDA (sklearn), NMF (sklearn), Custom KMeans+c-TF-IDF |
| Random seed | 42 (topic models only; HF inference has no seed) |

---

## 4. Database Schema (VERIFIED)

The `comments` table does NOT contain `discourse_act`. All NLP labels exist only in Parquet files — not in the primary database. No provenance metadata (model_name, timestamp, version) is stored anywhere.

---

## 5. Annotation Status (VERIFIED)

- `manual_validation_sample.csv`: 74 rows, ALL human annotation columns are EMPTY
- `comments_annotated.parquet`: model-generated predictions, NOT human labels
- **Human annotation count: ZERO**
- **Cohen's Kappa: NOT COMPUTED**
- **Any F1/Precision/Recall against ground truth: NOT COMPUTED**

---

## 6. Critical Methodological Risks

| Risk | Severity | Description |
|---|---|---|
| Zero-shot labels as ground truth | CRITICAL | All 136,587 labels are unvalidated model outputs |
| No human annotation | CRITICAL | Cannot evaluate model accuracy |
| Taxonomy dimension mixing | HIGH | Labels mix discourse function, stance, content type, topical relevance |
| Preprocessing before classification | HIGH | Unclear if stemmed text is fed to transformer (would be an error) |
| discourse_act not in database | HIGH | No SQL provenance; labels separated from corpus |
| 31.7% corpus gap | HIGH | Analyzed corpus ≠ full corpus; reason undocumented |
| "Mini-BERTopic" naming | MEDIUM | Not actual BERTopic (uses KMeans not HDBSCAN+UMAP) |
| Semantic alignment undefined | MEDIUM | No operational thresholds, not stored in any file |
| Spam rule over-aggressive | MEDIUM | URL = spam removes legitimate correction comments |
| langdetect misclassification | MEDIUM | Short informal Indonesian misclassified as Tagalog/Somali/Swahili |
| Rule fallback: overlapping keywords | MEDIUM | "salah", "bukan" in both Disagreement AND Correction |
| No data leakage audit | HIGH | Train/test split validity unverified |
| Extreme class imbalance | HIGH | Top 2 classes = 67.6%; bottom 3 = 4.3% |

---

## 7. Good Practices to Preserve

- RANDOM_SEED = 42 in settings.py
- Lazy model loading (singleton pattern)
- Graceful HF → rule-based fallback
- SQLite with foreign key relationships
- Separate raw/processed/annotated directory structure
- `parent_id` enables reply chain analysis
- MTLD over simple TTR for lexical diversity
- Multiple topic modeling approaches for comparison

---

## 8. Recommended Research Roadmap (Phase 0 → Final)

```
Phase 0: AUDIT (this document)              ← DONE
Phase 1: Discourse Taxonomy Audit            ← NEXT (discourse_codebook_v1.md)
Phase 2: Pilot Human Annotation (500–800)   ← REQUIRES HUMAN ANNOTATORS
Phase 3: Inter-Rater Reliability            ← Cohen's Kappa > 0.67 gate
Phase 4: Taxonomy Freeze / Revision        ← Based on pilot results
Phase 5: Full Human Annotation (8,000–12,000)
Phase 6: Model Benchmark (Zero-shot + Fine-tuned)
Phase 7: Full Corpus Inference (final model)
Phase 8: Statistical Analysis + Error Analysis
Phase 9: Research Report Generation
```

The pipeline infrastructure is solid. The critical missing component is human-annotated ground truth.

---
*Produced: 2026-08-16. No code modified. All findings from direct file/code inspection.*
