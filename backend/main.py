from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import SessionLocal, engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from rapidfuzz import process, fuzz
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except auth.JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/auth/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/songs/search", response_model=List[schemas.Song])
def search_songs(query: str, db: Session = Depends(get_db)):
    songs = db.query(models.Song).all()
    song_titles = [s.title for s in songs]
    matches = process.extract(query, song_titles, limit=10, scorer=fuzz.token_sort_ratio)
    matched_titles = [match[0] for match in matches if match[1] > 50]
    
    db_matches = db.query(models.Song).filter(models.Song.title.contains(query) | models.Song.artist.contains(query)).all()
    
    final_results = []
    seen_ids = set()
    
    for title in matched_titles:
        song = next((s for s in songs if s.title == title), None)
        if song and song.id not in seen_ids:
            final_results.append(song)
            seen_ids.add(song.id)

    for song in db_matches:
        if song.id not in seen_ids:
            final_results.append(song)
            seen_ids.add(song.id)
            
    return final_results

@app.post("/analyze-mood", response_model=List[schemas.Song])
def analyze_mood(bpm: int, db: Session = Depends(get_db)):
    # Use logic from mood_engine as per BluePrint
    import mood_engine
    mood = mood_engine.get_mood_from_bpm(bpm)
    
    # Map strict SRS output to simplified DB tags if necessary, 
    # but currently get_mood_from_bpm returns compatible tags "Sad", "Happy", "Mass"
        
    songs = db.query(models.Song).filter(models.Song.mood_tag == mood).all()
    return songs

@app.get("/songs/youtube-search")
def youtube_search(query: str):
    """
    Search YouTube for Telugu songs globally
    Returns results from YouTube that can be played directly
    """
    try:
        import youtube_api
        
        # Search YouTube with the query
        results = youtube_api.search_youtube(query, max_results=20)
        
        # Format results for frontend
        formatted_results = []
        for item in results:
            formatted_results.append({
                "id": item["video_id"],  # Use video_id as temporary ID
                "title": item["title"],
                "artist": item["channel"],
                "movie": "YouTube",
                "mood_tag": "YouTube",
                "file_url": item["url"],
                "thumbnail": item.get("thumbnail", ""),
                "duration": item.get("duration", 0),
                "views": item.get("views", 0),
                "lyrics": "Available on YouTube",
                "bpm_range": 100,
                "is_youtube": True
            })
        
        return formatted_results
        
    except Exception as e:
        print(f"YouTube search error: {e}")
        return []


