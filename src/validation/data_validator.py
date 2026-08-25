import json
import logging
from pathlib import Path
from langdetect import detect, LangDetectException
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def check_encoding(text):
    """
    Validates text encoding, ensuring it's valid UTF-8.
    """
    if not isinstance(text, str):
        return False
    try:
        text.encode('utf-8').decode('utf-8')
        return True
    except UnicodeError:
        return False

def detect_language(text):
    """
    Detects language of a text block.
    Returns: (lang_code, confidence_score)
    Note: langdetect doesn't output confidence score by default, we'll return a placeholder score 1.0 or 0.0 on error.
    """
    if not text or len(text.strip()) < 3:
        return "unknown", 0.0
    try:
        lang = detect(text)
        return lang, 1.0
    except LangDetectException:
        return "unknown", 0.0

def is_spam(text):
    """
    Applies heuristic spam checks (e.g. length, external URLs, characters pattern).
    """
    if not text:
        return True
    
    # URL check
    if "http://" in text or "https://" in text or "www." in text:
        return True
        
    # Extremely short comments (less than 2 chars)
    if len(text.strip()) < 2:
        return True
        
    # Repeated characters (e.g. "aaaaaaa...")
    # Very simple heuristic: if a single character covers more than 50% of a long string
    if len(text) > 20:
        char_counts = {}
        for char in text.lower():
            char_counts[char] = char_counts.get(char, 0) + 1
        max_char_count = max(char_counts.values())
        if max_char_count / len(text) > 0.6:
            return True
            
    return False

def validate_data(comments_dir=None, output_report_path=None):
    """
    Validates raw comment JSON files.
    Identifies:
    - total comments
    - duplicate comment IDs
    - language distribution
    - spam counts
    - encoding errors
    """
    c_dir = Path(comments_dir or settings.RAW_COMMENTS_DIR)
    report_path = Path(output_report_path or settings.REPORTS_DIR / "05_validation_report.json")
    
    results = {
        "total_files_checked": 0,
        "total_comments_read": 0,
        "duplicates_count": 0,
        "spam_count": 0,
        "encoding_errors": 0,
        "languages": {},
        "valid_comments_count": 0
    }
    
    seen_ids = set()
    
    for json_file in c_dir.glob("*.json"):
        results["total_files_checked"] += 1
        with open(json_file, "r", encoding="utf-8") as f:
            try:
                comments = json.load(f)
            except json.JSONDecodeError:
                logging.error(f"JSON decode error in {json_file}")
                results["encoding_errors"] += 1
                continue
                
            for comment in comments:
                results["total_comments_read"] += 1
                
                # Check top-level comment
                cid = comment.get("comment_id")
                text = comment.get("text", "")
                
                # Check encoding
                if not check_encoding(text):
                    results["encoding_errors"] += 1
                    
                # Check duplicate
                if cid in seen_ids:
                    results["duplicates_count"] += 1
                else:
                    seen_ids.add(cid)
                    
                # Check spam
                if is_spam(text):
                    results["spam_count"] += 1
                else:
                    results["valid_comments_count"] += 1
                    
                # Language detection
                lang, _ = detect_language(text)
                results["languages"][lang] = results["languages"].get(lang, 0) + 1
                
                # Check replies
                for reply in comment.get("replies", []):
                    results["total_comments_read"] += 1
                    r_id = reply.get("comment_id")
                    r_text = reply.get("text", "")
                    
                    if not check_encoding(r_text):
                        results["encoding_errors"] += 1
                        
                    if r_id in seen_ids:
                        results["duplicates_count"] += 1
                    else:
                        seen_ids.add(r_id)
                        
                    if is_spam(r_text):
                        results["spam_count"] += 1
                    else:
                        results["valid_comments_count"] += 1
                        
                    r_lang, _ = detect_language(r_text)
                    results["languages"][r_lang] = results["languages"].get(r_lang, 0) + 1
                    
    # Save the report
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    logging.info(f"Data validation complete. Report saved to {report_path}")
    return results
