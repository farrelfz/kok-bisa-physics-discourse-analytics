# KokBisa Discourse Analysis
# Implementation Plan: Pilot Calibration → Gold Annotation → Model Training → Full Corpus Inference

## 1. Purpose

Dokumen ini mendefinisikan rencana implementasi penelitian klasifikasi
fungsi wacana pada komentar YouTube KokBisa.

Pipeline penelitian dirancang untuk menjawab tiga kebutuhan utama:

1. Menghasilkan **gold-standard discourse dataset** yang memiliki kualitas
   anotasi dan konsistensi yang memadai.
2. Melatih dan mengevaluasi model klasifikasi fungsi wacana secara ketat
   tanpa kebocoran data antar-video.
3. Menerapkan model terbaik pada seluruh korpus komentar untuk menghasilkan
   analisis empiris mengenai pola discourse komunitas KokBisa.

Pipeline utama:

```text
PILOT 520
    │
    ▼
Audit Annotation Reliability
    │
    ▼
Codebook v1.1 + Calibration
    │
    ▼
Gold Dataset Construction
10,000–12,000 Comments
    │
    ▼
Independent Annotation
    │
    ▼
Adjudication + Quality Control
    │
    ▼
Frozen Gold Dataset
    │
    ▼
Video-Level Train / Validation / Test
    │
    ▼
Model Benchmark
    │
    ├── Baseline
    ├── IndoBERT
    └── mDeBERTa-v3
    │
    ▼
Final Model Selection
    │
    ▼
Inference on Full Corpus
202,429 Comments
    │
    ▼
Corpus-Level Discourse Analysis
    │
    ▼
Scientific Paper
```

---

# 2. Current Research Status

## 2.1 Corpus

The research corpus contains:

```text
Total comments      : 202,429
Total videos        : 35
Top-level comments  : 116,459
Replies             : 85,970
```

The corpus must not be randomly split at comment level for the primary
generalization benchmark.

Potential contamination sources include:

* exact duplicate comments,
* near-duplicate comments,
* repeated comments across videos,
* parent-child reply relationships,
* video-specific lexical patterns.

Therefore, the primary evaluation protocol must use:

```text
VIDEO AS GROUP
```

rather than:

```text
COMMENT AS INDEPENDENT SAMPLE
```

---

# 3. Phase 0 — Freeze Current Pilot Results

## Objective

Preserve the current 520-comment pilot as a diagnostic dataset.

The pilot must not be continuously modified to chase a higher model score.

The purpose of the pilot is:

```text
Taxonomy Validation
+
Annotation Reliability Diagnosis
+
Pipeline Debugging
+
Early Model Behavior Analysis
```

The pilot is NOT the final benchmark dataset.

## Inputs

```text
reports/annotation_pilot.csv
data/annotated/pilot_gold_520.csv
data/annotated/annotation_pilot_completed_520.csv
```

## Required Outputs

```text
reports/pilot_dataset_summary.json
reports/pilot_label_distribution.csv
reports/pilot_confusion_matrix_indobert.png
reports/pilot_error_analysis.md
```

## Acceptance Criteria

* [ ] Pilot dataset version is frozen.
* [ ] Label mapping is documented.
* [ ] Every sample has a final adjudicated label.
* [ ] No silent relabeling is performed after model training.
* [ ] All future taxonomy changes are versioned.

---

# 4. Phase 1 — Pilot Error Analysis

## Objective

Determine whether poor model performance originates primarily from:

1. insufficient training data,
2. class imbalance,
3. annotation ambiguity,
4. taxonomy overlap,
5. split instability,
6. training configuration,
7. or a combination of these factors.

## Required Analysis

### 4.1 Label Distribution

Calculate:

* support per class,
* percentage per class,
* number of unique videos per class,
* minimum and maximum class frequency.

Example:

```text
Agreement       : minority
Suggestion      : minority
Experience      : minority
Opinion         : majority
Question        : majority
```

