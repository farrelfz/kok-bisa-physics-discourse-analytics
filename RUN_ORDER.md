# Colab Execution Run Order

## PHASE A: DISCOURSE MODEL TRAINING
**Target Notebook:** `notebooks/08_discourse_model_training.ipynb`

### Pre-requisites:
- Hardware Accelerator: GPU (T4, V100, or A100) must be enabled in Colab.
- Dependencies installed via `requirements_colab.txt`.

### Steps:
1. Open `08_discourse_model_training.ipynb`.
2. Locate `RUN_MODE = "smoke"` in Section 2 and change it to `RUN_MODE = "full"`.
3. Select "Run All".
4. **Expected Duration:** ~1 to 3 hours depending on GPU.
5. **Validation:** Check Google Drive `KokBisaResearch/outputs/training/best_model/` folder. It should contain `model.safetensors`, `config.json`, `tokenizer.json`, `label_mapping.json`, and `model_metadata.json`.

---

## PHASE B: FULL CORPUS INFERENCE & SEMANTIC ANALYSIS
**Target Notebook:** `notebooks/06_indobert_semantic_analysis.ipynb`

### Pre-requisites:
- Hardware Accelerator: GPU must be enabled.
- **Phase A must be 100% completed successfully.**
- Verify `outputs/training/best_model/` is fully populated.

### Steps:
1. Open `06_indobert_semantic_analysis.ipynb`.
2. Select "Run All".
3. The notebook will process the entire 202k+ dataset in batches of 10,000 comments.
4. If the Colab kernel crashes during inference, simply "Run All" again. It will automatically detect existing checkpoints and resume.
5. **Expected Duration:** ~1 hour.
6. **Validation:** Check `outputs/inference/full_corpus_predictions.parquet` and the generated plots in `outputs/figures/`.
