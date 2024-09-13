// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Correct paths based on the file structure
import HomeIcon from './Frame 41.png';
import SearchIcon from './Frame 42.png';
import LibraryIcon from './Frame 57.png';
import Logo from './SymphoNix logo.png';
import LikedTracksIcon from './Rectangle 2.png';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <img src={Logo} alt="SymphoNix Logo" className="sidebar-logo" />
        
      </header>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className="sidebar-link">
              <img src={HomeIcon} alt="Home" className="sidebar-icon-h" />
              Головна
            </Link>
          </li>
          <li>
            <Link to="/categories" className="sidebar-link">
              <img src={SearchIcon} alt="Search" className="sidebar-icon" />
              Пошук
            </Link>
          </li>
          <li>
            <Link to="/library" className="sidebar-link">
              <img src={LibraryIcon} alt="Library" className="sidebar-icon" />
              Бібліотека
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-buttons">
        <button className="sidebar-button">Плейлісти</button>
        <button className="sidebar-button">Артисти</button>
        <button className="sidebar-button">Альбоми</button>
      </div>
      <section className="sidebar-content">
        <div className="sidebar-item">
          <img src={LikedTracksIcon} alt="Liked Tracks" className="sidebar-item-img" />
          <div>
            <p className="sidebar-item-title">Треки, які сподобалися</p>
            <p className="sidebar-item-subtitle">Плейліст • 20 пісень</p>
          </div>
        </div>
        {/* Add more items as needed */}
      </section>
    </div>
  );
};

export default Sidebar;
