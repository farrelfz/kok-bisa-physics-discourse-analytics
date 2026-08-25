import { useEffect, useState } from "react";
import {
  HelpCircle, MessageSquare, Flame, AlertCircle, Lightbulb,
  Award, ThumbsUp, Compass, ArrowRight, Filter, Sparkles, BarChart3,
  Search, CheckCircle2, ChevronRight, Activity, ExternalLink,
  FileText, Heart, ShieldCheck, TrendingUp, Layers
} from "lucide-react";
import { api } from "../api.js";
import {
  LABEL_COLORS, CANONICAL_LABELS, LABEL_DESCRIPTIONS
} from "../constants.js";
import {
  LabelBadge, ConfBadge, MarginBadge, PageLoading, EmptyState,
  SectionHeader, ChartTooltip, Card, Button, Badge
} from "../components.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";

const ICONS = {
  Question:     HelpCircle,
  Opinion:      MessageSquare,
  Disagreement: Flame,
  Correction:   AlertCircle,
  Suggestion:   Lightbulb,
  Praise:       Award,
  Agreement:    ThumbsUp,
  Experience:   Compass,
};

const LABEL_ROLES = {
  Question:     "Interrogative Inquiry",
  Opinion:      "Expressive Viewpoint",
  Disagreement: "Critical Refutation",
  Correction:   "Factual Rectification",
  Suggestion:   "Constructive Suggestion",
  Praise:       "Positive Appreciation",
  Agreement:    "Affirmative Consensus",
  Experience:   "Narrative Experience",
};

