import logging
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import networkx as nx
from pathlib import Path
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Set publication style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams.update({
    'font.size': 12,
    'axes.labelsize': 14,
    'axes.titlesize': 16,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'figure.titlesize': 18,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight'
})

def plot_zipf(ranks, frequencies, save_name="zipf_curve.png"):
    """
    Plots Zipf's Law rank-frequency curve on log-log scales.
    """
    plt.figure(figsize=(8, 6))
    
    # Scatter points
    plt.loglog(ranks, frequencies, marker=".", linestyle="none", alpha=0.6, label="Observed Words")
    
    # Fit Zipf's (s=1 line)
    # y = C / x^s -> log(y) = log(C) - s*log(x)
    # Use top rank's frequency as C
    c_val = frequencies[0]
    expected = [c_val / r for r in ranks]
    plt.loglog(ranks, expected, linestyle="--", color="red", label="Theoretical Zipf (s=1)")
    
    plt.xlabel("Rank (log)")
    plt.ylabel("Frequency (log)")
    plt.title("Zipf's Law Fit")
    plt.legend()
    plt.tight_layout()
    
    dest_path = settings.REPORTS_DIR.parent / "figures"
    dest_path.mkdir(exist_ok=True)
    out_file = dest_path / save_name
    plt.savefig(out_file)
    plt.close()
    logging.info(f"Zipf plot saved to {out_file}")

def plot_topics(topics, save_name="topic_distribution.png"):
    """
    Plots top topics and their keyword weights.
    """
    n_topics = len(topics)
    fig, axes = plt.subplots(n_topics, 1, figsize=(10, 3 * n_topics), sharex=True)
    if n_topics == 1:
        axes = [axes]
        
    for idx, topic in enumerate(topics):
        words = topic["top_words"][:8][::-1]
        weights = topic["weights"][:8][::-1]
        
        ax = axes[idx]
        ax.barh(words, weights, color=sns.color_palette("muted")[idx % 6])
        ax.set_title(f"Topic {topic['topic_id']}")
        
    plt.xlabel("Weight")
    plt.tight_layout()
    
    dest_path = settings.REPORTS_DIR.parent / "figures"
    dest_path.mkdir(exist_ok=True)
    out_file = dest_path / save_name
    plt.savefig(out_file)
    plt.close()
    logging.info(f"Topic plot saved to {out_file}")

def plot_embeddings_projection(embeddings, labels, save_name="embeddings_projection.png"):
    """
    Projects embeddings using UMAP, with fallback to t-SNE / PCA if UMAP is missing.
    """
    plt.figure(figsize=(10, 8))
    
    # Attempt UMAP projection
    projected = None
    method_name = "UMAP"
    
    try:
        import umap
        reducer = umap.UMAP(n_components=2, random_state=42)
        projected = reducer.fit_transform(embeddings)
    except Exception as e:
        logging.warning(f"UMAP failed/missing: {e}. Falling back to t-SNE.")
        try:
            from sklearn.manifold import TSNE
            tsne = TSNE(n_components=2, random_state=42)
            projected = tsne.fit_transform(embeddings)
            method_name = "t-SNE"
        except Exception as e2:
            logging.warning(f"t-SNE failed: {e2}. Falling back to PCA.")
            from sklearn.decomposition import PCA
            pca = PCA(n_components=2, random_state=42)
            projected = pca.fit_transform(embeddings)
            method_name = "PCA"
            
    df = pd.DataFrame({
        "Dim 1": projected[:, 0],
        "Dim 2": projected[:, 1],
        "Discourse Act": labels
    })
    
    sns.scatterplot(data=df, x="Dim 1", y="Dim 2", hue="Discourse Act", palette="Set2", alpha=0.7)
    plt.title(f"Semantic Projection of Comments ({method_name})")
    plt.xlabel(f"{method_name} Dimension 1")
    plt.ylabel(f"{method_name} Dimension 2")
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    
    dest_path = settings.REPORTS_DIR.parent / "figures"
    dest_path.mkdir(exist_ok=True)
    out_file = dest_path / save_name
    plt.savefig(out_file)
    plt.close()
    logging.info(f"Embedding projection plot saved to {out_file}")

def plot_collocation_network(collocations, save_name="collocation_network.png"):
    """
    Plots a network graph of top bigram collocations.
    """
    G = nx.Graph()
    
    for colloc in collocations:
        bigram = colloc["bigram"]
        pmi = colloc["pmi"]
        w1, w2 = bigram.split()
        G.add_edge(w1, w2, weight=pmi)
        
    plt.figure(figsize=(10, 8))
    pos = nx.spring_layout(G, k=0.5, seed=42)
    
    # Node weights
    degrees = dict(G.degree())
    node_sizes = [d * 150 for d in degrees.values()]
    
    # Edge weights
    edges = G.edges(data=True)
    weights = [e[2]['weight'] for e in edges]
    
    nx.draw_networkx_nodes(G, pos, node_size=node_sizes, node_color="skyblue", alpha=0.9)
    nx.draw_networkx_edges(G, pos, width=weights, edge_color="gray", alpha=0.5)
    nx.draw_networkx_labels(G, pos, font_size=10, font_family="sans-serif")
    
    plt.title("Collocation Network (Bigrams)")
    plt.axis("off")
    plt.tight_layout()
    
    dest_path = settings.REPORTS_DIR.parent / "figures"
    dest_path.mkdir(exist_ok=True)
    out_file = dest_path / save_name
    plt.savefig(out_file)
    plt.close()
    logging.info(f"Collocation network plot saved to {out_file}")
