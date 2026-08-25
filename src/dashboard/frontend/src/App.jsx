import { useState, useCallback, useMemo } from "react";
import {
  LayoutDashboard, Video, BarChart3,
  BrainCircuit, BookOpen, Search, Menu, ChevronRight,
  Info, Activity, X, Sparkles, Terminal, Compass, Globe,
  AlertTriangle, Layers, ShieldCheck, Filter
} from "lucide-react";

import Overview           from "./pages/Overview.jsx";
import DiscourseExplorer  from "./pages/DiscourseExplorer.jsx";
import VideoExplorer      from "./pages/VideoExplorer.jsx";
import Embeddings         from "./pages/Embeddings.jsx";
import Language           from "./pages/Language.jsx";
import CommentExplorer    from "./pages/CommentExplorer.jsx";
import ConfidenceAnalysis from "./pages/ConfidenceAnalysis.jsx";
import UncertaintyExplorer from "./pages/UncertaintyExplorer.jsx";
import Playground         from "./pages/Playground.jsx";
import ModelPerformance   from "./pages/ModelPerformance.jsx";
import Pipeline           from "./pages/Pipeline.jsx";
import Methodology         from "./pages/Methodology.jsx";
import ColabGuide          from "./pages/ColabGuide.jsx";
import AboutResearch       from "./pages/AboutResearch.jsx";

const NAV = [
  // ── Analytics & Exploration ──
  { id: "overview",    label: "Overview",           icon: LayoutDashboard, section: "Analytics",       badge: "KPIs" },
  { id: "discourse",   label: "Discourse Analysis", icon: BarChart3,       section: "Analytics",       badge: "8 Acts" },
  { id: "videos",      label: "Video Analysis",     icon: Video,           section: "Analytics",       badge: "35 Vids" },
  { id: "embeddings",  label: "Semantic Space (2D)",icon: Compass,         section: "Analytics",       badge: "PCA" },
  { id: "language",    label: "Language Map",       icon: Globe,           section: "Analytics",       badge: "41 Lang" },

  // ── Corpus & Diagnostics ──
  { id: "comments",    label: "Comment Explorer",   icon: Search,          section: "Corpus & Data",   badge: "202k" },
  { id: "confidence",  label: "Confidence Explorer",icon: Activity,        section: "Corpus & Data",   badge: "Certainty" },
  { id: "uncertainty", label: "Boundary Ambiguity", icon: AlertTriangle,   section: "Corpus & Data",   badge: "Review" },

  // ── Interactive Lab ──
  { id: "playground",  label: "Live Playground",    icon: Sparkles,        section: "Interactive Lab", badge: "Inference" },

  // ── Research & Engine ──
  { id: "model",       label: "Model Performance",  icon: BrainCircuit,    section: "Research & Engine", badge: "97.4% F1" },
  { id: "pipeline",    label: "Pipeline Stages",    icon: Layers,          section: "Research & Engine", badge: "9 Steps" },
  { id: "methodology", label: "Methodology",        icon: BookOpen,        section: "Research & Engine", badge: "Codebook" },
  { id: "colab",       label: "Colab Reproduction", icon: Terminal,        section: "Research & Engine", badge: "GPU" },
  { id: "about",       label: "About & Copyright",  icon: Info,            section: "Research & Engine", badge: "Credits" },
];

const PAGES = {
  overview:    Overview,
  discourse:   DiscourseExplorer,
  videos:      VideoExplorer,
  embeddings:  Embeddings,
  language:    Language,
  comments:    CommentExplorer,
  confidence:  ConfidenceAnalysis,
  uncertainty: UncertaintyExplorer,
  playground:  Playground,
  model:       ModelPerformance,
  pipeline:    Pipeline,
  methodology: Methodology,
  colab:       ColabGuide,
  about:       AboutResearch,
};

const PAGE_TITLES = {
  overview:    "Research Overview & KPIs",
  discourse:   "Discourse Act Analytics",
  videos:      "Video-Level Discourse Matrix",
  embeddings:  "2D Semantic Space & PCA Projection",
  language:    "Multilingual & Language Distribution",
  comments:    "Full Corpus Comment Search",
  confidence:  "Model Confidence & Certainty",
  uncertainty: "Boundary Ambiguity & Error Analysis",
  playground:  "Live Inference Playground",
  model:       "Model Performance & Benchmarks",
  pipeline:    "Pipeline Architecture & Workflow",
  methodology: "Scientific Methodology & Codebook",
  colab:       "Google Colab GPU Reproduction",
  about:       "About Research & Copyright",
};

