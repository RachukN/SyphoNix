import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

// Correct paths based on the file structure
import HomeIcon from './Frame 41.png';
import SearchIcon from './Frame 57.png';
import LibraryIcon from './Frame 42.png';
import Logo from './SymphoNix logo.png';
import LikedTracksIcon from './Rectangle 2.png';

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
}

const Sidebar: React.FC = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchSavedAlbums = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/me/albums', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 }, // Limit to 10 albums, adjust as needed
        });

        const albums = response.data.items.map((item: any) => item.album);
        setSavedAlbums(albums);
      } catch (error) {
        console.error('Failed to fetch saved albums:', error);
      }
    };

    fetchSavedAlbums();
  }, []);

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
            <Link to="/searchh" className="sidebar-link">
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
      
      
        
      <div className="sidebar-item">
        <div className='margin-5' >
        <img src={LikedTracksIcon} alt="Liked Tracks" className="sidebar-item-img" />
          <div >
            <p className="sidebar-item-title">Треки, які сподобалися</p>
            <p className="sidebar-item-subtitle">Плейліст • 20 пісень</p>
          </div>
        </div>
          
        </div>
        {/* Display saved albums */}
        <section className="sidebar-content">
        {savedAlbums.map((album) => (
          <div key={album.id} className="sidebar-item">
            <img src={album.images[0]?.url || 'default-album.png'} alt={album.name} className="sidebar-item-img" />
            <div>
              <p className="sidebar-item-title">{album.name}</p>
              <p className="sidebar-item-subtitle">{album.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Sidebar;
