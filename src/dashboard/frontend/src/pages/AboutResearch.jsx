import React, { useState } from "react";
import {
  BookOpen, Award, Sparkles, Video, CheckCircle2,
  ExternalLink, GraduationCap, ShieldCheck, FileText, Users, Copy, Check, GitFork
} from "lucide-react";
import { SectionHeader } from "../components.jsx";
import { CANONICAL_LABELS, LABEL_COLORS } from "../constants.js";

export default function AboutResearch() {
  const [copied, setCopied] = useState(false);

  const bibtexCode = `@misc{kokbisa_discourse_2026,
  title  = {Indonesian Public Discourse Corpus: Deep Learning Classification of Science Engagement},
  author = {IPDC Research Project},
  year   = {2026},
  url    = {https://github.com/farrelfz/kok-bisa-physics-discourse-analytics}
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* ── Suggested Academic Citation (BibTeX) ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} style={{ color: "var(--brand)" }} />
            <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text1)" }}>
              Suggested Academic Citation (BibTeX)
            </span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {copied ? <Check size={14} style={{ color: "var(--success)" }} /> : <Copy size={14} />}
            {copied ? "Copied to Clipboard!" : "Copy BibTeX"}
          </button>
        </div>

        <pre style={{
          fontSize: 12,
          fontFamily: "JetBrains Mono",
          color: "var(--text1)",
          background: "var(--bg-subtle)",
          padding: "14px 16px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          overflowX: "auto",
          lineHeight: 1.5,
          margin: 0,
        }}>
{bibtexCode}
        </pre>
      </div>

      {/* ── Copyright & Licensing Notice ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={18} style={{ color: "#22C55E" }} />
            <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text1)" }}>
              Copyright, Licensing & Attribution
            </span>
          </div>
          <span className="tag tag-success" style={{ fontSize: 11, fontWeight: 700 }}>
            MIT License · Open Research
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>Indonesian Public Discourse Corpus (IPDC)</strong> is developed as an open-source academic research initiative to advance computational linguistics and public science engagement analytics in Indonesian digital communication.
          </p>
          <div style={{ padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>
              © 2026 Indonesian Public Discourse Corpus Research Project
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
              The software, analytical pipeline, and dashboard frontend are open-source and distributed under the <strong>MIT License</strong>.
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text3)" }}>
            All YouTube comment text assets belong to their respective original authors on YouTube and are analyzed under fair academic research terms. Video content and thumbnails remain the intellectual property of the <strong>Kok Bisa?</strong> channel.
          </p>

          <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              Source repository & open dataset available on GitHub
            </span>
            <a
              href="https://github.com/farrelfz/kok-bisa-physics-discourse-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <ExternalLink size={13} />
              <span>View GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── References ── */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <BookOpen size={18} style={{ color: "var(--brand)" }} />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text1)" }}>
            References
          </span>
        </div>
        <ul style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, margin: 0 }}>
          <li>Aji, A. F., Winata, G. I., Koto, F., Cahyawijaya, S., Romadhony, A., Mahendra, R., Kurniawan, K., Moeljadi, D., Prasojo, R. E., Baldwin, T., Lau, J. H., & Ruder, S. (2022). One country, 700+ languages: NLP challenges for underrepresented languages and dialects in Indonesia. <i>Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)</i>, 7226–7249. <a href="https://doi.org/10.18653/v1/2022.acl-long.500" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.18653/v1/2022.acl-long.500</a></li>
          <li>Austin, J. L. (1962). <i>How to do things with words</i>. Oxford University Press.</li>
          <li>Barik, A. M., Mahendra, R., & Adriani, M. (2019). Normalization of Indonesian-English code-mixed Twitter data. <i>Proceedings of the 5th Workshop on Noisy User-Generated Text (W-NUT 2019)</i>, 417–424. <a href="https://doi.org/10.18653/v1/D19-5554" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.18653/v1/D19-5554</a></li>
          <li>Bucchi, M., & Trench, B. (Eds.). (2021). <i>Routledge handbook of public communication of science and technology</i> (3rd ed.). Routledge.</li>
          <li>Cohen, J. (1960). A coefficient of agreement for nominal scales. <i>Educational and Psychological Measurement</i>, 20(1), 37–46. <a href="https://doi.org/10.1177/001316446002000104" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.1177/001316446002000104</a></li>
          <li>Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. <i>Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long and Short Papers)</i>, 4171–4186. <a href="https://doi.org/10.18653/v1/N19-1423" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.18653/v1/N19-1423</a></li>
          <li>Dubovi, I., & Tabak, I. (2020). An empirical analysis of knowledge co-construction in YouTube comments. <i>Computers & Education</i>, 156, Article 103939. <a href="https://doi.org/10.1016/j.compedu.2020.103939" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.1016/j.compedu.2020.103939</a></li>
          <li>Dubovi, I., & Tabak, I. (2021). Interactions between emotional and cognitive engagement with science on YouTube. <i>Public Understanding of Science</i>, 30(6), 759–776. <a href="https://doi.org/10.1177/0963662521990848" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.1177/0963662521990848</a></li>
          <li>Fauzan, M. F. D. (2026). <i>Kok Bisa? physics discourse analytics: An interactive research companion for the Indonesian Public Discourse Corpus (IPDC)</i> [Interactive web application]. GitHub Pages. Kok Bisa? Physics Discourse Analytics</li>
          <li>Hill, V. M., Grant, W. J., McMahon, M. L., & Singhal, I. S. (2022). How prominent science communicators on YouTube understand the impact of their work. <i>Frontiers in Communication</i>, 7, Article 1014477. <a href="https://doi.org/10.3389/fcomm.2022.1014477" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.3389/fcomm.2022.1014477</a></li>
          <li>Koto, F., Rahimi, A., Lau, J. H., & Baldwin, T. (2020). IndoLEM and IndoBERT: A benchmark dataset and pre-trained language model for Indonesian NLP. <i>Proceedings of the 28th International Conference on Computational Linguistics</i>, 757–770. <a href="https://doi.org/10.18653/v1/2020.coling-main.66" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.18653/v1/2020.coling-main.66</a></li>
          <li>Searle, J. R. (1969). <i>Speech acts: An essay in the philosophy of language</i>. Cambridge University Press.</li>
          <li>Vosoughi, S., & Roy, D. (2016). Tweet acts: A speech act classifier for Twitter. <i>Proceedings of the International AAAI Conference on Web and Social Media</i>, 10(1), 711–714. <a href="https://doi.org/10.1609/icwsm.v10i1.14821" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-light)", textDecoration: "none" }}>https://doi.org/10.1609/icwsm.v10i1.14821</a></li>
        </ul>
      </div>
    </div>
  );
}
