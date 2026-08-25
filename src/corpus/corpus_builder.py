import sqlite3
import json
import logging
import pandas as pd
from pathlib import Path
from config import settings
from src.validation.data_validator import is_spam, detect_language

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_connection(db_path=None):
    path = db_path or settings.DB_PATH
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    return sqlite3.connect(path)

def create_schema(db_path=None):
    """
    Creates SQLite database schema for the Indonesian Public Discourse Corpus.
    """
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    # 1. Videos Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        video_id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        published_at TEXT,
        view_count INTEGER,
        like_count INTEGER,
        comment_count INTEGER
    )
    """)
    
    # 2. Transcripts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        text TEXT,
        start_time REAL,
        duration REAL,
        is_generated INTEGER,
        language_code TEXT,
        FOREIGN KEY (video_id) REFERENCES videos (video_id)
    )
    """)
    
    # 3. Comments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        comment_id TEXT PRIMARY KEY,
        video_id TEXT,
        parent_id TEXT,
        author_name TEXT,
        author_channel_id TEXT,
        text TEXT,
        like_count INTEGER,
        published_at TEXT,
        updated_at TEXT,
        lang_detected TEXT,
        is_spam INTEGER,
        FOREIGN KEY (video_id) REFERENCES videos (video_id)
    )
    """)
    
    conn.commit()
    conn.close()
    logging.info("SQLite database schema initialized successfully.")

def populate_database(db_path=None):
    """
    Ingests video metadata, transcripts, and comments JSONs into SQLite.
    """
    create_schema(db_path)
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    # Ingest Videos metadata
    metadata_files = list(settings.RAW_METADATA_DIR.glob("*.json"))
    for file in metadata_files:
        video_id = file.stem
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            snippet = data.get("snippet", {})
            stats = data.get("statistics", {})
            
            cursor.execute("""
            INSERT OR REPLACE INTO videos (video_id, title, description, published_at, view_count, like_count, comment_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                video_id,
                snippet.get("title"),
                snippet.get("description"),
                snippet.get("publishedAt"),
                int(stats.get("viewCount", 0)),
                int(stats.get("likeCount", 0)),
                int(stats.get("commentCount", 0))
            ))
            
    # Ingest Transcripts
    transcript_files = list(settings.RAW_TRANSCRIPTS_DIR.glob("*.json"))
    for file in transcript_files:
        video_id = file.stem
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            lang_code = data.get("language_code")
            is_generated = 1 if data.get("is_generated") else 0
            
            for line in data.get("transcript", []):
                cursor.execute("""
                INSERT INTO transcripts (video_id, text, start_time, duration, is_generated, language_code)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    video_id,
                    line.get("text"),
                    line.get("start"),
                    line.get("duration"),
                    is_generated,
                    lang_code
                ))
                
    # Ingest Comments & Replies
    comment_files = list(settings.RAW_COMMENTS_DIR.glob("*.json"))
    for file in comment_files:
        video_id = file.stem
        with open(file, "r", encoding="utf-8") as f:
            comments = json.load(f)
            
            for comment in comments:
                cid = comment.get("comment_id")
                text = comment.get("text", "")
                spam = 1 if is_spam(text) else 0
                lang, _ = detect_language(text)
                
                cursor.execute("""
                INSERT OR REPLACE INTO comments (comment_id, video_id, parent_id, author_name, author_channel_id, text, like_count, published_at, updated_at, lang_detected, is_spam)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    cid,
                    video_id,
                    None,
                    comment.get("author_name"),
                    comment.get("author_channel_id"),
                    text,
                    comment.get("like_count"),
                    comment.get("published_at"),
                    comment.get("updated_at"),
                    lang,
                    spam
                ))
                
                # Replies
                for reply in comment.get("replies", []):
                    r_id = reply.get("comment_id")
                    r_text = reply.get("text", "")
                    r_spam = 1 if is_spam(r_text) else 0
                    r_lang, _ = detect_language(r_text)
                    
                    cursor.execute("""
                    INSERT OR REPLACE INTO comments (comment_id, video_id, parent_id, author_name, author_channel_id, text, like_count, published_at, updated_at, lang_detected, is_spam)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        r_id,
                        video_id,
                        cid,
                        reply.get("author_name"),
                        reply.get("author_channel_id"),
                        r_text,
                        reply.get("like_count"),
                        reply.get("published_at"),
                        reply.get("updated_at"),
                        r_lang,
                        r_spam
                    ))
                    
    conn.commit()
    conn.close()
    logging.info("SQLite Database populated with video, transcript, and comment data.")

def export_corpus(db_path=None):
    """
    Exports SQLite tables to CSV and unified Apache Parquet.
    """
    conn = get_connection(db_path)
    
    videos_df = pd.read_sql_query("SELECT * FROM videos", conn)
    transcripts_df = pd.read_sql_query("SELECT * FROM transcripts", conn)
    comments_df = pd.read_sql_query("SELECT * FROM comments", conn)
    
    conn.close()
    
    # Save CSVs
    videos_df.to_csv(settings.CORPUS_DIR / "videos.csv", index=False)
    transcripts_df.to_csv(settings.CORPUS_DIR / "transcripts.csv", index=False)
    comments_df.to_csv(settings.CORPUS_DIR / "comments.csv", index=False)
    
    # Export to Parquet
    comments_df.to_parquet(settings.PARQUET_PATH, index=False)
    logging.info("Corpus successfully exported to CSV and Parquet formats.")

def generate_corpus_stats(db_path=None, output_path=None):
    """
    Generates statistics from the database.
    """
    conn = get_connection(db_path)
    
    stats = {}
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM videos")
    stats["total_videos"] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM transcripts")
    stats["total_transcript_segments"] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM comments WHERE parent_id IS NULL")
    stats["total_top_level_comments"] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM comments WHERE parent_id IS NOT NULL")
    stats["total_replies"] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM comments")
    stats["total_comments_all"] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM comments WHERE is_spam = 1")
    stats["total_spam_comments"] = cursor.fetchone()[0]
    
    # Language distribution
    cursor.execute("SELECT lang_detected, COUNT(*) FROM comments GROUP BY lang_detected")
    stats["comments_by_language"] = dict(cursor.fetchall())
    
    # Word count estimation in clean comments
    cursor.execute("SELECT text FROM comments WHERE is_spam = 0")
    all_comments_text = cursor.fetchall()
    total_words = sum(len(str(row[0]).split()) for row in all_comments_text)
    stats["clean_comments_total_words"] = total_words
    
    conn.close()
    
    # Save statistics
    out_file = Path(output_path or settings.REPORTS_DIR / "07_corpus_stats.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=4)
        
    logging.info(f"Corpus statistics report saved to {out_file}")
    return stats
