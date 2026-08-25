# KokBisa — Discourse Annotation Codebook v1.1
## Operational Annotation Guidelines & Decision Hierarchy for Indonesian Science Communication Discourse

**Document Version:** 1.1 (Calibration & Operational Standard)  
**Corpus:** Indonesian Public Discourse Corpus (IPDC) — KokBisa YouTube Science Playlist  
**Target Annotators:** Human Annotators & Adjudicators  

---

## 1. Global Principle: Illocutionary Force Over Surface Syntax

> ### ⚠️ PRINSIP UTAMA (#1 CARDINAL RULE)
> **Klasifikasikan komentar berdasarkan FUNGSI KOMUNIKATIF DOMINAN (Dominant Illocutionary Force / Communicative Intent), BUKAN berdasarkan tanda baca (`?`, `!`) atau kata kunci permukaan saja.**

Banyak komentar media sosial menggunakan bentuk permukaan yang menipu (misal: pertanyaan retoris untuk menyindir, kalimat imperatif halus untuk mengusulkan ide). Anotator harus bertanya: **"Apa tujuan utama penutur menulis komentar ini kepada komunitas / kreator?"**

---

## 2. Definisi & Batasan 8 Kategori Wacana

### 1. `Question` (Pertanyaan / Pencarian Informasi)
* **Definisi:** Penutur **secara tulus mencari informasi, klarifikasi, elaborasi, atau penjelasan ilmiah baru** yang belum dipahami dari video.
* **Positive Examples:**
  * *"Kenapa cahaya tidak bisa lolos dari black hole?"*
  * *"Min, kalau gravitasi hilang 5 detik apa yang terjadi?"*
  * *"Gimana cara ngitung konstanta Planck itu?"*
* **Negative Examples (Bukan Question):**
  * *"Masa iya bumi datar tanpa gravitasi? Wkwk"* ➔ ❌ `Disagreement` (Pertanyaan retoris untuk menyanggah).
  * *"Bahas teori dawai di video selanjutnya dong?"* ➔ ❌ `Suggestion` (Permintaan konten baru).
  * *"Kira-kira alien itu beneran ada gak ya menurut kalian?"* ➔ Jika tulus bertanya ke audiens/kreator ➔ `Question`, jika pengantar opini pribadi yang panjang ➔ `Opinion`.

---

### 2. `Opinion` (Pandangan / Penilaian Subjektif)
* **Definisi:** Penutur **menyampaikan pandangan pribadi, evaluasi subjektif, interpretasi filosofis, atau spekulasi non-faktual** tanpa secara eksplisit menyerang atau menyanggah klaim tertentu.
* **Positive Examples:**
  * *"Menurut saya sains modern masih belum bisa menjelaskan kesadaran manusia."*
  * *"Sains itu indah tapi kadang bikin ngeri kalau dipikir-pikir."*
  * *"Kayaknya masa depan manusia bakal lebih banyak di ruang angkasa."*
* **Negative Examples (Bukan Opinion):**
  * *"Penjelasan menit 2:10 salah total, bukan begitu konsepnya!"* ➔ ❌ `Disagreement` / `Correction`.
  * *"Dulu pas kuliah fisika saya pernah coba hukum Ohm ini."* ➔ ❌ `Experience`.

---

### 3. `Disagreement` (Sanggahan / Penolakan / Kritik)
* **Definisi:** Penutur **secara eksplisit menolak, menentang, meragukan dengan keras (skeptisisme), atau mengambil posisi berlawanan** terhadap isi video, klaim sains, kreator, atau komentar lain. Termasuk pertanyaan retoris bernada sanggahan.
* **Positive Examples:**
  * *"Saya tidak setuju dengan teori multi-universe ini, terlalu fiksi."*
  * *"Penjelasannya ngawur dan tidak masuk akal."*
  * *"Apa iya ilmuwan udah buktiin itu? Buktinya mana? Jangan asal klaim."* (Rhetorical Skepticism)
* **Negative Examples (Bukan Disagreement):**
  * *"Bukan 30.000 km/s min, kecepatan cahaya itu 300.000 km/s."* ➔ ❌ `Correction` (Menyertakan ralat faktual/angka valid).
  * *"Menurut saya kurang lengkap."* ➔ ❌ `Opinion` (Kritik lunak tanpa sanggahan langsung terhadap klaim).