Do not evaluate only global accuracy.

The following must be reported:

```text
Precision per class
Recall per class
F1-score per class
Support per class
Macro-F1
Weighted-F1
Accuracy
```

---

## 4.2 Confusion Analysis

Analyze the most frequent class confusions.

Priority pairs:

```text
Agreement      ↔ Opinion
Suggestion     ↔ Opinion
Experience     ↔ Opinion
Disagreement   ↔ Opinion
Correction     ↔ Disagreement
Question       ↔ Rhetorical Question
```

Each major confusion must include at least:

```text
Ground Truth
Predicted Label
Comment Text
Video ID
Annotation Notes
Probable Error Cause
```

Create:

```text
reports/pilot_error_analysis.md
```

with the structure:

| True Label   | Predicted Label | Frequency | Error Pattern       | Action                |
| ------------ | --------------- | --------: | ------------------- | --------------------- |
| Agreement    | Opinion         |       ... | implicit agreement  | improve rule/examples |
| Suggestion   | Opinion         |       ... | indirect request    | improve rule/examples |
| Disagreement | Opinion         |       ... | weak negation       | calibration           |
| Question     | Disagreement    |       ... | rhetorical question | decision hierarchy    |

---

# 5. Phase 2 — Codebook v1.1

## Objective

Convert pilot disagreement findings into explicit annotation rules.

The taxonomy remains:

```text
1. Opinion
2. Question
3. Experience
4. Agreement
5. Disagreement
6. Suggestion
7. Praise
8. Correction
```

However, each category must have:

```text
Definition
Positive Examples
Negative Examples
Boundary Cases
Decision Rules
Priority Rules
```

---

## 5.1 Global Annotation Principle

The primary annotation principle is:

> Label the dominant communicative function of the comment,
> not punctuation, isolated keywords, or superficial sentence form.

A comment containing multiple communicative signals must be classified
according to its dominant illocutionary function.

---

## 5.2 Question Rule

A comment is classified as `Question` only when it genuinely requests
information, clarification, or explanation.

### Positive examples

```text
Kenapa gravitasi bisa bekerja?
Bagaimana cara menghitungnya?
Apa yang dimaksud relativitas?
```

### Not automatically Question

```text
Masa iya bumi datar??
```

If the main communicative function is skepticism or rejection, classify
according to the dominant intent:

```text
Disagreement
or
Opinion
```

not simply because the text contains `?`.

---

## 5.3 Correction Rule

A comment is classified as `Correction` when it explicitly attempts to
repair or correct information.

The correction should contain at least one of:

* alternative factual information,
* explicit factual contradiction,
* numerical correction,
* calculation,
* timestamp-based correction,
* reference to a specific factual error.

Example:

```text
Di menit 4:20 penjelasannya kurang tepat karena...
```

Mere skepticism is not Correction.

```text
Masa sih itu benar?
```

should not automatically be labeled Correction.

---

## 5.4 Disagreement Rule

A comment is classified as `Disagreement` when the dominant function is
explicit rejection, opposition, or counter-position toward a claim,
person, comment, or explanation.

Example:

```text
Menurut saya penjelasan itu salah.
Saya tidak setuju dengan argumen tersebut.
```

---

## 5.5 Agreement Rule

A comment is classified as `Agreement` when its dominant purpose is to
express acceptance or alignment with a previous claim.

Example:

```text
Setuju banget.
Benar, saya sepakat.
Iya, pendapat itu masuk akal.
```

A general positive statement without a clear alignment target should not
automatically be Agreement.

---

## 5.6 Suggestion Rule

A comment is classified as `Suggestion` when it explicitly requests,
recommends, proposes, or encourages a future action.

Example:

```text
Bahas black hole dong.
Request video tentang relativitas.
Coba buat penjelasan yang lebih sederhana.
```

General opinions must not automatically be labeled Suggestion.

---

