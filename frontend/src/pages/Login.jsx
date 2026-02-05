import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
                localStorage.setItem('token', res.data.access_token);
                navigate('/');
            } else {
                await axios.post(`${API_BASE_URL}/auth/signup`, { username, email, password });
                alert("Signup successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '3rem', borderRadius: '1rem', width: '350px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(to right, #f43f5e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hrudaya Raagam</h1>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    {!isLogin && <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />}
                    <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="btn" type="submit" style={{ marginTop: '1rem' }}>{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </p>
                <p style={{ textAlign: 'center', marginTop: '0.5rem' }}><a href="/" style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Back to Home</a></p>
            </div>
        </div>
    );
};

export default Login;
