import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Library = () => {
    // Basic placeholder for playlist fetching
    const [playlists, setPlaylists] = useState([]);
    const token = localStorage.getItem('token');

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>My Playlists</h1>
                    <button className="btn">+ New Playlist</button>
                </div>

                <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    <div style={{ background: 'var(--card-bg)', height: '150px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--text-muted)', cursor: 'pointer', opacity: 0.7 }}>
                        Create New Playlist
                    </div>
                </div>
                {!token && <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>Please login to manage playlists.</p>}
            </div>
        </div>
    )
}
export default Library;
