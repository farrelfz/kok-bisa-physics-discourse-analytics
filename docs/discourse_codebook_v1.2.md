# KokBisa — Discourse Annotation & Calibration Codebook v1.2
## Methodological Framework for Indonesian Science Communication Public Discourse

**Document Version:** 1.2 (Pragmatic Function & Decision-Tree Edition)  
**Date:** 2026-08-16  
**Scope:** Annotation Protocol for Indonesian Public Discourse Corpus (IPDC)

---

## 1. Prinsip Metodologis Utama: "Fungsi Komunikasi Dominan"

> **ATURAN UTAMA (#1 RULE):**  
> **"Bentuk kalimat (tanda baca `?`, tanda seru `!`, kata tanya) HANYALAH BUKTI TEKSTUAL, BUKAN ATURAN KEPUTUSAN."**  
> Label diskursus **WAJIB** ditentukan berdasarkan **communicative function / illocutionary force dominan** dari keseluruhan komentar.

| Contoh Teks Komentar | Bentuk Permukaan | Fungsi Komunikasi Sebenarnya | Label Resmi |
|---|---|---|---|
| *"Bagaimana black hole bisa terbentuk?"* | Pertanyaan | Meminta informasi ilmiah baru | **Question** |
| *"Pusing? Ngira bumi datar tanpa bukti 😂"* | Pertanyaan (`?`) | Mengejek / menyanggah pandangan lawan | **Disagreement** |
| *"Menurut saya penjelasan ini terlalu disederhanakan."* | Pernyataan | Menyampaikan evaluasi/pandangan pribadi | **Opinion** |
| *"Bukan 30.000 km/s min, tapi 300.000 km/s di ruang hampa."* | Pernyataan | Memberikan ralat faktual dengan data benar | **Correction** |
| *"Coba bahas wormhole dan paradoks waktu di next video."* | Imperatif | Mengusulkan topik video di masa depan | **Suggestion** |
| *"Dulu waktu SD saya pernah nyoba eksperimen ini."* | Pernyataan | Menceritakan pengalaman masa lalu | **Experience** |

---

## 2. Pohon Keputusan Anotator (Prioritized Decision Tree)

Anotator **DILARANG** memilih label secara acak. Ikuti urutan evaluasi hierarkis berikut dari atas ke bawah:

```
START
  │
  ├── [1] Apakah komentar sama sekali tidak relevan dengan sains/video?
  │       └── YES ──► OFF-TOPIC (atau flag off_topic = YES)
  │
  ├── [2] Apakah komentar berada di thread balasan (parent_id != TOP_LEVEL)
  │       dan fungsi utamanya MENJAWAB pertanyaan penonton sebelumnya?
  │       └── YES ──► ANSWER
  │
  ├── [3] Apakah komentar MEMPERBAIKI KESALAHAN FAKTA dengan menyertakan
  │       alternatif/ralat yang benar (angka, rumus, menit video)?
  │       └── YES ──► CORRECTION
  │
  ├── [4] Apakah komentar MENGUSULKAN TINDAKAN / TOPIK / PERBAIKAN masa depan?
  │       └── YES ──► SUGGESTION
  │
  ├── [5] Apakah komentar menceritakan PENGALAMAN PRIBADI masa lalu?
  │       └── YES ──► EXPERIENCE
  │
  ├── [6] Apakah komentar terutama MEMUJI / MENGAPRESIASI kreator/video?
  │       └── YES ──► PRAISE
  │
  ├── [7] Apakah komentar menyatakan PERSETUJUAN EKSPLISIT pada klaim sains?
  │       └── YES ──► AGREEMENT
  │
  ├── [8] Apakah komentar MENYANGGAH / MENOLAK / MENGEJEK posisi klaim lawan
  │       (termasuk pertanyaan retoris / debat skeptis)?
  │       └── YES ──► DISAGREEMENT
  │
  ├── [9] Apakah komentar menyampaikan PANDANGAN / PENILAIAN / SPEKULASI pribadi?
  │       └── YES ──► OPINION
  │
  ├── [10] Apakah komentar tulus MENCARI INFORMASI / PENJELASAN baru?
  │       └── YES ──► QUESTION
  │
  └── [11] Teks rusak / karakter tak terbaca / gibberish?
          └── YES ──► OTHERS
```

---

## 3. Batasan Presisi Antar-Label yang Kerap Tertukar

### 🔴 A. Question vs Disagreement
- **DILARANG LABEL QUESTION JIKA:**
  - Pertanyaan bersifat retoris;
  - Pertanyaan digunakan untuk mengejek/meremehkan lawan (*"mikir pake logika bro?"*);
  - Pertanyaan digunakan untuk menyerang argumen atau bagian dari *counter-argument*;
  - Penutur sebenarnya sudah memiliki keyakinan sendiri dan tidak berniat meminta jawaban.
- **QUESTION HANYA JIKA:**
  - Tujuan utama penutur adalah **memperoleh informasi, klarifikasi, atau penjelasan**.

### 🔴 B. Opinion vs Disagreement
- **OPINION:** Penutur menyampaikan pandangan pribadi tanpa menyerang/melawan klaim spesifik (*"Saya berpikir X"*).
- **DISAGREEMENT:** Penutur mengambil posisi berlawanan terhadap klaim tertentu (*"Saya tidak setuju dengan X"*).

### 🔴 C. Correction vs Disagreement
```
Menolak Klaim
     │
     ├── Memberikan fakta/angka/definisi perbaikan alternatif? ──► CORRECTION
     └── Hanya menolak tanpa ralat faktual? ───────────────────► DISAGREEMENT
```

### 🔴 D. Suggestion Boundary
- Kata *"harus/sebaiknya/coba"* **BUKAN** pemicu otomatis `Suggestion`.
- `Suggestion` **WAJIB** mengandung tindakan atau permintaan topik baru yang diusulkan (*"Coba bahas X di next video"* -> `Suggestion`; *"Seharusnya kamu paham fisika"* -> `Disagreement/Opinion`).

### 🔴 E. Answer Contextual Rule
- `Answer` **HANYA BERLAKU** pada balasan (`parent_id != TOP_LEVEL`) yang secara substantif **menjawab pertanyaan**.
- Balasan yang hanya menyatakan *"saya kurang setuju"* pada komentar lain -> `Disagreement`, **BUKAN** `Answer`.

### 🔴 F. Others Exclusivity
- `Others` **HANYA** untuk teks rusak (*corrupted encoding*) atau *gibberish*. Dilarang digunakan sebagai tempat "saya ragu".

---

## 4. Metadata Tambahan: Confidence & Ambiguity Reason

Setiap baris anotasi kini memuat:
1. `annotation_confidence`: **`High`** | **`Medium`** | **`Low`**
2. `ambiguity_reason`: Alasan jika ragu (misal: `rhetorical_question_as_disagreement`, `opinion_vs_disagreement`, `correction_vs_disagreement`).
