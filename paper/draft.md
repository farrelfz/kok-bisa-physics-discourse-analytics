# Indonesian Public Discourse in YouTube-Based Science Communication
## A Corpus-Based Computational Linguistics Analysis

> **Catatan Manuskrip Lengkap:** Dokumen naskah lengkap artikel ilmiah terstandar **IMRaD (dengan Model Retoris CARS)** beserta seluruh tabel empiris, matriks kebingungan, dan diagram pipeline tersimpan di:  
> 📄 [academic_paper_imrad_cars.md](file:///home/si/Codingan/Pribadi/kokbisa/paper/academic_paper_imrad_cars.md)

---

### Abstract
This paper presents the construction and analysis of the **Indonesian Public Discourse Corpus (IPDC)**, a specialized linguistic corpus extracted from popular science communication videos on YouTube (focusing on the "Kok Bisa?" education channel). Using a hybrid methodology combining traditional Corpus Linguistics and modern Computational Linguistics/NLP techniques, we analyze the structure, vocabulary richness, and discourse characteristics of Indonesian public comments. Our findings reveal key engagement patterns, semantic alignments, and discourse structures that define science communication in the Indonesian digital landscape.

---

### 1. Introduction
Science communication plays a pivotal role in public education and digital literacy. YouTube has emerged as a primary medium for science dissemination in Indonesia, yet how the general public consumes, questions, and discusses scientific topics remains understudied. This paper addresses this gap by:
1. Building a generic pipeline to extract, validate, and structure public comments and video subtitles (202,429 comments across 35 videos).
2. Characterizing lexical diversity (Type-Token Ratio = 0.1750, MTLD = 94.4546, Zipf slope $s = 1.3171$) and analyzing linguistic patterns.
3. Conducting topic modeling and semantic alignment analysis using fine-tuned **IndoBERT Base** (achieving **97.40% Macro F1** and **97.73% Accuracy** with zero-leakage video stratification).

---

### 2. Method
We designed a 9-stage processing pipeline spanning:
- **Playlist Auditing & Data Collection**: Using the YouTube Data API v3 and `youtube-transcript-api` fallback mechanism.
- **Data Validation**: Language filtering (Indonesian detection across 41 codes), duplicate pruning, and spam classification (2,574 spam comments pruned).
- **Corpus Engineering**: Organizing structured text into an SQLite/DuckDB Database and exporting to Apache Parquet.
- **Linguistic Preprocessing**: Custom tokenization, stemming (using PySastrawi), and stopword elimination.
- **Gold Annotation & Reliability**: 10,500 gold-annotated samples with Cohen's Kappa $\kappa > 0.82$.
- **Deep Learning Model**: Fine-tuned IndoBERT Base with video-stratified splitting (70/15/15).

---

### 3. Results
- **Corpus Volume**: 35 public videos, 202,429 comments/replies, 3,059,944 clean tokens.
- **Model Performance**: IndoBERT Base Champion with **97.40% Macro F1** (Trial 2: 96.93%, mDeBERTa Baseline: 97.12%).
- **Discourse Distribution**: `Question` (39.59%), `Suggestion` (28.02%), `Praise` (9.41%), `Off-topic` (6.04%), `Disagreement` (4.91%), `Correction` (3.80%), `Opinion` (3.40%), `Others` (2.90%), `Agreement` (1.20%), and `Experience` (0.73%).

---

### 4. Discussion & Conclusion
High rates of "Question" and "Suggestion" comments demonstrate that Indonesian audiences actively engage in cognitive inquiry rather than passive viewing. The research platform is accessible via FastAPI + DuckDB + React 19 dashboard.

---

### References (APA 7th Edition)
- Biber, D. (1988). *Variation across speech and writing*. Cambridge University Press.
- Devlin, J. et al. (2019). BERT: Pre-training of deep bidirectional transformers. *NAACL-HLT 2019*.
- Koto, F., Rahimi, A., Lau, J. H., & Baldwin, T. (2020). IndoLEM and IndoBERT. *COLING 2020*.
- Swales, J. M. (1990). *Genre analysis: English in academic and research settings*. Cambridge University Press.
