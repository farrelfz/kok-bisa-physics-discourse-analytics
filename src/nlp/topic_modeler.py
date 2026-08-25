import logging
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, NMF
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
from src.nlp.semantic_analyzer import generate_embeddings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def run_lda(texts, n_topics=5, max_features=1000):
    """
    Fits LDA topic model using scikit-learn.
    Returns: (model, vectorizer, topics)
    """
    if not texts:
        return None, None, []
        
    vectorizer = CountVectorizer(max_features=max_features, stop_words=None)
    dtm = vectorizer.fit_transform(texts)
    
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=42)
    lda.fit(dtm)
    
    feature_names = vectorizer.get_feature_names_out()
    topics = []
    
    for topic_idx, topic in enumerate(lda.components_):
        top_words = [feature_names[i] for i in topic.argsort()[:-11:-1]]
        topics.append({
            "topic_id": topic_idx,
            "top_words": top_words,
            "weights": sorted(topic, reverse=True)[:10]
        })
        
    return lda, vectorizer, topics

def run_nmf(texts, n_topics=5, max_features=1000):
    """
    Fits NMF topic model using scikit-learn.
    Returns: (model, vectorizer, topics)
    """
    if not texts:
        return None, None, []
        
    vectorizer = TfidfVectorizer(max_features=max_features, stop_words=None)
    dtm = vectorizer.fit_transform(texts)
    
    nmf = NMF(n_components=n_topics, random_state=42, init='random')
    nmf.fit(dtm)
    
    feature_names = vectorizer.get_feature_names_out()
    topics = []
    
    for topic_idx, topic in enumerate(nmf.components_):
        top_words = [feature_names[i] for i in topic.argsort()[:-11:-1]]
        topics.append({
            "topic_id": topic_idx,
            "top_words": top_words,
            "weights": sorted(topic, reverse=True)[:10]
        })
        
    return nmf, vectorizer, topics

def run_mini_bertopic(texts, n_topics=5):
    """
    Runs Mini-BERTopic:
    1. Sentence embeddings
    2. KMeans clustering
    3. c-TF-IDF keyword extraction per cluster
    """
    if not texts:
        return []
        
    embeddings = generate_embeddings(texts)
    if len(embeddings) < n_topics:
        n_topics = len(embeddings)
        
    # Cluster embeddings using KMeans
    kmeans = KMeans(n_clusters=n_topics, random_state=42, n_init='auto')
    cluster_labels = kmeans.fit_predict(embeddings)
    
    # Calculate c-TF-IDF (Class-based TF-IDF)
    documents = pd.DataFrame({"Document": texts, "Class": cluster_labels})
    docs_per_class = documents.groupby(['Class'], as_index=False).agg({'Document': ' '.join})
    
    count_vectorizer = CountVectorizer(stop_words=None)
    count = count_vectorizer.fit_transform(docs_per_class.Document.values)
    words = count_vectorizer.get_feature_names_out()
    
    # c-TF-IDF formulation
    # W_{i, c} = TF_{i, c} * log(1 + A / df_i)
    # where A = average number of words per class
    total_words = count.sum()
    words_per_class = count.sum(axis=1)
    
    tf = count.T.toarray()
    df = np.asarray((count > 0).sum(axis=0)).squeeze()
    
    # Average words per class
    avg_words = total_words / n_topics
    
    # Calculate tf-idf score
    idf = np.log(1 + (avg_words / (df + 1e-5)))
    c_tfidf = tf * idf[:, None]
    
    topics = []
    for i in range(n_topics):
        # Sort indices
        scores = c_tfidf[:, i]
        top_indices = scores.argsort()[:-11:-1]
        top_words = [words[idx] for idx in top_indices]
        top_scores = [scores[idx] for idx in top_indices]
        
        topics.append({
            "topic_id": i,
            "top_words": top_words,
            "weights": top_scores,
            "doc_count": int((cluster_labels == i).sum())
        })
        
    return topics
