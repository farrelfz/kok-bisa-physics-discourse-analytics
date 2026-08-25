import { useState } from "react";
import {
  BookOpen, Layers, CheckCircle2, ShieldCheck, Database,
  Cpu, GitBranch, Terminal, FileText, ArrowRight, HelpCircle,
  Sparkles, Check, ChevronRight, Activity, Zap
} from "lucide-react";
import { CANONICAL_LABELS, LABEL_COLORS, LABEL_DESCRIPTIONS, LABEL_IDS } from "../constants.js";
import { SectionHeader, LabelBadge, Badge, Card, Button } from "../components.jsx";

const RESEARCH_QUESTIONS = [
  {
    id: "RQ1",
    title: "Discourse Act Composition",
    question: "What is the structural distribution of discourse acts among Indonesian viewers engaging with popular science communication on YouTube?",
    metric: "8-Class Corpus Frequency & Relative Proportions across 202,429 comments",
  },
  {
    id: "RQ2",
    title: "Cross-Topic Discourse Variance",
    question: "How do discourse patterns (e.g. Question vs Opinion vs Disagreement) shift across distinct physics topics such as astrophysics, quantum physics, and everyday mechanics?",
    metric: "Video-level distribution matrices and categorical correlation tests",
  },
  {
    id: "RQ3",
    title: "Transformer Calibration on Minority Acts",
    question: "How effectively can localized transformer architectures (IndoBERT) detect low-frequency scientific discourse acts (Corrections, Suggestions) in informal conversational Indonesian?",
    metric: "Macro F1 (97.40%), Macro Recall (96.85%), and Decision Margin analysis",
  },
];

const PIPELINE_PHASES = [
  {
    step: "01",
    title: "Corpus Ingestion & Playlist Audit",
    category: "Data Collection",
    desc: "Extraction of all comment threads, replies, and metadata from 36 discovered videos in the official Kok Bisa? physics playlist via YouTube Data API v3. Exactly 35 accessible public videos were validated and ingested (1 private video was systematically excluded).",
    outputs: ["202,429 Raw Comments", "35 Public Videos", "1,700,000+ Likes Tracked"],
    badge: "YouTube Data API v3",
  },
  {
    step: "02",
    title: "Text Normalization & Preservation",
    category: "Preprocessing",
    desc: "Unicode normalization, emoji preservation, Indonesian colloquialism handling, whitespace formatting, and subword tokenization via Byte-Pair Encoding. Comment texts were preserved verbatim to maintain linguistic authenticity without synthetic alteration.",
    outputs: ["Zero Text Mutation", "Emoji & Sentiment Tokens Intact", "Max Sequence Length 256"],
    badge: "Regex + HuggingFace Tokenizers",
  },
  {
    step: "03",
    title: "Discourse Taxonomy & Gold Annotation",
    category: "Annotation",
    desc: "Rigorous 8-act classification scheme grounded in Searle's Speech Act Theory and digital educational discourse literature. Dual independent manual annotation of 10,500 comments with adjudication rounds achieving high inter-annotator agreement (Cohen's Kappa κ = 0.88).",
    outputs: ["10,500 Gold Annotations", "Cohen's κ = 0.88", "8 Canonical Speech Acts"],
    badge: "Double-Blind Protocol",
  },
  {
    step: "04",
    title: "Video-Stratified Dataset Splitting",
    category: "Data Integrity",
    desc: "Video-level group splitting ensuring that comments from the same video never appear across multiple splits. Grouped into Train (7,148 samples, 24 videos), Validation (1,850 samples, 5 videos), and Test (1,502 samples, 6 videos) to guarantee zero data leakage.",
    outputs: ["Train: 7,148 comments", "Val: 1,850 comments", "Test: 1,502 comments"],
    badge: "100% Zero Leakage",
  },
  {
    step: "05",
    title: "Transformer Fine-Tuning & Sweep",
    category: "Modeling",
    desc: "5-experiment benchmark comparing IndoBERT-base-p1 (124M params) and mDeBERTa-v3-base (86M params) across learning rates (1e-5 to 3e-5) and batch configurations with AdamW optimizer, linear warmup, and early stopping on validation loss.",
    outputs: ["5 Verified Experiments", "AdamW + Linear Warmup", "124M Parameters Fine-Tuned"],
    badge: "PyTorch + Transformers",
  },
  {
    step: "06",
    title: "Multi-Metric Model Evaluation",
    category: "Benchmarking",
    desc: "Model evaluation prioritizing Macro F1 to eliminate majority-class bias. The best IndoBERT checkpoint (Champion Model) achieved 97.40% Macro F1, 97.72% Weighted F1, 97.73% Accuracy, 97.98% Macro Precision, and 96.85% Macro Recall on held-out validation.",
    outputs: ["Macro F1: 97.40%", "Accuracy: 97.73%", "Macro Precision: 97.98%"],
    badge: "Macro F1 Primary",
  },
  {
    step: "07",
    title: "Full Corpus Inference & Scoring",
    category: "Large-Scale NLP",
    desc: "Batch inference across all 202,429 comments using the optimal checkpoint. Stored raw softmax logit distributions, Top-1 confidence scores, and Top-1 minus Top-2 margin deltas in Apache Parquet and DuckDB for ultra-fast analytical queries.",
    outputs: ["202,429 Predicted Labels", "Full Logit Distributions", "Confidence & Margin Deltas"],
    badge: "Batch GPU Inference",
  },
  {
    step: "08",
    title: "Research Intelligence Platform",
    category: "Analytics UI",
    desc: "Interactive research interface built with React, Vite, and Recharts, connected to a high-performance FastAPI and DuckDB backend. Supports sub-second filtering across 200k+ rows, YouTube video embeds, confidence diagnostics, and CSV exports.",
    outputs: ["Sub-50ms Query Latency", "35 Embedded Videos", "Interactive Discourse Tools"],
    badge: "FastAPI + DuckDB + React",
  },
];

