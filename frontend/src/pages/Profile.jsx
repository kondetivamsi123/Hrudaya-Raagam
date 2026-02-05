import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'User', email: 'user@example.com' });

    useEffect(() => {
        // In a real app, fetch user details from backend using token
        // For now, mock or decode token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            // Mock data for now since we don't have a /me endpoint fully wired in frontend
            setUser({ username: 'vamsi', email: 'vamsi@example.com' });
        }
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem'
                }}>
                    👤
                </div>
                <h1>{user.username}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>

                <div style={{ marginTop: '3rem', textAlign: 'left', background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem' }}>
                    <h3>Account Statistics</h3>
                    <p>Total Songs Played: 12</p>
                    <p>Heartbeat Scans: 5</p>
                    <p>Playlists Created: 2</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
