import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

_model = None

def get_embedding_model():
    """
    Loads sentence transformer model lazily.
    """
    global _model
    if _model is not None:
        return _model
        
    logging.info(f"Loading Sentence-Transformer model: {settings.EMBEDDING_MODEL_NAME}")
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
    except Exception as e:
        logging.error(f"Error loading sentence-transformer model: {e}")
        raise e
    return _model

def generate_embeddings(texts):
    """
    Generates embeddings for a list of text strings.
    Falls back to TF-IDF vectorizer if Sentence-Transformer model fails to load.
    """
    if not texts:
        return np.array([])
    try:
        model = get_embedding_model()
        return model.encode(texts, show_progress_bar=False)
    except Exception as e:
        logging.warning(f"SentenceTransformer embedding error ({e}). Using TF-IDF fallback embeddings.")
        from sklearn.feature_extraction.text import TfidfVectorizer
        vec = TfidfVectorizer(max_features=384)
        return vec.fit_transform(texts).toarray()

def calculate_cosine_similarity(embeddings_a, embeddings_b):
    """
    Computes cosine similarity matrix between two sets of embeddings.
    """
    if embeddings_a.size == 0 or embeddings_b.size == 0:
        return np.array([])
    return cosine_similarity(embeddings_a, embeddings_b)

def calculate_semantic_diversity(embeddings, max_samples=10000):
    """
    Calculates semantic diversity of a set of embeddings.
    Standard metric: 1 - mean pairwise cosine similarity.
    Uses random sampling if the dataset is too large to prevent RAM memory overflow.
    """
    n_samples = len(embeddings)
    if n_samples <= 1:
        return 0.0
        
    if n_samples > max_samples:
        logging.info(f"Embeddings count ({n_samples}) exceeds max_samples ({max_samples}). Sampling for semantic diversity calculation.")
        # Fix random state for reproducibility
        rng = np.random.default_rng(settings.RANDOM_SEED)
        indices = rng.choice(n_samples, size=max_samples, replace=False)
        embeddings = embeddings[indices]
        
    sim_matrix = cosine_similarity(embeddings)
    # Get upper triangle indices (excluding self-similarity diagonal)
    triu_indices = np.triu_indices_from(sim_matrix, k=1)
    mean_pairwise_similarity = np.mean(sim_matrix[triu_indices])
    
    return float(1.0 - mean_pairwise_similarity)