## 5.7 Experience Rule

A comment is classified as `Experience` when its dominant function is
sharing a personal event, observation, history, or lived experience.

Example:

```text
Saya pernah mengalami hal seperti ini.
Waktu sekolah dulu saya pernah...
```

A general statement beginning with "menurut saya" remains Opinion unless
the primary content is a personal experience.

---

# 6. Phase 3 — Annotator Calibration

## Objective

Validate Codebook v1.1 before large-scale annotation.

Large-scale annotation must NOT begin immediately after writing the
codebook.

## Procedure

### Step 1 — Annotator Briefing

All annotators receive:

```text
codebook_v1.1.md
annotation_examples.csv
decision_tree.md
```

### Step 2 — Calibration Batch

Create a new independent calibration sample:

```text
50–100 comments
```

The sample should intentionally include difficult boundary cases:

```text
Rhetorical questions
Implicit agreement
Weak disagreement
Opinion vs experience
Correction vs disagreement
Indirect suggestions
Multi-intent comments
```

### Step 3 — Independent Annotation

Each annotator labels the calibration batch independently.

No discussion is allowed during the first annotation pass.

### Step 4 — Reliability Measurement

Calculate:

```text
Raw Agreement
Cohen's Kappa
Confusion Matrix Annotator 1 vs Annotator 2
```

### Step 5 — Calibration Review

Only disagreement cases are discussed.

Every resolved ambiguity must be converted into:

```text
New rule
+
Positive example
+
Negative example
```

### Acceptance Gate

Large-scale annotation can begin only when:

```text
Cohen's Kappa >= predefined acceptance threshold
```

Recommended operational target:

```text
Kappa >= 0.60 before scaling
Kappa >= 0.70 preferred
```

If the threshold is not achieved:

```text
DO NOT SCALE ANNOTATION.
```

Instead:

```text
Revise Codebook
↓
New Calibration Batch
↓
Recalculate Reliability
```

---

# 7. Phase 4 — Gold Dataset Construction

## Objective

Create a high-quality manually annotated dataset of:

```text
Target: 10,000–12,000 comments
```

The dataset should represent:

```text
All discourse classes
All major videos
Top-level comments
Replies
Different physics/science topics
```

---

## 7.1 Sampling Strategy

Sampling must not rely exclusively on predicted discourse labels.

The sampling pool should combine:

```text
A. Predicted discourse strata
B. Video representation
C. Comment type
   - top-level
   - reply
D. Uncertainty sampling
E. Minority-class enrichment
```

Recommended conceptual structure:

```text
FULL CORPUS
    │
    ├── Stratify by predicted discourse
    │
    ├── Ensure all videos represented
    │
    ├── Separate top-level and replies
    │
    ├── Include high-uncertainty comments
    │
    └── Enrich rare predicted classes
            │
            ▼
        GOLD CANDIDATE POOL
```

Predicted labels are used only as a sampling aid.

They must never be treated as ground truth.

---

## 7.2 Split Before Annotation

The split assignment must be frozen before annotation.

Each comment receives:

```text
train
validation
test
```

based exclusively on:

```text
video_id
```

The same video must never appear across multiple partitions.

Conceptually:

```text
35 Videos
    │
    ├── Train Videos
    ├── Validation Videos
    └── Test Videos
```

Then comments are sampled within each partition.

---

## 7.3 Critical Class Coverage Gate

Before annotation begins, check whether every discourse class is
represented in:

```text
Train
Validation
Test
```

This is essential because a simple random assignment of videos can produce
a partition where rare discourse classes are poorly represented.

Therefore, the split procedure should optimize:

```text
No video leakage
+
Approximate class balance
+
Approximate topic balance
+
Adequate minority-class support
```

Recommended method:

```text
Stratified Group Assignment
```

where feasible.

The optimization unit remains:

```text
VIDEO
```

not individual comments.

---

# 8. Phase 5 — Large-Scale Annotation

