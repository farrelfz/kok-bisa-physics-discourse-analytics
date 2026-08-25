# Colab Pipeline Preflight Audit

## 1. Required Files for Colab Pipeline
- [x] `notebooks/08_discourse_model_training.ipynb` (Valid - 0.01 MB)
- [x] `notebooks/06_indobert_semantic_analysis.ipynb` (Valid - 0.02 MB)
- [x] `data/corpus/corpus.parquet` (Valid - 25.34 MB)
- [x] `data/processed/train_balanced.parquet` (Valid - 1.09 MB)
- [x] `data/processed/validation_balanced.parquet` (Valid - 0.28 MB)
- [x] `data/processed/test_balanced.parquet` (Valid - 0.20 MB)
- [x] `config/discourse_label_mapping.json` (Valid - 0.00 MB)
- [x] `config/experiment_plan.json` (Valid - 0.00 MB)

## 2. Deprecated / Dummy Files to Exclude
- [EXCLUDE] `models/temp_EXP_01` (Dummy/Deprecated CPU Artifact)
- [EXCLUDE] `models/temp_EXP_02` (Dummy/Deprecated CPU Artifact)
- [EXCLUDE] `models/temp_EXP_03` (Dummy/Deprecated CPU Artifact)

## 3. Input/Output Dependency Map
### Notebook 08 (Training)
**INPUTS:**
- `data/processed/*_balanced.parquet`
- `config/discourse_label_mapping.json`
- `config/experiment_plan.json`
**OUTPUTS:**
- `outputs/training/best_model/*` (Model, Tokenizer, Meta)
- `reports/model_selection_report.md`

### Notebook 06 (Inference)
**INPUTS:**
- `data/corpus/corpus.parquet`
- `outputs/training/best_model/*`
**OUTPUTS:**
- `outputs/inference/checkpoints/batch_*.parquet`
- `outputs/inference/full_corpus_predictions.parquet`
- `outputs/figures/*.png`