import json
import logging
import time
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from config import settings
from src.audit.playlist_auditor import get_youtube_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def fetch_video_metadata(video_id, api_key=None, max_retries=5, backoff_factor=2):
    """
    Fetches detailed video statistics and metadata.
    """
    youtube = get_youtube_client(api_key)
    
    retries = 0
    while retries < max_retries:
        try:
            request = youtube.videos().list(
                part="snippet,statistics,contentDetails",
                id=video_id
            )
            response = request.execute()
            
            items = response.get("items", [])
            if not items:
                logging.warning(f"No metadata found for video {video_id} (could be private or deleted).")
                return None
                
            return items[0]
            
        except HttpError as e:
            if e.resp.status in [429, 500, 503]:
                sleep_time = backoff_factor ** retries
                logging.warning(f"Rate limited or server error ({e.resp.status}). Retrying in {sleep_time}s...")
                time.sleep(sleep_time)
                retries += 1
            else:
                logging.error(f"HTTP error for video {video_id}: {e}")
                raise e
        except Exception as e:
            logging.error(f"Unexpected error fetching metadata for {video_id}: {e}")
            raise e
            
    raise RuntimeError(f"Failed to fetch metadata for video {video_id} after {max_retries} retries.")

def save_metadata(video_id, metadata, output_dir=None):
    """
    Saves metadata JSON to raw metadata directory.
    """
    out_dir = Path(output_dir or settings.RAW_METADATA_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    out_path = out_dir / f"{video_id}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4, ensure_ascii=False)
    logging.info(f"Saved metadata for {video_id} to {out_path}")
    return out_path

def scrape_metadata_for_playlist(video_inventory_path=None, api_key=None):
    """
    Iterates through video inventory and downloads metadata for all accessible videos.
    """
    inventory_path = Path(video_inventory_path or settings.REPORTS_DIR / "02_video_inventory.csv")
    if not inventory_path.exists():
        raise FileNotFoundError(f"Video inventory CSV not found at {inventory_path}")
        
    df = pd.read_csv(inventory_path) if 'pd' in globals() else None
    if df is None:
        import pandas as pd
        df = pd.read_csv(inventory_path)
        
    # Only scrape accessible videos
    target_videos = df[df["is_accessible"] == True]
    
    scraped_count = 0
    for _, row in target_videos.iterrows():
        video_id = row["video_id"]
        # Skip if already exists (fail-fast / checkpoint support)
        dest_file = settings.RAW_METADATA_DIR / f"{video_id}.json"
        if dest_file.exists():
            logging.info(f"Metadata for {video_id} already exists. Skipping.")
            continue
            
        logging.info(f"Scraping metadata for video: {video_id}")
        try:
            metadata = fetch_video_metadata(video_id, api_key)
            if metadata:
                save_metadata(video_id, metadata)
                scraped_count += 1
                time.sleep(0.5)  # Moderate sleep to avoid rapid quota drain
        except Exception as e:
            logging.error(f"Failed to scrape metadata for {video_id}: {e}")
            
    logging.info(f"Completed scraping metadata. Newly scraped: {scraped_count} videos.")