@app.post("/playlists", response_model=schemas.Playlist)
def create_playlist(playlist: schemas.PlaylistCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_playlist = models.Playlist(playlist_name=playlist.playlist_name, user_id=current_user.id)
    if playlist.song_ids:
        songs = db.query(models.Song).filter(models.Song.id.in_(playlist.song_ids)).all()
        db_playlist.songs = songs
        
    db.add(db_playlist)
    db.commit()
    db.refresh(db_playlist)
    return db_playlist

@app.post("/admin/import", response_model=schemas.Song)
def import_song(title: str, url: str, artist: str = "Unknown", mood: str = "Happy", db: Session = Depends(get_db)):
    # Simple import logic
    song = models.Song(title=title, file_url=url, artist=artist, mood_tag=mood, movie="Imported", bpm_range=100)
    db.add(song)
    db.commit()
    db.refresh(song)
    return song

from fastapi.responses import RedirectResponse

@app.get("/download/{id}")
def download_song(id: int, db: Session = Depends(get_db)):
    song = db.query(models.Song).filter(models.Song.id == id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    file_path = song.file_url
    
    if file_path.startswith("http"):
        return RedirectResponse(url=file_path)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(path=file_path, filename=f"{song.title}.mp3", media_type='audio/mpeg')

@app.get("/songs", response_model=List[schemas.Song])
def get_songs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    songs = db.query(models.Song).offset(skip).limit(limit).all()
    return songs

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    
    # Check if songs exist, populate if missing (Upsert logic)
    # UPDATED: Use "Melody" instead of "Sad"
    # UPDATED: Use VALID external URLs so audio actually plays (using free test audio)
    songs_to_add = [
        {"title": "Samajavaragamana", "movie": "Ala Vaikunthapurramuloo", "artist": "Sid Sriram", "mood_tag": "Happy", "bpm_range": 110, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "lyrics": "Nee kaallani pattaku vadalanannavi chuude naa kallu\nAa choopulanalla thokkuku vellaku dayaleda asalu\n..."},
        {"title": "Butta Bomma", "movie": "Ala Vaikunthapurramuloo", "artist": "Armaan Malik", "mood_tag": "Happy", "bpm_range": 115, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "lyrics": "Intha kanna manchi polikedhi\nEvaru cheppaleru ani anukuntunna\nButta bomma butta bomma\nNannu sutthukuntive"},
        {"title": "Mass Raja", "movie": "Dhamaka", "artist": "Nakash Aziz", "mood_tag": "Mass", "bpm_range": 140, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", "lyrics": "Dhamaka... Mass Raja... \n(High Energy Beats)\nDham dham dham dham dhamaka!"},
        {"title": "Ay Pilla", "movie": "Love Story", "artist": "Haricharan", "mood_tag": "Melody", "bpm_range": 70, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", "lyrics": "Ay pilla... paruguuna pothundhi... \nGundello... "},
        {"title": "Naatu Naatu", "movie": "RRR", "artist": "Rahul Sipligunj", "mood_tag": "Mass", "bpm_range": 150, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", "lyrics": "Polam gattu dummu dulapara..."},
        {"title": "Inkem Inkem", "movie": "Geetha Govindam", "artist": "Sid Sriram", "mood_tag": "Happy", "bpm_range": 95, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", "lyrics": "Inkem inkem inkem kaavaale..."},
        {"title": "Oo Antava", "movie": "Pushpa", "artist": "Indravathi Chauhan", "mood_tag": "Mass", "bpm_range": 130, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", "lyrics": "Oo antava mava oo oo antava..."},
        {"title": "Em Sandeham Ledu", "movie": "Oohalu Gusagusalade", "artist": "Kalyani Malik", "mood_tag": "Melody", "bpm_range": 65, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", "lyrics": "Em sandeham ledu..."},
        {"title": "Ramuloo Ramulaa", "movie": "Ala Vaikunthapurramuloo", "artist": "Anurag Kulkarni", "mood_tag": "Mass", "bpm_range": 125, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", "lyrics": "Ramuloo ramulaa nannu paakaam chesavuro..."},
        {"title": "Chitti", "movie": "Jathi Ratnalu", "artist": "Ram Miriyala", "mood_tag": "Happy", "bpm_range": 105, "file_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", "lyrics": "Chitti nee navvante lakshmi patas..."}
    ]
    
    for s in songs_to_add:
        # Check if exists by title
        exists = db.query(models.Song).filter(models.Song.title == s["title"]).first()
        if not exists:
            db_song = models.Song(**s)
            db.add(db_song)
        else:
             # Update to use the working URL if it was using the broken local one
             if "sample.mp3" in exists.file_url:
                 exists.file_url = s["file_url"]
                 exists.mood_tag = s["mood_tag"]
                 db.add(exists)


    db.commit()
    
    # Create songs directory
    if not os.path.exists("songs"):
        os.makedirs("songs")
    if not os.path.exists("songs/sample.mp3"):
        with open("songs/sample.mp3", "wb") as f:
            f.write(b"FAKE MP3 CONTENT")
            
    # Upsert default user
    user = db.query(models.User).filter(models.User.username == "vamsi").first()
    if not user:
        try:
            hashed_password = auth.get_password_hash("Vamsi@123")
            user = models.User(username="vamsi", email="vamsi@example.com", hashed_password=hashed_password)
            db.add(user)
            db.commit()
        except Exception as e:
            print(f"Error creating default user: {e}")

    db.close()
