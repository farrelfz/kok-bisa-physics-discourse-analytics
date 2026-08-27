# ============================================================
# KEY RESULT 2 — DISCOURSE COMPOSITION OF TOP 7 VIDEOS
# ============================================================

import os
import json
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# ------------------------------------------------------------
# LOAD FINAL DATA & VIDEO METADATA
# ------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "outputs/inference/full_corpus_predictions.parquet")
VIDEO_META_PATH = os.path.join(BASE_DIR, "data/processed/video_stats_enriched.json")

df = pd.read_parquet(DATA_PATH)

# Load video titles mapping from enriched video metadata
if os.path.exists(VIDEO_META_PATH):
    with open(VIDEO_META_PATH, "r", encoding="utf-8") as f:
        video_meta = json.load(f)
    video_title_map = {v["video_id"]: v["title"] for v in video_meta}
else:
    # Fallback to CSV inventory if JSON is not found
    inv_path = os.path.join(BASE_DIR, "reports/02_video_inventory.csv")
    inv_df = pd.read_csv(inv_path)
    video_title_map = dict(zip(inv_df["video_id"], inv_df["title"]))

# Map video_title into DataFrame
df["video_title"] = df["video_id"].map(video_title_map).fillna(df["video_id"])

VIDEO_COL = "video_id"
TITLE_COL = "video_title"
LABEL_COL = "predicted_label"

# ------------------------------------------------------------
# IDENTIFY TOP 7 VIDEOS BY NUMBER OF COMMENTS
# ------------------------------------------------------------

video_counts = (
    df.groupby([VIDEO_COL, TITLE_COL])
    .size()
    .reset_index(name="comment_count")
    .sort_values("comment_count", ascending=False)
)

top7_videos = video_counts.head(7).copy()
print("Top 7 Most Discussed Videos:")
print(top7_videos[[TITLE_COL, "comment_count"]])

# ============================================================
# DISCOURSE COMPOSITION FOR TOP 7 MOST-DISCUSSED VIDEOS
# ============================================================

DISCOURSE_ORDER = [
    "Opinion",
    "Question",
    "Praise",
    "Experience",
    "Suggestion",
    "Disagreement",
    "Agreement",
    "Correction"
]

# Exact canonical color palette matching the Key Results poster
DISCOURSE_COLORS = {
    "Opinion": "#0B5CAB",       # Royal Blue
    "Question": "#D92524",      # Vibrant Red
    "Praise": "#F2721C",        # Orange
    "Experience": "#E5AD12",    # Yellow/Gold
    "Suggestion": "#2CA048",    # Forest Green
    "Disagreement": "#7B52A1",  # Purple
    "Agreement": "#761E48",     # Deep Wine / Maroon
    "Correction": "#63666A",    # Slate Grey
}

COLOR_PALETTE = [DISCOURSE_COLORS[act] for act in DISCOURSE_ORDER]

# Keep only comments from Top 7 videos
top7_ids = top7_videos[VIDEO_COL].tolist()

plot_df = df[
    df[VIDEO_COL].isin(top7_ids)
].copy()

# Count discourse acts
composition = pd.crosstab(
    plot_df[VIDEO_COL],
    plot_df[LABEL_COL],
    normalize="index"
)

# Ensure all 8 classes exist
composition = composition.reindex(
    columns=DISCOURSE_ORDER,
    fill_value=0
)

# Restore ranking order
composition = composition.reindex(
    top7_videos[VIDEO_COL]
)

# ------------------------------------------------------------
# CREATE DISPLAY LABELS
# ------------------------------------------------------------

title_map = dict(
    zip(
        top7_videos[VIDEO_COL],
        top7_videos[TITLE_COL]
    )
)

count_map = dict(
    zip(
        top7_videos[VIDEO_COL],
        top7_videos["comment_count"]
    )
)

labels = []

for i, video_id in enumerate(composition.index, start=1):
    title = str(title_map.get(video_id, video_id))

    # Truncate long titles cleanly
    if len(title) > 38:
        title = title[:35] + "..."

    count = count_map.get(video_id, 0)

    labels.append(
        f"#{i} {title}\n"
        f"n = {count:,}"
    )

composition.index = labels

# ============================================================
# PLOT
# ============================================================

fig, ax = plt.subplots(
    figsize=(13, 7.5),
    dpi=300
)

composition.plot(
    kind="barh",
    stacked=True,
    ax=ax,
    width=0.70,
    color=COLOR_PALETTE,
    edgecolor="none"
)

ax.set_xlim(0, 1)

ax.set_xlabel(
    "Proportion of Classified Comments",
    fontweight="bold",
    fontsize=11.5,
    labelpad=10
)

ax.set_ylabel("")

ax.set_title(
    "Discourse Composition of the 7 Most-Discussed Videos",
    fontsize=15,
    fontweight="bold",
    pad=16
)

ax.set_xticks(
    [0, 0.25, 0.50, 0.75, 1.00]
)

ax.set_xticklabels(
    ["0%", "25%", "50%", "75%", "100%"],
    fontsize=10.5
)

ax.tick_params(axis="y", labelsize=10)

ax.invert_yaxis()

ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.spines["left"].set_visible(False)
ax.spines["bottom"].set_color("#CCCCCC")

ax.grid(
    axis="x",
    alpha=0.3,
    linestyle="--",
    color="#B0BEC5"
)

# Legend positioned below the plot in 2 clean rows matching the Key Results poster
ax.legend(
    title="Discourse Act",
    bbox_to_anchor=(0.5, -0.15),
    loc="upper center",
    ncol=4,
    frameon=True,
    facecolor="#F8FAFC",
    edgecolor="#E2E8F0",
    fontsize=10.5,
    title_fontproperties={"weight": "bold", "size": 11}
)

plt.tight_layout()

output_fig_path = os.path.join(BASE_DIR, "top7_video_discourse_composition.png")
plt.savefig(
    output_fig_path,
    dpi=300,
    bbox_inches="tight",
    facecolor="white"
)

print(f"\nFigure successfully saved with aligned palette to: {output_fig_path}")
