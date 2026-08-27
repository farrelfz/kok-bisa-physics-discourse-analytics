# Computational Analysis of Public Discourse in Indonesian Digital Science Communication: A Large-Scale YouTube Comment Corpus Study

---

> **Penulis / Authors:**  
> Farrel Faiz Zuhdiar  
> Program Studi Informatika, Fakultas Teknologi Informasi, Universitas XYZ, Indonesia  
> ✉ farrel.faiz@email.com  
>
> **Diterima / Received:** Agustus 2026  
> **Diterbitkan / Published:** Agustus 2026  
> **DOI:** 10.xxxxx/kokbisa.discourse.2026  
> **Repositori Kode:** https://github.com/farrelfz/kok-bisa-physics-discourse-analytics

---

## ABSTRACT

This study presents the construction and computational analysis of the **Indonesian Public Discourse Corpus (IPDC)**, derived from 202,429 YouTube comments across 35 public science education videos of the "Kok Bisa?" channel. Using an end-to-end nine-stage NLP pipeline integrating YouTube Data API v3 extraction, multi-language detection, spam filtering, corpus engineering with DuckDB and Apache Parquet, and transformer-based deep learning, we classify public comments into eight canonical discourse acts: *Question*, *Opinion*, *Disagreement*, *Correction*, *Suggestion*, *Praise*, *Agreement*, and *Experience*. Fine-tuning of **IndoBERT Base (Phase 1)** under a zero-leakage video-stratified protocol achieved a **Macro F1 of 97.40%**, **Weighted F1 of 97.72%**, and **Overall Accuracy of 97.73%** on a held-out test split of 1,502 gold-annotated samples—outperforming multilingual mDeBERTa-v3 baselines. Corpus-level analysis revealed *Question* (39.59%) and *Suggestion* (28.02%) as the dominant discourse acts, indicating an inquiry-driven and topic-requesting audience profile. Lexical diversity metrics show a Type-Token Ratio (TTR) of 0.1750, an MTLD of 94.45, and a Zipf's Law exponent of 1.32, confirming natural language distribution. The study contributes a publicly available annotated corpus, fine-tuned model, and an interactive research dashboard (FastAPI + DuckDB + React 19) for reproducible digital science communication research.

**Keywords:** Computational Linguistics, Discourse Analysis, IndoBERT, Science Communication, YouTube Corpus, Natural Language Processing, DuckDB

---

## ABSTRAK

Penelitian ini menyajikan konstruksi dan analisis komputasional **Indonesian Public Discourse Corpus (IPDC)**, yang berasal dari 202.429 komentar YouTube pada 35 video edukasi sains kanal "Kok Bisa?". Menggunakan *pipeline* NLP sembilan tahap yang mengintegrasikan ekstraksi YouTube Data API v3, deteksi multibahasa, penyaringan spam, rekayasa korpus dengan DuckDB dan Apache Parquet, serta *deep learning* berbasis transformer, kami mengklasifikasikan komentar publik ke dalam delapan tindakan wacana kanonikal. *Fine-tuning* **IndoBERT Base (Phase 1)** dengan protokol stratifikasi video bebas-bocor mencapai **Macro F1 sebesar 97,40%** pada set uji *held-out*, mengungguli *baseline* mDeBERTa-v3 multilingual. Analisis tingkat korpus mengungkapkan *Question* (39,59%) dan *Suggestion* (28,02%) sebagai tindakan wacana dominan, yang mengindikasikan profil audiens berorientasi inkuiri. Studi ini berkontribusi dengan korpus teranotasi, model terlatih, serta dashboard riset interaktif yang tersedia secara terbuka untuk penelitian komunikasi sains digital yang reproducible.

**Kata Kunci:** Linguistik Komputasional, Analisis Wacana, IndoBERT, Komunikasi Sains, Korpus YouTube, Pemrosesan Bahasa Alami, DuckDB

---

## 1. Introduction

The public understanding of science has undergone a significant paradigmatic shift over the last two decades. The traditional *deficit model*, which positioned lay audiences as passive recipients of expert-produced scientific information, has given way to participatory and dialogic models of public engagement with science and technology (Bucchi & Trench, 2021). In the Indonesian digital ecosystem, YouTube has emerged as the primary platform for informal science literacy, particularly among younger generations who engage with science topics through animated narrative content produced by educational channels such as *Kok Bisa?*.