## Annotation Protocol

Each comment should contain:

```text
comment_id
video_id
parent_id
split
text

human_annotator_1
human_annotator_2

adjudicated_label
annotation_confidence
ambiguity_reason
off_topic_flag
annotation_notes
```

---

## 8.1 Double Annotation Strategy

Recommended workflow:

```text
Comment
   │
   ├── Annotator 1
   │
   └── Annotator 2
          │
          ▼
      Agreement?
       │       │
      YES      NO
       │       │
       ▼       ▼
     Accept   Adjudication
```

High-confidence agreement can be accepted directly.

Disagreement must enter the adjudication queue.

---

## 8.2 Annotation Quality Control

Track:

```text
Completion rate
Inter-rater agreement
Cohen's Kappa
Class distribution
Annotator disagreement rate
Most frequent confusion pairs
Annotation time
Missing values
Invalid labels
```

Create periodic reports:

```text
reports/annotation_progress/
├── batch_01_quality.json
├── batch_02_quality.json
├── batch_03_quality.json
└── final_annotation_quality.md
```

---

# 9. Phase 6 — Freeze Final Gold Dataset

After annotation and adjudication:

```text
NO MORE LABEL CHANGES
```

unless a documented dataset revision is created.

Final dataset:

```text
data/annotated/gold_standard_final.csv
```

Metadata:

```text
data/annotated/gold_standard_final_metadata.json
```

The metadata must contain:

```json
{
  "dataset_version": "v1.0",
  "total_samples": 10000,
  "taxonomy_version": "v1.1",
  "annotation_protocol": "double_annotation_with_adjudication",
  "split_unit": "video_id",
  "random_seed": 42
}
```

---

# 10. Phase 7 — Dataset Integrity Audit

Before model training, run the following checks.

## 10.1 Leakage Check

Verify:

```text
train_videos ∩ validation_videos = ∅
train_videos ∩ test_videos = ∅
validation_videos ∩ test_videos = ∅
```

Expected:

```text
0 overlapping videos
```

---

## 10.2 Duplicate Check

Check:

```text
Exact duplicates
Near duplicates
Cross-split duplicates
Repeated template comments
```

If exact duplicate text appears in multiple partitions:

```text
Flag
↓
Review
↓
Remove or consolidate according to predefined protocol
```

---

## 10.3 Class Distribution Check

Report:

```text
Class distribution in Train
Class distribution in Validation
Class distribution in Test
```

Every class should have sufficient support in the test set.

If a class is absent or nearly absent:

```text
STOP TRAINING
```

and redesign the video partition or sampling plan.

---

# 11. Phase 8 — Baseline Models

Before transformer fine-tuning, establish reproducible baselines.

Recommended baseline hierarchy:

```text
Baseline 0
Majority Class

Baseline 1
Zero-Shot Classification

Baseline 2
TF-IDF + Logistic Regression

Baseline 3
IndoBERT Fine-Tuning

Baseline 4
mDeBERTa-v3 Fine-Tuning
```

This provides a meaningful answer to:

> Does the transformer actually improve performance beyond simpler models?

---

# 12. Phase 9 — Transformer Fine-Tuning

## Models

Primary candidates:

```text
indobenchmark/indobert-base-p1
microsoft/mdeberta-v3-base
```

Both models must be trained using:

```text
Same gold dataset
Same train split
Same validation split
Same test split
Same evaluation metrics
```

---

## 12.1 Training Configuration

Initial configuration:

```text
Learning Rate      : 2e-5
Maximum Epochs     : 8–10
Weight Decay       : 0.01
Warmup Ratio       : 0.10
Evaluation         : per epoch
Primary Metric     : Macro-F1
Early Stopping     : enabled
Best Model         : highest validation Macro-F1
```

Hyperparameter tuning must use:

```text
TRAIN + VALIDATION ONLY
```

The test set must remain untouched.

---

## 12.2 Class Imbalance

