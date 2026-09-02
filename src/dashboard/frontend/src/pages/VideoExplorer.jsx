import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search, ExternalLink, MessageSquare, TrendingUp, X, ChevronLeft,
  LayoutGrid, Table as TableIcon, Filter, Play, CheckCircle2, Eye, Sparkles
} from "lucide-react";
import { api } from "../api.js";
import { LABEL_COLORS, CANONICAL_LABELS, PUBLIC_VIDEOS } from "../constants.js";
import {
  LabelBadge, ConfBadge, MarginBadge, PageLoading, EmptyState, SectionHeader,
  DiscourseBar, VideoPlayerModal, Button, Badge
} from "../components.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

function VideoCard({ video, onSelect, onPlay }) {
  const [thumbError, setThumbError] = useState(false);
  const vid = video.video_id || video.id;
  const thumbUrl = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
  const ytUrl = `https://www.youtube.com/watch?v=${vid}`;

  return (
    <div className="video-card card-hover">
      {/* Thumbnail with hover play overlay */}
      <div className="video-thumb-wrap" onClick={() => onSelect(video)}>
        {!thumbError ? (
          <img
            src={thumbUrl}
            alt={video.title}
            onError={() => setThumbError(true)}
            loading="lazy"
          />
        ) : (
          <div className="video-thumb-fallback">
            <Play size={24} />
            <span>{vid}</span>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
          className="play-overlay"
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#EF4444",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(video);
            }}
            title="Watch in Dashboard Player"
          >
            <Play size={18} fill="#FFFFFF" style={{ marginLeft: 2 }} />
          </div>
        </div>

        {/* View count chip on top of thumbnail */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(4px)",
            color: "#FFFFFF",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "JetBrains Mono",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Eye size={12} />
          {video.view_count ? `${(video.view_count / 1000).toFixed(0)}k views` : "YouTube"}
        </div>
      </div>

      <div className="video-card-body">
        <div
          className="video-card-title"
          title={video.title}
          onClick={() => onSelect(video)}
          style={{ cursor: "pointer" }}
        >
          {video.title}
        </div>

        <div className="video-card-meta">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="video-card-stat">
              <MessageSquare size={13} style={{ color: "var(--brand-light)" }} />
              <strong style={{ color: "var(--text1)" }}>{(video.total_comments || 0).toLocaleString()}</strong>
              <span>comments</span>
            </div>
            <div className="video-card-stat">
              <TrendingUp size={13} style={{ color: "var(--success)" }} />
              <span style={{ fontFamily: "JetBrains Mono" }}>{((video.mean_confidence || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Discourse distribution bar */}
          {video.discourse_distribution && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text3)", marginBottom: 3 }}>
                <span>Discourse Composition</span>
                <span style={{ fontWeight: 700, color: LABEL_COLORS[video.dominant_discourse] }}>{video.dominant_discourse}</span>
              </div>
              <DiscourseBar distribution={video.discourse_distribution} total={video.total_comments} height={6} />
            </div>
          )}

          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
            <LabelBadge label={video.dominant_discourse || "Opinion"} size="sm" />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-ghost btn-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(video);
                }}
                title="Play Video"
              >
                <Play size={12} fill="currentColor" /> Play
              </button>
              <a
                href={ytUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-xs"
                onClick={(e) => e.stopPropagation()}
                title="Open directly on YouTube"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoDetail({ video, onClose, onPlay, navigateTo }) {
  const [detail, setDetail]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [comments, setComments]     = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel]     = useState("");
  const [commentSearch, setCommentSearch]     = useState("");
  const [commentPage, setCommentPage]         = useState(1);
  const [totalComments, setTotalComments]     = useState(0);

  useEffect(() => {
    setLoading(true);
    api.video(video.video_id)
      .then(d => { setDetail(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [video.video_id]);

  const fetchComments = useCallback(() => {
    setCommentsLoading(true);
    api.comments({
      video_id: video.video_id,
      label: selectedLabel || undefined,
      search: commentSearch || undefined,
      page: commentPage,
      page_size: 15,
    })
      .then(res => {
        setComments(res.comments || []);
        setTotalComments(res.total || 0);
        setCommentsLoading(false);
      })
      .catch(() => setCommentsLoading(false));
  }, [video.video_id, selectedLabel, commentSearch, commentPage]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const vd = detail || video;
  const rawDist = vd?.discourse_distribution;
  const dist = Array.isArray(rawDist)
    ? rawDist
    : (rawDist && typeof rawDist === "object")
      ? CANONICAL_LABELS.map((lbl) => {
          const count = rawDist[lbl] || 0;
          const tot = vd?.total_comments || 1;
          return {
            label: lbl,
            count: count,
            pct: Number(((count / tot) * 100).toFixed(1)),
            color: LABEL_COLORS[lbl] || "#3B82F6",
          };
        })
      : [];
  const ytUrl = `https://www.youtube.com/watch?v=${video.video_id}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Back button & Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          <ChevronLeft size={14} /> Back to 35 Videos Collection
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn btn-primary btn-sm" onClick={() => onPlay(vd)}>
            <Play size={14} fill="#FFFFFF" /> Watch Video
          </button>
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} /> YouTube
          </a>
        </div>
      </div>

      {/* Main Top Section: Embed (Left) & Metadata + Discourse Distribution (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(380px, 55%) 1fr", gap: 20 }}>
        {/* Left: Video Frame & Chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="embed-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${video.video_id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={vd.title}
            />
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>Discourse Breakdown for This Video</div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Click a bar to filter comments</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={dist}
                layout="vertical"
                margin={{ left: 0, right: 30, top: 4, bottom: 4 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const l = e.activePayload[0].payload.label;
                    setSelectedLabel(prev => prev === l ? "" : l);
                    setCommentPage(1);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} tickFormatter={v => v.toLocaleString()} />
                <YAxis type="category" dataKey="label" tick={{ fill: "#0F172A", fontSize: 12, fontWeight: 700 }} width={100} />
                <Tooltip
                  formatter={v => [`${v.toLocaleString()} comments`, "Count"]}
                  contentStyle={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-md)" }}
                />
                <Bar dataKey="count" radius={[0, 5, 5, 0]} cursor="pointer">
                  {dist.map(d => (
                    <Cell
                      key={d.label}
                      fill={d.color || LABEL_COLORS[d.label]}
                      opacity={selectedLabel && selectedLabel !== d.label ? 0.35 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Research Analytics & Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.4, color: "var(--text1)", marginBottom: 14 }}>
              {vd.title}
            </h2>

            <div className="meta-list">
              <div className="meta-row">
                <span className="meta-key">Educational Channel</span>
                <span className="meta-val">{vd.channel_title || "Kok Bisa?"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Published Date</span>
                <span className="meta-val">{vd.published_at ? vd.published_at.slice(0, 10) : "—"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">YouTube Views</span>
                <span className="meta-val" style={{ fontFamily: "JetBrains Mono" }}>
                  {vd.view_count?.toLocaleString() || "—"}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Analyzed Corpus Comments</span>
                <span className="meta-val" style={{ fontFamily: "JetBrains Mono", color: "var(--brand)", fontWeight: 800 }}>
                  {vd.total_comments?.toLocaleString()} comments
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Dominant Discourse Act</span>
                <span className="meta-val"><LabelBadge label={vd.dominant_discourse || "Opinion"} /></span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Mean Prediction Confidence</span>
                <span className="meta-val" style={{ fontFamily: "JetBrains Mono", color: "var(--success)" }}>
                  {vd.mean_confidence ? `${(vd.mean_confidence * 100).toFixed(2)}%` : "—"}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigateTo("comments", { videoId: video.video_id })}
              >
                <MessageSquare size={13} /> Deep Corpus Query
              </button>
            </div>
          </div>

          {/* Proportions */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">Discourse Category Share (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {dist.map(d => (
                <div key={d.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: d.color }}>{d.label}</span>
                    <span style={{ fontFamily: "JetBrains Mono", color: "var(--text2)", fontWeight: 600 }}>
                      {d.count?.toLocaleString()} ({d.pct}%)
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: In-situ Comment Explorer for This Video */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>
              Comments Sample ({totalComments.toLocaleString()} matching filter)
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>
              {selectedLabel ? `Filtered by ${selectedLabel}` : "Showing all discourse acts"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              className={`btn btn-xs ${!selectedLabel ? "btn-primary" : "btn-ghost"}`}
              onClick={() => { setSelectedLabel(""); setCommentPage(1); }}
            >
              All
            </button>
            {CANONICAL_LABELS.map(l => (
              <button
                key={l}
                className={`btn btn-xs ${selectedLabel === l ? "btn-primary" : "btn-ghost"}`}
                onClick={() => { setSelectedLabel(prev => prev === l ? "" : l); setCommentPage(1); }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {commentsLoading ? (
          <div style={{ padding: 30, textAlign: "center" }}><PageLoading /></div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Comment Text</th>
                  <th>Predicted Label</th>
                  <th>Confidence</th>
                  <th>Margin</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(c => (
                  <tr key={c.comment_id}>
                    <td className="text-cell">{c.text}</td>
                    <td><LabelBadge label={c.predicted_label} size="sm" /></td>
                    <td><ConfBadge value={c.confidence} /></td>
                    <td><MarginBadge value={c.margin} /></td>
                    <td style={{ fontFamily: "JetBrains Mono", fontSize: 12 }}>{c.like_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoExplorer({ navigateTo, initialVideoId }) {
  const [videos, setVideos]         = useState([]);
  const [matrixData, setMatrixData] = useState([]);
  const [matrixLabels, setMatrixLabels] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("total_comments");
  const [order, setOrder]           = useState("desc");
  const [actFilter, setActFilter]   = useState("ALL");
  const [activeTab, setActiveTab]   = useState("grid"); // "grid" | "matrix"
  const [selected, setSelected]     = useState(null);
  const [modalVideo, setModalVideo] = useState(null);

  const fetchVideos = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.videos({ search, sort_by: sort, order }),
      api.videoMatrix(),
    ])
      .then(([vRes, mRes]) => {
        setVideos(vRes.videos || []);
        setMatrixData(mRes.data || []);
        setMatrixLabels(mRes.labels || CANONICAL_LABELS);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, sort, order]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Initial video support
  useEffect(() => {
    if (initialVideoId && videos.length) {
      const target = videos.find(v => v.video_id === initialVideoId);
      if (target) setSelected(target);
    }
  }, [initialVideoId, videos]);

  const filteredVideos = useMemo(() => {
    if (actFilter === "ALL") return videos;
    return videos.filter(v => v.dominant_discourse === actFilter);
  }, [videos, actFilter]);

  if (selected) {
    return (
      <>
        <VideoDetail
          video={selected}
          onClose={() => setSelected(null)}
          onPlay={(v) => setModalVideo(v)}
          navigateTo={navigateTo}
        />
        <VideoPlayerModal video={modalVideo} onClose={() => setModalVideo(null)} />
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Video Modal Player */}
      <VideoPlayerModal video={modalVideo} onClose={() => setModalVideo(null)} />

      {/* Section Header */}
      <SectionHeader
        eyebrow="Corpus Video Repository"
        title="35 Public Science Videos Collection"
        sub="Browse and inspect all 35 educational science videos from Kok Bisa? analyzed with fine-tuned IndoBERT."
        right={
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`btn btn-sm ${activeTab === "grid" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("grid")}
            >
              <LayoutGrid size={14} /> Video Showcase
            </button>
            <button
              className={`btn btn-sm ${activeTab === "matrix" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("matrix")}
            >
              <TableIcon size={14} /> Heatmap Matrix
            </button>
          </div>
        }
      />

      {/* Filter Controls */}
      <div className="filter-bar">
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search className="search-icon" />
          <input
            className="input-field"
            placeholder="Search 35 videos by title or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="input-field" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="total_comments">Sort: Most Comments</option>
          <option value="view_count">Sort: Most Views</option>
          <option value="mean_confidence">Sort: Mean Confidence</option>
          <option value="title">Sort: Title</option>
        </select>

        <select className="input-field" value={order} onChange={e => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: "auto", fontFamily: "JetBrains Mono", fontWeight: 700 }}>
          {filteredVideos.length} / 35 Videos
        </span>
      </div>

      {/* Dominant Act Quick Filter Pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginRight: 4 }}>Filter Dominant Act:</span>
        <button
          className={`btn btn-xs ${actFilter === "ALL" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActFilter("ALL")}
        >
          All (35)
        </button>
        {CANONICAL_LABELS.map(l => {
          const count = videos.filter(v => v.dominant_discourse === l).length;
          if (count === 0) return null;
          return (
            <button
              key={l}
              className={`btn btn-xs ${actFilter === l ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActFilter(l)}
              style={{
                borderColor: actFilter === l ? undefined : `${LABEL_COLORS[l]}40`,
                color: actFilter === l ? undefined : LABEL_COLORS[l],
              }}
            >
              {l} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <PageLoading />
      ) : activeTab === "grid" ? (
        /* Video Grid */
        filteredVideos.length === 0 ? (
          <EmptyState icon="🎬" title="No videos match search filter" />
        ) : (
          <div className="video-grid">
            {filteredVideos.map(v => (
              <VideoCard
                key={v.video_id}
                video={v}
                onSelect={setSelected}
                onPlay={(vid) => setModalVideo(vid)}
              />
            ))}
          </div>
        )
      ) : (
        /* Video × Discourse Matrix View */
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div className="card-title" style={{ marginBottom: 2 }}>
                Video × Discourse Matrix (Cross-Topic Comparison)
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                Values represent exact comment percentage (%) per video
              </div>
            </div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Video Title (35 Public Videos)</th>
                  {matrixLabels.map(l => (
                    <th key={l} style={{ textAlign: "center" }}>
                      <LabelBadge label={l} size="sm" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.map(row => {
                  const targetVideo = videos.find(v => v.video_id === row.video_id);
                  return (
                    <tr key={row.video_id}>
                      <td style={{ maxWidth: 260, fontSize: 12.5 }}>
                        <button
                          style={{
                            background: "none", border: "none", color: "var(--brand)",
                            cursor: "pointer", fontSize: 12.5, textAlign: "left", padding: 0, lineHeight: 1.4,
                            fontWeight: 700
                          }}
                          onClick={() => targetVideo && setSelected(targetVideo)}
                        >
                          {row.title}
                        </button>
                      </td>
                      {matrixLabels.map(l => {
                        const pct = row[`${l}_pct`] || 0;
                        const count = row[l] || 0;
                        const alpha = Math.min(Math.max(pct / 75, 0.06), 0.85);
                        const color = LABEL_COLORS[l];

                        return (
                          <td
                            key={l}
                            style={{
                              textAlign: "center",
                              fontFamily: "JetBrains Mono",
                              fontSize: 11.5,
                              fontWeight: pct > 10 ? 800 : 500,
                              background: count > 0 ? `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : "transparent",
                              cursor: "pointer",
                            }}
                            title={`${count.toLocaleString()} comments (${pct}%)`}
                            onClick={() => targetVideo && setSelected(targetVideo)}
                          >
                            {pct}%
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