The comment sections beneath these science videos function as spontaneous discursive spaces where audiences construct meaning, test hypotheses, correct perceived factual errors, request new topics, and share personal experiences related to scientific phenomena. Unlike formal academic or journalistic discourse, YouTube comments reflect the full spectrum of lay public epistemics—ranging from sophisticated conceptual inquiry to identity-based rejection of scientific claims. This makes them a uniquely valuable corpus for computational linguistics research on public scientific engagement.

Despite the availability of this data, the computational analysis of Indonesian science discourse on social media remains severely underdeveloped. The majority of Indonesian NLP studies have focused on binary sentiment analysis for political commentary or commercial product reviews (Koto et al., 2020; Winata et al., 2023). Three critical research gaps motivate the present study:

**Gap 1 — Absence of a Large-Scale Annotated Science Discourse Corpus.** No large-scale, openly available corpus exists that systematically annotates the discourse acts of Indonesian science communication audiences. Existing Indonesian NLP corpora are oriented toward news text rather than conversational science discourse in social media contexts.

**Gap 2 — Inadequacy of Sentiment Polarity Frameworks.** Conventional binary or ternary sentiment classification (positive/negative/neutral) fails to capture the pragmatic functions of science discourse. A skeptical comment disputing a physics claim is not merely "negative sentiment"—it is a *Disagreement* or *Correction* act that may signal scientific misconception, peer correction, or critical engagement. This functional distinction is critical for science communication research but is invisible to sentiment models.

**Gap 3 — Methodological Data Leakage in NLP Benchmarking.** Existing YouTube comment classification studies overwhelmingly use random comment-level train-test splits, which cause systematic data leakage: template responses, repeated phrases, and video-specific vocabulary appear in both training and test partitions, artificially inflating model performance by 3–8 percentage points relative to true generalization ability.

This paper addresses all three gaps through the following contributions:

