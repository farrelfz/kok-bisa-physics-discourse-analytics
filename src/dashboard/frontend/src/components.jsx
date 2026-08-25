/**
 * Shared reusable UI components for KOK BISA? Discourse Analytics.
 * Strict shadcn/ui × Research-Grade Visual System.
 */
import React from "react";
import { X, ExternalLink, Play, Sparkles, Check, ChevronRight } from "lucide-react";
import { LABEL_COLORS, CANONICAL_LABELS, LABEL_DESCRIPTIONS, LABEL_IDS } from "./constants.js";

// ── High-Contrast Label Styles ──────────────────────────────────────
const LABEL_TEXT_COLORS = {
  Question:     "#1D4ED8", // Blue-700
  Opinion:      "#6D28D9", // Violet-700
  Disagreement: "#B91C1C", // Red-700
  Correction:   "#C2410C", // Orange-700
  Suggestion:   "#0F766E", // Teal-700
  Praise:       "#A16207", // Yellow-700
  Agreement:    "#15803D", // Green-700
  Experience:   "#BE185D", // Pink-700
};

const LABEL_BG_COLORS = {
  Question:     "#EFF6FF",
  Opinion:      "#F5F3FF",
  Disagreement: "#FEF2F2",
  Correction:   "#FFF7ED",
  Suggestion:   "#F0FDFA",
  Praise:       "#FEFCE8",
  Agreement:    "#F0FDF4",
  Experience:   "#FDF2F8",
};

// ── Card Primitives (shadcn style) ──────────────────────────────────
export function Card({ className = "", children, style, onClick, hover = false }) {
  return (
    <div
      className={`card ${hover ? "card-hover" : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, style }) {
  return <div className={`card-header ${className}`} style={{ marginBottom: 12, ...style }}>{children}</div>;
}

export function CardTitle({ className = "", children, style }) {
  return <div className={`card-title-lg ${className}`} style={style}>{children}</div>;
}

export function CardDescription({ className = "", children, style }) {
  return <div className={`card-sub ${className}`} style={style}>{children}</div>;
}

export function CardContent({ className = "", children, style }) {
  return <div className={`card-content ${className}`} style={style}>{children}</div>;
}

// ── Button (shadcn style) ───────────────────────────────────────────
export function Button({
  children,
  variant = "default", // default | secondary | outline | ghost | brand
  size = "default",    // sm | default | lg
  className = "",
  disabled = false,
  onClick,
  style,
  title,
}) {
  const vClass =
    variant === "brand"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-primary";

  const sClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      className={`btn ${vClass} ${sClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
      title={title}
    >
      {children}
    </button>
  );
}

// ── Badge (shadcn style) ────────────────────────────────────────────
export function Badge({ children, variant = "default", className = "", style }) {
  return (
    <span className={`tag ${variant === "brand" ? "tag-brand" : ""} ${className}`} style={style}>
      {children}
    </span>
  );
}

// ── LabelBadge (8 Canonical Discourse Acts) ─────────────────────────
export function LabelBadge({ label, size = "md", showId = false }) {
  const dotColor = LABEL_COLORS[label] || "#71717A";
  const textColor = LABEL_TEXT_COLORS[label] || "#09090B";
  const bg = LABEL_BG_COLORS[label] || "#F4F4F5";
  const fontSize = size === "sm" ? 11 : size === "lg" ? 13 : 11.5;

  return (
    <span
      className="label-badge"
      style={{
        background: bg,
        color: textColor,
        fontSize,
        border: `1px solid ${dotColor}35`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: size === "sm" ? "2px 7px" : "3px 8px",
        borderRadius: "var(--radius-xs)",
        fontWeight: 600,
        fontFamily: "Geist, Inter, sans-serif",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dotColor,
          display: "inline-block",
        }}
      />
      {showId && LABEL_IDS[label] !== undefined && (
        <span style={{ opacity: 0.6, fontSize: 10, fontFamily: "JetBrains Mono" }}>
          [{LABEL_IDS[label]}]
        </span>
      )}
      {label}
    </span>
  );
}

// ── ConfBadge & MarginBadge ─────────────────────────────────────────
export function ConfBadge({ value }) {
  const pct = (value * 100).toFixed(1);
  const isHigh = value >= 0.90;
  const isMed  = value >= 0.70;

  const bg    = isHigh ? "var(--success-bg)" : isMed ? "var(--warning-bg)" : "var(--danger-bg)";
  const color = isHigh ? "var(--success)"    : isMed ? "var(--warning)"    : "var(--danger)";

  return (
    <span
      className="conf-badge"
      style={{
        background: bg,
        color: color,
        border: `1px solid ${color}30`,
        fontFamily: "JetBrains Mono",
        fontWeight: 700,
      }}
    >
      {pct}%
    </span>
  );
}

export function MarginBadge({ value }) {
  const pct = (value * 100).toFixed(1);
  const isHigh = value >= 0.50;
  const isMed  = value >= 0.30;

  const bg    = isHigh ? "var(--info-bg)" : isMed ? "var(--warning-bg)" : "var(--danger-bg)";
  const color = isHigh ? "var(--info)"    : isMed ? "var(--warning)"    : "var(--danger)";

  return (
    <span
      className="conf-badge"
      style={{
        background: bg,
        color: color,
        border: `1px solid ${color}30`,
        fontFamily: "JetBrains Mono",
        fontWeight: 700,
      }}
    >
      {pct}%
    </span>
  );
}

// ── Discourse Distribution Mini-Bar ─────────────────────────────────
export function DiscourseBar({ distribution = {}, total = 0, height = 6 }) {
  const sum = total || Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height,
        borderRadius: 3,
        overflow: "hidden",
        background: "var(--surface4)",
      }}
    >
      {CANONICAL_LABELS.map(label => {
        const count = distribution[label] || 0;
        if (!count) return null;
        const pct = (count / sum) * 100;
        if (pct <= 0) return null;
        const color = LABEL_COLORS[label];

        return (
          <div
            key={label}
            style={{
              width: `${pct}%`,
              background: color,
              transition: "width 0.3s ease",
            }}
            title={`${label}: ${count.toLocaleString()} (${pct.toFixed(1)}%)`}
          />
        );
      })}
    </div>
  );
}

