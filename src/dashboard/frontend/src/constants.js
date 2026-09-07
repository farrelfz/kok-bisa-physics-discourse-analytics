// Canonical label list and metadata
export const CANONICAL_LABELS = [
  "Question", "Opinion", "Disagreement", "Correction",
  "Suggestion", "Praise", "Agreement", "Experience"
];

export const LABEL_COLORS = {
  Opinion:      "#0B5CAB",  // Royal Blue
  Question:     "#D92524",  // Vibrant Red
  Praise:       "#F2721C",  // Orange
  Experience:   "#E5AD12",  // Gold / Yellow
  Suggestion:   "#2CA048",  // Forest Green
  Disagreement: "#7B52A1",  // Purple
  Agreement:    "#761E48",  // Maroon / Wine
  Correction:   "#63666A",  // Slate Grey
};

export const LABEL_DESCRIPTIONS = {
  Question:     "Comments asking for information, explanation, clarification, or scientific understanding.",
  Opinion:      "Comments expressing personal views, interpretations, beliefs, or evaluations.",
  Disagreement: "Comments expressing opposition, rejection, or disagreement toward an idea or viewpoint.",
  Correction:   "Comments attempting to correct information, misconceptions, facts, or scientific explanations.",
  Suggestion:   "Comments proposing ideas, recommendations, improvements, or possible future topics.",
  Praise:       "Comments expressing appreciation, admiration, enjoyment, or positive feedback.",
  Agreement:    "Comments explicitly supporting or agreeing with an idea, explanation, or another viewer.",
  Experience:   "Comments sharing personal experiences, observations, or real-life science stories.",
};

export const LABEL_IDS = {
  Question:     0,
  Opinion:      1,
  Disagreement: 2,
  Correction:   3,
  Suggestion:   4,
  Praise:       5,
  Agreement:    6,
  Experience:   7,
};

// Verified Model Architecture Constants
export const BEST_MODEL_METRICS = {
  model_name:       "indobenchmark/indobert-base-p1",
  macro_f1:         0.9740,
  weighted_f1:      0.9772,
  accuracy:         0.9773,
  macro_precision:  0.9798,
  macro_recall:     0.9685,
  learning_rate:    "3e-05",
  batch_size:       16,
  epochs:           5,
  total_annotated:  10500,
  train_size:       7148,
  validation_size:  1850,
  test_size:        1502,
  corpus_size:      202429,
  public_videos:    35,
  private_videos:   1,
  total_playlist:   36,
  channel:          "Kok Bisa?",
  playlist:         "PLCnD2jU_siVrn_0fbUVeUX-ZiGNNsiXC4",
};

// Verified experiment benchmarks across 5 configurations
export const EXPERIMENTS = [
  {
    id:           "Trial 1",
    name:         "IndoBERT Base (LR 1e-5)",
    model:        "indobenchmark/indobert-base-p1",
    architecture: "IndoBERT Base",
    lr:           "1e-05",
    batch_size:   16,
    epochs:       5,
    macro_f1:     0.9582,
    weighted_f1:  0.9654,
    accuracy:     0.9660,
    is_best:      false,
    status:       "Completed",
  },
  {
    id:           "Trial 2",
    name:         "IndoBERT Base (LR 2e-5)",
    model:        "indobenchmark/indobert-base-p1",
    architecture: "IndoBERT Base",
    lr:           "2e-05",
    batch_size:   16,
    epochs:       5,
    macro_f1:     0.9693,
    weighted_f1:  0.9739,
    accuracy:     0.9741,
    is_best:      false,
    status:       "Completed",
  },
  {
    id:           "Champion Model",
    name:         "IndoBERT Base (LR 3e-5) — Best",
    model:        "indobenchmark/indobert-base-p1",
    architecture: "IndoBERT Base",
    lr:           "3e-05",
    batch_size:   16,
    epochs:       5,
    macro_f1:     0.9740,
    weighted_f1:  0.9772,
    accuracy:     0.9773,
    macro_precision: 0.9798,
    macro_recall:    0.9685,
    is_best:      true,
    status:       "Selected Champion",
  },
  {
    id:           "Baseline A",
    name:         "mDeBERTa-v3 Base (LR 1e-5)",
    model:        "microsoft/mdeberta-v3-base",
    architecture: "mDeBERTa-v3 Base",
    lr:           "1e-05",
    batch_size:   8,
    epochs:       5,
    macro_f1:     0.9685,
    weighted_f1:  0.9721,
    accuracy:     0.9725,
    is_best:      false,
    status:       "Completed",
  },
  {
    id:           "Baseline B",
    name:         "mDeBERTa-v3 Base (LR 2e-5)",
    model:        "microsoft/mdeberta-v3-base",
    architecture: "mDeBERTa-v3 Base",
    lr:           "2e-05",
    batch_size:   8,
    epochs:       5,
    macro_f1:     0.9712,
    weighted_f1:  0.9750,
    accuracy:     0.9754,
    is_best:      false,
    status:       "Completed",
  },
];

// Video list — 35 public science education videos

