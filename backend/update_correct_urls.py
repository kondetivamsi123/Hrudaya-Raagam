from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Update with CORRECT YouTube URLs
songs_update = [
    {"title": "Butta Bomma", "url": "https://www.youtube.com/watch?v=2mDCVzruYzQ", "mood": "Happy", "artist": "Armaan Malik", "movie": "Ala Vaikunthapurramuloo", "bpm": 115},
    {"title": "Samajavaragamana", "url": "https://www.youtube.com/watch?v=Kp5A_1UAJog", "mood": "Happy", "artist": "Sid Sriram", "movie": "Ala Vaikunthapurramuloo", "bpm": 110},
    {"title": "Naatu Naatu", "url": "https://www.youtube.com/watch?v=4_eEgJhsBMo", "mood": "Mass", "artist": "Rahul Sipligunj", "movie": "RRR", "bpm": 150},
    {"title": "Oo Antava", "url": "https://www.youtube.com/watch?v=Ep5eO-HXCqU", "mood": "Mass", "artist": "Indravathi Chauhan", "movie": "Pushpa", "bpm": 130},
]

for s in songs_update:
    song = db.query(models.Song).filter(models.Song.title == s["title"]).first()
    if song:
        print(f"Updating {song.title} with correct YouTube URL...")
        song.file_url = s["url"]
        song.mood_tag = s["mood"]
        song.artist = s["artist"]
        song.movie = s["movie"]
        song.bpm_range = s["bpm"]
        db.add(song)
    else:
        print(f"Creating {s['title']} with YouTube URL...")
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
print("\n✅ Database updated with correct YouTube URLs!")
print("\nUpdated songs:")
print("1. Butta Bomma - https://www.youtube.com/watch?v=2mDCVzruYzQ")
print("2. Samajavaragamana - https://www.youtube.com/watch?v=Kp5A_1UAJog")
print("3. Naatu Naatu - https://www.youtube.com/watch?v=4_eEgJhsBMo")
print("4. Oo Antava - https://www.youtube.com/watch?v=Ep5eO-HXCqU")
db.close()
