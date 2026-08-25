import re
import unicodedata
import emoji
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from config import settings

# Initialize Sastrawi factories
stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()

stopword_factory = StopWordRemoverFactory()
stopword_remover = stopword_factory.create_stop_word_remover()

def clean_text(text):
    """
    Cleans text: removes URLs, mentions (@user), hashtags (#topic),
    demojizes/removes emojis, and normalizes whitespaces.
    """
    if not isinstance(text, str):
        return ""
        
    # Unicode normalization (NFKC)
    text = unicodedata.normalize("NFKC", text)
    
    # Lowercase
    text = text.lower()
    
    # Remove URL links
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove HTML tags (if any)
    text = re.sub(r'<.*?>', '', text)
    
    # Remove mentions
    text = re.sub(r'@\w+', '', text)
    
    # Remove hashtags but keep word
    text = re.sub(r'#(\w+)', r'\1', text)
    
    # Convert emojis to text descriptors or remove them
    text = emoji.replace_emoji(text, replace='')
    
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def tokenize(text):
    """
    Splits text into words/tokens (basic alphanumeric tokenization).
    """
    return re.findall(r'\b\w+\b', text)

def remove_stopwords(text):
    """
    Removes standard Indonesian stopwords using PySastrawi.
    """
    return stopword_remover.remove(text)

def stem_text(text):
    """
    Applies Sastrawi stemming to Indonesian text.
    """
    return stemmer.stem(text)

def preprocess_comment(text):
    """
    Runs the full Indonesian preprocessing pipeline on a comment.
    Returns: dict of steps (cleaned, tokenized, stemmed)
    """
    cleaned = clean_text(text)
    no_stopwords = remove_stopwords(cleaned)
    stemmed = stem_text(no_stopwords)
    tokens = tokenize(stemmed)
    
    return {
        "raw": text,
        "cleaned": cleaned,
        "no_stopwords": no_stopwords,
        "stemmed": stemmed,
        "tokens": tokens
    }