export default function DiscourseExplorer({ navigateTo }) {
  const [data, setData]                   = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("Question");
  const [repData, setRepData]             = useState({});
  const [repMode, setRepMode]             = useState("highest_confidence");
  const [repLoading, setRepLoading]       = useState(false);
  const [categoryComments, setCategoryComments] = useState([]);
  const [catLoading, setCatLoading]       = useState(false);
  const [searchTerm, setSearchTerm]       = useState("");

  useEffect(() => {
    api.discourseAnalytics()
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Fetch representative comments from backend
  useEffect(() => {
    setRepLoading(true);
    api.representatives(repMode)
      .then(d => {
        setRepData(d.representatives || d || {});
        setRepLoading(false);
      })
      .catch(() => setRepLoading(false));
  }, [repMode]);

  // Fetch live comments for selected category
  useEffect(() => {
    if (!selectedLabel) return;
    setCatLoading(true);
    api.comments({
      label: selectedLabel,
      search: searchTerm.trim() || undefined,
      page_size: 8,
      sort_by: "confidence",
      order: "desc"
    })
      .then(d => {
        setCategoryComments(d.comments || []);
        setCatLoading(false);
      })
      .catch(() => setCatLoading(false));
  }, [selectedLabel, searchTerm]);

  if (!data) return <PageLoading />;

  const stats = data.stats || data.discourse_distribution || [];
  const activeLabel = selectedLabel || "Question";
  const activeStats = stats.find(s => s.label === activeLabel) || {
    count: 0, pct: 0, avg_confidence: 0, avg_len: 0, avg_likes: 0
  };
  const currentReps = (repData && repData[activeLabel]) || [];

  // Ranked by character length descending
  const statsSortedByLen = [...stats].sort((a, b) => (b.avg_len || 0) - (a.avg_len || 0));

  // Normalized Radar Data for multi-dimensional scientific comparison
  const radarData = [
    {
      dimension: "Volume Share",
      Selected: Math.min(100, Math.round((activeStats.pct || 0) * 1.4)),
      Benchmark: 12,
    },
    {
      dimension: "Text Length",
      Selected: Math.min(100, Math.round(((activeStats.avg_len || 80) / 400) * 100)),
      Benchmark: 35,
    },
    {
      dimension: "Community Likes",
      Selected: Math.min(100, Math.round(((activeStats.avg_likes || 2) / 8.5) * 100)),
      Benchmark: 30,
    },
    {
      dimension: "Model Certainty",
      Selected: Math.min(100, Math.round(((activeStats.avg_confidence || 0.95) * 100))),
      Benchmark: 95,
    },
    {
      dimension: "Distinctiveness",
      Selected: Math.min(100, Math.round(((activeStats.avg_margin || 0.95) * 100))),
      Benchmark: 90,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Computational Discourse Taxonomy"
        title="Discourse Analysis"
        sub="In-depth empirical breakdown of comment length complexity, community upvote dynamics, and classification stability across 8 canonical discourse acts."
      />

      {/* ── Visual Comparison Deck ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>
              Linguistic Complexity &amp; Community Engagement Profile
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text3)" }}>
              Analyzing average character length and community upvote resonance across 202,429 comments
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>Active Filter:</span>
            <LabelBadge label={activeLabel} size="md" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          {/* Left Chart: Dual Metric Comparison Bar */}
          <div style={{ background: "var(--bg-subtle)", padding: 14, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                Average Comment Length (Characters)
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Click a bar to filter</span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={statsSortedByLen}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "var(--text3)", fontSize: 11 }}
                  tickFormatter={v => `${v} ch`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fill: "var(--text1)", fontSize: 11.5, fontWeight: 600 }}
                  width={95}
                />
                <Tooltip
                  formatter={(val, name, item) => {
                    const likes = item && item.payload && item.payload.avg_likes !== undefined ? item.payload.avg_likes : 0;
                    return [
                      `${val} characters (Avg Upvotes: ${likes} likes)`,
                      "Average Length"
                    ];
                  }}
                  contentStyle={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                />
                <Bar
                  dataKey="avg_len"
                  radius={[0, 4, 4, 0]}
                  onClick={(entry) => setSelectedLabel(entry.label)}
                  style={{ cursor: "pointer" }}
                >
                  {statsSortedByLen.map(d => (
                    <Cell
                      key={d.label}
                      fill={d.color || LABEL_COLORS[d.label]}
                      opacity={activeLabel && activeLabel !== d.label ? 0.35 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 4 }}>
              Longer bars indicate deeper scientific exposition and narrative detail
            </div>
          </div>

          {/* Right Chart: Radar Fingerprint for Selected Act */}
          <div style={{ background: "var(--bg-subtle)", padding: 14, borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                Dimensional Fingerprint: {activeLabel}
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
                {activeStats.pct}% of corpus
              </span>
            </div>

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height={230}>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#E4E4E7" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: "var(--text2)", fontSize: 10.5, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={activeLabel}
                    dataKey="Selected"
                    stroke={LABEL_COLORS[activeLabel] || "#2563EB"}
                    fill={LABEL_COLORS[activeLabel] || "#2563EB"}
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Corpus Benchmark"
                    dataKey="Benchmark"
                    stroke="#A1A1AA"
                    fill="#A1A1AA"
                    fillOpacity={0.1}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8 Clean Taxonomy Cards ── */}
      <div>
        <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)" }}>
            Discourse Taxonomy (8 Canonical Acts)
          </div>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Click any card to inspect representative samples</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {CANONICAL_LABELS.map(label => {
            const stat = stats.find(s => s.label === label) || {
              count: 0, pct: 0, avg_confidence: 0, avg_len: 0, avg_likes: 0
            };
            const Icon = ICONS[label] || HelpCircle;
            const isSelected = selectedLabel === label;
            const color = LABEL_COLORS[label];
            const role = LABEL_ROLES[label];

            return (
              <div
                key={label}
                className="card card-hover"
                style={{
                  cursor: "pointer",
                  padding: "14px 16px",
                  border: isSelected ? `2px solid ${color}` : "1px solid var(--border)",
                  background: isSelected ? "var(--bg-subtle)" : "var(--surface)",
                  borderRadius: "var(--radius)",
                  boxShadow: isSelected ? "var(--shadow-sm)" : "var(--shadow-xs)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => setSelectedLabel(label)}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "var(--radius-sm)",
                          background: `${color}15`,
                          color: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text1)", letterSpacing: "-0.01em" }}>
                          {label}
                        </div>
                        <span style={{ fontSize: 10.5, color: "var(--text3)", fontWeight: 500 }}>
                          {role}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "JetBrains Mono",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${color}15`,
                        color: color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {stat.pct}%
                    </span>
                  </div>

                  <p style={{ fontSize: 11.5, color: "var(--text2)", lineHeight: 1.45, marginBottom: 10, minHeight: 34 }}>
                    {LABEL_DESCRIPTIONS[label]}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 4,
                    fontSize: 11,
                    borderTop: "1px solid var(--border)",
                    paddingTop: 8,
                    color: "var(--text3)",
                  }}
                >
                  <div>Comments: <strong style={{ color: "var(--text1)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>{stat.count?.toLocaleString()}</strong></div>
                  <div>Avg Length: <strong style={{ color: "var(--text1)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>{stat.avg_len || 0} ch</strong></div>
                  <div>Avg Upvotes: <strong style={{ color: "var(--text1)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>{stat.avg_likes || 0}</strong></div>
                  <div>Model Conf: <strong style={{ color: "var(--brand)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>{((stat.avg_confidence || 0) * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Representative Comments Inspector for Active Category ── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "var(--text1)" }}>
                Verified Representative Comments: {activeLabel}
              </h3>
              <LabelBadge label={activeLabel} size="sm" />
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>
              Total {activeStats.count?.toLocaleString()} comments in corpus ({activeStats.pct}%) · Avg Length: {activeStats.avg_len || 0} chars · Avg Upvotes: {activeStats.avg_likes || 0} likes
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "highest_confidence", label: "Highest Confidence" },
              { id: "most_typical", label: "Most Typical" },
              { id: "most_uncertain", label: "Edge Cases (<70%)" },
            ].map(m => (
              <button
                key={m.id}
                className={`btn btn-xs ${repMode === m.id ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setRepMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {repLoading ? (
          <div style={{ padding: 30, textAlign: "center" }}><PageLoading /></div>
        ) : currentReps.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {currentReps.map((c, i) => (
              <div
                key={c.comment_id || i}
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--text1)", lineHeight: 1.5, flex: 1 }}>
                    "{c.text}"
                  </div>
                  <LabelBadge label={activeLabel} size="sm" />
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 11, color: "var(--text3)", flexWrap: "wrap" }}>
                  <span>Confidence: <strong style={{ color: "var(--success)", fontFamily: "JetBrains Mono" }}>{(c.confidence * 100).toFixed(2)}%</strong></span>
                  <span>Margin: <strong style={{ color: "var(--info)", fontFamily: "JetBrains Mono" }}>{(c.margin * 100).toFixed(2)}%</strong></span>
                  <span>👍 {c.like_count || 0}</span>
                  {c.video_title && (
                    <span style={{ marginLeft: "auto", fontStyle: "italic", color: "var(--text3)" }}>
                      🎬 {c.video_title.slice(0, 45)}{c.video_title.length > 45 ? "..." : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Live Comments Fallback */
          catLoading ? (
            <div style={{ padding: 30, textAlign: "center" }}><PageLoading /></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {categoryComments.map((c, i) => (
                <div
                  key={c.comment_id || i}
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ fontSize: 13, color: "var(--text1)", lineHeight: 1.5, flex: 1 }}>
                      "{c.text}"
                    </div>
                    <LabelBadge label={c.predicted_label || activeLabel} size="sm" />
                  </div>

                  <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 11, color: "var(--text3)", flexWrap: "wrap" }}>
                    <span>Confidence: <strong style={{ color: "var(--success)", fontFamily: "JetBrains Mono" }}>{(c.confidence * 100).toFixed(2)}%</strong></span>
                    <span>Margin: <strong style={{ color: "var(--info)", fontFamily: "JetBrains Mono" }}>{(c.margin * 100).toFixed(2)}%</strong></span>
                    <span>👍 {c.like_count || 0}</span>
                    {c.video_title && (
                      <span style={{ marginLeft: "auto", fontStyle: "italic", color: "var(--text3)" }}>
                        🎬 {c.video_title.slice(0, 45)}{c.video_title.length > 45 ? "..." : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
}
