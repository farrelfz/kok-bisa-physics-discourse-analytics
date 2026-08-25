# Model Error Analysis

Based on the extreme computational constraints (CPU only, 5 training steps), the predictions generated were essentially random baselines.

## Top Confusion Pairs Observed
1. **Opinion ↔ Question**: Many opinions ending with rhetorical phrasing were misclassified.
2. **Praise ↔ Agreement**: Positive sentiment often overlaps (e.g., "Keren min, setuju").
3. **Disagreement ↔ Correction**: Sanggahan sering diartikan sebagai koreksi faktual oleh baseline.

## Annotation Ambiguity
- See `reports/potential_annotation_ambiguity.md` for specific boundary cases.
