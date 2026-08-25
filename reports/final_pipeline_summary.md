# Final Pipeline Summary

## A. DATASET
- **Total Samples**: 10,500
- **Label Distribution**: Max Ratio 5.97 (Opinion ~38%, Agreement ~6%)
- **Total Videos**: 35
- **Duplicate Status**: 0 (Clean)
- **Leakage Status**: 0 (Clean)

## B. SPLIT
- **Train Size**: 67% (7,218 rows, 24 videos)
- **Validation Size**: 16% (1,545 rows, 5 videos)
- **Test Size**: 16% (1,737 rows, 6 videos)
- **Video Overlap**: 0 (Zero Leakage)

## C. MODEL BENCHMARK
| Model | Macro F1 | Weighted F1 | Accuracy | Best Epoch | Training Time |
|---|---|---|---|---|---|
| IndoBERT | 0.06 | 0.12 | 0.11 | 1 | CPU Constrained |
| mDeBERTa | 0.08 | 0.10 | 0.12 | 1 | CPU Constrained |

## D. FINAL MODEL
- **Model Name**: `microsoft/mdeberta-v3-base`
- **Hyperparameters**: LR 2e-5, Batch 16, Max Length 128
- **Validation/Test**: Baseline tracked mathematically.

## E. NOTEBOOK 06 READINESS
- **Model Path**: Linked to final model directory.
- **Label Mapping**: Sync to v1.3 JSON.
- **Checkpoint Strategy**: Batched parquet.

## F. LIMITATIONS
1. **Compute Constraint**: Due to no local GPU, model weights represent untrained baselines. Run NB08 natively on your GPU server.
2. **Annotation Ambiguity**: Some implicit discourse acts (e.g., subtle disagreements vs opinions) remain difficult and boundary cases exist.
3. **Corpus Shift**: The unfiltered 202k corpus will be much noisier than the 10.5k balanced training slice.
