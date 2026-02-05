from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    playlists = relationship("Playlist", back_populates="owner")

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    movie = Column(String)
    artist = Column(String)
    mood_tag = Column(String)
    file_url = Column(String)
    bpm_range = Column(Integer)
    lyrics = Column(Text) # Added lyrics field

# Association table for Playlist <-> Songs
playlist_songs = Table('playlist_songs', Base.metadata,
    Column('playlist_id', Integer, ForeignKey('playlists.id')),
    Column('song_id', Integer, ForeignKey('songs.id'))
)

class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    playlist_name = Column(String)

    owner = relationship("User", back_populates="playlists")
    songs = relationship("Song", secondary=playlist_songs)
