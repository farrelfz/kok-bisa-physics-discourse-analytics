import os
import shutil
import zipfile
import hashlib
from pathlib import Path

def create_release():
    print("Starting release packaging process...")
    
    BASE_DIR = Path("/home/si/Codingan/Pribadi/kokbisa")
    RELEASE_DIR = BASE_DIR / "release" / "kokbisa_colab_pipeline"
    ZIP_PATH = BASE_DIR / "release" / "kokbisa_colab_pipeline.zip"
    
    # 1. Clean staging dir
    if RELEASE_DIR.exists():
        shutil.rmtree(RELEASE_DIR)
    RELEASE_DIR.mkdir(parents=True)
    
    # 2. Define required files and directories
    include_paths = [
        "notebooks/08_discourse_model_training.ipynb",
        "notebooks/06_indobert_semantic_analysis.ipynb",
        "data/corpus/corpus.parquet",
        "data/processed/train_balanced.parquet",
        "data/processed/validation_balanced.parquet",
        "data/processed/test_balanced.parquet",
        "config/discourse_label_mapping.json",
        "config/experiment_plan.json",
        "config/pipeline_contract.json",
        "scripts/verify_environment.py",
        "requirements_colab.txt",
        "README_COLAB.md",
        "RUN_ORDER.md"
    ]
    
    # 3. Copy files to staging
    print("Copying files to staging directory...")
    for p in include_paths:
        src = BASE_DIR / p
        dst = RELEASE_DIR / p
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            print(f"  Copied: {p}")
        else:
            print(f"  WARNING: Missing required file {p}")
            
    # 4. Zip the staging directory
    print("\\nZipping payload...")
    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(RELEASE_DIR):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(RELEASE_DIR.parent)
                zipf.write(file_path, arcname)
                
    # 5. Generate Checksums and Manifest
    print("\\nGenerating Manifest...")
    manifest_lines = [
        "# Kok Bisa Pipeline Release Manifest",
        "",
        "## Checksums (SHA-256)",
        "| File | SHA-256 | Size (MB) |",
        "|---|---|---|"
    ]
    
    for root, _, files in sorted(os.walk(RELEASE_DIR)):
        for file in sorted(files):
            file_path = Path(root) / file
            rel_path = file_path.relative_to(RELEASE_DIR)
            size_mb = file_path.stat().st_size / (1024 * 1024)
            
            with open(file_path, "rb") as f:
                sha256 = hashlib.sha256(f.read()).hexdigest()
                
            manifest_lines.append(f"| `{rel_path}` | `{sha256}` | {size_mb:.2f} |")
            
    manifest_path = BASE_DIR / "release" / "MANIFEST.md"
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("\n".join(manifest_lines))
        
    # Clean staging dir after zipping
    if RELEASE_DIR.exists():
        shutil.rmtree(RELEASE_DIR)
        
    print(f"\n✅ Release created successfully!")
    print(f"  - ZIP Archive: {ZIP_PATH} ({(ZIP_PATH.stat().st_size / (1024*1024)):.2f} MB)")
    print(f"  - Manifest: {manifest_path}")

if __name__ == "__main__":
    create_release()
