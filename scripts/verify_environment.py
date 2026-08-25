import os
import sys

def verify_environment():
    print("Verifying Colab GPU Environment for Kok Bisa Research Pipeline...")
    
    # 1. Hardware Check
    print("\\n[1/3] Checking Hardware Acceleration...")
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ GPU Detected: {torch.cuda.get_device_name(0)}")
        else:
            print("❌ WARNING: No GPU detected! Execution will be extremely slow. Enable GPU in Runtime > Change runtime type.")
    except ImportError:
        print("❌ CRITICAL: PyTorch is not installed.")
        
    # 2. Dependency Check
    print("\\n[2/3] Checking Core Dependencies...")
    deps = ["transformers", "datasets", "accelerate", "evaluate", "pandas", "pyarrow", "fastparquet", "sklearn"]
    for dep in deps:
        try:
            __import__(dep if dep != "sklearn" else "sklearn")
            print(f"✅ {dep} is installed.")
        except ImportError:
            print(f"❌ {dep} is MISSING. Please run: !pip install -r requirements_colab.txt")
            
    # 3. Path & Contract Check
    print("\n[3/3] Checking Data & Contract Dependencies...")
    required_paths = [
        "config/pipeline_contract.json",
        "data/corpus/corpus.parquet",
        "data/processed/train_balanced.parquet",
        "notebooks/08_discourse_model_training.ipynb",
        "notebooks/06_indobert_semantic_analysis.ipynb"
    ]
    
    all_paths_exist = True
    for path in required_paths:
        if os.path.exists(path):
            print(f"✅ Found {path}")
        else:
            print(f"❌ MISSING {path}")
            all_paths_exist = False
            
    if not all_paths_exist:
        print("\\n❌ Environment verification failed. Please ensure you have extracted the ZIP correctly and are running this from the repository root in Google Drive.")
    else:
        print("\\n✅ Environment verification passed. Ready for Notebook 08.")

if __name__ == "__main__":
    verify_environment()
