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
import Plus from'./Default.png';
interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
}

const Sidebar: React.FC = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [favoriteTracksCount, setFavoriteTracksCount] = useState<number>(0);

  useEffect(() => {
    const fetchSavedAlbumsAndTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        // Fetch saved albums
        const albumsResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 }, // Limit to 10 albums, adjust as needed
        });

        const albums = albumsResponse.data.items.map((item: any) => item.album);
        setSavedAlbums(albums);

        // Fetch favorite tracks
        const tracksResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }, // You can adjust the limit based on your need
        });

        setFavoriteTracksCount(tracksResponse.data.total); // Store the total number of saved tracks
      } catch (error) {
        console.error('Failed to fetch saved albums or tracks:', error);
      }
    };

    fetchSavedAlbumsAndTracks();
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
            <div className="sidebar-link">
            <Link to="/playlists" className="sidebar-link" >
              <img src={LibraryIcon} alt="Library" className="sidebar-icon" />
              Бібліотека
              <img src={Plus} alt="Library" className="plus" />
            </Link>
            
            </div>
          </li>
        </ul>
      </nav>
      <div className="sidebar-buttons">
        <button className="sidebar-button">Плейлісти</button>
        <button className="sidebar-button">Артисти</button>
        <button className="sidebar-button">Альбоми</button>
      </div>

      <div className="sidebar-item">
        <div className='margin-5'>
          <Link to="/favorites" className="sidebar-link">
            <img src={LikedTracksIcon} alt="Liked Tracks" className="sidebar-item-img" />
          </Link>
          <div>
            <p className="sidebar-item-title-s">Треки, які сподобалися</p>
            <p className="sidebar-item-subtitle-s">Плейліст • {favoriteTracksCount} пісень</p>
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
