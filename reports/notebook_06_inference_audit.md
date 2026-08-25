# Notebook 06 Inference Audit

## Checklist
1. **Model Path**: Pointed to `models/discourse_classifier_final` (Confirmed)
2. **Label Mapping**: Uses `config/discourse_label_mapping.json` (Identical)
3. **Tokenizer**: Uses `AutoTokenizer` aligned to `microsoft/mdeberta-v3-base`.
4. **Max Length**: Maintained at 128.
5. **Batch Memory-Safe**: Yes, recommended batch_size=32 for inference.
6. **Output Probabilities**: Pipeline saves logits/softmax confidences.
