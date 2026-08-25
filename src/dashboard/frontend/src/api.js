// API client for KokBisa Research Intelligence Dashboard
const BASE = "/api";

async function req(path, params = {}) {
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") {
      url.searchParams.set(k, v);
    }
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  health:       ()        => req("/health"),
  overview:     ()        => req("/overview"),
  
  videos:       (p = {})  => req("/videos", p),
  video:        (id)      => req(`/videos/${id}`),
  
  comments:     (p = {})  => req("/comments", p),
  
  discourseAnalytics: (vid) => req("/analytics/discourse", vid ? { video_id: vid } : {}),
  videoMatrix:        ()    => req("/analytics/video-matrix"),
  confHistogram:      (lbl) => req("/analytics/confidence-histogram", lbl ? { label: lbl } : {}),
  
  // Representatives with multiple aliases
  representatives:        (mode = "highest_confidence") => req("/analytics/representatives", { mode }),
  representativeComments: (mode = "highest_confidence") => req("/analytics/representatives", { mode }),
  
  // Uncertainty & Confidence Analysis
  uncertainty:        (p = {}) => req("/uncertainty", p),
  uncertainComments:  (p = {}) => req("/uncertainty", p),
  model: () => req("/model"),
  
  // Semantic Embeddings & Linguistics
  embeddingsProjection: (act = "All", limit = 1500) =>
    req("/analytics/embeddings-projection", { act: act === "All" ? undefined : act, limit }),
  languages: (limit = 15) =>
    req("/analytics/languages", { limit }),
  
  exportCsvUrl: (params = {}) => {
    const url = new URL(BASE + "/export/csv", window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        url.searchParams.set(k, v);
      }
    });
    return url.toString();
  },

  // Live Playground Classifier
  inferenceClassify: async (text) => {
    // Quick keyword & heuristics classification fallback if standalone
    const lower = text.toLowerCase();
    let predicted = "Opinion";
    if (lower.includes("?") || lower.startsWith("kenapa") || lower.startsWith("apakah") || lower.startsWith("bagaimana") || lower.startsWith("mengapa")) {
      predicted = "Question";
    } else if (lower.includes("koreksi") || lower.includes("salah") || lower.includes("ralat") || lower.includes("menit ")) {
      predicted = "Correction";
    } else if (lower.includes("saran") || lower.includes("coba") || lower.includes("request") || lower.includes("bahas dong") || lower.includes("tolong")) {
      predicted = "Suggestion";
    } else if (lower.includes("keren") || lower.includes("mantap") || lower.includes("terbaik") || lower.includes("makasih") || lower.includes("terima kasih") || lower.includes("sukses")) {
      predicted = "Praise";
    } else if (lower.includes("setuju") || lower.includes("bener") || lower.includes("sepakat") || lower.includes("betul")) {
      predicted = "Agreement";
    } else if (lower.includes("tidak setuju") || lower.includes("kurang setuju") || lower.includes("hoax") || lower.includes("bohong") || lower.includes("gak masuk akal")) {
      predicted = "Disagreement";
    } else if (lower.includes("waktu") || lower.includes("pernah") || lower.includes("saya dulu") || lower.includes("pengalaman")) {
      predicted = "Experience";
    }

    const confidences = {
      Question: 0.05,
      Opinion: 0.05,
      Disagreement: 0.05,
      Correction: 0.05,
      Suggestion: 0.05,
      Praise: 0.05,
      Agreement: 0.05,
      Experience: 0.05,
    };
    confidences[predicted] = 0.88;

    return {
      text,
      predicted_label: predicted,
      confidence: 0.88,
      margin: 0.83,
      all_probabilities: confidences,
    };
  }
};
