# Indonesian Public Discourse Corpus (IPDC) & Research Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![Model: IndoBERT Base](https://img.shields.io/badge/Model-IndoBERT%20Base-green.svg)](https://huggingface.co/indobenchmark/indobert-base-p1)
[![Macro F1: 97.40%](https://img.shields.io/badge/Macro%20F1-97.40%25-purple.svg)](#-model-benchmarks)
[![Corpus Size: 202k](https://img.shields.io/badge/Corpus-202%2C429%20Comments-orange.svg)](#-corpus-overview)

An end-to-end computational linguistics and deep learning research platform analyzing public discourse and scientific inquiry in Indonesian science education videos (**Kok Bisa?** physics playlist).

---

## 🔬 Research Overview & Key Findings

- **Corpus Scale**: **202,429 YouTube comments** extracted across 35 public science education videos.
- **8 Canonical Discourse Acts**: `Question`, `Opinion`, `Disagreement`, `Correction`, `Suggestion`, `Praise`, `Agreement`, and `Experience`.
- **Champion Deep Learning Model**: Fine-tuned **IndoBERT Base** (`indobenchmark/indobert-base-p1`) achieving **97.40% Macro F1** and **97.73% Accuracy** on held-out test splits with strict zero-leakage video stratification.
- **Zero Class Collapse**: Exceptional stability on challenging minority acts (e.g., *Correction* at 96.2% F1 and *Disagreement* at 97.2% F1).
- **Interactive Research Portal**: High-performance single-page research dashboard powered by **FastAPI + DuckDB** and **React 19 + Vite + Recharts/ECharts**.

---

## 📁 Repository Structure

```
kokbisa/
├── config/                        # Global configuration & playlist settings
│   ├── settings.py                # Paths, thresholds, model architectures, and random seeds
│   └── playlist_registry.yaml     # Tracked YouTube playlist registry
├── data/                          # Structured data layers
│   ├── raw/                       # Raw YouTube API comment JSON & transcripts
│   ├── processed/                 # Tokenized, filtered, and cleaned Parquet datasets
│   ├── annotated/                 # Gold-annotated validation and test sets (10,500 comments)
│   └── corpus/                    # Parquet corpus exports and DuckDB relational database
├── docs/                          # Academic documentation & annotation guidelines
│   ├── discourse_codebook_v1.md   # 8-Act canonical discourse annotation codebook
│   └── implementation.md          # Technical research implementation specification
├── figures/                       # Publication charts, Zipf distributions, and embeddings plots
├── notebooks/                     # Reproducible Jupyter & Google Colab GPU notebooks (01–10)
│   ├── 01_playlist_audit.ipynb    # Playlist auditing and video accessibility validation
│   ├── 02_scraping.ipynb          # YouTube Data API v3 full comment harvesting
│   ├── 03_validation.ipynb        # Language detection & spam filtering
│   ├── 04_corpus.ipynb            # Relational database & corpus compilation
│   ├── 05_preprocessing.ipynb     # Token normalization & Sastrawi morphology
│   ├── 06_indobert_semantic_analysis.ipynb # [Colab GPU] Semantic embeddings & inference
│   ├── 07_topic_modeling.ipynb    # TF-IDF keyword extraction & topic clustering
│   ├── 08_discourse_model_training.ipynb   # [Colab GPU] IndoBERT fine-tuning & benchmarking
│   ├── 09_visualization.ipynb     # Publication figure generation
│   └── 10_dashboard_analytics.ipynb # Dashboard preflight cache generator
├── outputs/                       # Final inference Parquet files & evaluation artifacts
│   ├── figures/                   # Model performance figures & confusion matrices
│   └── inference/                 # full_corpus_predictions.parquet (202,429 rows)
├── reports/                       # Data leakage audits, calibration reports, & test evaluations
├── src/                           # Production source code
│   ├── audit/                     # Playlist and data integrity auditing modules
│   ├── corpus/                    # SQLite, DuckDB, and Parquet corpus builders
│   ├── dashboard/                 # Research web application
│   │   ├── api/                   # FastAPI backend with zero-copy DuckDB engine
│   │   └── frontend/              # Modern React 19 + Vite + shadcn/ui dashboard
│   ├── nlp/                       # NLP pipeline modules (annotator, classifier, analyzer)
│   ├── preprocessing/             # Text cleaning, normalizers, & Sastrawi stemmer
│   ├── scraping/                  # YouTube Data API v3 harvesting client
│   ├── validation/                # Spam filter rules & language detection
│   └── visualization/             # Chart generators
├── tests/                         # Unit tests (18 tests passing)
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules for virtualenvs, caches, & big data
├── LICENSE                        # MIT License
├── requirements.txt               # Python package dependencies
├── setup.py                       # Package installer
└── run_local_pipeline.sh          # Automated bash pipeline runner
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.12+
- Node.js 18+ (for frontend dashboard)

### 2. Environment Setup
```bash
# Clone the repository
git clone https://github.com/farrelfz/kok-bisa-physics-discourse-analytics.git
cd kokbisa-discourse-analytics

# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
pip install -e .
```

### 3. Configure Credentials
Copy `.env.example` to `.env` and provide your YouTube Data API v3 key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
FORCE_RULE_BASED=0
```

### 4. Running Unit Tests
```bash
python -m unittest discover tests/
```

---

## 📊 Launching the Research Dashboard

### Option A: Run Full Production Server (FastAPI serves Backend + Built Frontend)
```bash
# Build frontend bundle
cd src/dashboard/frontend
npm install
npm run build
cd ../../..

# Start FastAPI server on port 8000
python -m uvicorn src.dashboard.api.main:app --host 127.0.0.1 --port 8000
```
Open **`http://127.0.0.1:8000`** in your browser.

### Option B: Frontend Development Mode (Hot Module Replacement)
```bash
# Terminal 1: Start backend API
python -m uvicorn src.dashboard.api.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Start Vite frontend dev server
cd src/dashboard/frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧭 Dashboard Navigation & Feature Matrix

The research portal is organized into 4 intuitive sections across 14 dedicated analytics modules:

| Section | Module | Description |
| :--- | :--- | :--- |
| **Analytics** | **Overview** | Executive KPI summary, corpus volume, top metrics, dominant acts |
| | **Discourse Analysis** | Deep 8-Act distribution breakdown, interaction behaviors, and key quotes |
| | **Video Analysis** | Video-level discourse matrix, view-to-comment ratios, YouTube embed |
| | **Semantic Space (2D)** | Interactive 2D PCA vector plane (MiniLM embeddings) with point inspector |
| | **Language Map** | 41 detected language codes, Indonesian dominance (79.4%), dialect analysis |
| **Corpus & Data** | **Comment Explorer** | Full-text instant search across all 202,429 comments with multi-filters & CSV export |
| | **Confidence Explorer** | Model confidence distributions and classification margins (Top-1 vs Top-2) |
| | **Boundary Ambiguity** | Low-confidence uncertainty explorer for manual review and active learning |
| **Interactive Lab** | **Live Playground** | Real-time interactive comment classifier with logit probability breakdown |
| **Research & Engine**| **Model Performance** | 5 fine-tuned trial comparisons, IndoBERT Champion, Per-Class F1 breakdown |
| | **Pipeline Stages** | 9-stage end-to-end NLP architecture from raw scraping to DuckDB |
| | **Methodology** | Scientific codebook, zero-leakage video stratification, quality control |
| | **Colab Reproduction** | Step-by-step GPU reproduction guidelines for Google Colab (T4/A100) |
| | **About & Copyright** | Academic background, research questions, licensing, and BibTeX citation |

---

## 📈 Model Benchmarks

Evaluation performed on held-out test split (1,502 gold comments) with video-stratified splitting:

| Experiment Setup | Backbone Architecture | Learning Rate | Macro F1 | Weighted F1 | Overall Accuracy | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Champion Model** | **IndoBERT Base (Phase 1)** | **3e-5** | **97.40%** | **97.72%** | **97.73%** | **Selected Champion** |
| Trial 2 | IndoBERT Base | 2e-5 | 96.93% | 97.39% | 97.41% | Completed |
| Trial 1 | IndoBERT Base | 1e-5 | 95.82% | 96.54% | 96.60% | Completed |
| Baseline B | mDeBERTa-v3 Base | 2e-5 | 97.12% | 97.50% | 97.54% | Baseline |
| Baseline A | mDeBERTa-v3 Base | 1e-5 | 96.85% | 97.21% | 97.25% | Baseline |

---

## 📄 Academic Citation & Copyright

### Copyright
© 2026 **Indonesian Public Discourse Corpus (IPDC) Project & Kok Bisa? Discourse Analytics Research**. All rights reserved.

### License
This project is open-source software licensed under the **[MIT License](LICENSE)**.

### BibTeX Citation
```bibtex
@misc{kokbisa_discourse_2026,
  title  = {Indonesian Public Discourse Corpus: Deep Learning Classification of Science Engagement},
  author = {IPDC Research Project},
  year   = {2026},
  url    = {https://github.com/farrelfz/kok-bisa-physics-discourse-analytics}
}
```

---

## 📚 References

- Aji, A. F., Winata, G. I., Koto, F., Cahyawijaya, S., Romadhony, A., Mahendra, R., Kurniawan, K., Moeljadi, D., Prasojo, R. E., Baldwin, T., Lau, J. H., & Ruder, S. (2022). One country, 700+ languages: NLP challenges for underrepresented languages and dialects in Indonesia. *Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)*, 7226–7249. https://doi.org/10.18653/v1/2022.acl-long.500
- Austin, J. L. (1962). *How to do things with words*. Oxford University Press. 
- Barik, A. M., Mahendra, R., & Adriani, M. (2019). Normalization of Indonesian-English code-mixed Twitter data. *Proceedings of the 5th Workshop on Noisy User-Generated Text (W-NUT 2019)*, 417–424. https://doi.org/10.18653/v1/D19-5554
- Bucchi, M., & Trench, B. (Eds.). (2021). *Routledge handbook of public communication of science and technology* (3rd ed.). Routledge.
- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, 20(1), 37–46. https://doi.org/10.1177/001316446002000104
- Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long and Short Papers)*, 4171–4186. https://doi.org/10.18653/v1/N19-1423
- Dubovi, I., & Tabak, I. (2020). An empirical analysis of knowledge co-construction in YouTube comments. *Computers & Education*, 156, Article 103939. https://doi.org/10.1016/j.compedu.2020.103939
- Dubovi, I., & Tabak, I. (2021). Interactions between emotional and cognitive engagement with science on YouTube. *Public Understanding of Science*, 30(6), 759–776. https://doi.org/10.1177/0963662521990848
- Fauzan, M. F. D. (2026). *Kok Bisa? physics discourse analytics: An interactive research companion for the Indonesian Public Discourse Corpus (IPDC)* [Interactive web application]. GitHub Pages. Kok Bisa? Physics Discourse Analytics
- Hill, V. M., Grant, W. J., McMahon, M. L., & Singhal, I. S. (2022). How prominent science communicators on YouTube understand the impact of their work. *Frontiers in Communication*, 7, Article 1014477. https://doi.org/10.3389/fcomm.2022.1014477
- Koto, F., Rahimi, A., Lau, J. H., & Baldwin, T. (2020). IndoLEM and IndoBERT: A benchmark dataset and pre-trained language model for Indonesian NLP. *Proceedings of the 28th International Conference on Computational Linguistics*, 757–770. https://doi.org/10.18653/v1/2020.coling-main.66
- Searle, J. R. (1969). *Speech acts: An essay in the philosophy of language*. Cambridge University Press.
- Vosoughi, S., & Roy, D. (2016). Tweet acts: A speech act classifier for Twitter. *Proceedings of the International AAAI Conference on Web and Social Media*, 10(1), 711–714. https://doi.org/10.1609/icwsm.v10i1.14821
