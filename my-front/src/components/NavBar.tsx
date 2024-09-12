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
    <nav style={{ padding: '10px', backgroundColor: '#282c34', color: 'white' }}>
      <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/profile" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Profile</Link>
      <Link to="/categories" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Categories</Link>
      <Link to="/music" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Music</Link>
      
      <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
    </nav>
  );
};

export default NavBar;
