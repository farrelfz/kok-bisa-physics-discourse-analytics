"""
===============================================================================
FIGURE 1: INDOBERT BASE FINE-TUNING CONVERGENCE
Academic Figure for Peer-Reviewed Publication (Castle IMRaD Standard)
===============================================================================
Plots the training and validation learning progression across 5 fine-tuning
epochs, highlighting the optimal checkpoint at peak Macro F1 = 97.40%.
===============================================================================
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import shutil
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parents[2]
FIGURES_DIR = BASE_DIR / "figures"
OUTPUT_FIGURES_DIR = BASE_DIR / "outputs/figures"
FIGURES_DIR.mkdir(exist_ok=True)
OUTPUT_FIGURES_DIR.mkdir(exist_ok=True)

# Academic Canvas Setup
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Liberation Sans']
plt.rcParams['mathtext.fontset'] = 'cm'

fig, ax = plt.subplots(figsize=(7.8, 5.2), dpi=300, facecolor='#FFFFFF')
ax.set_facecolor('#FFFFFF')

# Epoch data
epochs = np.array([1, 2, 3, 4, 5])
train_f1 = np.array([0.762, 0.894, 0.948, 0.976, 0.985])
val_f1 = np.array([0.748, 0.881, 0.939, 0.968, 0.974])

# Plot F1 lines
ax.plot(epochs, train_f1, 'o-', color='#1D4ED8', linewidth=2.4, markersize=7.5,
        label='Train Macro F1 (Final: 98.5%)', zorder=4)
ax.plot(epochs, val_f1, 's--', color='#059669', linewidth=2.4, markersize=7.5,
        label='Validation Macro F1 (Peak: 97.4%)', zorder=4)

# Test Point Marker at locked test evaluation
ax.scatter([5], [0.9740], color='#DC2626', s=140, zorder=6,
           edgecolors='#991B1B', linewidth=2.0, label='Held-Out Test F1: 97.40%')

# Title and Labels
ax.set_title("IndoBERT Base Fine-Tuning Convergence",
             fontsize=12.5, fontweight='bold', pad=14, color='#0F172A')
ax.set_xlabel("Fine-Tuning Epochs", fontsize=10.5, fontweight='bold', color='#1E293B')
ax.set_ylabel("Discourse Macro F1 Score", fontsize=10.5, fontweight='bold', color='#1E293B')
ax.set_ylim(0.70, 1.01)
ax.set_xticks(epochs)
ax.set_xticklabels([f"Epoch {e}" for e in epochs], fontsize=9.5)
ax.set_yticks([0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00])
ax.set_yticklabels(["0.70", "0.75", "0.80", "0.85", "0.90", "0.95", "1.00"], fontsize=9.5)

# Grid and spines
ax.grid(True, linestyle='--', color='#E2E8F0', alpha=0.85, zorder=0)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#64748B')
ax.spines['bottom'].set_color('#64748B')

# Legend
ax.legend(loc='lower right', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=9.2)

plt.tight_layout()

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
print("[OK] FIGURE 1 STANDALONE GENERATED SUCCESSFULLY:")
print(f"  • PNG (300 DPI) : {out_png_fig}")
print(f"  • SVG (Vector)  : {out_svg_fig}")
print(f"  • PDF (Vector)  : {out_pdf_fig}")
print(f"  • Output Copy   : {out_png_out}")
print("=" * 65)
