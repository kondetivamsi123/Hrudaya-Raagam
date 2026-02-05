from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

songs_update = [
    {"title": "Samajavaragamana", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "mood": "Happy"},
    {"title": "Butta Bomma", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "mood": "Happy"},
    {"title": "Mass Raja", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", "mood": "Mass"},
    {"title": "Ay Pilla", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", "mood": "Melody"},
    {"title": "Naatu Naatu", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", "mood": "Mass"},
    {"title": "Inkem Inkem", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", "mood": "Happy"},
    {"title": "Oo Antava", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", "mood": "Mass"},
    {"title": "Em Sandeham Ledu", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", "mood": "Melody"},
    {"title": "Ramuloo Ramulaa", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", "mood": "Mass"},
    {"title": "Chitti", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", "mood": "Happy"}
]

for s in songs_update:
    song = db.query(models.Song).filter(models.Song.title == s["title"]).first()
    if song:
        print(f"Updating {song.title}...")
        song.file_url = s["url"]
        song.mood_tag = s["mood"]
        db.add(song)
    else:
        print(f"Creating {s['title']}...")
        new_song = models.Song(title=s["title"], file_url=s["url"], mood_tag=s["mood"], artist="Unknown", movie="Unknown", bpm_range=100)
        db.add(new_song)

db.commit()
print("Database updated successfully.")
db.close()
