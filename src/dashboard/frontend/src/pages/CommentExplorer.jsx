import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search, Filter, Download, Shuffle, ChevronDown, ChevronUp,
  ExternalLink, MessageSquare, Check, X, RefreshCw
} from "lucide-react";
import { api } from "../api.js";
import { LABEL_COLORS, CANONICAL_LABELS, PUBLIC_VIDEOS } from "../constants.js";
import {
  LabelBadge, ConfBadge, MarginBadge, PageLoading, EmptyState,
  SectionHeader, Pagination, Button, Badge
} from "../components.jsx";

const PAGE_SIZE = 25;

const CONFIDENCE_PRESETS = [
  { id: "all", label: "All Confidence", min: 0.0, max: 1.0 },
  { id: "high", label: "High (≥90%)", min: 0.90, max: 1.0 },
  { id: "med", label: "Medium (70–90%)", min: 0.70, max: 0.90 },
  { id: "low", label: "Ambiguous (<70%)", min: 0.0, max: 0.70 },
];

const MARGIN_PRESETS = [
  { id: "all", label: "All Margins", min: 0.0, max: 1.0 },
  { id: "narrow", label: "Narrow (<30%)", min: 0.0, max: 0.30 },
  { id: "wide", label: "Decisive (≥50%)", min: 0.50, max: 1.0 },
];