---

### 4. `Correction` (Ralat Faktual / Perbaikan Informasi)
* **Definisi:** Penutur **memperbaiki kesalahan faktual yang spesifik** pada video atau komentar lain dengan **menyertakan bukti, angka, formula, alternatif fakta yang benar, atau rujukan menit tertentu (*timestamp*)**.
* **Aturan Kritis:** Harus mengandung elemen *reparasi faktual*. Skeptisisme umum tanpa ralat fakta tetap masuk `Disagreement`.
* **Positive Examples:**
  * *"Ada ralat di menit 03:45, Pluto dinyatakan sebagai planet kerdil sejak 2006 oleh IAU, bukan 2008."*
  * *"Salah rumus min, harusnya $E=mc^2$ bukan $E=m^2c$."*
  * *"Typo di subtitle: Andromeda itu galaksi tetangga, bukan nebula."*
* **Negative Examples (Bukan Correction):**
  * *"Salah tuh min infonya."* ➔ ❌ `Disagreement` (Tidak ada ralat alternatif/bukti).

---

### 5. `Suggestion` (Saran / Usulan Tindakan / Request Konten)
* **Definisi:** Penutur **mengusulkan tindakan spesifik, merekomendasikan perbaikan metode penjelasan, atau meminta topik video berikutnya**.
* **Positive Examples:**
  * *"Bahas mekanika kuantum dan kucing Schrödinger di next video min!"*
  * *"Saran min, font subtitle-nya diperbesar biar lebih gampang dibaca."*
  * *"Request dong min bahas asal-usul bahasa Indonesia."*
* **Negative Examples (Bukan Suggestion):**
  * *"Harusnya kamu belajar fisika dulu sebelum bikin video."* ➔ ❌ `Disagreement` (Kritik destruktif, bukan saran konstruktif).

---

### 6. `Praise` (Pujian / Apresiasi / Dukungan Positif)
* **Definisi:** Penutur **memberikan apresiasi positif, ucapan terima kasih, atau pujian** terhadap kualitas video, penjelasan narator, grafis animasi, atau channel KokBisa.
* **Positive Examples:**
  * *"Keren banget animasinya, penjelasan kompleks jadi gampang dimengerti!"*
  * *"Terima kasih KokBisa selalu mencerahkan anak bangsa."*
  * *"The best science channel in Indonesia!"*
* **Negative Examples (Bukan Praise):**
  * *"Mantap min setuju sama argumennya."* ➔ ❌ Jika penekanan pada persetujuan klaim ➔ `Agreement`.

---

### 7. `Agreement` (Persetujuan Eksplisit / Afirmasi Klaim)
* **Definisi:** Penutur **secara eksplisit menyatakan persetujuan, kesepakatan, atau afirmasi** terhadap argumen, kesimpulan video, atau komentar sebelumnya.
* **Positive Examples:**
  * *"Setuju banget sama poin tentang krisis iklim ini."*
  * *"Benar kata narator, tanpa matematika fisika gak akan jalan."*
  * *"Sepakat, kita memang harus mulai peduli lingkungan."*
* **Negative Examples (Bukan Agreement):**
  * *"Keren videonya!"* ➔ ❌ `Praise`.
  * *"Saya juga berpikir begitu sejak dulu."* ➔ Jika elaborasi opini ➔ `Opinion`.

---

### 8. `Experience` (Berbagi Pengalaman Pribadi / Lived Experience)
* **Definisi:** Penutur **menceritakan peristiwa nyata, pengalaman masa lalu, profesi pribadi, atau kejadian yang dialaminya sendiri** yang relevan dengan topik.
* **Positive Examples:**
  * *"Waktu saya kerja di lab astronomi dulu, teleskop ini memang butuh kalibrasi berjam-jam."*
  * *"Saya pernah ngerasain gempa 7 SR di Palu, suaranya beneran gemuruh dari dalam tanah."*
  * *"Dulu pas SD guru fisika saya pernah demoin eksperimen ini pake balon."*
* **Negative Examples (Bukan Experience):**
  * *"Menurut pengalaman saya teori ini kurang pas."* ➔ Tanpa narasi kejadian nyata ➔ `Opinion`.