Class weights must be calculated only from:

```text
TRAINING DATA
```

Never calculate class weights using validation or test labels.

Recommended loss:

```text
Weighted Cross Entropy
```

Optional robustness experiment:

```text
Focal Loss
```

However, the baseline weighted cross-entropy experiment must be completed
before adding more complex loss functions.

---

# 13. Phase 10 — Model Selection

The winning model must not be selected using Accuracy alone.

Primary metric:

```text
Macro-F1
```

Secondary metrics:

```text
Weighted-F1
Accuracy
Per-Class Precision
Per-Class Recall
Per-Class F1
```

Model selection rule:

```text
Highest Validation Macro-F1
+
No catastrophic collapse on minority classes
+
Stable validation behavior
```

A model with:

```text
High Accuracy
but
0 recall on several classes
```

must not automatically be considered the best model.

---

# 14. Phase 11 — Final Test Evaluation

The test set is evaluated exactly once for the selected configuration.

Required outputs:

```text
reports/final_test_metrics.json
reports/final_classification_report.csv
figures/final_confusion_matrix.png
reports/final_error_analysis.md
```

Report:

```text
Accuracy
Macro-F1
Weighted-F1

Per-class:
Precision
Recall
F1
Support
```

Also include:

```text
95% confidence interval where feasible
```

and qualitative error analysis.

---

# 15. Phase 12 — Final Model Training

After the model selection protocol is complete:

```text
Selected Architecture
        +
Finalized Hyperparameters
        +
Frozen Gold Dataset
```

The final production model may be trained according to the predefined
research protocol.

Important:

The final model training procedure must be documented separately from
the benchmark evaluation procedure.

Do not mix:

```text
Model selection
```

with:

```text
Final production training
```

without explicitly documenting the distinction.

---

# 16. Phase 13 — Full Corpus Inference

Input:

```text
data/corpus/corpus.parquet
```

Expected corpus:

```text
202,429 comments
```

Inference pipeline:

```text
Load Corpus
    │
    ▼
Text Validation
    │
    ▼
Batch Tokenization
    │
    ▼
Model Inference
    │
    ▼
Predicted Label
    │
    ▼
Prediction Confidence
    │
    ▼
Store Results
```

Required fields:

```text
comment_id
video_id
parent_id
text
predicted_discourse_act
prediction_confidence
model_version
inference_timestamp
```

---

# 17. Phase 14 — Post-Inference Quality Check

Do not immediately treat model predictions as ground truth.

Perform:

```text
Random Prediction Audit
```

Recommended sample:

```text
100–300 predictions
```

Audit:

```text
Overall correctness
Class-specific correctness
Low-confidence predictions
High-confidence errors
Minority-class behavior
```

Special attention:

```text
Agreement
Suggestion
Experience
Disagreement
```

---

# 18. Phase 15 — Corpus-Level Analysis

After inference validation, analyze:

## 18.1 Discourse Distribution

```text
Percentage per discourse act
Frequency per video
Frequency per topic
```

## 18.2 Temporal / Sequential Patterns

If timestamps are available:

```text
Discourse distribution over time
Changes across upload periods
```

## 18.3 Top-Level vs Reply Analysis

Compare:

```text
Top-Level Comments
vs
Replies
```

Questions:

```text
Are questions more frequent in top-level comments?
Does disagreement increase in replies?
Are corrections concentrated in discussion threads?
```

## 18.4 Topic-Level Comparison

Compare discourse patterns across video topics.

Example:

```text
Astrophysics
Quantum Mechanics
Classical Mechanics
Daily Science
```

---

# 19. Experiment Tracking

Every experiment must be reproducible.

Store:

```text
experiment_id
dataset_version
taxonomy_version
model_name
random_seed
train_size
validation_size
test_size
hyperparameters
class_weights
metrics
timestamp
```

Directory:

