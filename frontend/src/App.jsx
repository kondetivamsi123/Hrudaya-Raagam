import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlaySong = (song, songList = []) => {
    setCurrentSong(song);
    if (songList.length > 0) {
      setPlaylist(songList);
      const index = songList.findIndex(s => s.id === song.id || s.title === song.title);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      setPlaylist([song]);
      setCurrentIndex(0);
    }
  };

  const handleSongChange = (newIndex) => {
    if (playlist.length > 0 && newIndex >= 0 && newIndex < playlist.length) {
      setCurrentIndex(newIndex);
      setCurrentSong(playlist[newIndex]);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onPlay={handlePlaySong} />} />
        <Route path="/search" element={<Search onPlay={handlePlaySong} />} />
        <Route path="/library" element={<Library />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <MusicPlayer
        song={currentSong}
        playlist={playlist}
        currentIndex={currentIndex}
        onClose={() => setCurrentSong(null)}
        onSongChange={handleSongChange}
      />
    </>
  );
}

export default App;
