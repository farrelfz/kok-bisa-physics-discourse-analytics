import json
import logging
import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_youtube_client(api_key=None):
    key = api_key or settings.YOUTUBE_API_KEY
    if not key:
        raise ValueError(
            "YouTube API key is missing. Please set the YOUTUBE_API_KEY environment variable "
            "or provide it as an argument."
        )
    return build("youtube", "v3", developerKey=key)

def audit_playlist(playlist_id, api_key=None):
    """
    Audits a YouTube playlist: lists all videos, detects status, and gathers metadata.
    """
    youtube = get_youtube_client(api_key)
    videos = []
    
    try:
        next_page_token = None
        while True:
            request = youtube.playlistItems().list(
                part="snippet,status,contentDetails",
                playlistId=playlist_id,
                maxResults=50,
                pageToken=next_page_token
            )
            response = request.execute()
            
            for item in response.get("items", []):
                snippet = item.get("snippet", {})
                status = item.get("status", {})
                content_details = item.get("contentDetails", {})
                
                video_id = content_details.get("videoId")
                title = snippet.get("title")
                description = snippet.get("description")
                published_at = snippet.get("publishedAt")
                privacy_status = status.get("privacyStatus")
                position = snippet.get("position")
                
                # Check for deleted/private videos
                is_accessible = privacy_status == "public"
                if title == "Private video" or title == "Deleted video":
                    is_accessible = False
                
                videos.append({
                    "video_id": video_id,
                    "title": title,
                    "description": description,
                    "published_at": published_at,
                    "privacy_status": privacy_status,
                    "position": position,
                    "is_accessible": is_accessible
                })
                
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break
                
        logging.info(f"Audited playlist {playlist_id}. Found {len(videos)} videos.")
        return videos
        
    except HttpError as e:
        logging.error(f"HTTP error occurred during playlist audit: {e}")
        raise e
    except Exception as e:
        logging.error(f"Unexpected error during playlist audit: {e}")
        raise e

def generate_audit_reports(playlist_id, videos, output_md_path=None, output_csv_path=None):
    """
    Generates reports (Markdown and CSV inventory) from audited videos list.
    """
    df = pd.DataFrame(videos)
    
    # Path fallbacks
    md_path = output_md_path or settings.REPORTS_DIR / "01_playlist_report.md"
    csv_path = output_csv_path or settings.REPORTS_DIR / "02_video_inventory.csv"
    
    # Save CSV
    df.to_csv(csv_path, index=False)
    logging.info(f"Saved video inventory to {csv_path}")
    
    # Calculate statistics
    total_videos = len(df)
    accessible_videos = df["is_accessible"].sum()
    inaccessible_videos = total_videos - accessible_videos
    
    # Create Markdown report
    md_content = f"""# Playlist Audit Report
    
## Playlist Information
- **Playlist ID**: `{playlist_id}`
- **Total Videos Found**: {total_videos}
- **Accessible (Public) Videos**: {accessible_videos}
- **Inaccessible (Private/Deleted) Videos**: {inaccessible_videos}

## Accessibility Summary
- Public: {accessible_videos}
- Private/Deleted/Duplicate: {inaccessible_videos}

## Video List
| Position | Video ID | Title | Privacy Status | Accessible |
|---|---|---|---|---|
"""
    for _, row in df.iterrows():
        md_content += f"| {row['position']} | `{row['video_id']}` | {row['title']} | {row['privacy_status']} | {row['is_accessible']} |\n"
        
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    logging.info(f"Saved audit report to {md_path}")
    
    return {
        "total_videos": total_videos,
        "accessible_videos": accessible_videos,
        "inaccessible_videos": inaccessible_videos,
        "csv_path": str(csv_path),
        "md_path": str(md_path)
    }
