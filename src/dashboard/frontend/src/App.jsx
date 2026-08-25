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
  { id: "overview",    label: "Overview",           icon: LayoutDashboard, section: "Analytics" },
  { id: "discourse",   label: "Discourse Analysis", icon: BarChart3,       section: "Analytics" },
  { id: "videos",      label: "Video Analysis",     icon: Video,           section: "Analytics" },
  { id: "embeddings",  label: "Semantic Space (2D)",icon: Compass,         section: "Analytics" },
  { id: "language",    label: "Language Map",       icon: Globe,           section: "Analytics" },

  // ── Corpus & Diagnostics ──
  { id: "comments",    label: "Comment Explorer",   icon: Search,          section: "Corpus & Data" },
  { id: "confidence",  label: "Confidence Explorer",icon: Activity,        section: "Corpus & Data" },
  { id: "uncertainty", label: "Boundary Ambiguity", icon: AlertTriangle,   section: "Corpus & Data" },

  // ── Interactive Lab ──
  { id: "playground",  label: "Live Playground",    icon: Sparkles,        section: "Interactive Lab" },

  // ── Research & Engine ──
  { id: "model",       label: "Model Performance",  icon: BrainCircuit,    section: "Research & Engine" },
  { id: "pipeline",    label: "Pipeline Stages",    icon: Layers,          section: "Research & Engine" },
  { id: "methodology", label: "Methodology",        icon: BookOpen,        section: "Research & Engine" },
  { id: "colab",       label: "Colab Reproduction", icon: Terminal,        section: "Research & Engine" },
  { id: "about",       label: "About & Copyright",  icon: Info,            section: "Research & Engine" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVideo, setNavVideo]   = useState(null);
  const [navSearch, setNavSearch] = useState("");

  const navigateTo = useCallback((pageId, extra = {}) => {
    if (PAGES[pageId]) {
      setPage(pageId);
      setMobileOpen(false);
    }
    if (extra.videoId) setNavVideo(extra.videoId);
  }, []);

  const sections = useMemo(() => [...new Set(NAV.map(n => n.section))], []);

  const filteredNav = useMemo(() => {
    if (!navSearch.trim()) return NAV;
    const q = navSearch.toLowerCase();
    return NAV.filter(n =>
      n.label.toLowerCase().includes(q) ||
      n.section.toLowerCase().includes(q)
    );
  }, [navSearch]);

  const activeSections = useMemo(() => [...new Set(filteredNav.map(n => n.section))], [filteredNav]);

  const PageComponent = PAGES[page] || Overview;

  return (
    <div className="app-shell">
      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop open"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            KB
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">KOK BISA?</div>
              <div className="sidebar-brand-sub">Discourse Analytics</div>
            </div>
          )}
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            title="Close menu"
          >
            <X size={18} />
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
                <div className="nav-section-label">
                  <span>{sec}</span>
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
                      setMobileOpen(false);
                    }}
                    title={collapsed ? n.label : ""}
                  >
                    <Icon className="nav-item-icon" size={15} />
                    {(!collapsed || mobileOpen) && <span className="nav-item-label">{n.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Sidebar Footer & Copyright ── */}
        {(!collapsed || mobileOpen) && (
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
            className="btn btn-ghost btn-icon menu-toggle-btn"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(o => !o);
              } else {
                setCollapsed(c => !c);
              }
            }}
            style={{ padding: "6px" }}
            title="Toggle Navigation"
          >
            {collapsed ? <ChevronRight size={15} /> : <Menu size={15} />}
          </button>
          
          <div className="topbar-breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="topbar-portal-name" style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600 }}>Research Portal</span>
            <span className="topbar-portal-sep" style={{ fontSize: 13, color: "var(--text4)" }}>/</span>
            <span className="topbar-title" style={{ fontSize: 14.5, fontWeight: 700 }}>
              {PAGE_TITLES[page] || page}
            </span>
          </div>

          <div className="topbar-right" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="topbar-badge topbar-badge-stats"
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
              <span className="topbar-badge-text">202,429 Comments · 35 Videos</span>
            </span>

            <span
              className="topbar-badge topbar-badge-model"
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
              IndoBERT 97.4% F1
            </span>

            {/* ── GitHub Repository Link Button (Sleek Dark Badge) ── */}
            <a
              href="https://github.com/farrelfz/kok-bisa-physics-discourse-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="github-topbar-link"
              title="View Repository on GitHub: farrelfz/kok-bisa-physics-discourse-analytics"
            >
              <svg className="github-icon" viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
              </svg>
              <span className="github-label">GitHub</span>
              <span className="github-badge">Code</span>
            </a>
          </div>
        </div>

        {/* Page Content View */}
        <div className="page-content">
          <div className="page-inner-content">
            <PageComponent
              navigateTo={navigateTo}
              initialVideoId={navVideo}
            />
          </div>

          {/* ── Natural Scrollable Footer ── */}
          <footer className="app-footer">
            <div className="app-footer-left">
              <span className="app-footer-brand">
                © 2026 Indonesian Public Discourse Corpus (IPDC) Project
              </span>
              <span className="footer-dot">·</span>
              <span>Deep Learning Indonesian Physics Discourse Analysis</span>
              <span className="footer-dot">·</span>
              <span>202,429+ Verified YouTube Comments</span>
              <span className="footer-dot">·</span>
              <span>8 Canonical Discourse Categories</span>
            </div>
            <div className="app-footer-right">
              <code>indobenchmark/indobert-base-p1 (Macro F1: 97.40%)</code>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
