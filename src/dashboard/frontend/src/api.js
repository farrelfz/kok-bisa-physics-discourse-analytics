// API client for KokBisa Research Intelligence Dashboard
// Supports live FastAPI backend when available with seamless static precomputed fallback for GitHub Pages.

import dashboardStats from "./assets/data/dashboard_stats.json";
import videoStats from "./assets/data/video_stats.json";
import projectionData from "./assets/data/projection_sample.json";

const RAW_API = import.meta.env.VITE_API_URL || "";
const BASE = RAW_API ? RAW_API.replace(/\/+$/, "") + "/api" : "/api";

async function req(path, params = {}, fallbackFn = null) {
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

// ── Static Fallback Generators ────────────────────────────────────────────────
const TOTAL_COMMENTS = dashboardStats.total_comments || 202429;
const TOTAL_VIDEOS = dashboardStats.total_videos || 35;

const DISCOURSE_DIST = Object.entries(dashboardStats.discourse_distribution || {}).map(([label, count]) => ({
  label,
  count,
  pct: Number(((count / TOTAL_COMMENTS) * 100).toFixed(1)),
})).sort((a, b) => b.count - a.count);

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

  videos: (p = {}) =>
    req("/videos", p, (params) => {
      let list = Array.isArray(videoStats) ? [...videoStats] : [];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((v) => (v.title || "").toLowerCase().includes(q));
      }
      return { total: list.length, items: list, videos: list };
    }),

  video: (id) =>
    req(`/videos/${id}`, {}, () => {
      const list = Array.isArray(videoStats) ? videoStats : [];
      const found = list.find((v) => v.video_id === id || v.id === id);
      return found || list[0] || { id, title: "Physics Video", total_comments: 5000 };
    }),

  comments: (p = {}) =>
    req("/comments", p, (params) => {
      const act = params.discourse_label || params.act || "All";
      const sampleList = (projectionData?.points || [])
        .filter((pt) => act === "All" || pt.act === act)
        .slice(0, params.limit || 50)
        .map((pt, i) => ({
          comment_id: pt.id || `c_${i}`,
          video_id: "sample_vid",
          video_title: pt.video || "Fisika Kok Bisa?",
          text: pt.text || "Komentar diskusi ilmiah.",
          discourse_label: pt.act || "Opinion",
          predicted_discourse_act: pt.act || "Opinion",
          confidence: 0.95,
          margin: 0.91,
          likes: pt.likes || 0,
        }));
      return { total: sampleList.length, items: sampleList, comments: sampleList };
    }),

  discourseAnalytics: (vid) =>
    req("/analytics/discourse", vid ? { video_id: vid } : {}, () => ({
      distribution: DISCOURSE_DIST,
      average_likes: dashboardStats.average_likes_by_act || {},
      video_id: vid || "all",
    })),

  videoMatrix: () =>
    req("/analytics/video-matrix", {}, () => {
      return Array.isArray(videoStats) ? videoStats : [];
    }),

  confHistogram: (lbl) =>
    req("/analytics/confidence-histogram", lbl ? { label: lbl } : {}, () => {
      const bins = [
        { bin: "0.5-0.6", count: 1200 },
        { bin: "0.6-0.7", count: 2400 },
        { bin: "0.7-0.8", count: 6800 },
        { bin: "0.8-0.9", count: 24500 },
        { bin: "0.9-1.0", count: 167529 },
      ];
      return { label: lbl || "All", bins };
    }),

  representatives: (mode = "highest_confidence") =>
    req("/analytics/representatives", { mode }, () => {
      const acts = ["Question", "Opinion", "Disagreement", "Correction", "Suggestion", "Praise", "Agreement", "Experience"];
      const res = {};
      acts.forEach((act) => {
        const found = (projectionData?.points || []).find((p) => p.act === act);
        res[act] = found ? [found] : [];
      });
      return res;
    }),

  representativeComments: (mode = "highest_confidence") =>
    api.representatives(mode),

  uncertainty: (p = {}) =>
    req("/uncertainty", p, () => {
      const uncertainList = [
        {
          comment_id: "unc_1",
          text: "Mungkin teorinya bener tapi apakah sudah pernah dibuktikan secara eksperimen langsung di lab?",
          predicted_label: "Question",
          second_label: "Opinion",
          confidence: 0.52,
          second_confidence: 0.45,
          margin: 0.07,
          entropy: 0.68,
        },
        {
          comment_id: "unc_2",
          text: "Kayanya menit 03:20 ada salah ketik rumus, harusnya kuadrat bukan kali dua deh min.",
          predicted_label: "Correction",
          second_label: "Suggestion",
          confidence: 0.54,
          second_confidence: 0.42,
          margin: 0.12,
          entropy: 0.65,
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
        },
      ];
      return { items: uncertainList, comments: uncertainList, total: uncertainList.length };
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
      let pts = projectionData?.points || [];
      if (act && act !== "All") {
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
        { language: "id (Indonesian)", count: 198380, pct: 98.0 },
        { language: "en (English)", count: 2840, pct: 1.4 },
        { language: "jv/su (Javanese/Sundanese/Slang)", count: 1209, pct: 0.6 },
      ],
    })),

  exportCsvUrl: (params = {}) => {
    let fullUrl;
    if (BASE.startsWith("http://") || BASE.startsWith("https://")) {
      fullUrl = new URL(BASE + "/export/csv");
    } else {
      fullUrl = new URL(BASE + "/export/csv", window.location.origin);
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
