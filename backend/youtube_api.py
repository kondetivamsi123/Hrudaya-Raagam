import requests
from typing import Optional

def search_youtube(query: str, max_results: int = 10) -> list:
    """
    Search YouTube for Telugu songs using YouTube Data API v3
    Returns a list of video results with title, video_id, thumbnail, channel
    
    Note: This uses a free API key with limited quota. For production, get your own key from:
    https://console.cloud.google.com/apis/credentials
    """
    
    try:
        # Add "telugu song" to the query to filter results
        search_query = f"{query} telugu song"
        
        # Using invidious API (free YouTube API alternative)
        # Multiple public instances available
        instances = [
            "https://yewtu.be",
            "https://invidious.snopyta.org",
            "https://invidious.kavin.rocks"
        ]
        
        for instance in instances:
            try:
                url = f"{instance}/api/v1/search"
                params = {
                    "q": search_query,
                    "type": "video",
                    "sort_by": "relevance"
                }
                
                # Reduced timeout to 3 seconds for faster switching
                response = requests.get(url, params=params, timeout=3)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    results = []
                    for item in data[:max_results]:
                        results.append({
                            "title": item.get("title", "Unknown"),
                            "video_id": item.get("videoId", ""),
                            "url": f"https://www.youtube.com/watch?v={item.get('videoId', '')}",
                            "thumbnail": item.get("videoThumbnails", [{}])[0].get("url", "") if item.get("videoThumbnails") else "",
                            "channel": item.get("author", "Unknown"),
                            "duration": item.get("lengthSeconds", 0),
                            "views": item.get("viewCount", 0)
                        })
                    
                    if results:  # Only return if we got results
                        return results
                    
            except Exception as e:
                print(f"Failed with instance {instance}: {e}")
                continue
        
        # Fallback: return demo Telugu songs if all instances fail
        print("All Invidious instances failed, returning demo data")
        return get_demo_telugu_songs(query)
        
    except Exception as e:
        print(f"YouTube search error: {e}")
        return get_demo_telugu_songs(query)


def get_demo_telugu_songs(query: str = "") -> list:
    """
    Return demo Telugu songs for testing when YouTube API is unavailable
    """
    demo_songs = [
        {"title": "Srivalli - Pushpa", "video_id": "hcMzwMrr1tE", "channel": "T-Series Telugu", "views": 250000000},
        {"title": "Butta Bomma - Ala Vaikunthapurramuloo", "video_id": "2mDCVzruYzQ", "channel": "Aditya Music", "views": 180000000},
        {"title": "Naatu Naatu - RRR", "video_id": "4_eEgJhsBMo", "channel": "T-Series Telugu", "views": 300000000},
        {"title": "Oo Antava - Pushpa", "video_id": "u_wB6byrl5k", "channel": "T-Series Telugu", "views": 220000000},
        {"title": "Kalaavathi - Sarkaru Vaari Paata", "video_id": "SfDA33y38GE", "channel": "Aditya Music", "views": 150000000},
        {"title": "Samajavaragamana - Ala Vaikunthapurramuloo", "video_id": "OCg6BWlAXSw", "channel": "Aditya Music", "views": 120000000},
        {"title": "Inkem Inkem - Geetha Govindam", "video_id": "LPeZOE8ZIHI", "channel": "Aditya Music", "views": 100000000},
        {"title": "Ramuloo Ramulaa - Ala Vaikunthapurramuloo", "video_id": "Bg8Yb9zGYyA", "channel": "Aditya Music", "views": 90000000},
        {"title": "Seeti Maar - Radhe Shyam", "video_id": "WLD0kUKybeE", "channel": "T-Series Telugu", "views": 80000000},
        {"title": "Chuttammale - Devara", "video_id": "GWNrPJyRTcA", "channel": "T-Series Telugu", "views": 75000000},
    ]
    
    results = []
    for song in demo_songs:
        results.append({
            "title": song["title"],
            "video_id": song["video_id"],
            "url": f"https://www.youtube.com/watch?v={song['video_id']}",
            "thumbnail": f"https://i.ytimg.com/vi/{song['video_id']}/hqdefault.jpg",
            "channel": song["channel"],
            "duration": 240,
            "views": song["views"]
        })
    
    return results[:10]


def get_youtube_suggestions(mood: str = "Happy") -> list:
    """
    Get YouTube suggestions for Telugu songs based on mood
    """
    mood_queries = {
        "Happy": "telugu happy songs latest",
        "Mass": "telugu mass songs 2024",
        "Melody": "telugu melody songs romantic"
    }
    
    query = mood_queries.get(mood, "telugu songs latest")
    return search_youtube(query, max_results=5)