```text
experiments/
├── EXP001_baseline_majority/
├── EXP002_zero_shot/
├── EXP003_tfidf_logreg/
├── EXP004_indobert/
├── EXP005_mdeberta/
└── EXP006_final/
```

---

# 20. Required Research Gates

The project may proceed only when each gate is passed.

## GATE 1 — Taxonomy

```text
[ ] Codebook v1.1 complete
[ ] Boundary cases defined
[ ] Decision hierarchy defined
```

## GATE 2 — Calibration

```text
[ ] Independent calibration completed
[ ] Reliability threshold achieved
[ ] Difficult cases documented
```

## GATE 3 — Gold Dataset

```text
[ ] Target sample size achieved
[ ] Double annotation completed
[ ] Adjudication completed
[ ] Dataset frozen
```

## GATE 4 — Integrity

```text
[ ] No overlapping videos
[ ] Duplicate audit completed
[ ] Split distribution validated
[ ] All classes represented
```

## GATE 5 — Benchmark

```text
[ ] Baselines completed
[ ] IndoBERT completed
[ ] mDeBERTa completed
[ ] Validation-based model selection completed
```

## GATE 6 — Final Evaluation

```text
[ ] Test evaluated once
[ ] Per-class performance reported
[ ] Confusion matrix generated
[ ] Error analysis completed
```

## GATE 7 — Full Corpus Inference

```text
[ ] Model version frozen
[ ] Full corpus inference completed
[ ] Prediction audit completed
[ ] Final corpus exported
```

---

# 21. Final Project Deliverables

```text
data/
└── annotated/
    ├── pilot_gold_520.csv
    ├── calibration_batch.csv
    ├── gold_standard_final.csv
    └── gold_standard_final_metadata.json

docs/
├── codebook_v1.1.md
├── annotation_guidelines.md
├── decision_tree.md
└── implementation.md

reports/
├── annotation_reliability.md
├── calibration_report.md
├── data_leakage_audit.md
├── dataset_integrity_report.md
├── final_test_metrics.json
└── final_error_analysis.md

models/
└── discourse_model_final/

figures/
├── pilot_confusion_matrix.png
├── final_confusion_matrix.png
├── discourse_distribution.png
└── semantic_discourse_analysis.png

paper/
└── draft.md
```

---

# 22. Immediate Next Actions

The project must proceed in the following order:

```text
STEP 1
Freeze current 520 pilot results
        ↓
STEP 2
Complete pilot error analysis
        ↓
STEP 3
Create Codebook v1.1
        ↓
STEP 4
Run 50–100 sample calibration
        ↓
STEP 5
Measure inter-rater reliability again
        ↓
STEP 6
Pass calibration gate
        ↓
STEP 7
Validate video-level split
        ↓
STEP 8
Construct and annotate 10,000–12,000 gold samples
        ↓
STEP 9
Freeze final gold dataset
        ↓
STEP 10
Run baseline experiments
        ↓
STEP 11
Fine-tune IndoBERT
        ↓
STEP 12
Fine-tune mDeBERTa-v3
        ↓
STEP 13
Select model using validation Macro-F1
        ↓
STEP 14
Evaluate once on untouched test set
        ↓
STEP 15
Run full inference on 202,429 comments
        ↓
STEP 16
Conduct corpus-level discourse analysis
        ↓
STEP 17
Finalize scientific paper
```

---

# 23. Definition of Done

The research pipeline is considered complete only when:

```text
✓ Taxonomy is calibrated
✓ Annotation reliability is documented
✓ Gold dataset is frozen
✓ Video leakage is eliminated
✓ Baseline models are reported
✓ Transformer models are benchmarked fairly
✓ Model selection is validation-based
✓ Test set remains untouched until final evaluation
✓ Per-class performance is reported
✓ Full corpus inference is completed
✓ Prediction quality is manually audited
✓ Final dataset, model, metrics, and figures are reproducible
✓ Results are integrated into the scientific paper
```
