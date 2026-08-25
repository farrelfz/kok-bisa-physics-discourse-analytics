import json
import logging
import urllib.request
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import yt_dlp
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def fetch_transcript_api(video_id, languages=["id", "en"]):
    """
    Attempts to fetch transcript using youtube-transcript-api.
    Returns: (transcript_list, is_generated, language_code)
    """
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # Try to find manual transcript first
        try:
            transcript = transcript_list.find_manually_created_transcript(languages)
            is_generated = False
        except NoTranscriptFound:
            # Fallback to generated transcript
            transcript = transcript_list.find_generated_transcript(languages)
            is_generated = True
            
        data = transcript.fetch()
        return data, is_generated, transcript.language_code
        
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        logging.warning(f"youtube-transcript-api couldn't find transcript for {video_id}: {e}")
        return None, None, None
    except Exception as e:
        logging.error(f"Error fetching transcript via API for {video_id}: {e}")
        return None, None, None

def parse_json3_subtitles(json3_data):
    """
    Parses YouTube json3 format subtitles into youtube-transcript-api format:
    [{'text': str, 'start': float, 'duration': float}]
    """
    events = json3_data.get("events", [])
    parsed = []
    for event in events:
        segs = event.get("segs", [])
        if not segs:
            continue
        text = "".join(seg.get("utf8", "") for seg in segs).strip()
        if not text:
            continue
        start_ms = event.get("tStartMs", 0)
        duration_ms = event.get("dDurationMs", 0)
        
        parsed.append({
            "text": text,
            "start": round(start_ms / 1000.0, 3),
            "duration": round(duration_ms / 1000.0, 3)
        })
    return parsed

def fetch_transcript_ytdlp(video_id, languages=["id", "en"]):
    """
    Fallback method using yt-dlp to extract subtitles or auto-subtitles.
    """
    ydl_opts = {
        'skip_download': True,
        'write_auto_sub': True,
        'write_sub': True,
        'sub_langs': languages,
        'quiet': True,
        'no_warnings': True
    }
    
    url = f"https://www.youtube.com/watch?v={video_id}"
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            subtitles = info.get("subtitles", {})
            automatic_captions = info.get("automatic_captions", {})
            
            # Check manual subtitles
            for lang in languages:
                if lang in subtitles:
                    logging.info(f"Found manual subtitles for {video_id} using yt-dlp in '{lang}'")
                    json3_entry = next((item for item in subtitles[lang] if item.get("ext") == "json3"), None)
                    if json3_entry:
                        try:
                            req = urllib.request.Request(json3_entry["url"], headers={"User-Agent": "Mozilla/5.0"})
                            with urllib.request.urlopen(req, timeout=10) as response:
                                json3_data = json.loads(response.read().decode("utf-8"))
                                transcript_data = parse_json3_subtitles(json3_data)
                                if transcript_data:
                                    return transcript_data, False, lang
                        except Exception as parse_err:
                            logging.error(f"Failed to fetch or parse json3 manual subtitles for {video_id}: {parse_err}")
                    
            # Check auto captions
            for lang in languages:
                if lang in automatic_captions:
                    logging.info(f"Found auto-generated subtitles for {video_id} using yt-dlp in '{lang}'")
                    json3_entry = next((item for item in automatic_captions[lang] if item.get("ext") == "json3"), None)
                    if json3_entry:
                        try:
                            req = urllib.request.Request(json3_entry["url"], headers={"User-Agent": "Mozilla/5.0"})
                            with urllib.request.urlopen(req, timeout=10) as response:
                                json3_data = json.loads(response.read().decode("utf-8"))
                                transcript_data = parse_json3_subtitles(json3_data)
                                if transcript_data:
                                    return transcript_data, True, lang
                        except Exception as parse_err:
                            logging.error(f"Failed to fetch or parse json3 auto subtitles for {video_id}: {parse_err}")
                    
        return None, None, None
    except Exception as e:
        logging.error(f"yt-dlp fallback failed for {video_id}: {e}")
        return None, None, None

def save_transcript(video_id, transcript_data, is_generated, language_code, output_dir=None):
    """
    Saves transcript JSON to data/raw/transcripts/
    """
    out_dir = Path(output_dir or settings.RAW_TRANSCRIPTS_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    payload = {
        "video_id": video_id,
        "language_code": language_code,
        "is_generated": is_generated,
        "transcript": transcript_data
    }
    
    out_path = out_dir / f"{video_id}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4, ensure_ascii=False)
    logging.info(f"Saved transcript for {video_id} to {out_path}")
    return out_path

def scrape_transcripts_for_playlist(video_inventory_path=None):
    """
    Scrapes transcripts for all accessible videos in the inventory.
    """
    import pandas as pd
    inventory_path = Path(video_inventory_path or settings.REPORTS_DIR / "02_video_inventory.csv")
    if not inventory_path.exists():
        raise FileNotFoundError(f"Video inventory CSV not found at {inventory_path}")
        
    df = pd.read_csv(inventory_path)
    target_videos = df[df["is_accessible"] == True]
    
    scraped_count = 0
    for _, row in target_videos.iterrows():
        video_id = row["video_id"]
        dest_file = settings.RAW_TRANSCRIPTS_DIR / f"{video_id}.json"
        
        # Checkpoint support
        if dest_file.exists():
            logging.info(f"Transcript for {video_id} already exists. Skipping.")
            continue
            
        logging.info(f"Fetching transcript for {video_id}...")
        
        # Try API first
        transcript_data, is_generated, language_code = fetch_transcript_api(video_id)
        
        # Try yt-dlp fallback
        if not transcript_data:
            transcript_data, is_generated, language_code = fetch_transcript_ytdlp(video_id)
            
        if transcript_data:
            save_transcript(video_id, transcript_data, is_generated, language_code)
            scraped_count += 1
        else:
            logging.warning(f"No transcript could be retrieved for {video_id}")
            
    logging.info(f"Completed transcripts download. Newly scraped: {scraped_count} transcripts.")
