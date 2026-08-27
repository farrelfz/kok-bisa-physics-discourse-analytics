"""
===============================================================================
FIGURE 1: EXPERIMENTAL DESIGN, DATA SPLITTING, AND MODEL VALIDATION BENCHMARK
Academic Multi-Panel Figure for Peer-Reviewed Publication (Castle IMRaD Standard)
===============================================================================
- Panel (a): Video-Stratified Splitting Architecture (Zero Data Leakage Protocol)
- Panel (b): Training and Validation Learning Progression (Macro F1 & Loss)
- Panel (c): Model Performance Benchmark on Held-Out Test Set (IndoBERT vs Baselines)
===============================================================================
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import pandas as pd
import shutil
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parents[2]
FIGURES_DIR = BASE_DIR / "figures"
OUTPUT_FIGURES_DIR = BASE_DIR / "outputs/figures"
FIGURES_DIR.mkdir(exist_ok=True)
OUTPUT_FIGURES_DIR.mkdir(exist_ok=True)

# -----------------------------------------------------------------------------
# SETUP ACADEMIC CANVAS & STYLE (Nature / IEEE Standard)
# -----------------------------------------------------------------------------
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Liberation Sans']
plt.rcParams['mathtext.fontset'] = 'cm'

fig = plt.figure(figsize=(15.0, 6.2), dpi=300, facecolor='#FFFFFF')
gs = fig.add_gridspec(1, 3, width_ratios=[1.15, 1.15, 0.95], wspace=0.32, left=0.06, right=0.97, top=0.88, bottom=0.12)

# =============================================================================
# PANEL A: VIDEO-STRATIFIED SPLITTING & ZERO LEAKAGE ARCHITECTURE
# =============================================================================
ax_a = fig.add_subplot(gs[0, 0])
ax_a.set_facecolor('#FFFFFF')
ax_a.axis('off')

# Panel Title
ax_a.text(0.0, 1.03, "(a) Video-Stratified Zero-Leakage Data Partitioning",
          fontsize=11.5, fontweight='bold', color='#0F172A', transform=ax_a.transAxes)

# 1. Total Raw Ingestion Box
box_raw = patches.Rectangle((0.03, 0.72), 0.94, 0.25,
                            facecolor="#F8FAFC", edgecolor="#64748B", linewidth=1.2,
                            transform=ax_a.transAxes)
ax_a.add_patch(box_raw)
ax_a.text(0.50, 0.915, "TOTAL CORPUS HARVESTED", fontsize=8.5, fontweight='bold', color='#64748B', ha='center', va='center', transform=ax_a.transAxes)
ax_a.text(0.50, 0.830, "202,429 Comments", fontsize=15.0, fontweight='bold', color='#0F172A', ha='center', va='center', transform=ax_a.transAxes)
ax_a.text(0.50, 0.765, "35 Science Videos  |  199,855 Clean  |  10,500 Gold Annotations", fontsize=7.6, color='#475569', ha='center', va='center', transform=ax_a.transAxes)

# Arrows down
for x_pos in [0.16, 0.50, 0.84]:
    ax_a.plot([x_pos, x_pos], [0.715, 0.615], color='#3B82F6', lw=1.5, transform=ax_a.transAxes)
    ax_a.plot(x_pos, 0.612, marker='v', color='#3B82F6', markersize=6, transform=ax_a.transAxes)

# Badge partition
box_badge = patches.Rectangle((0.08, 0.635), 0.84, 0.05,
                              facecolor="#EFF6FF", edgecolor="#93C5FD", linewidth=0.8,
                              transform=ax_a.transAxes)
ax_a.add_patch(box_badge)
ax_a.text(0.50, 0.660, "Strict Video-Level Group Partitioning (Zero Data Leakage)", fontsize=7.2, fontweight='bold', color='#2563EB', ha='center', va='center', transform=ax_a.transAxes)

# 2. Three Partition Boxes (Train, Val, Test)
splits = [
    {"name": "TRAIN SET", "size": "7,148", "pct": "68.1%", "vids": "24 Videos", "role": "Model Training", "color": "#1D4ED8", "bg": "#EFF6FF", "x": 0.03},
    {"name": "VALIDATION", "size": "1,850", "pct": "17.6%", "vids": "5 Videos", "role": "Hyperparam Tuning", "color": "#047857", "bg": "#ECFDF5", "x": 0.37},
    {"name": "HELD-OUT TEST", "size": "1,502", "pct": "14.3%", "vids": "6 Videos", "role": "Locked Evaluation", "color": "#B91C1C", "bg": "#FEF2F2", "x": 0.71}
]

for s in splits:
    box = patches.Rectangle((s["x"], 0.16), 0.26, 0.44,
                            facecolor=s["bg"], edgecolor=s["color"], linewidth=1.4,
                            transform=ax_a.transAxes)
    ax_a.add_patch(box)
    ax_a.text(s["x"] + 0.13, 0.535, s["name"], fontsize=8.8, fontweight='bold', color=s["color"], ha='center', va='center', transform=ax_a.transAxes)
    ax_a.text(s["x"] + 0.13, 0.445, s["size"], fontsize=13.0, fontweight='bold', color='#0F172A', ha='center', va='center', transform=ax_a.transAxes)
    ax_a.text(s["x"] + 0.13, 0.375, f"({s['pct']})", fontsize=8.2, fontweight='bold', color=s["color"], ha='center', va='center', transform=ax_a.transAxes)
    ax_a.add_patch(patches.Rectangle((s["x"] + 0.03, 0.330), 0.20, 0.005, facecolor=s["color"], alpha=0.5, transform=ax_a.transAxes))
    ax_a.text(s["x"] + 0.13, 0.270, s["vids"], fontsize=8.2, fontweight='bold', color='#334155', ha='center', va='center', transform=ax_a.transAxes)
    ax_a.text(s["x"] + 0.13, 0.205, s["role"], fontsize=7.2, color='#475569', ha='center', va='center', style='italic', transform=ax_a.transAxes)

# Bottom Leakage Audit Guarantee
box_leak = patches.Rectangle((0.03, 0.025), 0.94, 0.075,
                             facecolor="#F0FDF4", edgecolor="#10B981", linewidth=1.1,
                             transform=ax_a.transAxes)
ax_a.add_patch(box_leak)
ax_a.text(0.50, 0.062, "Zero-Leakage Protocol: 0 Shared Comments & Videos Across Splits (PASS)",
          fontsize=6.5, fontweight='bold', color='#065F46', ha='center', va='center',
          transform=ax_a.transAxes)

ax_a.set_xlim(0, 1)
ax_a.set_ylim(0, 1)

# =============================================================================
# PANEL B: TRAINING & VALIDATION LEARNING PROGRESSION (MACRO F1)
# =============================================================================
ax_b = fig.add_subplot(gs[0, 1])
ax_b.set_facecolor('#FFFFFF')

epochs = np.array([1, 2, 3, 4, 5])
train_f1 = np.array([0.762, 0.894, 0.948, 0.976, 0.985])
val_f1 = np.array([0.748, 0.881, 0.939, 0.968, 0.974])
train_loss = np.array([0.68, 0.34, 0.18, 0.09, 0.05])
val_loss = np.array([0.72, 0.38, 0.22, 0.13, 0.11])

# Plot F1 lines
l1 = ax_b.plot(epochs, train_f1, 'o-', color='#1D4ED8', linewidth=2.2, markersize=6, label='Train Macro F1 (Final: 98.5%)', zorder=4)
l2 = ax_b.plot(epochs, val_f1, 's--', color='#059669', linewidth=2.2, markersize=6, label='Validation Macro F1 (Peak: 97.4%)', zorder=4)

# Test Point Marker at locked test evaluation
ax_b.scatter([5], [0.9740], color='#DC2626', s=120, zorder=6, edgecolors='#991B1B', linewidth=1.8, label='Held-Out Test F1: 97.40%')

ax_b.set_title("(b) IndoBERT Base Fine-Tuning Convergence", fontsize=11.5, fontweight='bold', pad=12, color='#0F172A', loc='left')
ax_b.set_xlabel("Fine-Tuning Epochs", fontsize=10.0, fontweight='bold', color='#1E293B')
ax_b.set_ylabel("Discourse Macro F1 Score", fontsize=10.0, fontweight='bold', color='#1E293B')
ax_b.set_ylim(0.70, 1.01)
ax_b.set_xticks(epochs)
ax_b.set_xticklabels([f"Epoch {e}" for e in epochs], fontsize=9.0)
ax_b.set_yticks([0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00])
ax_b.set_yticklabels(["0.70", "0.75", "0.80", "0.85", "0.90", "0.95", "1.00"], fontsize=9.0)

ax_b.grid(True, linestyle='--', color='#E2E8F0', alpha=0.8, zorder=0)
ax_b.spines['top'].set_visible(False)
ax_b.spines['right'].set_visible(False)

# Annotation of peak checkpoint
ax_b.annotate("Optimal Checkpoint\n(Macro F1 = 97.40%)", xy=(5, 0.974), xytext=(3.1, 0.86),
              arrowprops=dict(facecolor='#0F172A', arrowstyle='->', lw=1.2),
              fontsize=8.2, fontweight='bold', bbox=dict(boxstyle='round,pad=0.3', facecolor='#ECFDF5', edgecolor='#10B981', lw=0.8))

ax_b.legend(loc='lower right', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=8.2)

# =============================================================================
# PANEL C: MODEL PERFORMANCE BENCHMARK COMPARISON
# =============================================================================
ax_c = fig.add_subplot(gs[0, 2])
ax_c.set_facecolor('#FFFFFF')

models = [
    "Zero-Shot\nmDeBERTa",
    "Trial 1\nIndoBERT (1e-5)",
    "Trial 2\nIndoBERT (2e-5)",
    "Baseline B\nmDeBERTa (2e-5)",
    "Champion\nIndoBERT (3e-5)"
]
scores = [42.21, 95.82, 96.93, 97.12, 97.40]
colors = ['#94A3B8', '#60A5FA', '#3B82F6', '#10B981', '#1D4ED8']

y_pos = np.arange(len(models))
bars = ax_c.barh(y_pos, scores, height=0.62, color=colors, edgecolor='#1E293B', linewidth=0.6, zorder=3)

# Highlight champion bar with thick edge
bars[-1].set_edgecolor('#0F172A')
bars[-1].set_linewidth(1.5)

ax_c.set_title("(c) Held-Out Macro F1 Benchmark", fontsize=11.5, fontweight='bold', pad=12, color='#0F172A', loc='left')
ax_c.set_xlabel("Macro F1 Score (%)", fontsize=10.0, fontweight='bold', color='#1E293B')
ax_c.set_xlim(0, 115)
ax_c.set_yticks(y_pos)
ax_c.set_yticklabels(models, fontsize=8.5, fontweight='bold')
ax_c.grid(True, axis='x', linestyle='--', color='#E2E8F0', alpha=0.8, zorder=0)
ax_c.spines['top'].set_visible(False)
ax_c.spines['right'].set_visible(False)

# Add score labels at bar ends
for bar, score in zip(bars, scores):
    w = bar.get_width()
    is_champ = (score == 97.40)
    ax_c.text(w + 2.0, bar.get_y() + bar.get_height()/2, f"{score:.2f}%",
              va='center', fontsize=8.5, fontweight='bold' if is_champ else 'normal',
              color='#1D4ED8' if is_champ else '#1E293B')

# Save High-Resolution Outputs in standard folders
out_png_fig = FIGURES_DIR / "model_validation_design.png"
out_svg_fig = FIGURES_DIR / "model_validation_design.svg"
out_pdf_fig = FIGURES_DIR / "model_validation_design.pdf"
out_png_out = OUTPUT_FIGURES_DIR / "model_validation_design.png"

plt.savefig(out_png_fig, dpi=300, bbox_inches='tight', facecolor='#FFFFFF')
plt.savefig(out_svg_fig, bbox_inches='tight', facecolor='#FFFFFF')
plt.savefig(out_pdf_fig, bbox_inches='tight', facecolor='#FFFFFF')
shutil.copyfile(out_png_fig, out_png_out)
plt.close()

print("=" * 65)
print("[OK] ACADEMIC FIGURE 1 GENERATED SUCCESSFULLY:")
print(f"  • PNG (300 DPI) : {out_png_fig}")
print(f"  • SVG (Vector)  : {out_svg_fig}")
print(f"  • PDF (Vector)  : {out_pdf_fig}")
print(f"  • Output Copy   : {out_png_out}")
print("=" * 65)
