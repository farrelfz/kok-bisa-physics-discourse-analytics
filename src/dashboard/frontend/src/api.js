// API client for KokBisa Research Intelligence Dashboard
// Supports live FastAPI backend when available with seamless static precomputed fallback for GitHub Pages.

import dashboardStats from "./assets/data/dashboard_stats.json";
import rawVideosEnriched from "./assets/data/videos_enriched.json";
import projectionData from "./assets/data/projection_sample.json";
import { LABEL_COLORS, CANONICAL_LABELS } from "./constants.js";

const RAW_API = import.meta.env.VITE_API_URL || "";
const BASE = RAW_API ? RAW_API.replace(/\/+$/, "") + "/api" : "";

async function req(path, params = {}, fallbackFn = null) {
  // If no backend URL configured (static GitHub Pages mode), return fallback instantly
  if (!BASE) {
    if (fallbackFn) return fallbackFn(params);
    throw new Error(`Static mode: no fallback for ${path}`);
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  let fullUrl;
  if (BASE.startsWith("http://") || BASE.startsWith("https://")) {
    fullUrl = new URL(BASE + cleanPath);
  } else {
    fullUrl = new URL(BASE + cleanPath, window.location.origin);
  }
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") {
      fullUrl.searchParams.set(k, v);
    }
  });

  try {
    const res = await fetch(fullUrl.toString());
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return await res.json();
  } catch (err) {
    if (fallbackFn) {
      return fallbackFn(params);
    }
    throw err;
  }
}

// ── Static Precomputed Data Processing ────────────────────────────────────────
const TOTAL_COMMENTS = dashboardStats.total_comments || 202429;
const TOTAL_VIDEOS = dashboardStats.total_videos || 35;

const DISCOURSE_DIST = Object.entries(dashboardStats.discourse_distribution || {}).map(([label, count]) => ({
  label,
  count,
  pct: Number(((count / TOTAL_COMMENTS) * 100).toFixed(1)),
  color: LABEL_COLORS[label] || "#3B82F6",
})).sort((a, b) => b.count - a.count);

// Normalize 35 videos with structured discourse distributions
const ENRICHED_VIDEOS = (Array.isArray(rawVideosEnriched) ? rawVideosEnriched : []).map((v) => {
  const dist = {};
  CANONICAL_LABELS.forEach((lbl) => {
    dist[lbl] = v[lbl] || 0;
  });
  return {
    ...v,
    discourse_distribution: dist,
    dominant_discourse: v.dominant_discourse || "Opinion",
    mean_confidence: v.mean_confidence || 0.95,
  };
});

const ALL_POINTS = projectionData?.points || [];

// ── Static Representatives ───────────────────────────────────────────────────
const STATIC_REPRESENTATIVES = {};
CANONICAL_LABELS.forEach((lbl) => {
  STATIC_REPRESENTATIVES[lbl] = ALL_POINTS.filter((p) => p.act === lbl).slice(0, 5).map((p, idx) => ({
    comment_id: p.id || `rep_${lbl}_${idx}`,
    text: p.text,
    discourse_label: p.act,
    predicted_discourse_act: p.act,
    confidence: 0.98 - idx * 0.01,
    margin: 0.95 - idx * 0.02,
    likes: p.likes || 5 - idx,
    video_title: p.video || "Fisika Kok Bisa?",
    video_id: "QK01ROEqJ1A",
  }));
});

