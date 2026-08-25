# KokBisa — Calibration Evaluation Report
## AI-Assisted Dual-Pass Annotation Consistency (Codebook v1.1 Validation)

**Methodological Provenance Note:**  
Evaluasi ini mengukur **AI-assisted dual-pass annotation consistency** (konsistensi intra-annotator terstandarisasi dengan adjudikasi kasus ambigu), bukan reliabilitas dua manusia independen terpisah.

**Date:** 2026-08-22  
**Total Samples Evaluated:** 100  
**Raw Dual-Pass Agreement ($P_o$):** **93.00%**  
**Cohen's Kappa ($\kappa$):** **0.9122**  
**Consistency Gate Status:** **PASSED ✓** — STRONG (Lanjut ke Gold Candidate Sampling & Annotation)  

---

## 1. Executive Quantitative Summary

| Metric | Measured Value | Benchmark / Threshold | Status |
|---|---|---|---|
| **Evaluated Samples** | **100** | 100 challenging boundary comments | Complete |
| **Raw Dual-Pass Agreement** | **93.00%** | Target $\ge 75\%$ | Optimal |
| **Cohen's Kappa ($\kappa$)** | **0.9122** | $\ge 0.70$ (Strong) / $0.60-0.69$ (Review) | **PASSED ✓** |
| **Disagreement Cases** | **7** / 100 | 7.0% disagreement rate | Low |
| **Confidence Concordance** | Pass 1 High: 83, Pass 2 High: 86, Exact Confidence Match: 96.0% | - | - |

---

## 2. Agreement & Support per Label

| Discourse Label | Pass 1 Count | Pass 2 Count | Agreed Count ($N$) | Disagreed Cases ($N$) | Agreement IoU |
|---|:---:|:---:|:---:|:---:|:---:|
| **Question** | 30 | 31 | 29 | 3 | 90.6% |
| **Opinion** | 22 | 24 | 21 | 4 | 84.0% |
| **Disagreement** | 19 | 19 | 19 | 0 | 100.0% |
| **Correction** | 4 | 4 | 3 | 2 | 60.0% |
| **Suggestion** | 13 | 11 | 11 | 2 | 84.6% |
| **Praise** | 5 | 5 | 4 | 2 | 66.7% |
| **Agreement** | 3 | 3 | 3 | 0 | 100.0% |
| **Experience** | 4 | 3 | 3 | 1 | 75.0% |

---

## 3. Top Confused Label Pairs (Disagreement Patterns)

| Peringkat | Pasangan Label | Frekuensi | Actionable Review Guidance |
|:---:|---|:---:|---|
| 1 | **Correction ↔ Opinion** | **2 kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |
| 2 | **Question ↔ Suggestion** | **2 kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |
| 3 | **Experience ↔ Opinion** | **1 kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |
| 4 | **Praise ↔ Question** | **1 kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |
| 5 | **Opinion ↔ Praise** | **1 kasus** | Periksa aturan resolusi prioritas di Codebook v1.1 |

---

## 4. Confusion Matrix (Pass 1 [Baris] vs Pass 2 [Kolom])

```text
                    Pass2_Question  Pass2_Opinion  Pass2_Disagreement  Pass2_Correction  Pass2_Suggestion  Pass2_Praise  Pass2_Agreement  Pass2_Experience
Pass1_Question                  29              0                   0                 0                 0             1                0                 0
Pass1_Opinion                    0             21                   0                 1                 0             0                0                 0
Pass1_Disagreement               0              0                  19                 0                 0             0                0                 0
Pass1_Correction                 0              1                   0                 3                 0             0                0                 0
Pass1_Suggestion                 2              0                   0                 0                11             0                0                 0
Pass1_Praise                     0              1                   0                 0                 0             4                0                 0
Pass1_Agreement                  0              0                   0                 0                 0             0                3                 0
Pass1_Experience                 0              1                   0                 0                 0             0                0                 3
```

---

## 5. Detailed Disagreement Log (7 Kasus)

| Sample ID | Teks Komentar | Pass 1 Label | Pass 2 Label | Strata Asal | Catatan Pass 1 / Pass 2 |
|---|---|:---:|:---:|---|---|
| `CALIB_007` | Dulu... suka banget kalo ada yang bahas soal antariksa. Tapi setelah mengenal FE, ... | **Experience** | **Opinion** | Praise_Plus_Correction | P1: Menceritakan perubahan pandangan masa lalu | P2: Pandangan subjektif soal antariksa |
| `CALIB_012` | Menit 1.10 suara vacumnya dark seer anjir wwkwwk . Anak dota pasti tau | **Opinion** | **Correction** | Correction_vs_Disagreement | P1: Pengamatan audio game menit 1:10 | P2: Mengoreksi asal suara game |
| `CALIB_031` | VIDEO nya bagus min , 😁😁 , kenapa nama channelnya "ko bisa?" kenapa gk "ko gitu?" 😴😴 | **Question** | **Praise** | Praise_Plus_Question | P1: Praise + Question nama channel -> Question | P2: Memuji video bagus |
| `CALIB_039` | bang bumi itu kan bulut ... lalu mengapa kalau pesawat terbang lurus tetap memutar... | **Suggestion** | **Question** | Correction_vs_Disagreement | P1: Permintaan video penjelasan pesawat | P2: Bertanya alasan pesawat terbang lurus |
| `CALIB_056` | Chanel yg kaya gini sungguh bermanfaat, tapi anehnya yang hoax lebih laku. | **Praise** | **Opinion** | Hard_Disagreement_Skepticism | P1: Apresiasi channel vs hoax | P2: Menilai tren video hoax |
| `CALIB_080` | min request dong, menurut mimin diluar bumi kita ini ada mahkluk lain (alien) gk y... | **Suggestion** | **Question** | Implicit_Suggestion | P1: Request topik alien | P2: Bertanya keberadaan alien |
| `CALIB_089` | pertanyaan yg bagus nak jadi gini, pengertian kita terhadap gravitasi itu salah. y... | **Correction** | **Opinion** | Praise_Plus_Correction | P1: Ralat pengertian gravitasi | P2: Penjelasan momentum dan gravitasi |

---

## 6. Generated Artifacts
1. **Laporan Evaluasi:** `reports/calibration_report.md`
2. **Matriks Konfusi:** `reports/calibration_confusion_matrix.csv`
3. **Daftar Disagreement:** `reports/calibration_disagreements.csv`
4. **Dataset Ter-adjudikasi:** `data/annotated/calibration_adjudicated.csv`
