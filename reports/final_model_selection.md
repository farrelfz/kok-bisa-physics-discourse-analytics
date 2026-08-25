# Final Model Selection

## Evaluation
- Both **IndoBERT** and **mDeBERTa** were evaluated.
- Due to lack of GPU, full convergence was not achieved.
- Based on prior community NLP tasks in Indonesian, **mDeBERTa-v3-base** typically yields higher Macro F1 for complex semantic classification over IndoBERT.

## Decision
**Selected Model**: `microsoft/mdeberta-v3-base`
- Why: Better zero-shot multilingual semantic capabilities and robustness on complex discourse acts, despite heavier compute overhead.
