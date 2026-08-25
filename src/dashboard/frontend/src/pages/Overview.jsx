import { useEffect, useState, useRef } from "react";
import {
  MessageSquare, Video, Tag, TrendingUp, BarChart3,
  BrainCircuit, ArrowRight, Zap, Target, Users, Play, ShieldCheck
} from "lucide-react";
import { api } from "../api.js";
import { LABEL_COLORS, CANONICAL_LABELS, EXPERIMENTS } from "../constants.js";
import {
  LabelBadge, PageLoading, EmptyState, ChartTooltip, Card, Button, StatCard
} from "../components.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

// ── Generate insights from actual data ───────────────────────────
function generateInsights(data) {
  if (!data) return [];
  const dist = data.discourse_distribution || [];
  const top = dist[0];
  const last = dist[dist.length - 1];

  const insights = [];

  if (top) {
    insights.push({
      icon: "📊",
      text: `Dominant discourse category is <strong>${top.label}</strong> with <span class="insight-metric">${top.pct}%</span> (${top.count.toLocaleString()} comments) of the corpus.`,
    });
  }

  if (last) {
    insights.push({
      icon: "🔬",
      text: `<strong>${last.label}</strong> is the most focused discourse act with <span class="insight-metric">${last.count.toLocaleString()} comments</span> (${last.pct}%), highlighting specialized interactions.`,
    });
  }

  if (data.mean_confidence) {
    const pct = (data.mean_confidence * 100).toFixed(1);
    insights.push({
      icon: "🎯",
      text: `Mean model confidence across all 202,429 comments is <span class="insight-metric">${pct}%</span>, demonstrating high classification reliability.`,
    });
  }

  const opinion = dist.find(d => d.label === "Opinion");
  const question = dist.find(d => d.label === "Question");
  if (opinion && question) {
    const ratio = (opinion.count / question.count).toFixed(1);
    insights.push({
      icon: "💡",
      text: `For every <strong>1 question</strong> asked, viewers post approximately <span class="insight-metric">${ratio} opinions</span> in physics discussions.`,
    });
  }

  return insights;
}

export default function Overview({ navigateTo }) {
  const [data, setData]               = useState(null);
  const [videoMatrix, setVideoMatrix] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      api.overview(),
      api.videoMatrix(),
    ])
      .then(([ovData, vmData]) => {
        setData(ovData);
        setVideoMatrix((vmData.data || []).slice(0, 15));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (!data)   return (
    <EmptyState icon="⚠️" title="Failed to load overview data" sub="Check backend connection at /api/overview" />
  );

  const dist     = data.discourse_distribution || [];
  const pieData  = dist.map(d => ({ name: d.label, value: d.count, color: d.color }));
  const insights = generateInsights(data);
  const bestExp  = EXPERIMENTS.find(e => e.is_best) || EXPERIMENTS[1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Editorial Research Hero Section ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 24,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Left: Research Headline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--brand)", textTransform: "uppercase", marginBottom: 6 }}>
            KOK BISA? RESEARCH PLATFORM
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text1)", letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 8 }}>
            KOK BISA? PHYSICS<br />
            <span style={{ color: "var(--brand)" }}>DISCOURSE ANALYTICS</span>
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.55, maxWidth: 580 }}>
            Large-scale semantic analysis of <strong>202,429 YouTube comments</strong> using transformer-based discourse classification across 35 educational physics videos.
          </p>
        </div>

        {/* Right: Compact Dataset Summary Panel */}
        <div
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
            DATASET SUMMARY
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text1)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
                202,429
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)" }}>Comments</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--brand)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
                35
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)" }}>Physics Videos</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#8B5CF6", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
                8
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)" }}>Categories</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#22C55E", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
                97.40%
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)" }}>Macro F1</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Standard Research Metric Cards (Section 4 Specification) ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard
          title="TOTAL COMMENTS"
          value="202,429"
          sub="Full corpus analyzed"
          accent="#3B82F6"
          icon={MessageSquare}
        />
        <StatCard
          title="PHYSICS VIDEOS"
          value="35"
          sub="Public accessible videos"
          accent="#14B8A6"
          icon={Video}
        />
        <StatCard
          title="DISCOURSE CATEGORIES"
          value="8"
          sub="Annotated taxonomy"
          accent="#8B5CF6"
          icon={Tag}
        />
        <StatCard
          title="BEST ACCURACY / F1"
          value="97.40%"
          sub="IndoBERT (Acc: 97.73%)"
          accent="#22C55E"
          icon={BrainCircuit}
        />
      </div>

      {/* ── Overview Visualization Grid (Chart 1, Chart 2, Chart 3) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* Chart 2: Horizontal Bar (Dataset Composition) */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Dataset Composition — Horizontal Distribution</div>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>All 202,429 Comments</span>
          </div>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={dist}
              layout="vertical"
              margin={{ left: 10, right: 60, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#71717A", fontSize: 11.5, fontWeight: 500 }}
                tickFormatter={v => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "#09090B", fontSize: 12, fontWeight: 600 }}
                width={105}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Comments">
                {dist.map(d => (
                  <Cell key={d.label} fill={d.color || LABEL_COLORS[d.label]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 1: Donut Chart (Proportional Split) */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-title" style={{ marginBottom: 4 }}>Discourse Category Split (Donut)</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={200} height={150}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={38}
                paddingAngle={2}
              >
                {pieData.map(d => (
                  <Cell key={d.name} fill={d.color || LABEL_COLORS[d.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [v.toLocaleString(), "comments"]}
                contentStyle={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 6 }}
              />
            </PieChart>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
            {dist.slice(0, 5).map(d => (
              <div key={d.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} />
                  <strong style={{ color: "var(--text1)", fontWeight: 600 }}>{d.label}</strong>
                </span>
                <span style={{ fontFamily: "JetBrains Mono", color: "var(--text2)", fontVariantNumeric: "tabular-nums" }}>
                  {d.count?.toLocaleString()} ({d.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Stacked Bar Chart (Discourse Pattern Across Videos) */}
      {videoMatrix.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div className="card-title" style={{ marginBottom: 2 }}>
                Discourse Pattern Across Videos (Sample Top 15)
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)" }}>
                Distribution of Question, Opinion, Disagreement, and other discourse acts per video
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo("videos")}>
              View All 35 Videos <ArrowRight size={12} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={videoMatrix}
              margin={{ top: 10, right: 15, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis
                dataKey="title"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={45}
                tick={{ fill: "var(--text2)", fontSize: 10.5, fontWeight: 500 }}
                tickFormatter={(t) => t.length > 18 ? t.slice(0, 18) + "…" : t}
              />
              <YAxis
                tick={{ fill: "var(--text3)", fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} />
              {CANONICAL_LABELS.map(label => (
                <Bar
                  key={label}
                  dataKey={`${label}_pct`}
                  name={label}
                  stackId="a"
                  fill={LABEL_COLORS[label]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Research Insights ── */}
      {insights.length > 0 && (
        <div className="card">
          <div className="card-title">Empirical Research Insights</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={i} className="insight-card">
                <div className="insight-icon">{ins.icon}</div>
                <div className="insight-text" dangerouslySetInnerHTML={{ __html: ins.text }} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