// ── Interactive YouTube Video Modal Player ──────────────────────────
export function VideoPlayerModal({ video, onClose }) {
  if (!video) return null;

  const vid = video.video_id || video.id;
  const title = video.title || "YouTube Video";
  const ytUrl = video.youtube_url || `https://www.youtube.com/watch?v=${vid}`;
  const embedUrl = video.embed_url || `https://www.youtube.com/embed/${vid}?autoplay=1`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(9, 9, 11, 0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: 860,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                background: "#EF4444",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Play size={13} fill="#FFFFFF" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={ytUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none" }}
            >
              <span>YouTube</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{ padding: "5px", borderRadius: 4 }}
              title="Close Player"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video Embed Frame (16:9 AspectRatio) */}
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000000" }}>
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        {/* Video Footer Metadata */}
        {video.discourse_distribution && (
          <div style={{ padding: "14px 18px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11.5 }}>
              <span style={{ fontWeight: 700, color: "var(--text2)" }}>Discourse Act Distribution</span>
              <span style={{ color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
                {(video.total_comments || 0).toLocaleString()} Comments
              </span>
            </div>
            <DiscourseBar distribution={video.discourse_distribution} total={video.total_comments} height={6} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Metric Card (Section 4 Specification: Neutral surface + Semantic icon) ──
export function StatCard({ title, value, sub, accent = "var(--brand)", icon: Icon, badge }) {
  return (
    <div className="metric-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="metric-icon-wrap" style={{ background: `${accent}15`, color: accent }}>
          {Icon && <Icon size={17} />}
        </div>
        {badge && <span className="tag">{badge}</span>}
      </div>

      <div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", margin: 0 }}>
          {title}
        </p>
        <h3 style={{ marginTop: 4, marginBottom: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text1)", fontVariantNumeric: "tabular-nums" }}>
          {value}
        </h3>
        {sub && (
          <p style={{ marginTop: 3, marginBottom: 0, fontSize: 12.5, color: "var(--text3)", fontWeight: 400 }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── SectionHeader ───────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, sub, right }) {
  return (
    <div className="section-header" style={{ marginBottom: 16 }}>
      <div>
        {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
        <div className="section-title">{title}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ── PageLoading & EmptyState ────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const sz = size === "lg" ? 30 : size === "sm" ? 16 : 20;
  return <div className="spinner" style={{ width: sz, height: sz, borderWidth: size === "sm" ? 2 : 2.5 }} />;
}

export function PageLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 12 }}>
      <Spinner size="lg" />
      <span style={{ color: "var(--text2)", fontSize: 13, fontWeight: 500 }}>
        Loading Research Intelligence Corpus…
      </span>
    </div>
  );
}

export function EmptyState({ icon = "📭", title = "No comments found", sub, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}

// ── ChartTooltip ────────────────────────────────────────────────────
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        fontSize: 12,
        boxShadow: "var(--shadow-sm)",
        color: "var(--text1)",
        minWidth: 150,
      }}
    >
      {label && (
        <div style={{ fontWeight: 700, marginBottom: 6, borderBottom: "1px solid var(--border)", paddingBottom: 4, color: "var(--text1)" }}>
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ color: "var(--text2)", marginBottom: 2, display: "flex", gap: 10, justifyContent: "space-between" }}>
          <span>{p.name}:</span>
          <strong style={{ color: p.color || "var(--text1)", fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

// ── Pagination ──────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPage(1)} disabled={page === 1}>« First</button>
      <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹ Prev</button>
      {start > 1 && <span style={{ color: "var(--text3)", fontSize: 12 }}>…</span>}
      {pages.map(p => (
        <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      {end < totalPages && <span style={{ color: "var(--text3)", fontSize: 12 }}>…</span>}
      <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>Next ›</button>
      <button className="page-btn" onClick={() => onPage(totalPages)} disabled={page === totalPages}>Last »</button>
      <span style={{ fontSize: 11.5, color: "var(--text3)", marginLeft: 6, fontWeight: 600, fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
        Page {page} / {totalPages}
      </span>
    </div>
  );
}
