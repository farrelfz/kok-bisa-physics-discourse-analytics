import {
  BookOpen, Award, Sparkles, Video, CheckCircle2,
  ExternalLink, GraduationCap, ShieldCheck, FileText, Users
} from "lucide-react";
import { SectionHeader } from "../components.jsx";
import { CANONICAL_LABELS, LABEL_COLORS } from "../constants.js";

export default function AboutResearch() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Academic Research Context"
        title="About the Research"
        sub="Computational discourse analysis of public interaction in Indonesian science and physics education videos."
      />

      {/* ── Overview & Background ── */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <GraduationCap size={22} style={{ color: "var(--brand)" }} />
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text1)", letterSpacing: "-0.02em" }}>
            Project Background & Scope
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 12 }}>
          <p>
            Digital science communication channels like <strong style={{ color: "var(--text1)" }}>Kok Bisa?</strong> serve as informal educational hubs for millions of Indonesian learners. Viewers do not merely consume video content; they actively participate through comments, posing scientific inquiries, debating physical theories, correcting factual oversights, and sharing personal observations.
          </p>
          <p>
            This research develops a state-of-the-art Deep Learning NLP pipeline utilizing <strong style={{ color: "var(--brand-light)" }}>IndoBERT (indobenchmark/indobert-base-p1)</strong> to classify comment discourse into eight canonical acts. With an unprecedented corpus of <strong style={{ color: "var(--text1)" }}>202,429 comments</strong> across 35 physics and science educational videos, this platform provides interactive empirical insights into how the Indonesian public engages with science.
          </p>
        </div>
      </div>

      {/* ── Key Research Questions ── */}
      <div className="card">
        <div className="card-title">Core Research Questions Addressed</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            {
              q: "What types of discourse dominate public science communication?",
              desc: "Analyzing whether viewer interaction is primarily expressive (Opinion), interrogative (Question), or critical (Disagreement / Correction)."
            },
            {
              q: "Which scientific topics stimulate the most active questioning?",
              desc: "Evaluating how abstract physics topics (e.g. Black Holes, Theory of Relativity, Moon origin) compare against applied science in triggering inquiry."
            },
            {
              q: "What triggers scientific Disagreement and factual Correction?",
              desc: "Identifying videos that generate substantial debate and peer-to-peer correction among viewers."
            },
            {
              q: "How reliable is Transformer-based discourse classification on informal Indonesian?",
              desc: "Benchmarking IndoBERT with strict zero-leakage validation splits to achieve 97.40% Macro F1."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "14px 16px",
                background: "var(--surface2)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text1)" }}>
                {idx + 1}. {item.q}
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Research Methodology & Reproducibility ── */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">Corpus & Data Transparency</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text3)" }}>Channel</span>
              <strong style={{ color: "var(--text1)" }}>Kok Bisa? (YouTube)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text3)" }}>Playlist ID</span>
              <code style={{ fontSize: 11, color: "var(--brand-light)" }}>PLCnD2jU_siVrn_0fbUVeUX-ZiGNNsiXC4</code>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text3)" }}>Public Videos</span>
              <strong style={{ color: "var(--text1)" }}>35 Videos (1 Private Excluded)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text3)" }}>Total Corpus</span>
              <strong style={{ color: "var(--text1)", fontFamily: "JetBrains Mono" }}>202,429 Comments</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text3)" }}>Primary Prediction Parquet</span>
              <code style={{ fontSize: 11, color: "var(--text2)" }}>outputs/inference/full_corpus_predictions.parquet</code>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Interdisciplinary Stack</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
            <div style={{ padding: "8px 12px", background: "var(--surface2)", borderRadius: 6 }}>
              <div style={{ fontWeight: 700, color: "var(--brand-light)" }}>Deep Learning & NLP</div>
              <div style={{ color: "var(--text3)", marginTop: 2 }}>PyTorch, Hugging Face Transformers, IndoBERT (indobenchmark/indobert-base-p1)</div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--surface2)", borderRadius: 6 }}>
              <div style={{ fontWeight: 700, color: "#10B981" }}>High-Performance Query Engine</div>
              <div style={{ color: "var(--text3)", marginTop: 2 }}>FastAPI, DuckDB (Zero-copy in-memory querying of 200k+ rows)</div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--surface2)", borderRadius: 6 }}>
              <div style={{ fontWeight: 700, color: "#F59E0B" }}>Research Dashboard & Visualizations</div>
              <div style={{ color: "var(--text3)", marginTop: 2 }}>React 19, Vite, Recharts, ECharts, TanStack Table, Lucide Icons</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright, License & Academic Citation ── */}
      <div className="card" style={{ padding: "24px 28px", border: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={22} style={{ color: "var(--brand)" }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text1)", letterSpacing: "-0.02em" }}>
                Copyright, Licensing &amp; Attribution
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                Open-source academic research under the permissive MIT License
              </div>
            </div>
          </div>

          <span className="tag tag-brand" style={{ fontSize: 11.5, fontWeight: 700 }}>
            MIT License · Open Science
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong>Indonesian Public Discourse Corpus (IPDC)</strong> is developed as an academic research initiative to advance computational linguistics and public science engagement analytics in the Indonesian language.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Copyright Notice:</strong><br />
              © 2026 <em>Indonesian Public Discourse Corpus Research Project</em>. All rights reserved. The software and analytical dashboard are open-source under the <strong>MIT License</strong>.
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text3)" }}>
              All YouTube comment text assets belong to their respective original authors on YouTube and are processed under fair academic research terms. Video content and thumbnails are property of <strong>Kok Bisa?</strong> channel.
            </p>
          </div>

          {/* BibTeX Citation Box */}
          <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
              Suggested Academic Citation (BibTeX)
            </div>
            <pre style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono",
              color: "var(--text1)",
              background: "var(--surface)",
              padding: "10px 12px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              overflowX: "auto",
              lineHeight: 1.45,
              margin: 0,
            }}>
{`@misc{kokbisa_discourse_2026,
  title  = {Indonesian Public Discourse Corpus: Deep Learning Classification of Science Engagement},
  author = {IPDC Research Project},
  year   = {2026},
  url    = {https://github.com/farrelfz/kok-bisa-physics-discourse-analytics}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
