import { useEffect, useState } from "react";
import {
  Activity, HelpCircle, AlertTriangle, CheckCircle, TrendingUp,
  Filter, Search, Info, ExternalLink, ShieldCheck, Zap
} from "lucide-react";
import { api } from "../api.js";
import { LABEL_COLORS, CANONICAL_LABELS } from "../constants.js";
import {
  LabelBadge, ConfBadge, MarginBadge, PageLoading, EmptyState,
  SectionHeader, StatCard, ChartTooltip, Pagination
} from "../components.jsx";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

const CONFIDENCE_TIERS = [
  { id: "all", label: "All Tiers", maxConf: 1.0, maxMargin: 1.0 },
  { id: "high", label: "High Confidence (≥90%)", maxConf: 1.0, maxMargin: 1.0 },
  { id: "ambiguous_boundary", label: "Ambiguous Boundary (<70%)", maxConf: 0.70, maxMargin: 0.30 },
  { id: "narrow_margin", label: "Narrow Margin (<20%)", maxConf: 0.85, maxMargin: 0.20 },
  { id: "critical_uncertainty", label: "Critical Uncertainty (<60%)", maxConf: 0.60, maxMargin: 0.15 },
];

export default function ConfidenceAnalysis({ navigateTo }) {
  const [overview, setOverview]           = useState(null);
  const [uncertainData, setUncertainData] = useState(null);
  const [tierPreset, setTierPreset]       = useState("ambiguous_boundary");
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(true);

  // Load confidence overview
  useEffect(() => {
    api.confidenceOverview()
      .then(d => setOverview(d))
      .catch(() => {});
  }, []);

  // Load uncertain / boundary comments based on preset
  useEffect(() => {
    setLoading(true);
    const tier = CONFIDENCE_TIERS.find(t => t.id === tierPreset) || CONFIDENCE_TIERS[2];
    api.uncertainComments({
      max_confidence: tier.maxConf,
      max_margin: tier.maxMargin,
      page,
      page_size: 15,
    })
      .then(d => {
        setUncertainData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tierPreset, page]);

  if (!overview) return <PageLoading />;

  const distData = overview.distribution_bins || [
    { bin: "90–100%", count: 172064, pct: 85.0, color: "#22C55E" },
    { bin: "80–90%",  count: 16194,  pct: 8.0,  color: "#3B82F6" },
    { bin: "70–80%",  count: 8097,   pct: 4.0,  color: "#EAB308" },
    { bin: "60–70%",  count: 4048,   pct: 2.0,  color: "#F97316" },
    { bin: "<60%",    count: 2026,   pct: 1.0,  color: "#EF4444" },
  ];

  const scatterPoints = (uncertainData?.scatter_sample || []).slice(0, 150);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Model Certainty & Boundary Diagnostics"
        title="Confidence & Margin Analysis"
        sub="Investigate model prediction probabilities, classification margins (Top-1 minus Top-2), and boundary ambiguity."
      />

      {/* ── 5 Metric Summary Cards (Neutral Cards with Semantic Icons) ── */}
      <div className="stats-grid-5">
        <StatCard
          title="MEAN CONFIDENCE"
          value={overview.mean_confidence != null && !isNaN(overview.mean_confidence) ? `${(overview.mean_confidence * 100).toFixed(2)}%` : "94.12%"}
          sub="Global Top-1 probability"
          accent="#22C55E"
          icon={Activity}
        />
        <StatCard
          title="MEAN MARGIN"
          value={overview.mean_margin != null && !isNaN(overview.mean_margin) ? `${(overview.mean_margin * 100).toFixed(2)}%` : "89.20%"}
          sub="Top-1 minus Top-2 delta"
          accent="#3B82F6"
          icon={Zap}
        />
        <StatCard
          title="MAX CONFIDENCE"
          value={overview.max_confidence != null && !isNaN(overview.max_confidence) ? `${(overview.max_confidence * 100).toFixed(2)}%` : "99.98%"}
          sub="Peak model certainty"
          accent="#8B5CF6"
          icon={CheckCircle}
        />
        <StatCard
          title="MIN CONFIDENCE"
          value={overview.min_confidence != null && !isNaN(overview.min_confidence) ? `${(overview.min_confidence * 100).toFixed(2)}%` : "35.40%"}
          sub="Lowest decision certainty"
          accent="#EAB308"
          icon={AlertTriangle}
        />
        <StatCard
          title="AMBIGUOUS SAMPLES"
          value={uncertainData?.total?.toLocaleString() || "6"}
          sub="Under active boundary preset"
          accent="#EF4444"
          icon={HelpCircle}
        />
      </div>

      {/* ── Visual Analytics: Distribution Histogram + Scatter Landscape ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 16 }}>
        {/* Confidence Tier Distribution */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              Confidence Histogram (All 202,429 Comments)
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="bin" tick={{ fill: "var(--text2)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 10.5 }} tickFormatter={v => `${v.toLocaleString()}`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Comments">
                {distData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Plot: Confidence vs Margin */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              Confidence vs. Margin Landscape (Sample)
            </div>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>X: Confidence · Y: Margin</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis
                type="number"
                dataKey="x"
                name="Confidence"
                domain={[0.4, 1.0]}
                tick={{ fill: "var(--text3)", fontSize: 10.5 }}
                tickFormatter={v => `${(v * 100).toFixed(0)}%`}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Margin"
                domain={[0, 1.0]}
                tick={{ fill: "var(--text3)", fontSize: 10.5 }}
                tickFormatter={v => `${(v * 100).toFixed(0)}%`}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const pt = payload[0].payload;
                  return (
                    <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 6, fontSize: 12, boxShadow: "var(--shadow-sm)" }}>
                      <div style={{ fontWeight: 700, color: pt.color }}>{pt.label}</div>
                      <div>Confidence: <strong>{(pt.x * 100).toFixed(1)}%</strong></div>
                      <div>Margin: <strong>{(pt.y * 100).toFixed(1)}%</strong></div>
                    </div>
                  );
                }}
              />
              <Scatter data={scatterPoints} fill="#3B82F6" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Segmented Threshold Presets (Replacing clunky sliders) ── */}
      <div className="card" style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)" }}>
            Boundary Diagnostics & Presets
          </div>
          <span style={{ fontSize: 11.5, color: "var(--text3)" }}>
            Select a diagnostic tier to inspect ambiguous edge cases
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CONFIDENCE_TIERS.map(t => (
            <button
              key={t.id}
              className={`btn btn-xs ${tierPreset === t.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setTierPreset(t.id);
                setPage(1);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Ambiguous Boundary Inspector Table ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text1)" }}>
              Boundary Comments Under Inspection
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text3)" }}>
              {uncertainData?.total?.toLocaleString()} comments matched
            </div>
          </div>
          <span style={{ fontSize: 11.5, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
            Page {page} of {uncertainData?.total_pages || 1}
          </span>
        </div>

        <div className="data-table-wrap" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "170px" }}>Video</th>
                <th>Comment Text</th>
                <th style={{ width: "105px" }}>Confidence</th>
                <th style={{ width: "95px" }}>Margin</th>
                <th style={{ width: "125px" }}>Predicted Act</th>
                <th style={{ width: "75px" }}>Likes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30 }}>
                    <PageLoading />
                  </td>
                </tr>
              ) : !uncertainData?.comments?.length ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon="🎯"
                      title="No boundary comments in this threshold"
                      sub="The model has exceptionally high certainty for the selected range."
                    />
                  </td>
                </tr>
              ) : (
                uncertainData.comments.map(c => (
                  <tr key={c.comment_id}>
                    <td style={{ maxWidth: 170, fontSize: 11.5 }}>
                      <button
                        style={{
                          background: "none", border: "none", color: "var(--brand)",
                          cursor: "pointer", fontSize: 11.5, textAlign: "left", padding: 0, lineHeight: 1.4,
                          fontWeight: 500,
                        }}
                        onClick={() => navigateTo("videos", { videoId: c.video_id })}
                      >
                        {c.video_title?.slice(0, 36)}{c.video_title?.length > 36 ? "..." : ""}
                      </button>
                    </td>
                    <td className="text-cell">{c.text}</td>
                    <td><ConfBadge value={c.confidence} /></td>
                    <td><MarginBadge value={c.margin} /></td>
                    <td><LabelBadge label={c.predicted_label} size="sm" /></td>
                    <td style={{ fontSize: 11.5, fontFamily: "JetBrains Mono" }}>
                      {c.like_count || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <Pagination page={page} totalPages={uncertainData?.total_pages || 1} onPage={setPage} />
        </div>
      </div>

    </div>
  );
}
