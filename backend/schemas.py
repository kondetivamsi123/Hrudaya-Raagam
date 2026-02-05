from pydantic import BaseModel
from typing import List, Optional

class SongBase(BaseModel):
    title: str
    movie: Optional[str] = None
    artist: Optional[str] = None
    mood_tag: Optional[str] = None
    file_url: Optional[str] = None
    bpm_range: Optional[int] = None
    lyrics: Optional[str] = None # Added lyrics field

class SongCreate(SongBase):
    pass

class Song(SongBase):
    id: int
    class Config:
        from_attributes = True

class PlaylistBase(BaseModel):
    playlist_name: str

class PlaylistCreate(PlaylistBase):
    song_ids: List[int] = []

class Playlist(PlaylistBase):
    id: int
    user_id: int
    songs: List[Song] = []
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    playlists: List[Playlist] = []
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
