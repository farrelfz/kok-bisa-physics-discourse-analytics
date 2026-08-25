# Full Corpus Inference Readiness

## Strategy
- **Batching**: Saving every 10,000 comments to `data/checkpoints/inference/batch_XXXX.parquet`.
- **Validation**:
  - Total input rows: 202,429
  - Ensure zero dropped rows.
  - Distribution will be aggregated post-inference.

## Post-Inference Note
A domain shift is anticipated when shifting from the *high-quality filtered Natural Balanced dataset* (10k) back to the *unfiltered noisy corpus* (202k). The model may skew heavily towards `Opinion` and `Question` as many raw comments lack strong discourse markers.
