import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [search, setSearch] = useState("");

  // Listen for storage events or just check periodically if needed
  // But for simple use, we rely on parent or reload. 
  // Better: check location or use a context. For now, simple local state initialized.

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${search}`);
    }
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Link to="/" className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #f43f5e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Hrudaya Raagam
      </Link>
      <input
        type="text"
        placeholder="Search Telugu Songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        style={{ width: '300px' }}
      />
      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/library">Playlists</Link></li>
        <li><Link to="/downloads">Downloads</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {token ? (
          <li onClick={handleLogout} style={{ cursor: 'pointer' }} className="btn">Logout</li>
        ) : (
          <li><Link to="/login" className="btn">Login/Signup</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