export default function CommentExplorer({ navigateTo, initialVideoId }) {
  const [comments, setComments]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [videos, setVideos]         = useState(PUBLIC_VIDEOS);

  // Filter state
  const [selectedLabel, setSelectedLabel]       = useState("");
  const [selectedVideo, setSelectedVideo]       = useState(initialVideoId || "");
  const [searchInput, setSearchInput]           = useState("");
  const [activeConfPreset, setActiveConfPreset] = useState("all");
  const [activeMarginPreset, setActiveMarginPreset] = useState("all");
  const [sortBy, setSortBy]                     = useState("confidence");
  const [sortOrder, setSortOrder]               = useState("desc");
  const [isRandom, setIsRandom]                 = useState(false);

  const searchTimeout = useRef(null);

  // Load video list
  useEffect(() => {
    api.videos()
      .then(d => {
        if (d.videos?.length) setVideos(d.videos);
      })
      .catch(() => {});
  }, []);

  // Fetch comments with current parameters
  const fetchComments = useCallback((random = false) => {
    setLoading(true);
    const confObj = CONFIDENCE_PRESETS.find(p => p.id === activeConfPreset) || CONFIDENCE_PRESETS[0];
    const marginObj = MARGIN_PRESETS.find(p => p.id === activeMarginPreset) || MARGIN_PRESETS[0];

    api.comments({
      label: selectedLabel || undefined,
      video_id: selectedVideo || undefined,
      search: searchInput.trim() || undefined,
      min_confidence: confObj.min,
      max_confidence: confObj.max,
      min_margin: marginObj.min,
      max_margin: marginObj.max,
      sort_by: random ? "random" : sortBy,
      order: sortOrder,
      page,
      page_size: PAGE_SIZE,
    })
      .then(d => {
        setComments(d.comments || []);
        setTotal(d.total || 0);
        setTotalPages(d.total_pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedLabel, selectedVideo, searchInput, activeConfPreset, activeMarginPreset, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchComments(isRandom);
  }, [fetchComments, isRandom]);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    setPage(1);
  };

  const handleRandomSample = () => {
    setIsRandom(true);
    setPage(1);
    fetchComments(true);
  };

  const resetAllFilters = () => {
    setSelectedLabel("");
    setSelectedVideo("");
    setSearchInput("");
    setActiveConfPreset("all");
    setActiveMarginPreset("all");
    setSortBy("confidence");
    setSortOrder("desc");
    setIsRandom(false);
    setPage(1);
  };

  const handleSort = (col) => {
    setIsRandom(false);
    if (sortBy === col) {
      setSortOrder(o => o === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const exportCsv = () => {
    const confObj = CONFIDENCE_PRESETS.find(p => p.id === activeConfPreset) || CONFIDENCE_PRESETS[0];
    const marginObj = MARGIN_PRESETS.find(p => p.id === activeMarginPreset) || MARGIN_PRESETS[0];

    const url = api.exportCsvUrl({
      label: selectedLabel || undefined,
      video_id: selectedVideo || undefined,
      search: searchInput.trim() || undefined,
      min_confidence: confObj.min,
      max_confidence: confObj.max,
      min_margin: marginObj.min,
      max_margin: marginObj.max,
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "kokbisa_corpus_export.csv";
    a.click();
  };

  const Th = ({ col, label, width }) => (
    <th
      onClick={() => handleSort(col)}
      style={{ cursor: "pointer", width, userSelect: "none" }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <span>{label}</span>
        {sortBy === col && (
          sortOrder === "desc" ? <ChevronDown size={13} /> : <ChevronUp size={13} />
        )}
      </div>
    </th>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <SectionHeader
        eyebrow="Corpus Exploration & Search"
        title="Comment Explorer"
        sub="Search, filter, and inspect individual comment predictions across the entire educational corpus."
        right={
          <button className="btn btn-secondary btn-sm" onClick={exportCsv}>
            <Download size={13} /> Export Filtered CSV
          </button>
        }
      />

      {/* Main Filter Bar */}
      <div className="card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Top Filter Row: Search & Video Select */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-bar" style={{ minWidth: 260, flex: 1 }}>
            <Search className="search-icon" />
            <input
              className="input-field"
              placeholder="Search Indonesian comment text..."
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>

          <select
            className="input-field"
            style={{ maxWidth: 280, fontSize: 12.5 }}
            value={selectedVideo}
            onChange={e => {
              setSelectedVideo(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All 35 Public Videos</option>
            {videos.map(v => (
              <option key={v.video_id || v.id} value={v.video_id || v.id}>
                {(v.title || v.video_id).slice(0, 42)}...
              </option>
            ))}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handleRandomSample} title="Draw random sample of comments">
            <Shuffle size={13} /> Random
          </button>

          <button className="btn btn-ghost btn-sm" onClick={resetAllFilters}>
            Reset
          </button>
        </div>

        {/* Middle Filter Row: 8 Canonical Acts Filter Buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)", marginRight: 4 }}>
            Discourse Act:
          </span>
          <button
            className={`btn btn-xs ${!selectedLabel ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setSelectedLabel("");
              setPage(1);
            }}
          >
            All Acts
          </button>
          {CANONICAL_LABELS.map(l => {
            const isSelected = selectedLabel === l;
            return (
              <button
                key={l}
                className={`btn btn-xs ${isSelected ? "btn-primary" : "btn-secondary"}`}
                style={isSelected ? { background: LABEL_COLORS[l], borderColor: LABEL_COLORS[l], color: "#FFFFFF" } : {}}
                onClick={() => {
                  setSelectedLabel(isSelected ? "" : l);
                  setPage(1);
                }}
              >
                {l}
              </button>
            );
          })}
        </div>

        {/* Bottom Filter Row: Segmented Threshold Controls (Replacing clunky sliders) */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          {/* Confidence Presets */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)" }}>
              Confidence:
            </span>
            <div style={{ display: "inline-flex", background: "var(--bg-subtle)", borderRadius: 6, padding: 2, border: "1px solid var(--border)" }}>
              {CONFIDENCE_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveConfPreset(p.id);
                    setPage(1);
                  }}
                  style={{
                    padding: "3px 8px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    borderRadius: 4,
                    border: "none",
                    background: activeConfPreset === p.id ? "var(--surface)" : "transparent",
                    color: activeConfPreset === p.id ? "var(--brand-dark)" : "var(--text3)",
                    boxShadow: activeConfPreset === p.id ? "var(--shadow-xs)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Margin Presets */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)" }}>
              Margin:
            </span>
            <div style={{ display: "inline-flex", background: "var(--bg-subtle)", borderRadius: 6, padding: 2, border: "1px solid var(--border)" }}>
              {MARGIN_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveMarginPreset(p.id);
                    setPage(1);
                  }}
                  style={{
                    padding: "3px 8px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    borderRadius: 4,
                    border: "none",
                    background: activeMarginPreset === p.id ? "var(--surface)" : "transparent",
                    color: activeMarginPreset === p.id ? "var(--brand-dark)" : "var(--text3)",
                    boxShadow: activeMarginPreset === p.id ? "var(--shadow-xs)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text3)" }}>
        <span>
          {loading ? "Querying corpus..." : `Found ${total.toLocaleString()} comments matching filters`}
        </span>
        <span style={{ fontFamily: "JetBrains Mono", fontVariantNumeric: "tabular-nums" }}>
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Comments Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="data-table-wrap" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <Th col="published_at" label="Published" width="105px" />
                <th style={{ width: "170px" }}>Video</th>
                <th>Comment Text</th>
                <Th col="confidence" label="Confidence" width="105px" />
                <Th col="margin" label="Margin" width="95px" />
                <th style={{ width: "120px" }}>Predicted Label</th>
                <Th col="like_count" label="Likes" width="80px" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                    <PageLoading />
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon="💬"
                      title="No comments found"
                      sub="Try broadening your search query or confidence filters."
                    />
                  </td>
                </tr>
              ) : (
                comments.map(c => (
                  <tr key={c.comment_id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                      {c.published_at?.slice(0, 10) || "—"}
                    </td>
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
                      {c.like_count?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "var(--text3)" }}>
            Showing {comments.length} rows per page
          </span>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}