export default function App() {
  const [page, setPage]           = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [navVideo, setNavVideo]   = useState(null);
  const [navSearch, setNavSearch] = useState("");

  const navigateTo = useCallback((pageId, extra = {}) => {
    if (PAGES[pageId]) {
      setPage(pageId);
    }
    if (extra.videoId) setNavVideo(extra.videoId);
  }, []);

  const sections = useMemo(() => [...new Set(NAV.map(n => n.section))], []);

  const filteredNav = useMemo(() => {
    if (!navSearch.trim()) return NAV;
    const q = navSearch.toLowerCase();
    return NAV.filter(n =>
      n.label.toLowerCase().includes(q) ||
      n.section.toLowerCase().includes(q) ||
      (n.badge && n.badge.toLowerCase().includes(q))
    );
  }, [navSearch]);

  const activeSections = useMemo(() => [...new Set(filteredNav.map(n => n.section))], [filteredNav]);

  const PageComponent = PAGES[page] || Overview;

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            KB
          </div>
          {!collapsed && (
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">KOK BISA?</div>
              <div className="sidebar-brand-sub">Discourse Analytics</div>
            </div>
          )}
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setCollapsed(true)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", display: "none" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Nav Search (when expanded) */}
        {!collapsed && (
          <div style={{ padding: "10px 12px 4px 12px" }}>
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              padding: "4px 8px",
            }}>
              <Search size={13} style={{ color: "var(--text3)", marginRight: 6, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Jump to page..."
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 11.5,
                  color: "var(--text1)",
                  width: "100%",
                }}
              />
              {navSearch && (
                <button
                  onClick={() => setNavSearch("")}
                  style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: 0 }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {activeSections.map(sec => (
            <div key={sec} style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 6 }}>
              {!collapsed && (
                <div className="nav-section-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{sec}</span>
                  <span style={{ fontSize: 9.5, opacity: 0.6, fontWeight: 500 }}>
                    {filteredNav.filter(n => n.section === sec).length}
                  </span>
                </div>
              )}
              {filteredNav.filter(n => n.section === sec).map(n => {
                const Icon = n.icon;
                const isActive = page === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setPage(n.id);
                    }}
                    title={collapsed ? n.label : ""}
                    style={{ justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                      <Icon className="nav-item-icon" size={15} />
                      {!collapsed && <span className="nav-item-label">{n.label}</span>}
                    </div>
                    {!collapsed && n.badge && (
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "JetBrains Mono",
                          fontWeight: 600,
                          padding: "1px 5px",
                          borderRadius: 4,
                          background: isActive ? "var(--brand-100)" : "var(--bg-subtle)",
                          color: isActive ? "var(--brand-dark)" : "var(--text3)",
                          border: `1px solid ${isActive ? "var(--brand-200)" : "var(--border)"}`,
                          flexShrink: 0,
                        }}
                      >
                        {n.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Sidebar Footer & Copyright ── */}
        {!collapsed && (
          <div className="sidebar-footer" style={{ borderTop: "1px solid var(--border)", padding: "12px 14px" }}>
            <div className="footer-brand" style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text1)", marginBottom: 2 }}>
              KOK BISA? · Physics Analytics
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.4 }}>
              © 2026 IPDC Research Team
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text4)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
              MIT Open Research License
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Area ── */}
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => setCollapsed(c => !c)}
            style={{ padding: "6px" }}
            title="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={15} /> : <Menu size={15} />}
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600 }}>Research Portal</span>
            <span style={{ fontSize: 13, color: "var(--text4)" }}>/</span>
            <span className="topbar-title" style={{ fontSize: 14.5, fontWeight: 700 }}>
              {PAGE_TITLES[page] || page}
            </span>
          </div>

          <div className="topbar-right" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="topbar-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--surface3)",
                color: "var(--text2)",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
              202,429 Comments · 35 Public Videos
            </span>

            <span
              style={{
                fontSize: 11,
                fontFamily: "JetBrains Mono",
                color: "var(--brand-dark)",
                background: "var(--brand-50)",
                border: "1px solid var(--brand-200)",
                padding: "3px 8px",
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              IndoBERT 97.40% F1
            </span>
          </div>
        </div>

        {/* Page Content View */}
        <div className="page-content">
          <PageComponent
            navigateTo={navigateTo}
            initialVideoId={navVideo}
          />
        </div>

        {/* ── Persistent Bottom Footer Strip & Copyright ── */}
        <div style={{
          padding: "8px 24px",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          gap: 20,
          fontSize: 11,
          color: "var(--text3)",
          flexShrink: 0,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <span style={{ fontWeight: 600, color: "var(--text2)" }}>
            © 2026 Indonesian Public Discourse Corpus (IPDC) Project
          </span>
          <span>·</span>
          <span>Deep Learning Indonesian Physics Discourse Analysis</span>
          <span>·</span>
          <span>202,429+ Verified YouTube Comments</span>
          <span>·</span>
          <span>8 Canonical Discourse Categories</span>
          <span style={{ marginLeft: "auto", color: "var(--text3)", fontFamily: "JetBrains Mono" }}>
            indobenchmark/indobert-base-p1 (Macro F1: 97.40%)
          </span>
        </div>
      </div>
    </div>
  );
}
