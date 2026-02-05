import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';

const MusicPlayer = ({ song, onClose, playlist = [], currentIndex = 0, onSongChange }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false);
    const [isYouTube, setIsYouTube] = useState(false);

    // When song changes, reset and start playing
    useEffect(() => {
        if (song) {
            const youtubeCheck = song.file_url && (song.file_url.includes('youtube.com') || song.file_url.includes('youtu.be'));
            setIsYouTube(youtubeCheck);
            setShowLyrics(false);

            // For new songs, start playing
            if (!youtubeCheck && audioRef.current) {
                audioRef.current.load(); // Reload the audio source
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => {
                        console.log('Autoplay prevented:', err);
                        setIsPlaying(false);
                    });
            } else {
                setIsPlaying(true);
            }
        }
    }, [song?.id, song?.title]); // Only trigger when song actually changes

    const togglePlay = () => {
        if (!isYouTube && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.log('Play error:', err));
            }
        }
    };

    const handleStop = () => {
        // Stop = Pause (keep position for resume)
        if (!isYouTube && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (playlist.length > 0 && onSongChange) {
            const nextIndex = (currentIndex + 1) % playlist.length;
            onSongChange(nextIndex);
        }
    };

    const handlePrevious = () => {
        if (playlist.length > 0 && onSongChange) {
            if (currentTime > 3) {
                // Restart current song
                if (!isYouTube && audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                }
            } else {
                // Go to previous song
                const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
                onSongChange(prevIndex);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        handleNext();
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getYouTubeEmbedUrl = (url) => {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    };

    if (!song) return null;

    return (
        <>
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(20, 20, 30, 0.85)', backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: '1rem', zIndex: 1000,
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                            width: '56px', height: '56px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{isYouTube ? '▶️' : '🎵'}</span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{song.artist}</span>
                            {isYouTube && <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', display: 'block' }}>YouTube</span>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Previous Button */}
                        <button
                            className="btn"
                            style={{ background: 'transparent', padding: '0.5rem', fontSize: '1.2rem' }}
                            onClick={handlePrevious}
                            title="Previous / Restart"
                        >
                            ⏮️
                        </button>

                        {/* Stop Button */}
                        <button
                            className="btn"
                            style={{ background: 'transparent', padding: '0.5rem', fontSize: '1.2rem' }}
                            onClick={handleStop}
                            title={isYouTube ? "Close Player" : "Stop"}
                        >
                            ⏹️
                        </button>

                        {/* Play/Pause Button */}
                        {!isYouTube && (
                            <button className="btn" style={{
                                padding: '0', borderRadius: '50%', width: '48px', height: '48px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', background: 'white', color: 'black'
                            }} onClick={togglePlay}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                        )}

                        {/* Next Button */}
                        <button
                            className="btn"
                            style={{ background: 'transparent', padding: '0.5rem', fontSize: '1.2rem' }}
                            onClick={handleNext}
                            title="Next / Stop"
                        >
                            ⏭️
                        </button>

                        {/* Lyrics Button */}
                        <button className="btn" style={{ background: 'transparent', padding: 0 }} onClick={() => setShowLyrics(!showLyrics)}>
                            <span style={{ fontSize: '1.2rem', opacity: showLyrics ? 1 : 0.6 }}>🎤</span>
                        </button>

                        {/* Close Button */}
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={onClose}>
                            ✕
                        </button>
                    </div>
                </div>

                {!isYouTube && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ minWidth: '30px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
                        <div style={{ flex: 1, position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: `${(currentTime / (duration || 1)) * 100}%`,
                                background: 'var(--primary)', borderRadius: '2px'
                            }}></div>
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                onChange={(e) => audioRef.current.currentTime = e.target.value}
                                style={{
                                    position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0
                                }}
                            />
                        </div>
                        <span style={{ minWidth: '30px' }}>{formatTime(duration)}</span>
                    </div>
                )}

                {isYouTube ? (
                    <div style={{ display: 'none' }}>
                        <iframe
                            width="0"
                            height="0"
                            src={getYouTubeEmbedUrl(song.file_url)}
                            allow="autoplay; encrypted-media"
                            style={{ border: 'none' }}
                        />
                    </div>
                ) : (
                    <audio
                        ref={audioRef}
                        src={`${API_BASE_URL}/download/${song.id}`}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                    />
                )}
            </div>

            {/* Lyrics Overlay */}
            {showLyrics && (
                <div style={{
                    position: 'fixed', top: '0', left: 0, right: 0, bottom: '0',
                    background: 'linear-gradient(to bottom, #1e1e2e, #000)', zIndex: 999,
                    display: 'flex', flexDirection: 'column',
                    padding: '2rem 1rem 120px 1rem',
                    animation: 'fadeIn 0.3s'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isYouTube && (
                            <div style={{ flex: 1, maxWidth: '560px', margin: '0 auto' }}>
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={getYouTubeEmbedUrl(song.file_url)}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    style={{ borderRadius: '1rem' }}
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setShowLyrics(false)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', position: 'absolute', top: '1rem', right: '1rem' }}
                        >✕</button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', textAlign: 'center', marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{song.title}</h2>
                        <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>{song.artist}</p>
                        <div style={{ fontSize: '1.4rem', lineHeight: '2', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-line', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
                            {song.lyrics || "Lyrics not available for this song."}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MusicPlayer;
