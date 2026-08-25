import os
import json
from pathlib import Path

def run_preflight_audit():
    print("Running Colab Preflight Audit...")
    
    BASE_DIR = Path("/home/si/Codingan/Pribadi/kokbisa")
    
    required_files = [
        "notebooks/08_discourse_model_training.ipynb",
        "notebooks/06_indobert_semantic_analysis.ipynb",
        "data/corpus/corpus.parquet",
        "data/processed/train_balanced.parquet",
        "data/processed/validation_balanced.parquet",
        "data/processed/test_balanced.parquet",
        "config/discourse_label_mapping.json",
        "config/experiment_plan.json"
    ]
    
    deprecated_patterns = [
        "reports/model_benchmark/*.csv",
        "models/temp_*"
    ]
    
    audit_report = [
        "# Colab Pipeline Preflight Audit",
        "",
        "## 1. Required Files for Colab Pipeline"
    ]
    
    missing_files = []
    
    for f in required_files:
        p = BASE_DIR / f
        if p.exists():
            size_mb = p.stat().st_size / (1024 * 1024)
            audit_report.append(f"- [x] `{f}` (Valid - {size_mb:.2f} MB)")
        else:
            missing_files.append(f)
            audit_report.append(f"- [ ] `{f}` (MISSING)")
            
    audit_report.append("")
    audit_report.append("## 2. Deprecated / Dummy Files to Exclude")
    import glob
    for pattern in deprecated_patterns:
        matches = glob.glob(str(BASE_DIR / pattern))
        for match in matches:
            rel_path = Path(match).relative_to(BASE_DIR)
            audit_report.append(f"- [EXCLUDE] `{rel_path}` (Dummy/Deprecated CPU Artifact)")
            
    audit_report.append("")
    audit_report.append("## 3. Input/Output Dependency Map")
    audit_report.append("### Notebook 08 (Training)")
    audit_report.append("**INPUTS:**")
    audit_report.append("- `data/processed/*_balanced.parquet`")
    audit_report.append("- `config/discourse_label_mapping.json`")
    audit_report.append("- `config/experiment_plan.json`")
    audit_report.append("**OUTPUTS:**")
    audit_report.append("- `outputs/training/best_model/*` (Model, Tokenizer, Meta)")
    audit_report.append("- `reports/model_selection_report.md`")
    
    audit_report.append("")
    audit_report.append("### Notebook 06 (Inference)")
    audit_report.append("**INPUTS:**")
    audit_report.append("- `data/corpus/corpus.parquet`")
    audit_report.append("- `outputs/training/best_model/*`")
    audit_report.append("**OUTPUTS:**")
    audit_report.append("- `outputs/inference/checkpoints/batch_*.parquet`")
    audit_report.append("- `outputs/inference/full_corpus_predictions.parquet`")
    audit_report.append("- `outputs/figures/*.png`")
    
    report_path = BASE_DIR / "reports" / "colab_pipeline_preflight_audit.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(audit_report))
        
    print(f"Preflight audit saved to: {report_path}")

if __name__ == "__main__":
    run_preflight_audit()
