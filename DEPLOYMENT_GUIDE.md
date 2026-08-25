# Panduan Menayangkan Dashboard ke GitHub Pages

Dashboard riset ini sepenuhnya siap ditayangkan secara interaktif di **GitHub Pages** menggunakan **GitHub Actions**.

---

## 🚀 Langkah 1-Klik untuk Mengaktifkan GitHub Pages

1. Buka repository Anda di browser:
   👉 **[https://github.com/farrelfz/kok-bisa-physics-discourse-analytics](https://github.com/farrelfz/kok-bisa-physics-discourse-analytics)**

2. Klik tab **Settings** (Pengaturan).

3. Di menu sidebar sebelah kiri, klik **Pages** (di bagian *Code and automation*).

4. Pada bagian **Build and deployment**:
   - Di dropdown **Source**, pilih: **`GitHub Actions`**

5. Selesai! 🎉
   - GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) akan otomatis mem-build aplikasi React Vite dan menayangkannya ke:
   - 👉 **`https://farrelfz.github.io/kok-bisa-physics-discourse-analytics/`**

---

## 📊 Fitur Interaktif yang Tersedia di GitHub Pages:
- **Interactive Overview**: Grafik distribusi 8 kategori discourse act, metrik likes, dan key insight riset.
- **Video Explorer**: Penjelajah interaktif 35 video sains dengan metrik views, komentar, dan rasio discourse.
- **Discourse Analysis**: Matriks distribusi topik interaktif antar video.
- **Confidence & Uncertainty Explorer**: Analisis keandalan model IndoBERT dan analisis kasus ambigu/perbatasan.
- **2D/3D Semantic Embeddings**: Visualisasi proyeksi semantik 2,000 titik komentar interaktif.
- **Language Breakdown**: Statistik ragam bahasa (Indonesia formal, slang/informal, Inggris).
- **Model Performance**: Hasil benchmark lengkap model champion IndoBERT Base (Macro F1 97.40%, Akurasi 97.73%).
- **Live Playground**: Uji coba klasifikasi komentar secara langsung di browser.
