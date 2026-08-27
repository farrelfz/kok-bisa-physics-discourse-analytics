import React from 'react';
import { Layers, Cpu, Database, Terminal, ShieldCheck, CheckCircle2, Code2, Server } from 'lucide-react';
import { SectionHeader } from '../components.jsx';

export default function Pipeline() {
  const PIPELINE = [
    { num: 1, label: 'Scrape Playlist & Video Metadata', desc: 'Queries YouTube Data API v3 to retrieve comprehensive video descriptors, view counts, and publish timestamps.', tool: 'google-api-python-client', color: '#2563EB' },
    { num: 2, label: 'Fetch Full Comment Threads', desc: 'Extracts top-level comments and nested reply hierarchies (202,429 comments total) across all 35 science videos.', tool: 'YouTube API & Pagination', color: '#3B82F6' },
    { num: 3, label: 'Fetch Subtitles & Transcripts', desc: 'Downloads timestamped captions to provide multimodal video context for science discussions.', tool: 'youtube-transcript-api', color: '#6366F1' },
    { num: 4, label: 'Data Cleaning & Normalization', desc: 'Emoji parsing, lowercase conversion, repetitive whitespace stripping, and empty comment filtering.', tool: 'RegEx & Pandas', color: '#8B5CF6' },
    { num: 5, label: 'Probabilistic Language Detection', desc: 'Classifies comments into 41 language codes and filters non-Indonesian texts using langdetect.', tool: 'langdetect', color: '#EC4899' },
    { num: 6, label: 'Rule-Based Spam Detection', desc: 'Filters promotional URLs, spam hashtags, repeated bot characters, and timestamp spam.', tool: 'Regex Filter Rules', color: '#EF4444' },
    { num: 7, label: 'Indonesian Stemming & Morphology', desc: 'Converts affixes, prefixes, and suffixes to canonical base root words.', tool: 'Sastrawi Stemmer', color: '#F97316' },
    { num: 8, label: 'Deep Learning Discourse Inference', desc: 'Classifies 8 canonical discourse acts using fine-tuned IndoBERT Base with zero class collapse (97.40% Macro F1).', tool: 'IndoBERT (HuggingFace)', color: '#10B981' },
    { num: 9, label: 'Semantic Embeddings & Indexing', desc: 'Generates 384-dim dense vectors (MiniLM) and outputs DuckDB / Parquet query tables for dashboard analytics.', tool: 'Sentence-Transformers & DuckDB', color: '#14B8A6' }
  ];

  const TECH = [
    'Python 3.12+', 'PyTorch 2.x', 'Hugging Face Transformers', 'IndoBERT Base',
    'FastAPI Backend', 'DuckDB Engine', 'React 19 + Vite', 'Recharts & ECharts',
    'Pandas & PyArrow', 'Sastrawi NLP'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="System & Data Engineering"
        title="End-to-End Pipeline Architecture"
        sub="9-stage modular automated NLP pipeline powering the Indonesian Public Discourse Corpus (IPDC) from raw YouTube scraping to real-time DuckDB inference queries."
      />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20 }}>
        {/* 9 Steps List */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="card-title" style={{ margin: 0 }}>9-Stage Pipeline Workflow</div>
              <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 2 }}>Sequential data transformation and model inference pipeline</div>
            </div>
            <span className="tag tag-brand" style={{ fontSize: 11 }}>
              Automated Pipeline
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PIPELINE.map((p) => (
              <div
                key={p.num}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '12px 14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: p.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: 'JetBrains Mono',
                    flexShrink: 0,
                  }}
                >
                  {p.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>
                      {p.label}
                    </div>
                    <code style={{ fontSize: 10.5, background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--text2)' }}>
                      {p.tool}
                    </code>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.45 }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Code Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tech Stack */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Production Tech Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TECH.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: 11.5,
                    fontFamily: 'JetBrains Mono',
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--bg-subtle)',
                    color: 'var(--text2)',
                    border: '1px solid var(--border)',
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* NLP Modules Directory */}
          <div className="card" style={{ padding: '20px 22px', flex: 1 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>NLP Modules Architecture</div>
            <div style={{ fontSize: 11.5, color: 'var(--text3)', marginBottom: 14 }}>Modular codebase structure in <code>src/nlp/</code></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--brand-dark)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Code2 size={14} /> src/nlp/annotator.py
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4 }}>
                  Text preprocessing, token cleaning, and Sastrawi Indonesian stemmer routines.
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#8B5CF6', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={14} /> src/nlp/discourse_classifier.py
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4 }}>
                  PyTorch / HuggingFace IndoBERT inference engine with batch forward passes and logit probability calibration.
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#10B981', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Server size={14} /> src/nlp/semantic_analyzer.py
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4 }}>
                  Sentence embeddings (MiniLM), TF-IDF topic keyword extraction, and collocation analysis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Funnel & Corpus Provenance Section */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} style={{ color: 'var(--brand)' }} />
              Corpus Data Funnel & Provenance Pipeline
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 2 }}>
              Transparent record transition from raw API harvesting to dense vector embedding and gold annotation splits
            </div>
          </div>
          <span className="tag tag-brand" style={{ fontSize: 11 }}>
            Zero-Ambiguity Data Provenance
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {/* Stage 1 */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', borderTop: '3px solid #2563EB' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Stage 1: Raw Harvesting
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
              202,429
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text2)', fontWeight: 600, marginBottom: 4 }}>
              Raw YouTube API Scrapes
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
              116,459 top-level comments + 85,970 threaded replies extracted across 35 public science videos.
            </div>
          </div>

          {/* Stage 2 */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', borderTop: '3px solid #EF4444' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Stage 2: Clean Corpus
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
              199,855
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text2)', fontWeight: 600, marginBottom: 4 }}>
              Spam-Pruned Clean Records
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
              2,574 promotional spam, bot repetition, and gambling links removed (<code>comments_processed.parquet</code>).
            </div>
          </div>

          {/* Stage 3 */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', borderTop: '3px solid #8B5CF6' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Stage 3: Vectorized Subset
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
              136,587
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text2)', fontWeight: 600, marginBottom: 4 }}>
              High-Quality Dense Vectors
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
              Well-formed comments (&gt;3 tokens, high ID confidence) indexed with 384-dim embeddings (<code>comments_embeddings.npy</code>).
            </div>
          </div>

          {/* Stage 4 */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', borderTop: '3px solid #10B981' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Stage 4: Gold Benchmark Split
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text1)', fontFamily: 'JetBrains Mono', margin: '4px 0' }}>
              10,500
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text2)', fontWeight: 600, marginBottom: 4 }}>
              Gold Stratified Annotations
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
              Dual-annotated gold standard: Train (7,148), Validation (1,850), and Held-Out Test (1,502) across separate videos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
