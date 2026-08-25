# Notebook 08 Preflight Audit

## Dataset Information
- **Target Dataset**: `data/annotated/gold_standard_balanced_natural.csv`
- **Total Rows**: 10500
- **Columns**: comment_id, video_id, text, discourse_label, confidence, annotation_pass, source, like_count, published_at, parent_id, author_name

## Data Integrity Overview
- **Missing Values**: {'comment_id': 0, 'video_id': 0, 'text': 0, 'discourse_label': 0, 'confidence': 0, 'annotation_pass': 0, 'source': 0, 'like_count': 0, 'published_at': 0, 'parent_id': 6093, 'author_name': 0}
- **Duplicate Rows**: 0
- **Duplicate Comment IDs**: 0
- **Duplicate Texts**: 0

## Distributions
- **Label Distribution**: {'Opinion': 4007, 'Question': 1246, 'Disagreement': 994, 'Praise': 968, 'Suggestion': 961, 'Experience': 939, 'Correction': 714, 'Agreement': 671}
- **Unique Videos**: 35
- **Average Text Length**: 138.8 characters

## File Structure Checks
- `notebooks/08_discourse_model_training.ipynb`: Exists (True)
- `notebooks/06_mdeberta_semantic_analysis.ipynb`: Exists (True)
- `config/discourse_label_mapping.json`: Exists (True)
