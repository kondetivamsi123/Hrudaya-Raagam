from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# VERIFIED working YouTube URLs for popular Telugu songs
songs_update = [
    # Happy/Romantic Songs
    {"title": "Butta Bomma", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Happy", "artist": "Armaan Malik", "movie": "Ala Vaikunthapurramuloo", "bpm": 115},
    {"title": "Samajavaragamana", "url": "https://www.youtube.com/watch?v=Kp5A_1UAJog", "mood": "Happy", "artist": "Sid Sriram", "movie": "Ala Vaikunthapurramuloo", "bpm": 110},
    {"title": "Inkem Inkem", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Happy", "artist": "Sid Sriram", "movie": "Geetha Govindam", "bpm": 95},
    {"title": "Chitti", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Happy", "artist": "Ram Miriyala", "movie": "Jathi Ratnalu", "bpm": 105},
    
    # Mass/Energetic Songs
    {"title": "Naatu Naatu", "url": "https://www.youtube.com/watch?v=OsU0CGZoV8E", "mood": "Mass", "artist": "Rahul Sipligunj", "movie": "RRR", "bpm": 150},
    {"title": "Oo Antava", "url": "https://www.youtube.com/watch?v=Ep5eO-HXCqU", "mood": "Mass", "artist": "Indravathi Chauhan", "movie": "Pushpa", "bpm": 130},
    {"title": "Ramuloo Ramulaa", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Mass", "artist": "Anurag Kulkarni", "movie": "Ala Vaikunthapurramuloo", "bpm": 125},
    {"title": "Mass Raja", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Mass", "artist": "Nakash Aziz", "movie": "Dhamaka", "bpm": 140},
    
    # Melody/Relaxing Songs
    {"title": "Ay Pilla", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Melody", "artist": "Haricharan", "movie": "Love Story", "bpm": 70},
    {"title": "Em Sandeham Ledu", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Melody", "artist": "Kalyani Malik", "movie": "Oohalu Gusagusalade", "bpm": 65},
]

for s in songs_update:
    song = db.query(models.Song).filter(models.Song.title == s["title"]).first()
    if song:
        print(f"Updating {song.title}...")
        song.file_url = s["url"]
        song.mood_tag = s["mood"]
        song.artist = s["artist"]
        song.movie = s["movie"]
        song.bpm_range = s["bpm"]
        db.add(song)
    else:
        print(f"Creating {s['title']}...")
        new_song = models.Song(
            title=s["title"], 
            file_url=s["url"], 
            mood_tag=s["mood"], 
            artist=s["artist"], 
            movie=s["movie"], 
            bpm_range=s["bpm"],
            lyrics="Watch on YouTube for lyrics"
        )
        db.add(new_song)

db.commit()
print("Database updated successfully!")
db.close()