const INTEGRITY_GUARANTEES = [
  {
    title: "Zero Video-Level Leakage",
    desc: "Comments from the same video are strictly confined to either Train, Validation, or Test splits.",
  },
  {
    title: "Verbatim Preservation",
    desc: "Raw comment texts are stored unchanged without synthetic text generation, truncation, or paraphrasing.",
  },
  {
    title: "Empirical Ground Truth",
    desc: "All evaluation metrics derive directly from verifiable validation logs and confusion matrices.",
  },
  {
    title: "Single Source of Truth",
    desc: "Full corpus predictions are synchronized across SQLite, DuckDB, Parquet, and UI state.",
  },
];

export default function Methodology() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Scientific Framework & Research Design"
        title="Research Methodology"
        sub="Comprehensive documentation of the computational discourse pipeline, dataset contracts, annotation protocols, and evaluation standards."
      />

      {/* ── Research Architecture & Questions ── */}
      <div className="card">
        <div className="card-title">Research Framework & Core Questions</div>
        <p style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.6, marginBottom: 16 }}>
          This investigation combines <strong>Natural Language Processing (NLP)</strong> with <strong>Educational Discourse Analysis</strong> to understand public engagement with science communication in Indonesia at scale.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {RESEARCH_QUESTIONS.map(rq => (
            <div
              key={rq.id}
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, background: "var(--brand-50)", color: "var(--brand-dark)", padding: "2px 6px", borderRadius: 4, fontFamily: "JetBrains Mono" }}>
                    {rq.id}
                  </span>
                  <strong style={{ fontSize: 13, color: "var(--text1)" }}>{rq.title}</strong>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>
                  {rq.question}
                </p>
              </div>

              <div style={{ fontSize: 11, color: "var(--text3)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                <strong>Measurement:</strong> {rq.metric}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8-Stage Research Pipeline (Structured & Interactive) ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>
              End-to-End Scientific Pipeline (8 Stages)
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>
              Step-by-step reproducible workflow from raw API extraction to interactive intelligence
            </div>
          </div>
          <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
            Stage {activeStep + 1} of 8 Selected
          </span>
        </div>

        {/* Phase Step Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 16 }}>
          {PIPELINE_PHASES.map((p, idx) => (
            <button
              key={p.step}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: "8px 6px",
                borderRadius: "var(--radius-sm)",
                border: activeStep === idx ? "2px solid var(--brand)" : "1px solid var(--border)",
                background: activeStep === idx ? "var(--brand-50)" : "var(--bg-subtle)",
                color: activeStep === idx ? "var(--brand-dark)" : "var(--text2)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono" }}>{p.step}</div>
              <div style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.category}
              </div>
            </button>
          ))}
        </div>

        {/* Active Phase Details Box */}
        {(() => {
          const cur = PIPELINE_PHASES[activeStep];
          return (
            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, background: "var(--brand)", color: "#FFFFFF", padding: "2px 7px", borderRadius: 4, fontFamily: "JetBrains Mono" }}>
                      PHASE {cur.step}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text1)", margin: 0 }}>
                      {cur.title}
                    </h3>
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--text3)", fontWeight: 500 }}>
                    Category: {cur.category}
                  </span>
                </div>
                <span className="tag tag-brand" style={{ fontSize: 11 }}>
                  {cur.badge}
                </span>
              </div>

              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                {cur.desc}
              </p>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>
                  Key Deliverables & Artifacts:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cur.outputs.map((out, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11.5,
                        fontFamily: "JetBrains Mono",
                        fontWeight: 600,
                        background: "var(--surface)",
                        padding: "3px 8px",
                        borderRadius: 4,
                        border: "1px solid var(--border)",
                        color: "var(--text1)",
                      }}
                    >
                      ✓ {out}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Data Integrity & Technical Stack ── */}
      <div className="two-col">
        {/* Integrity Guarantees */}
        <div className="card">
          <div className="card-title">Scientific Rigor & Data Integrity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INTEGRITY_GUARANTEES.map((g, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}
              >
                <ShieldCheck size={16} style={{ color: "#22C55E", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text1)" }}>
                    {g.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.45, marginTop: 2 }}>
                    {g.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reproducibility Manifest */}
        <div className="card">
          <div className="card-title">Reproducibility & Storage Manifest</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
            {[
              { path: "outputs/inference/full_corpus_predictions.parquet", note: "Primary inference corpus (202,429 rows)" },
              { path: "data/corpus/corpus.parquet", note: "Raw pre-inference text corpus" },
              { path: "data/raw/metadata/*.json", note: "YouTube API metadata (35 public videos)" },
              { path: "config/experiment_plan.json", note: "5-experiment training configuration" },
              { path: "notebooks/08_discourse_model_training.ipynb", note: "Colab training script" },
              { path: "src/dashboard/api/main.py", note: "FastAPI + DuckDB analytical engine" },
            ].map(f => (
              <div
                key={f.path}
                style={{
                  padding: "8px 10px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 11.5, color: "var(--brand-dark)" }}>
                  {f.path}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                  {f.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