---

## 3. Aturan Resolusi Multi-Intent (Decision Priority Hierarchy)

Bila satu komentar mengandung lebih dari satu fungsi komunikatif (misal: memuji lalu bertanya, atau menyanggah sambil memberi ralat), gunakan hirarki resolusi berikut dari prioritas tertinggi ke terendah:

```text
HIRARKI PRIORITAS INTENT GANDA:

1. CORRECTION     (Jika memuat ralat faktual terverifikasi ➔ PRIORITAS UTAMA)
       │
2. DISAGREEMENT   (Jika memuat sanggahan/skeptisisme keras/retoris)
       │
3. QUESTION       (Jika memuat pertanyaan ilmiah tulus yang mencari jawaban)
       │
4. SUGGESTION     (Jika memuat permintaan topik masa depan atau perbaikan teknis)
       │
5. EXPERIENCE     (Jika memuat narasi peristiwa pengalaman hidup nyata)
       │
6. AGREEMENT      (Jika memuat afirmasi persetujuan klaim)
       │
7. PRAISE         (Jika memuji, namun tidak ada intent analitis di atasnya)
       │
8. OPINION        (Default untuk pandangan umum subjektif)
```

### Kasus Contoh Multi-Intent:
1. *"Keren banget videonya min! Mau nanya, kalau kecepatan cahaya konstan, kenapa waktu bisa melambat?"*
   ➔ **Praise + Question** ➔ **Keputusan: `Question`** (Pertanyaan adalah inti interaksi kognitif).
2. *"Videonya mantap, tapi di menit 02:15 bukan 1945 min tapi 1942."*
   ➔ **Praise + Correction** ➔ **Keputusan: `Correction`** (Perbaikan fakta diutamakan).
3. *"Animasi bagus, tapi saya gak setuju kalau AI bakal gantiin semua guru."*
   ➔ **Praise + Disagreement** ➔ **Keputusan: `Disagreement`**.

---

## 4. Matriks Diferensiasi Kasus Rawan Ambigu (*Boundary Cases*)

| Kasus Perbandingan | Karakteristik Kunci Label A | Karakteristik Kunci Label B |
|---|---|---|
| **Question vs Disagreement** | **Question:** Penutur tulus tidak tahu dan ingin penjelasan. | **Disagreement:** Bentuk tanda tanya `?` digunakan untuk menyindir/menyangkal klaim (*rhetorical question*). |
| **Correction vs Disagreement** | **Correction:** Menyediakan alternatif ralat faktual/angka/menit. | **Disagreement:** Hanya menolak atau mencela tanpa data ralat yang benar. |
| **Opinion vs Experience** | **Opinion:** Spekulasi umum (*"kayaknya", "menurut saya"*). | **Experience:** Narasi peristiwa nyata masa lalu yang dialami langsung oleh penutur. |
| **Suggestion vs Opinion** | **Suggestion:** Ada objek permintaan/tindakan (*"request min", "coba bahas"*). | **Opinion:** Pernyataan umum tentang apa yang semestinya terjadi tanpa mengusulkan aksi konten. |
| **Agreement vs Praise** | **Agreement:** Menyetujui kebenaran argumen/klaim ilmiah. | **Praise:** Mengagumi kemasan video, channel, narator, atau visual animasi. |

---

## 5. Protokol Kalibrasi & Adjudikasi

1. **Batch Kalibrasi:** Sebelum masuk ke dataset 10.000 sampel, setiap anotator wajib mengerjakan batch kalibrasi (50–100 sampel) secara independen.
2. **Acceptance Threshold:**
   * $\kappa \ge 0.70$: Lolos ke Anotasi Skala Penuh.
   * $0.60 \le \kappa < 0.70$: Review dan penyempurnaan contoh batas, lalu uji ulang 50 sampel baru.
   * $\kappa < 0.60$: DILARANG memulai anotasi skala besar; lakukan restrukturisasi aturan.
3. **Adjudikasi Disagreement:**
   * Sampel yang menghasilkan selisih label antara Anotator 1 dan 2 otomatis dialihkan ke antrean Adjudikator Independen dengan mencatat `ambiguity_reason` dan menetapkan `adjudicated_label` final.
