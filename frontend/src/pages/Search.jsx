import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import Navbar from '../components/Navbar';

const Search = ({ onPlay }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [youtubeResults, setYoutubeResults] = useState([]);
    const [searchMode, setSearchMode] = useState('local'); // 'local' or 'youtube'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            fetchResults();
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Fetch local database results
            const localRes = await axios.get(`${API_BASE_URL}/songs/search?query=${query}`);
            setResults(localRes.data);

            // Fetch YouTube results
            const youtubeRes = await axios.get(`${API_BASE_URL}/songs/youtube-search?query=${query} telugu song`);
            setYoutubeResults(youtubeRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id, title) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/download/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.mp3`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const displayResults = searchMode === 'local' ? results : youtubeResults;

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>Search Results for "{query}"</h1>

                {/* Toggle between Local and YouTube */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                    <button
                        className="btn"
                        style={{
                            background: searchMode === 'local' ? 'var(--primary)' : 'transparent',
                            border: '1px solid var(--primary)',
                            padding: '0.5rem 1.5rem'
                        }}
                        onClick={() => setSearchMode('local')}
                    >
                        📀 My Library ({results.length})
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: searchMode === 'youtube' ? 'var(--primary)' : 'transparent',
                            border: '1px solid var(--primary)',
                            padding: '0.5rem 1.5rem'
                        }}
                        onClick={() => setSearchMode('youtube')}
                    >
                        ▶️ YouTube ({youtubeResults.length})
                    </button>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🔄</div>
                        <p>Searching {searchMode === 'youtube' ? 'YouTube' : 'library'}...</p>
                    </div>
                )}

                {!loading && displayResults.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {displayResults.map((song, index) => (
                            <div key={song.id || index} style={{
                                background: 'var(--card-bg)',
                                padding: '1rem',
                                borderRadius: '1rem',
                                textAlign: 'left',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {song.thumbnail && (
                                    <img
                                        src={song.thumbnail}
                                        alt={song.title}
                                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem' }}
                                    />
                                )}
                                <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{song.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{song.artist}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Movie: {song.movie}</p>
                                {song.views && (
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        👁️ {(song.views / 1000000).toFixed(1)}M views
                                    </p>
                                )}
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{song.mood_tag}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn"
                                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', textDecoration: 'none' }}
                                            onClick={() => onPlay(song, displayResults)}
                                        >
                                            ▶ Play
                                        </button>
                                        {searchMode === 'local' && (
                                            <button
                                                className="btn"
                                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', textDecoration: 'none', background: 'transparent', border: '1px solid var(--primary)' }}
                                                onClick={() => handleDownload(song.id, song.title)}
                                            >
                                                ⬇
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && <p>No results found.</p>}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Search;
