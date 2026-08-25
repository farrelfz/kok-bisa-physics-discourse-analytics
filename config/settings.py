import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = BASE_DIR / "config"
DATA_DIR = BASE_DIR / "data"
REPORTS_DIR = BASE_DIR / "reports"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"
SRC_DIR = BASE_DIR / "src"
PAPER_DIR = BASE_DIR / "paper"
LOGS_DIR = BASE_DIR / "logs"

# Subdirectories for data stages
RAW_DATA_DIR = DATA_DIR / "raw"
RAW_METADATA_DIR = RAW_DATA_DIR / "metadata"
RAW_TRANSCRIPTS_DIR = RAW_DATA_DIR / "transcripts"
RAW_COMMENTS_DIR = RAW_DATA_DIR / "comments"

PROCESSED_DATA_DIR = DATA_DIR / "processed"
ANNOTATED_DATA_DIR = DATA_DIR / "annotated"
CORPUS_DIR = DATA_DIR / "corpus"

# Ensure all critical folders exist
for folder in [
    RAW_METADATA_DIR,
    RAW_TRANSCRIPTS_DIR,
    RAW_COMMENTS_DIR,
    PROCESSED_DATA_DIR,
    ANNOTATED_DATA_DIR,
    CORPUS_DIR,
    REPORTS_DIR,
    NOTEBOOKS_DIR,
    PAPER_DIR,
    LOGS_DIR,
]:
    folder.mkdir(parents=True, exist_ok=True)

# API Configurations
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

# Corpus DB settings
DB_PATH = CORPUS_DIR / "corpus.db"
PARQUET_PATH = CORPUS_DIR / "corpus.parquet"

# Global hyperparameters & settings
RANDOM_SEED = 42
LANGUAGE_MIN_SCORE = 0.5  # Threshold score for langdetect/fasttext
MAX_COMMENTS_PER_VIDEO = 1000000  # Safety threshold to avoid API exhaustion

# Models settings
EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
ZERO_SHOT_MODEL_NAME = "MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7"

# Registry mapping
PLAYLIST_REGISTRY_PATH = CONFIG_DIR / "playlist_registry.yaml"
