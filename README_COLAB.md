# Kok Bisa? Discourse Analysis - Google Colab GPU Pipeline

This repository contains the completely integrated and standard pipeline for running Transformer training (IndoBERT/IndoBERT) and Full-Corpus Inference on Google Colab with GPU acceleration.

## Environment Architecture
- **Training Mode:** Dual-Mode Notebook 08 automatically detects hardware. Change `RUN_MODE = "full"` for Colab GPU execution.
- **Inference Mode:** Notebook 06 utilizes a built-in checkpointing system, processing 10,000 comments at a time and merging them into the final `full_corpus_predictions.parquet`.
- **Storage Strategy:** All outputs are strictly written to the `outputs/` directory to prevent clutter.

## Quick Start Guide

1. **Upload to Google Drive**
   - Extract `kokbisa_colab_pipeline.zip` into your Google Drive under a folder named `KokBisaResearch`.

2. **Open Google Colab**
   - Go to [Google Colab](https://colab.research.google.com/).
   - Click **File > Open notebook > Google Drive**.
   - Navigate to `KokBisaResearch/notebooks/`.

3. **Install Dependencies (First Cell of Any Notebook)**
   ```python
   !pip install -r ../requirements_colab.txt
   ```

4. **Verify Environment**
   ```python
   !python3 ../scripts/verify_environment.py
   ```

5. **Execute Pipeline in Order**
   Please follow the strict execution order defined in `RUN_ORDER.md`.

## Data Contracts (Handoff)
- **Notebook 08** writes the final production model (safetensors, tokenizer, and `label_mapping.json`) to `outputs/training/best_model/`.
- **Notebook 06** strictly requires `outputs/training/best_model/` to be present and fully populated before it will execute.

## Troubleshooting

### Disconnects / RAM Crashes during Notebook 06
Notebook 06 features a bullet-proof checkpointing loop. If Colab disconnects midway through classifying the 200,000 comments:
1. Reconnect the runtime.
2. Re-run the cells.
3. Notebook 06 will automatically detect `batch_*.parquet` in `outputs/inference/checkpoints/` and resume exactly where it left off.
