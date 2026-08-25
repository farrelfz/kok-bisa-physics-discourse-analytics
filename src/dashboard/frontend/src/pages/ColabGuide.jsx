import React, { useState } from "react";
import { Terminal, Copy, Check, ExternalLink, Cpu, Download, Play, CheckCircle2 } from "lucide-react";
import { SectionHeader, Card, Button, Badge } from "../components.jsx";

const STEPS = [
  {
    num: 1,
    title: "Buka Lingkungan Google Colab",
    desc: "Buka Google Colab di browser, lalu upload notebook 08_discourse_model_training.ipynb atau 06_indobert_semantic_analysis.ipynb.",
    code: "# Link Google Colab:\nhttps://colab.research.google.com/",
    badge: "Tahap 1",
  },
  {
    num: 2,
    title: "Aktifkan Akselerasi Hardware GPU",
    desc: "Di menu Google Colab, pilih Runtime > Change runtime type > Hardware accelerator pilih GPU (T4, V100, atau A100).",
    code: "import torch\nprint('CUDA Available:', torch.cuda.is_available())\nprint('Device Name:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')",
    badge: "GPU Acceleration",
  },
  {
    num: 3,
    title: "Clone Repositori & Install Dependencies",
    desc: "Download dataset korpus dan install seluruh pustaka transformer PyTorch & HuggingFace.",
    code: "!git clone https://github.com/farrelfz/kok-bisa-physics-discourse-analytics.git kokbisa\n%cd kokbisa\n!pip install -r requirements.txt",
    badge: "Setup Environment",
  },
  {
    num: 4,
    title: "Jalankan Fine-Tuning atau Inference Batch",
    desc: "Eksekusi notebook training/inferensi secara sekuensial. Pipeline akan memproses 202.429 komentar menggunakan IndoBERT.",
    code: "# Estimasi Durasi:\n# - GPU T4: ~8-12 menit untuk 202.429 komentar\n# - CPU: ~3-5 jam",
    badge: "Batch Pipeline",
  },
  {
    num: 5,
    title: "Ekspor Hasil Prediksi Parquet ke Lokal",
    desc: "Sel terakhir di notebook akan otomatis men-generate file outputs/inference/full_corpus_predictions.parquet.",
    code: "from google.colab import files\nfiles.download('outputs/inference/full_corpus_predictions.parquet')",
    badge: "Output Sync",
  }
];

export default function ColabGuide() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Reproduction Guide & GPU Acceleration"
        title="Google Colab Pipeline"
        sub="Petunjuk langkah demi langkah untuk mereproduksi fine-tuning IndoBERT dan inferensi korpus 202.429 komentar menggunakan Google Colab."
      />

      {/* Overview Card */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Terminal size={18} style={{ color: "var(--brand)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--text1)" }}>
            Akselerasi Cloud GPU untuk 202.429 Komentar
          </h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
          Karena inferensi <strong>IndoBERT Base</strong> pada 202.429 komentar memerlukan komputasi forward-pass transformer intensif, notebook <strong>08_discourse_model_training.ipynb</strong> dan <strong>06_indobert_semantic_analysis.ipynb</strong> dirancang untuk dieksekusi pada GPU Google Colab (T4 / A100) dengan durasi hanya ~10 menit.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STEPS.map((s, idx) => (
          <div key={s.num} className="card" style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--brand-50)", color: "var(--brand-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: "JetBrains Mono" }}>
                  {s.num}
                </span>
                <strong style={{ fontSize: 14, color: "var(--text1)" }}>{s.title}</strong>
              </div>
              <span className="tag" style={{ fontSize: 11 }}>{s.badge}</span>
            </div>

            <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10 }}>
              {s.desc}
            </p>

            <div style={{ position: "relative" }}>
              <pre
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  fontSize: 12,
                  fontFamily: "JetBrains Mono",
                  color: "var(--text1)",
                  overflowX: "auto",
                  margin: 0,
                }}
              >
                {s.code}
              </pre>

              <button
                className="btn btn-ghost btn-xs"
                style={{ position: "absolute", top: 6, right: 6, background: "var(--surface)", border: "1px solid var(--border)" }}
                onClick={() => copyCode(s.code, idx)}
                title="Salin ke clipboard"
              >
                {copiedIndex === idx ? <Check size={12} color="#22C55E" /> : <Copy size={12} />}
                <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
