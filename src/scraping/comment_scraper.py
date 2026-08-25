import json
import logging
import time
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from config import settings
from src.audit.playlist_auditor import get_youtube_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def fetch_all_replies(parent_id, youtube):
    """
    Fetches all replies for a specific top-level comment parent ID using comments.list.
    """
    replies = []
    try:
        next_page_token = None
        while True:
            request = youtube.comments().list(
                part="snippet",
                parentId=parent_id,
                maxResults=100,
                pageToken=next_page_token,
                textFormat="plainText"
            )
            response = request.execute()
            
            for item in response.get("items", []):
                snippet = item.get("snippet", {})
                replies.append({
                    "comment_id": item.get("id"),
                    "author_name": snippet.get("authorDisplayName"),
                    "author_channel_id": snippet.get("authorChannelId", {}).get("value"),
                    "text": snippet.get("textDisplay"),
                    "like_count": snippet.get("likeCount"),
                    "published_at": snippet.get("publishedAt"),
                    "updated_at": snippet.get("updatedAt"),
                    "parent_id": parent_id
                })
                
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break
            time.sleep(0.05)  # Avoid hitting rate limits
    except Exception as e:
        logging.error(f"Error fetching replies for parent {parent_id}: {e}")
    return replies

def fetch_comments_for_video(video_id, api_key=None, max_comments=None):
    """
    Fetches comments and replies for a given video ID using commentThreads.list.
    """
    youtube = get_youtube_client(api_key)
    comments = []
    limit = max_comments or settings.MAX_COMMENTS_PER_VIDEO
    
    try:
        next_page_token = None
        while len(comments) < limit:
            request = youtube.commentThreads().list(
                part="snippet,replies",
                videoId=video_id,
                maxResults=100,
                pageToken=next_page_token,
                textFormat="plainText"
            )
            response = request.execute()
            
            for item in response.get("items", []):
                snippet = item.get("snippet", {})
                top_level_comment = snippet.get("topLevelComment", {})
                comment_id = top_level_comment.get("id")
                comment_snippet = top_level_comment.get("snippet", {})
                
                # Extract top-level details
                comment_data = {
                    "comment_id": comment_id,
                    "author_name": comment_snippet.get("authorDisplayName"),
                    "author_channel_id": comment_snippet.get("authorChannelId", {}).get("value"),
                    "text": comment_snippet.get("textDisplay"),
                    "like_count": comment_snippet.get("likeCount"),
                    "published_at": comment_snippet.get("publishedAt"),
                    "updated_at": comment_snippet.get("updatedAt"),
                    "parent_id": None,
                    "reply_count": snippet.get("totalReplyCount", 0),
                    "replies": []
                }
                
                # Extract replies if available
                total_reply_count = snippet.get("totalReplyCount", 0)
                replies_data = item.get("replies", {}).get("comments", [])
                
                if total_reply_count > len(replies_data):
                    comment_data["replies"] = fetch_all_replies(comment_id, youtube)
                else:
                    for reply in replies_data:
                        reply_snippet = reply.get("snippet", {})
                        comment_data["replies"].append({
                            "comment_id": reply.get("id"),
                            "author_name": reply_snippet.get("authorDisplayName"),
                            "author_channel_id": reply_snippet.get("authorChannelId", {}).get("value"),
                            "text": reply_snippet.get("textDisplay"),
                            "like_count": reply_snippet.get("likeCount"),
                            "published_at": reply_snippet.get("publishedAt"),
                            "updated_at": reply_snippet.get("updatedAt"),
                            "parent_id": comment_id
                        })
                    
                comments.append(comment_data)
                if len(comments) >= limit:
                    break
                    
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break
                
            time.sleep(0.1)  # Brief pause between pages
            
        logging.info(f"Fetched {len(comments)} top-level comments (with replies) for video {video_id}")
        return comments
        
    except HttpError as e:
        # Check for comments disabled error (403 with reason: 'commentsDisabled')
        if e.resp.status == 403:
            content_str = e.content.decode("utf-8") if e.content else ""
            if "commentsDisabled" in content_str:
                logging.warning(f"Comments are disabled or restricted for video {video_id}")
                return []
            elif "quotaExceeded" in content_str:
                logging.error("YouTube API quota exceeded!")
                raise e
            else:
                logging.error(f"HTTP 403 error: {content_str}")
                raise e
        else:
            logging.error(f"HTTP error fetching comments for {video_id}: {e}")
            raise e
    except Exception as e:
        logging.error(f"Unexpected error fetching comments for {video_id}: {e}")
        raise e

def save_comments(video_id, comments_data, output_dir=None):
    """
    Saves comments data JSON to raw/comments/
    """
    out_dir = Path(output_dir or settings.RAW_COMMENTS_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    out_path = out_dir / f"{video_id}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(comments_data, f, indent=4, ensure_ascii=False)
    logging.info(f"Saved comments for {video_id} to {out_path}")
    return out_path

def scrape_comments_for_playlist(video_inventory_path=None, api_key=None, max_comments=None):
    """
    Runs comment scraper for all accessible videos in video inventory.
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
        dest_file = settings.RAW_COMMENTS_DIR / f"{video_id}.json"
        
        # Checkpoint support
        if dest_file.exists():
            logging.info(f"Comments for {video_id} already exists. Skipping.")
            continue
            
        logging.info(f"Fetching comments for video: {video_id}")
        try:
            comments = fetch_comments_for_video(video_id, api_key, max_comments)
            save_comments(video_id, comments)
            scraped_count += 1
            time.sleep(0.5)
        except Exception as e:
            logging.error(f"Failed to scrape comments for {video_id}: {e}")
            
    logging.info(f"Completed comments scrape. Newly scraped comments for {scraped_count} videos.")
