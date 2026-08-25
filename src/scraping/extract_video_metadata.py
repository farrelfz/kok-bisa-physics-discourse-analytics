import os
import json
import pandas as pd
from pathlib import Path

def extract_metadata():
    metadata_dir = Path("data/raw/metadata")
    if not metadata_dir.exists():
        print(f"Error: Directory {metadata_dir} does not exist.")
        return
        
    extracted_data = []
    
    for json_file in metadata_dir.glob("*.json"):
        video_id = json_file.stem
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            snippet = data.get("snippet", {})
            title = snippet.get("title", "")
            
            # Cari thumbnail terbaik (maxres, high, medium, default)
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = ""
            for res in ["maxres", "high", "standard", "medium", "default"]:
                if res in thumbnails and "url" in thumbnails[res]:
                    thumbnail_url = thumbnails[res]["url"]
                    break
                    
            extracted_data.append({
                "video_id": video_id,
                "title": title,
                "thumbnail_url": thumbnail_url
            })
            
        except Exception as e:
            print(f"Error processing {json_file.name}: {e}")
            
    df = pd.DataFrame(extracted_data)
    
    output_dir = Path("data/processed")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    csv_path = output_dir / "video_metadata.csv"
    json_path = output_dir / "video_metadata.json"
    
    df.to_csv(csv_path, index=False)
    
    # Save as JSON dictionary { video_id: {title, thumbnail_url} } for easy frontend lookup
    json_dict = df.set_index("video_id").to_dict(orient="index")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_dict, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully extracted metadata for {len(df)} videos.")
    print(f"Saved to: {csv_path}")
    print(f"Saved to: {json_path}")

if __name__ == "__main__":
    extract_metadata()