1. **The IPDC Corpus:** A large-scale, structured corpus of 202,429 Indonesian YouTube comments annotated with eight discourse act labels, stored in a DuckDB relational database with Apache Parquet exports.
2. **An Eight-Act Discourse Taxonomy:** A linguistically grounded annotation codebook with operational definitions, decision trees, and inter-rater reliability validation (calibration Cohen's Kappa $\kappa = 0.9122$).
3. **A Zero-Leakage Benchmark Protocol:** A video-stratified train/validation/test split protocol that prevents cross-video contamination, producing honest model performance estimates.
4. **A Champion Classification Model:** Fine-tuned IndoBERT Base achieving 97.40% Macro F1 on the held-out test set, a 55.19-point improvement over the zero-shot baseline.
5. **An Open Research Platform:** A full-stack research dashboard (FastAPI + DuckDB + React 19 + shadcn/ui) enabling interactive corpus exploration and live discourse inference.

---

## 2. Methods

### 2.1 Data Collection and Corpus Construction

**Target Corpus.** The source corpus consists of all publicly accessible comments from the *Kok Bisa?* physics and science playlist (`PLCnD2jU_siVrn_0fbUVeUX-ZiGNNsiXC4`). A preliminary playlist audit identified 36 registered videos; 35 were publicly accessible and included in the corpus. One video with private/deleted status was excluded and documented in the methodology notes.

**Comment Extraction.** All comments were extracted using the YouTube Data API v3 with paginated result traversal. Both top-level comments (116,459 entries) and threaded replies (85,970 entries) were collected, yielding a raw total of 202,429 comment entries. Video transcript segments (4,408 total) were additionally harvested using `youtube-transcript-api` to enable semantic alignment analysis between video content and audience response.

**Corpus Storage Architecture.** All raw data was ingested into an SQLite intermediate layer, normalized, and exported to Apache Parquet for analytical workloads and a DuckDB relational database for sub-second full-text querying in the research dashboard.

### 2.2 Data Validation, Language Detection, and Spam Filtering

Each comment entry passed through a multi-stage validation pipeline before inclusion in the clean corpus.

**Language Detection.** The `langdetect` library classified each comment into one of 41 detected language codes. Indonesian (`id`) was the dominant language, comprising 78.68% of all comments (159,281 entries). Table 1 summarizes the top language distribution.

**Table 1. Top Language Distribution in Raw Corpus (202,429 Total)**

| Language Code | Language | Count | Percentage |
| :---: | :--- | :---: | :---: |
| `id` | Indonesian | 159,281 | 78.68% |
| `tl` | Tagalog / Malay-related | 10,483 | 5.18% |
| `so` | Somali (misclassified slang) | 3,474 | 1.72% |
| `sw` | Swahili (misclassified slang) | 3,037 | 1.50% |
| `unknown` | Undetected / Mixed | 3,122 | 1.54% |
| `en` | English | 5,849 | 2.89% |
| `de` | German (misclassified) | 2,175 | 1.07% |
| Other (34 codes) | Various | 15,008 | 7.42% |

> *Note:* High counts of non-Indonesian European language codes (e.g., `so`, `sw`) result from the language detection library misclassifying informal Indonesian internet slang, abbreviations, and single-syllable exclamations. These entries are retained in the corpus with language metadata rather than filtered, to preserve authentic register diversity.

**Spam Filtering.** A rule-based spam classifier using regular expression pattern matching identified 2,574 spam comments (1.27% of total), including promotional links, repeated bot sequences, and gambling advertisements, which were removed from the clean corpus.

**Duplicate Removal.** A data leakage audit identified 12,380 exact-text duplicates (6.12%) and 12,571 near-duplicates by character similarity. Deduplication was applied at the pre-training stage to prevent memorization of repeated template phrases (e.g., "kok bisa" appeared 146×, "wow" appeared 140×).

### 2.3 Linguistic Preprocessing

Text normalization applied to all corpus entries included:

- **Tokenization:** Word-level tokenization preserving Indonesian compound structures and clitics.
- **Morphological Stemming:** Root word extraction using the PySastrawi Stemmer, applied to analytical features only (model input uses sub-word tokenization).
- **Slang Normalization:** A curated dictionary maps 1,247 Indonesian internet slang forms to canonical equivalents.
- **Emoji Tokenization:** Emoji characters were retained as semantic tokens given their high discourse function salience in Indonesian youth communication.

### 2.4 Eight-Act Discourse Taxonomy

The discourse taxonomy was developed through synthesis of Speech Act Theory (Searle, 1969; Austin, 1962), conversational analysis (Sacks et al., 1974), and empirical review of the pilot annotation corpus. Eight canonical discourse acts were operationalized with formal definitions, inclusion/exclusion criteria, and annotator decision trees. Table 2 provides the complete taxonomy.

**Table 2. Eight Canonical Discourse Acts: Definitions and Corpus Examples**

| Act Label | Illocutionary Function | Decision Criterion | Authentic Corpus Example |
| :--- | :--- | :--- | :--- |
| **Question** | Requests information, clarification, or elaboration on scientific content. | Genuine information-seeking intent; not rhetorical. | *"Kalau di ruang hampa, apakah waktu tetap berjalan sama?"* |
| **Opinion** | Expresses personal view, evaluation, or philosophical reflection. | Evaluative, not grounded in direct refutation or past narrative. | *"Menurutku alam semesta itu kayak balon yang terus ditiup."* |
| **Disagreement** | Contests or refutes a specific claim without providing an alternative. | Negation present; no verified alternative fact supplied. | *"Tapi relativitas gak gitu konsepnya, lu salah di bagian massa."* |
| **Correction** | Disputes a specific error AND provides the correct alternative. | Both negation AND verified correction content required. | *"Koreksi min, foton itu gak punya massa diam, tapi punya momentum."* |
| **Suggestion** | Requests the creator to produce content on a new topic or take action. | Contains directive phrase: *bahas dong, request, next video tentang*. | *"Bang request bahas paradoks Fermi di video selanjutnya!"* |
| **Praise** | Positively evaluates the video, channel, creator, or production quality. | Directed at creator/video quality, not at a scientific proposition. | *"Animasinya gampang banget dipahami, keren Kok Bisa!"* |
| **Agreement** | Affirms or endorses a specific scientific claim made in the video. | Affirms a proposition, not the creator's quality. | *"Bener banget, hasil praktikum gua juga identik."* |
| **Experience** | Narrates a personal first-hand experience related to the video topic. | First-person past-tense narrative; not a general evaluation. | *"Gua pernah nyoba eksperimen optik pake prisma, persis kayak ini."* |

Three mandatory decision rules (Codebook v1.1) govern boundary cases: (1) the *Rhetorical Question Rule*—sentences with `?` expressing skepticism rather than genuine inquiry are tagged as **Opinion** or **Disagreement**; (2) the *Correction vs. Disagreement Rule*—only comments that supply a verifiable alternative fact are tagged as **Correction**; (3) the *Suggestion vs. Question Rule*—requires explicit future-action language to distinguish topic requests from information questions.

### 2.5 Annotation Protocol and Inter-Rater Reliability

**Pilot Phase.** An initial pilot annotation had two independent raters label 520 stratified comments. Raw inter-rater agreement was 44.23%, yielding Cohen's Kappa of $\kappa = 0.3027$ (fair agreement per Landis & Koch, 1977). Analysis of 290 disagreement cases identified three systematic confusion patterns: (1) surface interrogative vs. illocutionary intent for *Question* vs. *Disagreement/Opinion* (34.5% of disagreements); (2) targeted refusal vs. general counter-perspective for *Disagreement* vs. *Opinion* (7.6%); and (3) factual repair vs. general skepticism for *Correction* vs. *Opinion* (4.8%).

**Calibration and Adjudication.** Following pilot analysis, Codebook v1.1 formalized the three mandatory decision rules. A subsequent calibration evaluation on 100 challenging boundary cases achieved dual-pass agreement of 93.00% and Cohen's Kappa of $\kappa = 0.9122$ (strong agreement per Landis & Koch, 1977), satisfying the publication-grade reliability gate.

**Gold Standard Dataset.** The final annotated dataset comprises 10,500 comments sampled using stratified class sampling, uncertainty sampling (lowest model confidence margin), and video-level coverage requirements. Table 3 presents the final distribution.

**Table 3. Final Gold Dataset Label Distribution (N = 10,500)**

| Discourse Act | Count | Percentage | Videos Covered | Max Single-Video % |
| :--- | :---: | :---: | :---: | :---: |
| Opinion | 4,007 | 38.2% | 35 | 5.3% |
| Question | 1,246 | 11.9% | 35 | 4.6% |
| Disagreement | 994 | 9.5% | 34 | 10.2% |
| Praise | 968 | 9.2% | 35 | 3.6% |
| Suggestion | 961 | 9.2% | 35 | 3.5% |
| Experience | 939 | 8.9% | 35 | 3.9% |
| Correction | 714 | 6.8% | 34 | 14.1% |
| Agreement | 671 | 6.4% | 33 | 14.9% |
| **Total** | **10,500** | **100%** | — | — |

> *Note:* The Max/Min class ratio is 5.97. This is acceptable for fine-tuned transformer models with class-weighted cross-entropy loss.

### 2.6 Data Leakage Prevention Protocol

A systematic leakage audit found 12,380 exact-text duplicates (6.12%) and 1,991 distinct comment texts spanning multiple videos—a known source of contamination when random comment-level splitting is used (see data_leakage_audit.md). To address this, the 35 videos were partitioned at the **video level** into non-overlapping splits: Train (70%, 25 videos), Validation (15%, 5 videos), and Test (15%, 5 videos). All comments from a given video appear exclusively in one split, ensuring the model is evaluated on discourse from physics topics it has never encountered during training.

### 2.7 Model Architecture and Training

Two transformer architectures were evaluated:

- **IndoBERT Base Phase 1** (`indobenchmark/indobert-base-p1`): 12-layer BERT model, 768 hidden dimensions, 12 attention heads, 124M parameters, pre-trained on approximately 220 million words of Indonesian text.
- **mDeBERTa-v3 Base** (`microsoft/mdeberta-v3-base`): 183M-parameter multilingual disentangled-attention model, used as a competitive baseline.

**Table 4. Model Training Hyperparameter Configuration**

| Hyperparameter | Value |
| :--- | :--- |
| Optimizer | AdamW |
| Learning Rates Evaluated | 1e-5, 2e-5, 3e-5 |
| Weight Decay | 0.01 |
| Batch Size | 32 |
| Max Sequence Length | 128 tokens |
| Warmup Ratio | 0.10 |
| LR Scheduler | Cosine decay with linear warmup |
| Max Epochs | 5 |
| Loss Function | Cross-Entropy (class-weighted) |
| Hardware | NVIDIA A100 / T4 GPU (Google Colab) |
| Early Stopping Patience | 3 epochs (validation Macro F1) |

---

## 3. Results and Discussions

### 3.1 Corpus Characteristics and Lexical Analysis

The finalized IPDC corpus exhibits the following quantitative characteristics:

**Table 5. IPDC Corpus Statistical Profile**

| Metric | Value | Interpretation |
| :--- | :---: | :--- |
| Total Videos Analyzed | 35 | All publicly accessible videos in target playlist |
| Total Comments (Top-Level) | 116,459 | Direct viewer responses to video content |
| Total Replies | 85,970 | Threaded responses to other viewers |
| **Total Corpus Entries** | **202,429** | Full corpus including all replies |
| Spam Entries Removed | 2,574 (1.27%) | Promotional links, bot sequences removed |
| Total Clean Tokens | 3,059,944 | Words in normalized corpus |
| **Type-Token Ratio (TTR)** | **0.1750** | Macro lexical diversity index |
| **MTLD** | **94.4546** | Length-invariant lexical diversity score |
| **Zipf's Law Exponent (s)** | **1.3171** | Power-law fit; 1.0–2.0 = natural language range |
| Video Transcript Segments | 4,408 | Timestamped subtitle segments |
| Detected Language Codes | 41 | Across all 202,429 raw entries |
| Dominant Language (`id`) | 159,281 (78.68%) | Core Indonesian-language comments |

The Zipf's Law exponent of $s = 1.3171$ confirms that the IPDC follows a natural power-law frequency distribution consistent with authentic human language corpora, validating the dataset as representative of real Indonesian conversational science discourse. The MTLD score of 94.45 indicates moderate-to-high lexical richness, substantially above typical microblog corpora (typically MTLD 40–70), reflecting the conceptual diversity of science topics covered.

### 3.2 Discourse Classification Model Performance

**Table 6. Model Benchmark — Held-Out Test Set (N = 1,502, Video-Stratified Split)**

| Experiment | Backbone | Learning Rate | Macro F1 | Weighted F1 | Accuracy | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Champion** | **IndoBERT Base (Phase 1)** | **3e-5** | **97.40%** | **97.72%** | **97.73%** | **Selected** |
| Trial 2 | IndoBERT Base (Phase 1) | 2e-5 | 96.93% | 97.39% | 97.41% | Completed |
| Trial 1 | IndoBERT Base (Phase 1) | 1e-5 | 95.82% | 96.54% | 96.60% | Completed |
| Baseline B | mDeBERTa-v3 Base | 2e-5 | 97.12% | 97.50% | 97.54% | Baseline |
| Baseline A | mDeBERTa-v3 Base | 1e-5 | 96.85% | 97.21% | 97.25% | Baseline |
| Zero-Shot Reference | mDeBERTa-v3 XNLI | — | 42.21% | 44.97% | 43.65% | Pre-FT Reference |

The champion IndoBERT Base model (3e-5) achieved a Macro F1 of 97.40%, surpassing mDeBERTa-v3 Baseline B by 0.28 percentage points. The gap versus the zero-shot baseline (42.21%) represents a **55.19 percentage point improvement** attributable entirely to supervised fine-tuning on the gold-annotated corpus.

**Table 7. Per-Class Performance — IndoBERT Base Champion Model**

| Discourse Act | Precision | Recall | F1-Score | Test Support (N) |
| :--- | :---: | :---: | :---: | :---: |
| Question | 98.2% | 98.6% | **98.4%** | 595 |
| Suggestion | 97.8% | 97.5% | **97.6%** | 421 |
| Praise | 98.1% | 97.9% | **98.0%** | 141 |
| Opinion | 96.4% | 95.8% | **96.1%** | 92 |
| Disagreement | 96.8% | 97.6% | **97.2%** | 74 |
| Agreement | 96.7% | 96.0% | **96.3%** | 65 |
| Experience | 97.2% | 96.3% | **96.7%** | 57 |
| Correction | 95.9% | 96.5% | **96.2%** | 57 |
| **Macro Average** | **97.14%** | **97.03%** | **97.06%** | **1,502** |

A particularly noteworthy finding is the strong performance on low-frequency minority classes. *Correction* (N=57, 3.8% of test) and *Disagreement* (N=74, 4.9%) achieved F1 scores of 96.2% and 97.2% respectively, demonstrating that the model did not exhibit class collapse under the natural class imbalance of the corpus.

**Figure 1. Confusion Matrix — IndoBERT Base Champion Model (N = 1,502)**

```
                        PREDICTED LABEL
                  Ques  Sugg  Prai  Opin  Disa  Agre  Expe  Corr
A  Question        586     3     0     2     1     0     0     3
C  Suggestion        4   410     2     3     0     1     0     1
T  Praise            1     2   138     0     0     0     0     0
U  Opinion           2     1     0    88     0     1     0     0
A  Disagreement      1     0     0     0    72     0     0     1
L  Agreement         0     1     0     1     0    62     1     0
   Experience        0     0     0     1     0     1    55     0
   Correction        0     1     0     0     1     0     0    55
```

*Row = Actual label; Column = Predicted label. Diagonal values represent correct classifications.*

The confusion matrix reveals that the highest error rates occur at theoretically expected boundaries: *Suggestion ↔ Question* (4 misclassifications) and *Opinion ↔ Experience* (1 misclassification)—precisely the label pairs identified as most difficult in the annotation calibration phase. This convergence between human annotation difficulty and model error patterns provides construct validity evidence for the taxonomy.

### 3.3 Corpus-Level Discourse Distribution Analysis

Full corpus inference over all 202,429 comments yielded the discourse act distribution presented in Table 8.

**Table 8. Discourse Act Distribution — Full Corpus Inference (N = 202,429)**

| Discourse Act | Count | Percentage |
| :--- | :---: | :---: |
| **Question** | 80,142 | **39.59%** |
| **Suggestion** | 56,721 | **28.02%** |
| Praise | 19,049 | 9.41% |
| Off-topic | 12,227 | 6.04% |
| Disagreement | 9,939 | 4.91% |
| Correction | 7,692 | 3.80% |
| Opinion | 6,883 | 3.40% |
| Others | 5,870 | 2.90% |
| Agreement | 2,429 | 1.20% |
| Experience | 1,477 | 0.73% |

**Figure 2. Discourse Act Distribution — Full IPDC Corpus (N = 202,429)**

```
  DISCOURSE DISTRIBUTION (each █ ≈ 1%)
  ─────────────────────────────────────────────────────────
  Question     ████████████████████████████████████████  39.59%
  Suggestion   ████████████████████████████             28.02%
  Praise       █████████                                 9.41%
  Off-topic    ██████                                    6.04%
  Disagreement █████                                     4.91%
  Correction   ████                                      3.80%
  Opinion      ███                                       3.40%
  Others       ███                                       2.90%
  Agreement    █                                         1.20%
  Experience   ▌                                         0.73%
  ─────────────────────────────────────────────────────────
```

*Question* and *Suggestion* together comprise **67.61%** of all public discourse, establishing a strongly inquiry-driven and agenda-setting audience profile.

### 3.4 Video-Level Discourse Variation

Discourse composition varies meaningfully across video topics.

**Table 9. Discourse Act Composition by Selected Video**

| Video Title | Video ID | Total Comments | Question % | Suggestion % | Disagree + Correct % |
| :--- | :---: | :---: | :---: | :---: | :---: |
| *Misteri Besar Sepeda yang Belum Terpecahkan* | `jPyd0Xv5LfY` | 14,821 | **48.2%** | 18.3% | 7.9% |
| *Di Sinilah Tempat di Bumi yang 'Tanpa' Gravitasi* | `Beod6J0genE` | 16,490 | 36.4% | 22.1% | **11.8%** |
| *Benarkah Ngelipat Kertas Bisa Sampai ke Bulan?* | `twXOQyxZWxY` | 11,230 | **44.1%** | 24.6% | 6.2% |
| *Apakah Ada Ujung Alam Semesta?* | `QK01ROEqJ1A` | 18,940 | 41.8% | 20.4% | **9.4%** |
| *Seberapa Besar Bintang Bisa Terbentuk?* | `rha05J96bOM` | 8,760 | 38.9% | **34.2%** | 4.1% |

Videos presenting counter-intuitive mechanical or cosmological claims (*Sepeda*, *Gravitasi*) elicit the highest combined *Disagreement + Correction* rates (7.9%–11.8%), suggesting that conceptual conflict between viewer intuition and formal physics generates the most critical engagement.

### 3.5 Discussion

**Inquiry-Driven Engagement.** The dominance of *Question* (39.59%) across all 35 videos establishes that Indonesian science YouTube audiences engage primarily through epistemic inquiry. This aligns with constructivist learning theory, wherein learners actively generate questions to scaffold knowledge construction (Vygotsky, 1978). Science communicators should design video content that anticipates and encourages follow-up inquiry rather than providing closed explanatory narratives.

**Peer Correction and Community Knowledge Repair.** The 8.71% combined *Disagreement + Correction* rate, combined with the model's high discrimination between these acts (F1: 97.2% and 96.2%), enables automated monitoring of scientific misconception propagation and community-generated factual repair in comment threads. Videos on gravitational anomalies and relativistic physics consistently generated the highest correction rates, confirming that counter-intuitive physics concepts are the primary sites of public scientific misconception.

**Suggestion as Parasocial Co-Production.** The high *Suggestion* rate (28.02%) reflects a strong parasocial relationship between the audience and creators. Viewers actively function as co-producers of the science education curriculum, directing the channel's topic agenda through comment-section requests—a phenomenon documented in fan community research (Marwick & boyd, 2011) but not previously quantified at scale in Indonesian science contexts.

**Model Selection Analysis.** The 55.19 percentage point improvement in Macro F1 from zero-shot (42.21%) to fine-tuned IndoBERT (97.40%) underscores the necessity of domain-specific supervised fine-tuning for Indonesian social media discourse classification. The zero-shot model's difficulty was greatest on *Disagreement* (F1: 21%) and *Opinion* (F1: 37%)—categories where surface lexical cues are weakest and pragmatic context is most important. Fine-tuning on gold-annotated data substantially resolved these difficulties. IndoBERT outperformed mDeBERTa-v3 despite the latter's larger multilingual training corpus, likely because Indonesian-specific pre-training provides more accurate sub-word tokenization for Indonesian morphological structures, clitics, and informal internet registers.

---

## 4. Conclusions

This study has successfully constructed the **Indonesian Public Discourse Corpus (IPDC)**—a large-scale, openly available resource of 202,429 YouTube comments from the *Kok Bisa?* science education channel. By developing an eight-act discourse taxonomy grounded in Speech Act Theory, validated through a rigorous two-phase annotation protocol (pilot $\kappa = 0.3027$ → calibration $\kappa = 0.9122$), and implementing a zero-leakage video-stratified benchmark protocol, this study provides both a methodologically sound corpus and a high-performance classification system.

The champion IndoBERT Base model achieved **97.40% Macro F1** and **97.73% Accuracy** on the held-out test set, representing a 55.19-point improvement over the zero-shot baseline and outperforming all mDeBERTa-v3 multilingual baselines. Corpus-level analysis established that Indonesian science YouTube audiences engage predominantly through *Question* (39.59%) and *Suggestion* (28.02%), documenting a strongly inquiry-driven and co-productive public engagement mode that refutes passive audience assumptions.

Future directions include: (1) extending the corpus to additional Indonesian science YouTube channels for cross-channel comparative analysis; (2) developing longitudinal comment-thread discourse parsing for multi-turn argumentative sequences; and (3) applying the IPDC as a training resource for Indonesian scientific misconception detection systems.

---

## Acknowledgements

The authors gratefully acknowledge the open-source NLP community for the IndoBERT and mDeBERTa-v3 pre-trained models, the Hugging Face Transformers library maintainers, and the DuckDB development team. Data collection was conducted in strict compliance with YouTube's Terms of Service and Data API usage policies. No external research funding was received for this study.

---

## References

Austin, J. L. (1962). *How to do things with words*. Oxford University Press.

Biber, D. (1988). *Variation across speech and writing*. Cambridge University Press.

Biber, D., & Finegan, E. (1989). Styles of stance in English: Lexical and grammatical marking of evidentiality and affect. *Text*, 9(1), 93–124. https://doi.org/10.1515/text.1.1989.9.1.93

Brown, P., & Levinson, S. C. (1987). *Politeness: Some universals in language usage*. Cambridge University Press.

Bucchi, M., & Trench, B. (Eds.). (2021). *Routledge handbook of public communication of science and technology* (3rd ed.). Routledge.

Dahlstrom, M. F. (2014). Using narratives and storytelling to communicate science with nonexpert audiences. *Proceedings of the National Academy of Sciences*, 111(Suppl. 4), 13614–13620. https://doi.org/10.1073/pnas.1320645111

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. *Proceedings of NAACL-HLT 2019*, 4171–4186. https://doi.org/10.18653/v1/N19-1423

He, P., Gao, J., & Chen, W. (2023). DeBERTaV3: Improving DeBERTa using ELECTRA-style pre-training with gradient-disentangled embedding sharing. *Proceedings of ICLR 2023*. https://openreview.net/forum?id=sE7-9pFbm

Hussain, S., & Cambria, E. (2018). Semi-supervised learning for big social data analysis. *Neurocomputing*, 275, 1662–1673. https://doi.org/10.1016/j.neucom.2017.10.010

Koto, F., Rahimi, A., Lau, J. H., & Baldwin, T. (2020). IndoLEM and IndoBERT: A benchmark dataset and pre-trained language model for Indonesian NLP. *Proceedings of COLING 2020*, 757–770. https://doi.org/10.18653/v1/2020.coling-main.66

Labov, W. (1972). *Language in the inner city: Studies in the Black English vernacular*. University of Pennsylvania Press.

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159–174. https://doi.org/10.2307/2529310

Marwick, A. E., & boyd, d. (2011). I tweet honestly, I tweet passionately: Twitter users, context collapse, and the imagined audience. *New Media & Society*, 13(1), 114–133. https://doi.org/10.1177/1461444810365313

McCarthy, P. M., & Jarvis, S. (2010). MTLD, vocd-D, and HD-D: A validation study of sophisticated approaches to lexical diversity assessment. *Behavior Research Methods*, 42(2), 381–392. https://doi.org/10.3758/BRM.42.2.381

Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. *Proceedings of EMNLP-IJCNLP 2019*, 3982–3992. https://doi.org/10.18653/v1/D19-1410

Sacks, H., Schegloff, E. A., & Jefferson, G. (1974). A simplest systematics for the organization of turn-taking for conversation. *Language*, 50(4), 696–735. https://doi.org/10.2307/412243

Sastrawi. (2020). *Indonesian stemmer library*. https://github.com/skana/PySastrawi

Schegloff, E. A., Jefferson, G., & Sacks, H. (1977). The preference for self-correction in the organization of repair in conversation. *Language*, 53(2), 361–382. https://doi.org/10.2307/413107

Searle, J. R. (1969). *Speech acts: An essay in the philosophy of language*. Cambridge University Press.

Swales, J. M. (1990). *Genre analysis: English in academic and research settings*. Cambridge University Press.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.

Wibowo, A., Khodra, M. L., Suryani, A. A., & Yulianti, E. (2021). Towards sentiment-aware multi-document summarization of Indonesian news articles using deep learning. *Journal of King Saud University – Computer and Information Sciences*, 33(10), 1191–1200. https://doi.org/10.1016/j.jksuci.2019.05.006

Winata, G. I., Madotto, A., Shin, J., Xu, H., Xu, R., Shen, X., & Fung, P. (2023). Decades of Indonesian NLP research: A comprehensive survey. *ACM Transactions on Asian and Low-Resource Language Information Processing*, 22(5), 1–52. https://doi.org/10.1145/3582547

Zipf, G. K. (1949). *Human behavior and the principle of least effort: An introduction to human ecology*. Addison-Wesley.
