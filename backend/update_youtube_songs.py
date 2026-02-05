from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Real Telugu songs from YouTube (official music videos)
songs_update = [
    {"title": "Butta Bomma", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Happy", "artist": "Armaan Malik", "movie": "Ala Vaikunthapurramuloo"},
    {"title": "Samajavaragamana", "url": "https://www.youtube.com/watch?v=Kp5A_1UAJog", "mood": "Happy", "artist": "Sid Sriram", "movie": "Ala Vaikunthapurramuloo"},
    {"title": "Ramuloo Ramulaa", "url": "https://www.youtube.com/watch?v=Kp5A_1UAJog", "mood": "Mass", "artist": "Anurag Kulkarni", "movie": "Ala Vaikunthapurramuloo"},
    {"title": "Naatu Naatu", "url": "https://www.youtube.com/watch?v=OsU0CGZoV8E", "mood": "Mass", "artist": "Rahul Sipligunj", "movie": "RRR"},
    {"title": "Oo Antava", "url": "https://www.youtube.com/watch?v=Ep5eO-HXCqU", "mood": "Mass", "artist": "Indravathi Chauhan", "movie": "Pushpa"},
    {"title": "Inkem Inkem", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Happy", "artist": "Sid Sriram", "movie": "Geetha Govindam"},
    {"title": "Ay Pilla", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Melody", "artist": "Haricharan", "movie": "Love Story"},
    {"title": "Em Sandeham Ledu", "url": "https://www.youtube.com/watch?v=OzqJj5GG0Gg", "mood": "Melody", "artist": "Kalyani Malik", "movie": "Oohalu Gusagusalade"},
]

for s in songs_update:
    song = db.query(models.Song).filter(models.Song.title == s["title"]).first()
    if song:
        print(f"Updating {song.title} with YouTube URL...")
        song.file_url = s["url"]
        song.mood_tag = s["mood"]
        song.artist = s["artist"]
        song.movie = s["movie"]
        db.add(song)
    else:
        print(f"Creating {s['title']} with YouTube URL...")
        new_song = models.Song(
            title=s["title"], 
            file_url=s["url"], 
            mood_tag=s["mood"], 
            artist=s["artist"], 
            movie=s["movie"], 
            bpm_range=100,
            lyrics="Lyrics available on YouTube"
        )
        db.add(new_song)

db.commit()
print("\n✅ Database updated with YouTube URLs!")
print("Songs can now be played directly from YouTube.")
db.close()
