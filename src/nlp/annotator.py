import logging
import spacy
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

_nlp = None

def get_spacy_model():
    """
    Loads or downloads the Indonesian spaCy pipeline.
    By default, falls back to multilingual model or blank model if Indonesian is not loaded.
    """
    global _nlp
    if _nlp is not None:
        return _nlp
        
    try:
        # Load Indonesian pipeline if available
        # E.g. spacy has blank("id") or custom models like 'id_core_news_sm' (if precompiled)
        _nlp = spacy.load("id_core_news_sm")
        logging.info("Loaded spaCy Indonesian model ('id_core_news_sm').")
    except OSError:
        try:
            # Fallback to blank indonesian model
            _nlp = spacy.blank("id")
            logging.info("Blank 'id' model loaded. Basic tokenization only.")
        except Exception:
            _nlp = spacy.load("xx_ent_wiki_sm")
            logging.info("Loaded multilingual spaCy model ('xx_ent_wiki_sm').")
            
    return _nlp

def annotate_text(text):
    """
    Extracts POS tags, Named Entities, and Dependency Relations from text.
    """
    nlp = get_spacy_model()
    doc = nlp(text)
    
    tokens_data = []
    entities_data = []
    
    # Token features
    for token in doc:
        tokens_data.append({
            "text": token.text,
            "lemma": token.lemma_,
            "pos": token.pos_,
            "tag": token.tag_,
            "dep": token.dep_,
            "head": token.head.text
        })
        
    # Named Entities
    for ent in doc.ents:
        entities_data.append({
            "text": ent.text,
            "label": ent.label_,
            "start": ent.start_char,
            "end": ent.end_char
        })
        
    return {
        "tokens": tokens_data,
        "entities": entities_data
    }
