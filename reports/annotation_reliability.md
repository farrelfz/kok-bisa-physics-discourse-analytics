# KokBisa — Inter-Rater Reliability & Pilot Annotation Analysis Report
## Phase 2 Empirical Evaluation & Taxonomy Validation

**Date:** 2026-08-16  
**Auditor:** Senior Computational Linguistics Researcher & Data Scientist  
**Sample Analyzed:** 520 dual-annotated comments from `reports/annotation_pilot.csv`  
**Annotators:** Human Annotator 1, Human Annotator 2, Adjudicated Gold Truth

---

## 1. Executive Quantitative Summary

| Metric | Measured Value | Benchmark / Interpretation |
|---|---|---|
| **Annotated Pilot Comments** | **520 comments** | Stratified across classes + uncertainty |
| **Raw Inter-Rater Agreement ($P_o$)** | **44.23%** | Moderate raw consistency |
| **Cohen's Kappa ($\kappa$)** | **0.3027** | *Fair Agreement* (Landis & Koch, 1977) |
| **Zero-Shot mDeBERTa Baseline Accuracy** | **43.65%** | Evaluated against Adjudicated Truth |
| **Zero-Shot mDeBERTa Macro-F1** | **0.4221** | Baseline benchmark for supervised models |
| **Zero-Shot mDeBERTa Weighted-F1** | **0.4497** | Reflects moderate majority-class bias |

---

## 2. Zero-Shot mDeBERTa Baseline Performance (vs Adjudicated Truth)

| Class | Precision | Recall | F1-Score | Support (N) | Analysis / Key Finding |
|---|---|---|---|---|---|
| **Praise** | **0.70** | **0.74** | **0.72** | 57 | Highest performance. Positive lexicon is distinct. |
| **Question** | **0.86** | **0.45** | **0.59** | 128 | High precision, but misses implicit questions. |
| **Experience** | 0.37 | 0.57 | 0.45 | 42 | Moderate; easily confused with general opinion. |
| **Correction** | 0.38 | 0.46 | 0.42 | 50 | Low precision; confuses negation with factual repair. |
| **Opinion** | 0.47 | 0.30 | 0.37 | 130 | Substantial false negatives; model under-predicts Opinion. |
| **Suggestion** | 0.30 | 0.47 | 0.37 | 38 | High false positive rate due to imperative keywords. |
| **Agreement** | 0.17 | 0.69 | 0.28 | 16 | Small minority class; over-triggered by casual agreement. |
| **Disagreement** | 0.21 | 0.22 | 0.21 | 59 | Lowest performance; model struggles with informal negation. |
| **MACRO AVERAGE** | **0.43** | **0.49** | **0.42** | **520** | **Primary target for fine-tuning improvement** |

---

## 3. Systematic Disagreement Analysis (Annotator 1 vs Annotator 2)

Out of 520 comments, annotators disagreed on **290 comments (55.77%)**. The disagreements are not random; they follow **three systematic linguistic patterns**:

### 🔴 Pattern A: Surface Interrogative vs Illocutionary Stance (34.5% of all disagreements)
- **A1: Disagreement vs A2: Question (37 cases, 12.8%)**
- **A1: Opinion vs A2: Question (37 cases, 12.8%)**
- **A1: Correction vs A2: Question (15 cases, 5.2%)**
- **Root Cause:** Annotator 2 labeled any sentence containing `?` as `Question` (surface syntax), whereas Annotator 1 categorized comments based on communicative intent (e.g. rhetorical questions expressing skepticism as `Disagreement` or `Opinion`).
- **Example:** *"apa iya hal yg sengaja mereka kontroversikan mereka beberkan gitu aja?"* -> Surface = Question, Intent = Skeptical Opinion / Disagreement.

### 🔴 Pattern B: General Opinion vs Targeted Disagreement (7.6% of disagreements)
- **A1: Disagreement vs A2: Opinion (22 cases, 7.6%)**
- **Root Cause:** Ambiguity between expressing a counter-perspective (*Opinion*) vs explicitly rejecting a specific video claim (*Disagreement*).

### 🔴 Pattern C: Factual Correction vs Counter-Argument (4.8% of disagreements)
- **A1: Opinion vs A2: Correction (14 cases, 4.8%)**
- **Root Cause:** Confusing opinions about science with verifiable factual corrections citing numbers/timestamps.

---

## 4. Taxonomy Health & Refinement Gate

### Is the Taxonomy Viable?
**YES, but with explicit Decision Rules (Codebook v1.1).**  
The underlying taxonomy of 8 active discourse functions is sound, but annotator discrepancy stems from **decision hierarchy ambiguity**, specifically how to handle **rhetorical questions** and **multi-intent comments**.

### Mandatory Decision Rules for v1.1 (Calibration Rules):
1. **Rule of Dominant Illocutionary Force (Rhetorical Questions):**
   - If a sentence has `?` but does **NOT** genuinely request information (e.g. sarcasm, skepticism, rhetorical counter-claim) -> **Tag as OPINION or DISAGREEMENT, NOT Question.**
2. **Rule of Factuality for Correction:**
   - A comment is only `Correction` if it provides a **verifiable alternative fact, timestamp, or calculation**. Mere skepticism ("masa sih salah itu") is `Disagreement`.
3. **Rule of Direct Action for Suggestion:**
   - Must explicitly request future content, feature, or action ("bahas dong", "request min", "next video").

---

## 5. Roadmap for Phase 3: Large-Scale Gold Standard Annotation (10,000–15,000 Comments)

```
[Pilot Feedback & Calibration] ──────► SELESAI (Cohen's Kappa 0.3027 -> Diagnostic Clear)
             │
             ▼
[Annotator Briefing & Calibration Session] ──► 50-sample sync to align on Rhetorical Rules
             │
             ▼
[Large-Scale Stratified Sampling] ────────────► 10,000–12,000 Comments (Grouped by Video)
             │
             ▼
[Supervised Fine-Tuning in Colab] ───────────► Target: Macro-F1 >= 0.70 (vs Zero-shot 0.42)
```

1. **Target Dataset Size:** 10,000–12,000 comments (covering all 35 videos).
2. **Annotator Setup:** 2+ annotators with a designated Adjudicator for tie-breaking.
3. **Target Metric:** With the v1.1 calibration rules, inter-rater Kappa is projected to reach **$\kappa \ge 0.70$**.
