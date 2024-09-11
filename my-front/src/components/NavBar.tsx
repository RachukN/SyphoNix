// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#282c34', color: 'white' }}>
      <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
      <Link to="/categories" style={{ color: 'white', textDecoration: 'none' }}>Categories</Link>
      <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
    </nav>
  );
};

export default NavBar;
