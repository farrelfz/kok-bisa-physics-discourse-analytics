import { useEffect, useState } from "react";
import { api } from "../api.js";
import { LABEL_COLORS, CANONICAL_LABELS } from "../constants.js";
import { LabelBadge, SectionHeader } from "../components.jsx";
import { AlertTriangle, Filter, Search, Sliders } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 12, boxShadow: "var(--shadow-md)" }}>
      <div><strong>Confidence:</strong> {(d?.x * 100).toFixed(1)}%</div>
      <div><strong>Margin:</strong> {(d?.y * 100).toFixed(1)}%</div>
      {d?.label && (
        <div style={{ marginTop: 4 }}>
          <LabelBadge label={d.label} size="sm" />
        </div>
      )}
    </div>
  );
};

export default function UncertaintyExplorer({ navigateTo }) {
  const [maxConf,   setMaxConf]   = useState(0.7);
  const [maxMargin, setMaxMargin] = useState(0.3);
  const [data,      setData]      = useState(null);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);

  const fetch = () => {
    setLoading(true);
    api.uncertainty({ max_confidence: maxConf, max_margin: maxMargin, page, page_size: 25 })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [maxConf, maxMargin, page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Model Uncertainty & Boundary Diagnostics"
        title="Boundary Ambiguity & Error Analysis"
        sub="Identify ambiguous comment predictions where confidence is below the threshold or top-1 vs top-2 classification margin is narrow. Ideal for active learning and model refinement."
      />

      {/* Threshold controls */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)", display: "flex", alignItems: "center", gap: 6 }}>
            <Sliders size={15} style={{ color: "var(--brand)" }} />
            Uncertainty Filter Thresholds
          </div>
          {data && (
            <span className="tag tag-warning" style={{ fontSize: 11.5, fontWeight: 700 }}>
              {data.total?.toLocaleString()} ambiguous comments ({data.total ? (data.total / 202429 * 100).toFixed(1) : 0}% of corpus)
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--text2)", fontWeight: 600 }}>Max Confidence Ceiling</span>
              <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: "var(--brand-dark)" }}>{(maxConf * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" min={0.3} max={0.99} step={0.01}
              value={maxConf}
              onChange={e => { setMaxConf(parseFloat(e.target.value)); setPage(1); }}
              style={{ width: "100%", accentColor: "var(--brand)", cursor: "pointer" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--text2)", fontWeight: 600 }}>Max Margin (Top-1 minus Top-2)</span>
              <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: "#D97706" }}>{(maxMargin * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" min={0.01} max={0.5} step={0.01}
              value={maxMargin}
              onChange={e => { setMaxMargin(parseFloat(e.target.value)); setPage(1); }}
              style={{ width: "100%", accentColor: "#D97706", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* Scatter plot */}
      {data?.scatter_sample?.length > 0 && (
        <div className="card" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div className="card-title" style={{ margin: 0 }}>Confidence vs. Margin Dispersion ({data.scatter_sample.length} sampled points)</div>
              <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>Boundary ambiguity clusters highlighted across discourse acts</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" type="number" domain={[0, 1]} name="Confidence" tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill: "var(--text3)", fontSize: 10 }} label={{ value: "Confidence", position: "insideBottom", offset: -4, fill: "var(--text3)", fontSize: 11 }} />
              <YAxis dataKey="y" type="number" domain={[0, 0.5]} name="Margin" tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill: "var(--text3)", fontSize: 10 }} label={{ value: "Margin", angle: -90, position: "insideLeft", fill: "var(--text3)", fontSize: 11 }} />
              <Tooltip content={<ScatterTooltip />} />
              <ReferenceLine x={maxConf} stroke="#D97706" strokeDasharray="4 4" label={{ value: `Conf ≤ ${(maxConf*100).toFixed(0)}%`, fill: "#D97706", fontSize: 10, position: "top" }} />
              <ReferenceLine y={maxMargin} stroke="#D97706" strokeDasharray="4 4" label={{ value: `Margin ≤ ${(maxMargin*100).toFixed(0)}%`, fill: "#D97706", fontSize: 10, position: "right" }} />
              <Scatter data={data.scatter_sample} opacity={0.7}>
                {data.scatter_sample.map((p, i) => <Cell key={i} fill={p.color || "var(--text3)"} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Label breakdown */}
      {data?.label_breakdown?.length > 0 && (
        <div className="card" style={{ padding: "16px 20px" }}>
          <div className="card-title" style={{ marginBottom: 10 }}>Act Breakdown in Ambiguous Sample</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {data.label_breakdown.map(lb => (
              <div key={lb.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <LabelBadge label={lb.label} size="sm" />
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "JetBrains Mono", color: "var(--text1)" }}>
                  {lb.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text1)" }}>Ambiguous Candidate Comments for Adjudication</span>
          <span style={{ fontSize: 11.5, color: "var(--text3)" }}>Page {page} of {data?.total_pages || 1}</span>
        </div>

        <div className="data-table-wrap" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "160px" }}>Source Video</th>
                <th>Comment Text</th>
                <th style={{ width: "130px" }}>Predicted Act</th>
                <th style={{ width: "105px", textAlign: "right" }}>Confidence</th>
                <th style={{ width: "95px", textAlign: "right" }}>Margin</th>
                <th style={{ width: "80px", textAlign: "right" }}>Likes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40 }}><div className="spinner" /></td></tr>
              ) : (data?.comments || []).map(c => (
                <tr key={c.comment_id}>
                  <td style={{ maxWidth: 160, fontSize: 11 }}>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "var(--brand-dark)", cursor: "pointer", fontSize: 11.5, textAlign: "left", padding: 0, fontWeight: 600 }}
                      onClick={() => navigateTo && navigateTo("videos", { videoId: c.video_id })}
                    >
                      {c.video_title?.slice(0, 32)}{c.video_title?.length > 32 ? "…" : ""}
                    </button>
                  </td>
                  <td className="text-cell">{c.text}</td>
                  <td><LabelBadge label={c.predicted_label} size="sm" /></td>
                  <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#D97706", fontWeight: 700, fontFamily: "JetBrains Mono", fontSize: 12 }}>
                      {(c.confidence*100).toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                    {(c.margin*100).toFixed(1)}%
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                    {c.like_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.total_pages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>Showing page {page} of {data.total_pages}</span>
            <div className="pagination" style={{ margin: 0 }}>
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹ Prev</button>
              <button className="page-btn" onClick={() => setPage(p => Math.min(data.total_pages, p+1))} disabled={page === data.total_pages}>Next ›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
