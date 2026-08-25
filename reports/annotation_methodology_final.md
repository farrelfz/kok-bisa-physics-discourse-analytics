# AI-Assisted Discourse Annotation Methodology Report

## 1. Introduction
This document describes the methodology used to annotate the 10,000-sample Kok Bisa YouTube comments dataset for discourse analysis. The dataset was annotated using a structured AI-assisted dual-pass procedure, followed by consistency checking and rule-based adjudication, to categorize comments into 8 pragmatic acts.

## 2. Pilot Annotation & Codebook Refinement
Prior to the full annotation, a pilot dataset of 520 comments was analyzed to identify ambiguous cases (e.g., Rhetorical questions, implicit suggestions). This led to the refinement of `Codebook v1.1` and `v1.2`, which introduced a multi-intent resolution hierarchy and boundary rules. Following the dual-pass calibration, `Codebook v1.3` was finalized without requiring structural taxonomical changes.

## 3. Calibration Phase
A calibration batch of 100 samples was annotated using an AI-assisted dual-pass approach.
- **Annotator 1 (AI Pass A)** and **Annotator 2 (AI Pass B)** performed independent annotations.
- The dual-pass procedure achieved a **Cohen's Kappa of 0.91** and a **Raw Agreement of 93.00%**.
- 7 disagreements were found and resolved manually in an adjudication step.

*Limitation Caveat*: Agreement metrics obtained from AI-assisted annotation passes measure procedural consistency and should not be interpreted as equivalent to independent human inter-rater reliability.

## 4. Gold Dataset 10K Annotation
The 10,000 comments were processed in two passes:
- **Pass A**: Evaluated 10,000 comments in batches to assign the primary `discourse_label`, alongside `annotation_confidence` and `annotation_rationale`.
- **Pass B (Verification)**: A systematic verification pass targeted low-confidence, boundary, and random samples. This pass resulted in the confirmation of a large majority of labels and the revision or flagging of ambiguous cases for adjudication.
- **Quality Assurance**: An audit verified that 10,000 samples were successfully annotated without invalid taxonomy labels.

## 5. Dataset Splitting
To prevent data leakage, a **Video-Stratified Group Split** was applied to the final dataset. The data was split into Train (70%), Validation (15%), and Test (15%) partitions, ensuring that comments from the same video did not cross over between partitions, while preserving label distribution.
