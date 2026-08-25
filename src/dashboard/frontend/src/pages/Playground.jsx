import React, { useState } from "react";
import { api } from "../api.js";
import { Sparkles, Send, RefreshCw, HelpCircle, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { CANONICAL_LABELS, LABEL_COLORS, LABEL_DESCRIPTIONS, LABEL_IDS } from "../constants.js";
import { LabelBadge, ConfBadge, MarginBadge, SectionHeader, Card, Button } from "../components.jsx";

const PRESETS = [
  { label: "❓ Pertanyaan Penasaran", text: "Min, kenapa cahaya dari bintang yang sudah mati jutaan tahun lalu masih bisa terlihat di bumi hari ini?" },
  { label: "💡 Saran Topik Video", text: "Bahas tentang paradoks Fermi dan Dyson Sphere dong min di video selanjutnya! Pasti seru banget." },
  { label: "👏 Apresiasi Konten", text: "Keren banget animasinya! Penjelasannya mudah dipahami buat orang awam. Terus berkarya tim Kok Bisa!" },
  { label: "✏️ Koreksi Ilmiah", text: "Koreksi sedikit di menit 03:15, kecepatan cahaya di ruang hampa itu 299.792 km/detik, bukan mil/detik." },
  { label: "❌ Kontra / Skeptis", text: "Saya kurang setuju kalau bumi bulat, bukti foto satelit itu hasil CGI semua." },
  { label: "📖 Cerita Pengalaman", text: "Dulu waktu kecil saya sering begadang natap langit malam pakai teropong mainan sampai ketiduran." },
  { label: "🗣️ Opini Personal", text: "Menurut saya manusia memang sebaiknya fokus merawat bumi daripada buru-buru pindah ke Mars." }
];

export default function Playground() {
  const [input, setInput] = useState(PRESETS[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleClassify = async (textToTest) => {
    const query = textToTest || input;
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.inferenceClassify(query);
      setResult(res);
    } catch (err) {
      setError(err.message || "Gagal melakukan inferensi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Interactive Deep Learning Sandbox"
        title="Live Inference Playground"
        sub="Test custom Indonesian comment inputs in real-time to observe transformer logits and probability distributions across 8 discourse acts."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        {/* Input Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title" style={{ margin: 0 }}>
              Input Comment Text
            </div>
            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
              {input.length} characters
            </span>
          </div>

          <textarea
            className="input-field"
            rows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ketik komentar dalam Bahasa Indonesia untuk menguji klasifikasi..."
            style={{ width: "100%", resize: "vertical", fontSize: 13.5, lineHeight: 1.5 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleClassify(input)}
              disabled={loading || !input.trim()}
            >
              <Send size={13} /> {loading ? "Analyzing..." : "Classify Discourse Act"}
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setInput("");
                setResult(null);
              }}
            >
              Clear
            </button>
          </div>

          {/* Quick Presets */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)", marginBottom: 8 }}>
              Sample Benchmark Presets:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  className="btn btn-secondary btn-xs"
                  onClick={() => {
                    setInput(p.text);
                    handleClassify(p.text);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Results Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card-title" style={{ margin: 0 }}>
            Classification Results
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
              Running transformer tokenization & forward pass…
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-subtle)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "var(--text3)", textTransform: "uppercase", fontWeight: 700 }}>
                    Predicted Discourse Act
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <LabelBadge label={result.predicted_label} size="lg" />
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10.5, color: "var(--text3)", textTransform: "uppercase", fontWeight: 700 }}>
                    Confidence
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <ConfBadge value={result.confidence} />
                  </div>
                </div>
              </div>

              {/* Class Probabilities */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)", marginBottom: 8 }}>
                  Posterior Probability Distribution:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {CANONICAL_LABELS.map(lbl => {
                    const prob = result.all_probabilities?.[lbl] || (lbl === result.predicted_label ? result.confidence : 0.02);
                    const pct = (prob * 100).toFixed(1);
                    const color = LABEL_COLORS[lbl];
                    return (
                      <div key={lbl} style={{ fontSize: 11.5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ fontWeight: 600, color: "var(--text1)" }}>{lbl}</span>
                          <span style={{ fontFamily: "JetBrains Mono", color: "var(--text2)" }}>{pct}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 5 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 12.5 }}>
              Pilih salah satu preset atau ketik teks komentar untuk melihat hasil klasifikasi IndoBERT.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
