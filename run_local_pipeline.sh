#!/bin/bash
set -e

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Virtual environment activated."
fi

echo "========================================="
echo "1. Menjalankan Audit Playlist (Notebook 01)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/01_playlist_audit.ipynb || echo "Catatan: Notebook 01 membutuhkan YouTube API key jika ingin fetch ulang."

echo ""
echo "========================================="
echo "2. Menjalankan Scraping (Notebook 02)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/02_scraping.ipynb
echo "Scraping selesai!"

echo ""
echo "========================================="
echo "3. Menjalankan Validasi (Notebook 03)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/03_validation.ipynb

echo ""
echo "========================================="
echo "4. Membuat Database (Notebook 04)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/04_corpus.ipynb

echo ""
echo "========================================="
echo "5. Preprocessing Teks (Notebook 05)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/05_preprocessing.ipynb

echo ""
echo "========================================="
echo "6. Pemodelan Topik (Notebook 07)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/07_topic_modeling.ipynb

echo ""
echo "========================================="
echo "7. Visualisasi Penelitian (Notebook 09)..."
echo "========================================="
jupyter nbconvert --to notebook --execute --inplace notebooks/09_visualization.ipynb

echo ""
echo "========================================="
echo "Catatan Komputasi Berat (Stage 06 & 08):"
echo "Untuk inferensi transformer mDeBERTa-v3 & Sentence Embeddings,"
echo "silakan jalankan: notebooks/06_indobert_semantic_analysis.ipynb di Google Colab GPU."
echo "========================================="
echo "Pipeline lokal selesai!"
