import numpy as np
import pandas as pd
from collections import Counter
import nltk
from nltk.collocations import BigramCollocationFinder
from nltk.metrics import BigramAssocMeasures

def calculate_ttr(tokens):
    """
    Calculates Type-Token Ratio (TTR).
    """
    if not tokens:
        return 0.0
    return len(set(tokens)) / len(tokens)

def calculate_mtld(tokens, threshold=0.72):
    """
    Calculates Measure of Textual Lexical Diversity (MTLD).
    """
    if len(tokens) < 10:
        return 0.0
        
    def mtld_factor(token_list):
        factors = 0
        factor_len = 0
        ttr_val = 1.0
        types = set()
        
        for i, token in enumerate(token_list):
            types.add(token)
            factor_len += 1
            ttr_val = len(types) / factor_len
            
            if ttr_val < threshold:
                factors += 1
                factor_len = 0
                types = set()
                ttr_val = 1.0
                
        # Handle the remaining segment
        if factor_len > 0:
            excess_ttr = (1.0 - ttr_val) / (1.0 - threshold)
            factors += excess_ttr
            
        if factors == 0:
            return len(token_list)
        return len(token_list) / factors
        
    forward = mtld_factor(tokens)
    backward = mtld_factor(tokens[::-1])
    
    return (forward + backward) / 2.0

def calculate_ngrams(tokens, n=2):
    """
    Computes frequency of n-grams.
    """
    if len(tokens) < n:
        return {}
    ngrams = zip(*[tokens[i:] for i in range(n)])
    ngram_list = [" ".join(gram) for gram in ngrams]
    return Counter(ngram_list)

def fit_zipf_law(tokens):
    """
    Calculates ranks and frequencies for Zipf's Law evaluation.
    """
    counts = Counter(tokens)
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    
    ranks = np.arange(1, len(sorted_counts) + 1)
    frequencies = np.array([count for _, count in sorted_counts])
    
    return ranks.tolist(), frequencies.tolist(), [word for word, _ in sorted_counts]

def extract_collocations(tokens, min_freq=5, top_n=20):
    """
    Extracts top bigram collocations using PMI (Pointwise Mutual Information).
    """
    if len(tokens) < 2:
        return []
        
    bigram_measures = BigramAssocMeasures()
    finder = BigramCollocationFinder.from_words(tokens)
    finder.apply_freq_filter(min_freq)
    
    collocations = finder.nbest(bigram_measures.pmi, top_n)
    scored = finder.score_ngrams(bigram_measures.pmi)[:top_n]
    
    return [{"bigram": " ".join(gram), "pmi": score} for gram, score in scored]
