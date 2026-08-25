// Canonical label list and metadata
export const CANONICAL_LABELS = [
  "Question", "Opinion", "Disagreement", "Correction",
  "Suggestion", "Praise", "Agreement", "Experience"
];

export const LABEL_COLORS = {
  Question:     "#3B82F6",  // Blue
  Opinion:      "#8B5CF6",  // Violet
  Disagreement: "#EF4444",  // Red
  Correction:   "#F97316",  // Orange
  Suggestion:   "#14B8A6",  // Teal
  Praise:       "#EAB308",  // Yellow/Amber
  Agreement:    "#22C55E",  // Green
  Experience:   "#EC4899",  // Pink
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
export const PUBLIC_VIDEOS = [
  {
    "video_id": "0QCq6GPY8kQ",
    "title": "Bagaimana Kapal Berat Dapat Terapung?",
    "view_count": 3295730,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/0QCq6GPY8kQ/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=0QCq6GPY8kQ"
  },
  {
    "video_id": "21seK8tKSYI",
    "title": "Apa Jadinya Jika Bumi Datar?",
    "view_count": 3628019,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/21seK8tKSYI/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=21seK8tKSYI"
  },
  {
    "video_id": "2EVv7dmTFik",
    "title": "Bagaimana Matahari Terbakar Tanpa Oksigen di Luar Angkasa?",
    "view_count": 1365521,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/2EVv7dmTFik/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=2EVv7dmTFik"
  },
  {
    "video_id": "5Zi4qGpGop4",
    "title": "Dari Mana Bulan Kita Berasal?",
    "view_count": 886168,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/5Zi4qGpGop4/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=5Zi4qGpGop4"
  },
  {
    "video_id": "5_9wU8yJZ8w",
    "title": "Apakah Pesawat Sering Menabrak Burung Di Langit?",
    "view_count": 594739,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/5_9wU8yJZ8w/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=5_9wU8yJZ8w"
  },
  {
    "video_id": "6ceW7ugIKMs",
    "title": "Bagaimana Gerhana Matahari Bisa Terjadi?",
    "view_count": 763018,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/6ceW7ugIKMs/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=6ceW7ugIKMs"
  },
  {
    "video_id": "AxyPASIXz1k",
    "title": "Apakah Ada yang Lebih Kecil dari Atom?",
    "view_count": 4449621,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/AxyPASIXz1k/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=AxyPASIXz1k"
  },
  {
    "video_id": "Beod6J0genE",
    "title": "Di Sinilah Tempat di Bumi yang \u2018Tanpa\u2019 Gravitasi",
    "view_count": 988247,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/Beod6J0genE/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=Beod6J0genE"
  },
  {
    "video_id": "FGdLT8UuBZI",
    "title": "Apa Itu Gerhana Bulan Raksasa (Supermoon)?",
    "view_count": 473942,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/FGdLT8UuBZI/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=FGdLT8UuBZI"
  },
  {
    "video_id": "FMNRItiR6ZA",
    "title": "Kenapa Pluto Tidak Lagi Dianggap Sebagai Planet?",
    "view_count": 3985052,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/FMNRItiR6ZA/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=FMNRItiR6ZA"
  },
  {
    "video_id": "FjFsx6iQE3Y",
    "title": "Apakah Ada Kehidupan Lain di Luar Bumi?",
    "view_count": 5754741,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/FjFsx6iQE3Y/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=FjFsx6iQE3Y"
  },
  {
    "video_id": "H_5TPzquRyo",
    "title": "Apakah Teori Gravitasi dan Evolusi Hanya Sebuah \"Teori\"? (Ft. Sainsbro)",
    "view_count": 1308470,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/H_5TPzquRyo/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=H_5TPzquRyo"
  },
  {
    "video_id": "JRJ1ngbUe6A",
    "title": "Bagaimana Satelit Bisa Melayang Dan Tak Jatuh Dari Langit? (Ft. Telkom Indonesia)",
    "view_count": 1116343,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/JRJ1ngbUe6A/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=JRJ1ngbUe6A"
  },
  {
    "video_id": "NVDIHTGVcLc",
    "title": "Seberapa Tinggi Kita Bisa Mendirikan Bangunan?",
    "view_count": 4319694,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/NVDIHTGVcLc/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=NVDIHTGVcLc"
  },
  {
    "video_id": "PEbhbW4rgy4",
    "title": "Apa Yang Akan Terjadi Jika Matahari Tiba Tiba Lenyap?",
    "view_count": 1375067,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/PEbhbW4rgy4/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=PEbhbW4rgy4"
  },
  {
    "video_id": "QK01ROEqJ1A",
    "title": "Apakah Ada Ujung Alam Semesta?",
    "view_count": 16091885,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/QK01ROEqJ1A/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=QK01ROEqJ1A"
  },
  {
    "video_id": "RBFhyVux3IE",
    "title": "Apakah Flash Disk Makin Berat Ketika Diisi Data?",
    "view_count": 332167,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/RBFhyVux3IE/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=RBFhyVux3IE"
  },
  {
    "video_id": "T8g_hUpx9VU",
    "title": "Apa Benda Paling Panas Sejagat Raya?",
    "view_count": 1000172,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/T8g_hUpx9VU/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=T8g_hUpx9VU"
  },
  {
    "video_id": "T9ttUfGG7EE",
    "title": "Benarkah Manusia Pernah Mendarat di Bulan?",
    "view_count": 1733192,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/T9ttUfGG7EE/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=T9ttUfGG7EE"
  },
  {
    "video_id": "Tx87wEaDtxo",
    "title": "Apa Itu Black Hole Sebenarnya?",
    "view_count": 2165562,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/Tx87wEaDtxo/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=Tx87wEaDtxo"
  },
  {
    "video_id": "YljSXjd4lnk",
    "title": "Kenapa Pesawat Bisa Terbang?",
    "view_count": 3037930,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/YljSXjd4lnk/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=YljSXjd4lnk"
  },
  {
    "video_id": "YxgOhIQJX3Q",
    "title": "Bisakah Pesawat Terbang ke Luar Angkasa?",
    "view_count": 1509732,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/YxgOhIQJX3Q/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=YxgOhIQJX3Q"
  },
  {
    "video_id": "dghOCZmSEUQ",
    "title": "Kenapa Luar Angkasa Gelap?",
    "view_count": 1090178,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/dghOCZmSEUQ/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=dghOCZmSEUQ"
  },
  {
    "video_id": "eXml_nlmPoE",
    "title": "Kenapa Bumi Bulat, Ngga Kotak?",
    "view_count": 870235,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/eXml_nlmPoE/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=eXml_nlmPoE"
  },
  {
    "video_id": "impJiSfof9E",
    "title": "BREAKING NEWS: Foto Black Hole Pertama Dalam Sejarah",
    "view_count": 2850803,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/impJiSfof9E/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=impJiSfof9E"
  },
  {
    "video_id": "iq0yOkj3d28",
    "title": "Kenapa Bagi Kita, Bumi Terlihat Datar?",
    "view_count": 1158904,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/iq0yOkj3d28/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=iq0yOkj3d28"
  },
  {
    "video_id": "iyJeozHhvJI",
    "title": "Apa Yang Terjadi Jika Bulan Lenyap?",
    "view_count": 1282801,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/iyJeozHhvJI/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=iyJeozHhvJI"
  },
  {
    "video_id": "jPyd0Xv5LfY",
    "title": "Misteri Besar Sepeda yang Belum Terpecahkan",
    "view_count": 1197950,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/jPyd0Xv5LfY/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=jPyd0Xv5LfY"
  },
  {
    "video_id": "qis44fqpuAU",
    "title": "Jika Ada Mesin Waktu, Apa Yang Ingin Kalian Lakukan? (Diskusi)",
    "view_count": 284896,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/qis44fqpuAU/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=qis44fqpuAU"
  },
  {
    "video_id": "rha05J96bOM",
    "title": "Seberapa Besar Bintang Bisa Terbentuk?",
    "view_count": 1009287,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/rha05J96bOM/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=rha05J96bOM"
  },
  {
    "video_id": "rloh5wZxFrU",
    "title": "Seberapa Jauh Bumi dan Matahari?",
    "view_count": 692354,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/rloh5wZxFrU/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=rloh5wZxFrU"
  },
  {
    "video_id": "t5SaFgSaM_M",
    "title": "Seberapa Perlu Kita Mencari \u2018Bumi\u2019 Baru?",
    "view_count": 1106786,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/t5SaFgSaM_M/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=t5SaFgSaM_M"
  },
  {
    "video_id": "twXOQyxZWxY",
    "title": "Benarkah Ngelipat Kertas Bisa Ngebawa Kita Sampai ke Bulan?",
    "view_count": 431521,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/twXOQyxZWxY/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=twXOQyxZWxY"
  },
  {
    "video_id": "uA3cMFjqfaM",
    "title": "Bisakah Kita Membangun Koloni di Mars?",
    "view_count": 1718138,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/uA3cMFjqfaM/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=uA3cMFjqfaM"
  },
  {
    "video_id": "zbSe0xE7tg0",
    "title": "Apakah Manusia Bisa Hidup di Luar Angkasa?",
    "view_count": 388118,
    "comment_count": 0,
    "thumbnail_url": "https://i.ytimg.com/vi/zbSe0xE7tg0/mqdefault.jpg",
    "youtube_url": "https://www.youtube.com/watch?v=zbSe0xE7tg0"
  }
];
