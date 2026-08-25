import logging
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

_classifier = None

# Canonical 8 Discourse Labels
DISCOURSE_LABELS = [
    "Question",
    "Opinion",
    "Disagreement",
    "Correction",
    "Suggestion",
    "Praise",
    "Agreement",
    "Experience"
]

# Rule-based fallback keyword rules (Indonesian focus)
RULES = {
    "Question": [r"\?", "bagaimana", "mengapa", "kenapa", "apakah", "kok", "tanya", "nanya"],
    "Agreement": ["setuju", "agree", "bener", "betul", "benar", "sependapat", "sama"],
    "Disagreement": ["tidak setuju", "disagree", "tapi", "kurang pas", "salah", "bukan"],
    "Praise": ["keren", "mantap", "bagus", "suka", "hebat", "terima kasih", "makasih", "top", "wow", "amazing"],
    "Suggestion": ["saran", "usul", "sebaiknya", "coba", "mungkin", "tolong", "request", "bahas dong"],
    "Experience": ["saya juga", "pernah", "pengalaman", "dulu", "biasanya", "aku"],
    "Correction": ["koreksi", "ralat", "sebenarnya", "salah", "bukan", "menit ke-", "menit ke"],
}

def get_hf_classifier():
    """
    Attempts to load the best trained supervised model, falling back to Zero-Shot Classification.
    """
    global _classifier
    if _classifier is not None:
        return _classifier
        
    import os
    if os.getenv("FORCE_RULE_BASED", "0") == "1":
        _classifier = "fallback"
        return _classifier
        
    try:
        import torch
        device_id = 0 if torch.cuda.is_available() else -1
        from transformers import pipeline
        
        # Check candidate trained model directories
        candidates = [
            settings.BASE_DIR / "outputs" / "training" / "best_model",
            settings.BASE_DIR / "models" / "discourse_classifier_final",
            settings.BASE_DIR / "models" / "discourse_model_final",
        ]
        trained_model_dir = next((c for c in candidates if (c / "config.json").exists()), None)

        if trained_model_dir:
            logging.info(f"Loading trained supervised classifier from {trained_model_dir} on device={device_id}")
            _classifier = pipeline("text-classification", model=str(trained_model_dir), device=device_id)
        else:
            logging.info(f"Loading HF Zero-Shot Classifier on device={device_id}: {settings.ZERO_SHOT_MODEL_NAME}")
            _classifier = pipeline("zero-shot-classification", model=settings.ZERO_SHOT_MODEL_NAME, device=device_id)
    except Exception as e:
        logging.warning(f"Could not load HuggingFace Classifier: {e}. Falling back to Rule-Based Classifier.")
        _classifier = "fallback"
        
    return _classifier

def rule_based_classify(text):
    """
    Heuristic rule-based fallback classification for 8 canonical discourse acts.
    """
    import re
    text_lower = text.lower()
    scores = {label: 0.0 for label in DISCOURSE_LABELS}
    
    for label, keywords in RULES.items():
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b' if kw != r"\?" else re.escape(kw), text_lower):
                scores[label] += 1.0
                
    # Normalizing scores
    max_label = "Opinion"
    max_score = 0.0
    for label, score in scores.items():
        if score > max_score:
            max_score = score
            max_label = label
            
    # Default fallback
    if max_score == 0.0:
        if "?" in text:
            max_label = "Question"
            scores["Question"] = 1.0
        else:
            max_label = "Opinion"
            scores["Opinion"] = 1.0
            
    return max_label, scores

def classify_discourse(text):
    """
    Classifies a text comment into one of the 8 canonical discourse acts.
    """
    if not text or len(text.strip()) == 0:
        scores = {label: 0.0 for label in DISCOURSE_LABELS}
        scores["Opinion"] = 1.0
        return "Opinion", scores
        
    classifier = get_hf_classifier()
    
    if classifier == "fallback":
        return rule_based_classify(text)
        
    try:
        if classifier.task == "text-classification":
            # Supervised text classification model
            result = classifier(text, top_k=None)
            scores = {label: 0.0 for label in DISCOURSE_LABELS}
            top_label = "Opinion"
            max_score = -1.0
            for item in result[0]:
                label_name = item['label']
                score_val = item['score']
                if label_name in scores:
                    scores[label_name] = score_val
                if score_val > max_score:
                    max_score = score_val
                    top_label = label_name
            return top_label, scores
        else:
            # Zero-shot classification
            result = classifier(text, candidate_labels=DISCOURSE_LABELS, multi_label=False)
            top_label = result['labels'][0]
            scores = dict(zip(result['labels'], result['scores']))
            return top_label, scores
    except Exception as e:
        logging.error(f"HF classification failed: {e}. Falling back to rule-based.")
        return rule_based_classify(text)

def classify_discourse_batch(texts, batch_size=128):
    """
    Classifies a list of text comments into discourse acts in batches.
    """
    if not texts:
        return []
        
    classifier = get_hf_classifier()
    
    if classifier == "fallback":
        # Fallback to rule-based one-by-one
        labels = []
        for text in texts:
            lbl, _ = rule_based_classify(text)
            labels.append(lbl)
        return labels
        
    try:
        logging.info(f"Classifying {len(texts)} comments in batches (batch_size={batch_size})...")
        if classifier.task == "text-classification":
            results = classifier(texts, batch_size=batch_size)
            labels = [res['label'] for res in results]
            return labels
        else:
            results = classifier(texts, candidate_labels=DISCOURSE_LABELS, multi_label=False, batch_size=batch_size)
            labels = [res['labels'][0] for res in results]
            return labels
    except Exception as e:
        logging.error(f"HF batch classification failed: {e}. Falling back to rule-based.")
        labels = []
        for text in texts:
            lbl, _ = rule_based_classify(text)
            labels.append(lbl)
        return labels