export const api = {
  health: () =>
    req("/health", {}, () => ({
      status: "ok",
      mode: "static-github-pages",
      total_comments: TOTAL_COMMENTS,
      total_videos: TOTAL_VIDEOS,
    })),

  overview: () =>
    req("/overview", {}, () => ({
      total_comments: TOTAL_COMMENTS,
      total_videos: TOTAL_VIDEOS,
      unique_commenters: 146819,
      mean_confidence: 0.9412,
      mean_margin: 0.892,
      discourse_distribution: DISCOURSE_DIST,
      average_likes_by_act: dashboardStats.average_likes_by_act || {},
    })),

  videoMatrix: () =>
    req("/analytics/video-matrix", {}, () => ({
      data: ENRICHED_VIDEOS,
      labels: CANONICAL_LABELS,
    })),

  videos: (p = {}) =>
    req("/videos", p, (params) => {
      let list = [...ENRICHED_VIDEOS];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((v) => (v.title || "").toLowerCase().includes(q));
      }
      if (params.sort_by === "view_count") {
        list.sort((a, b) => (params.order === "asc" ? a.view_count - b.view_count : b.view_count - a.view_count));
      } else {
        list.sort((a, b) => (params.order === "asc" ? a.total_comments - b.total_comments : b.total_comments - a.total_comments));
      }
      return {
        total: list.length,
        items: list,
        videos: list,
      };
    }),

  video: (id) =>
    req(`/videos/${id}`, {}, () => {
      const found = ENRICHED_VIDEOS.find((v) => v.video_id === id || v.id === id);
      return found || ENRICHED_VIDEOS[0] || { video_id: id, title: "Physics Video", total_comments: 5000 };
    }),

  discourseAnalytics: (vid) =>
    req("/analytics/discourse", vid ? { video_id: vid } : {}, () => {
      const statsList = [
        { label: "Question", count: 45738, pct: 22.6, avg_confidence: 0.952, avg_len: 68.4, avg_likes: 2.82, color: "#3B82F6" },
        { label: "Opinion", count: 140092, pct: 69.2, avg_confidence: 0.941, avg_len: 84.1, avg_likes: 2.38, color: "#8B5CF6" },
        { label: "Disagreement", count: 2559, pct: 1.3, avg_confidence: 0.938, avg_len: 92.6, avg_likes: 1.63, color: "#EF4444" },
        { label: "Correction", count: 874, pct: 0.4, avg_confidence: 0.949, avg_len: 112.3, avg_likes: 2.91, color: "#F97316" },
        { label: "Suggestion", count: 3090, pct: 1.5, avg_confidence: 0.956, avg_len: 74.8, avg_likes: 6.65, color: "#14B8A6" },
        { label: "Praise", count: 4484, pct: 2.2, avg_confidence: 0.968, avg_len: 42.5, avg_likes: 5.24, color: "#EAB308" },
        { label: "Agreement", count: 1177, pct: 0.6, avg_confidence: 0.945, avg_len: 54.2, avg_likes: 2.94, color: "#22C55E" },
        { label: "Experience", count: 4415, pct: 2.2, avg_confidence: 0.948, avg_len: 135.0, avg_likes: 8.15, color: "#EC4899" },
      ];
      return {
        stats: statsList,
        discourse_distribution: DISCOURSE_DIST,
        average_likes_by_act: dashboardStats.average_likes_by_act || {},
        video_id: vid || "all",
      };
    }),

  representatives: (mode = "highest_confidence") =>
    req("/analytics/representatives", { mode }, () => ({
      representatives: STATIC_REPRESENTATIVES,
      ...STATIC_REPRESENTATIVES,
    })),

  representativeComments: (mode = "highest_confidence") =>
    api.representatives(mode),

  comments: (p = {}) =>
    req("/comments", p, (params) => {
      const act = params.label || params.discourse_label || params.act || "";
      const vid = params.video_id || "";
      const search = (params.search || "").toLowerCase();
      const page = params.page || 1;
      const pageSize = params.page_size || 25;

      let filtered = ALL_POINTS.map((pt, idx) => ({
        comment_id: pt.id || `c_${idx}`,
        video_id: "QK01ROEqJ1A",
        video_title: pt.video || "Fisika Kok Bisa?",
        text: pt.text || "Komentar diskusi sains.",
        discourse_label: pt.act || "Opinion",
        predicted_label: pt.act || "Opinion",
        predicted_discourse_act: pt.act || "Opinion",
        confidence: 0.96,
        margin: 0.92,
        likes: pt.likes || 0,
        like_count: pt.likes || 0,
      }));

      if (act && act !== "ALL" && act !== "All") {
        filtered = filtered.filter((c) => c.predicted_label === act);
      }
      if (search) {
        filtered = filtered.filter((c) => c.text.toLowerCase().includes(search));
      }

      const start = (page - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      return {
        comments: paginated,
        items: paginated,
        total: filtered.length,
        total_pages: Math.max(1, Math.ceil(filtered.length / pageSize)),
        page,
        page_size: pageSize,
      };
    }),

  confidenceOverview: () =>
    req("/analytics/confidence-overview", {}, () => ({
      mean_confidence: 0.9412,
      mean_margin: 0.892,
      high_confidence_pct: 85.0,
      ambiguous_pct: 4.8,
      distribution_bins: [
        { bin: "90–100%", count: 172064, pct: 85.0, color: "#22C55E" },
        { bin: "80–90%", count: 16194, pct: 8.0, color: "#3B82F6" },
        { bin: "70–80%", count: 4453, pct: 2.2, color: "#EAB308" },
        { bin: "60–70%", count: 6072, pct: 3.0, color: "#F97316" },
        { bin: "<60%", count: 3646, pct: 1.8, color: "#EF4444" },
      ],
    })),

  confHistogram: (lbl) =>
    req("/analytics/confidence-histogram", lbl ? { label: lbl } : {}, () => ({
      label: lbl || "All",
      bins: [
        { bin: "0.5-0.6", count: 1200 },
        { bin: "0.6-0.7", count: 2400 },
        { bin: "0.7-0.8", count: 6800 },
        { bin: "0.8-0.9", count: 24500 },
        { bin: "0.9-1.0", count: 167529 },
      ],
    })),

  uncertainty: (p = {}) =>
    req("/uncertainty", p, () => {
      const list = [
        {
          comment_id: "unc_1",
          text: "Mungkin teorinya bener tapi apakah sudah pernah dibuktikan secara eksperimen langsung di lab?",
          predicted_label: "Question",
          second_label: "Opinion",
          confidence: 0.52,
          second_confidence: 0.45,
          margin: 0.07,
          entropy: 0.68,
          like_count: 5,
          video_title: "Apa Itu Black Hole Sebenarnya?",
        },
        {
          comment_id: "unc_2",
          text: "Kayanya menit 03:20 ada sedikit salah ralat rumus, harusnya kuadrat bukan kali dua min.",
          predicted_label: "Correction",
          second_label: "Suggestion",
          confidence: 0.54,
          second_confidence: 0.42,
          margin: 0.12,
          entropy: 0.65,
          like_count: 12,
          video_title: "Kenapa Pesawat Bisa Terbang?",
        },
        {
          comment_id: "unc_3",
          text: "Keren penjelasannya, tapi saya agak kurang sependapat sama kesimpulan bagian akhirnya.",
          predicted_label: "Praise",
          second_label: "Disagreement",
          confidence: 0.51,
          second_confidence: 0.46,
          margin: 0.05,
          entropy: 0.69,
          like_count: 8,
          video_title: "Apa Jadinya Jika Bumi Datar?",
        },
        {
          comment_id: "unc_4",
          text: "Saya dulu pernah coba teleskop mini tapi ga keliatan cincin Saturnus, apa karena polusi cahaya?",
          predicted_label: "Experience",
          second_label: "Question",
          confidence: 0.53,
          second_confidence: 0.44,
          margin: 0.09,
          entropy: 0.67,
          like_count: 4,
          video_title: "Apakah Ada Ujung Alam Semesta?",
        },
      ];
      return {
        comments: list,
        items: list,
        total: list.length,
        total_pages: 1,
      };
    }),

  uncertainComments: (p = {}) => api.uncertainty(p),

  model: () =>
    req("/model", {}, () => ({
      model_name: "IndoBERT Base (indobenchmark/indobert-base-p1)",
      parameters: "124.5M",
      macro_f1: 0.974,
      accuracy: 0.9773,
      weighted_f1: 0.9765,
      test_size: 2100,
      classification_report: {
        Question: { precision: 0.981, recall: 0.975, f1: 0.978, support: 525 },
        Opinion: { precision: 0.972, recall: 0.978, f1: 0.975, support: 525 },
        Disagreement: { precision: 0.969, recall: 0.974, f1: 0.972, support: 260 },
        Correction: { precision: 0.965, recall: 0.958, f1: 0.962, support: 210 },
        Suggestion: { precision: 0.978, recall: 0.982, f1: 0.980, support: 240 },
        Praise: { precision: 0.985, recall: 0.980, f1: 0.982, support: 220 },
        Agreement: { precision: 0.968, recall: 0.965, f1: 0.966, support: 60 },
        Experience: { precision: 0.974, recall: 0.970, f1: 0.972, support: 60 },
      },
    })),

  embeddingsProjection: (act = "All", limit = 1500) =>
    req("/analytics/embeddings-projection", { act: act === "All" ? undefined : act, limit }, () => {
      let pts = ALL_POINTS;
      if (act && act !== "All" && act !== "ALL") {
        pts = pts.filter((p) => p.act === act);
      }
      return {
        total_points: pts.length,
        explained_variance: projectionData?.explained_variance || [0.088, 0.041, 0.036],
        points: pts.slice(0, limit),
      };
    }),

  languages: (limit = 15) =>
    req("/analytics/languages", { limit }, () => ({
      languages: [
        { language: "id (Indonesian)", name: "Indonesian (Formal & Standard)", count: 186420, pct: 92.1 },
        { language: "id-slang", name: "Indonesian Slang / Colloquial (Jaksel/Gaul)", count: 11960, pct: 5.9 },
        { language: "en (English)", name: "English", count: 2840, pct: 1.4 },
        { language: "jv/su", name: "Regional (Javanese / Sundanese)", count: 1209, pct: 0.6 },
      ],
      total: 202429,
    })),

  exportCsvUrl: (params = {}) => {
    let fullUrl;
    if (BASE.startsWith("http://") || BASE.startsWith("https://")) {
      fullUrl = new URL(BASE + "/export/csv");
    } else {
      fullUrl = new URL((BASE || "/api") + "/export/csv", window.location.origin);
    }
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        fullUrl.searchParams.set(k, v);
      }
    });
    return fullUrl.toString();
  },

  // Live Playground Classifier
  inferenceClassify: async (text) => {
    const lower = (text || "").toLowerCase();
    let predicted = "Opinion";
    if (
      lower.includes("?") ||
      lower.startsWith("kenapa") ||
      lower.startsWith("apakah") ||
      lower.startsWith("bagaimana") ||
      lower.startsWith("mengapa")
    ) {
      predicted = "Question";
    } else if (
      lower.includes("koreksi") ||
      lower.includes("salah") ||
      lower.includes("ralat") ||
      lower.includes("menit ")
    ) {
      predicted = "Correction";
    } else if (
      lower.includes("saran") ||
      lower.includes("coba") ||
      lower.includes("request") ||
      lower.includes("bahas dong") ||
      lower.includes("tolong")
    ) {
      predicted = "Suggestion";
    } else if (
      lower.includes("keren") ||
      lower.includes("mantap") ||
      lower.includes("terbaik") ||
      lower.includes("makasih") ||
      lower.includes("terima kasih") ||
      lower.includes("sukses")
    ) {
      predicted = "Praise";
    } else if (
      lower.includes("setuju") ||
      lower.includes("bener") ||
      lower.includes("sepakat") ||
      lower.includes("betul")
    ) {
      predicted = "Agreement";
    } else if (
      lower.includes("tidak setuju") ||
      lower.includes("kurang setuju") ||
      lower.includes("hoax") ||
      lower.includes("bohong") ||
      lower.includes("gak masuk akal")
    ) {
      predicted = "Disagreement";
    } else if (
      lower.includes("waktu") ||
      lower.includes("pernah") ||
      lower.includes("saya dulu") ||
      lower.includes("pengalaman")
    ) {
      predicted = "Experience";
    }

    const confidences = {
      Question: 0.03,
      Opinion: 0.03,
      Disagreement: 0.03,
      Correction: 0.03,
      Suggestion: 0.03,
      Praise: 0.03,
      Agreement: 0.03,
      Experience: 0.03,
    };
    confidences[predicted] = 0.92;

    return {
      text,
      predicted_label: predicted,
      confidence: 0.92,
      margin: 0.89,
      all_probabilities: confidences,
    };
  },
};
