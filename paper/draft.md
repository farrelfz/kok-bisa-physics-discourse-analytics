# Indonesian Public Discourse in YouTube-Based Science Communication
## A Corpus-Based Computational Linguistics Analysis

### Abstract
This paper presents the construction and analysis of the **Indonesian Public Discourse Corpus (IPDC)**, a specialized linguistic corpus extracted from popular science communication videos on YouTube (focusing on the "Kok Bisa?" education channel). Using a hybrid methodology combining traditional Corpus Linguistics and modern Computational Linguistics/NLP techniques, we analyze the structure, vocabulary richness, and discourse characteristics of Indonesian public comments. Our findings reveal key engagement patterns, semantic alignments, and discourse structures that define science communication in the Indonesian digital landscape.

---

### 1. Introduction
Science communication plays a pivotal role in public education and digital literacy. YouTube has emerged as a primary medium for science dissemination in Indonesia, yet how the general public consumes, questions, and discusses scientific topics remains understudied. This paper addresses this gap by:
1. Building a generic pipeline to extract, validate, and structure public comments and video subtitles.
2. Characterizing lexical diversity (Type-Token Ratio, MTLD) and analyzing linguistic patterns.
3. Conducting topic modeling and semantic alignment analysis to explore the dialogue between video content and public response.

---

### 2. Method
We designed a 10-stage processing pipeline spanning:
- **Playlist Auditing & Data Collection**: Using the YouTube Data API v3 and `youtube-transcript-api` fallback mechanism.
- **Data Validation**: Language filtering (Indonesian detection), duplicate pruning, and spam classification.
- **Corpus Engineering**: Organizing structured text into an SQLite Database and exporting to Apache Parquet.
- **Linguistic Preprocessing**: Custom tokenization, stemming (using PySastrawi), and stopword elimination.
- **Linguistic & Semantic Annotation**: POS-tagging, Named Entity Recognition, and discourse classification using multilingual Zero-Shot Transformers.
- **Discourse Analysis**: Semantic similarity mapping between transcripts and comments, Zipf's Law evaluation, and collocation extraction.

---

### 3. Results
*Note: Result metrics are generated automatically by the pipeline and recorded in `reports/07_corpus_stats.json`.*

#### 3.1 Corpus Summary
- Total Videos Analysed: 35
- Total Comments/Replies Gathered: 202,429
- Total Words (Clean Comments): 3,059,944

#### 3.2 Lexical Diversity & Zipf's Law Fit
- Type-Token Ratio (TTR): 0.1750
- Measure of Textual Lexical Diversity (MTLD): 94.4546
- Zipf's Law slope ($s$): 1.3171

#### 3.3 Topic Modeling & Discourse Distribution
- Dominant Discourse Acts: Question (39.59%), Suggestion (28.02%), Praise (9.41%), Off-topic (6.04%), Disagreement (4.91%), and Others (3.30%).

---

### 4. Discussion
We discuss the implications of our findings for science communication design. For instance, high rates of "Question" and "Suggestion" comments suggest an active, query-driven viewership, whereas high semantic alignment indicates that viewers are staying on-topic relative to the video transcript.

---

### 5. Conclusion
This study provides the first corpus-based analysis of Indonesian science communication public discourse on YouTube. The developed generic pipeline is open-sourced to encourage replication studies on other educational playlists.

---

### References (APA 7th Edition)
- Biber, D. (1988). *Variation across speech and writing*. Cambridge University Press.
- Bird, S., Klein, E., & Loper, E. (2009). *Natural language processing with Python: analyzing text with the natural language toolkit*. " O'Reilly Media, Inc.".
- Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. *arXiv preprint arXiv:1908.10084*.
- Sastrawi Stemmer. (2020). Indonesian Stemmer Library. Retrieved from https://github.com/skana/PySastrawi
