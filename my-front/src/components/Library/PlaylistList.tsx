import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaylistList: React.FC = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:5059/api/playlists');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Failed to fetch playlists', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await axios.delete(`http://localhost:5059/api/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p.id !== playlistId));
    } catch (error) {
      console.error('Failed to delete playlist', error);
    }
  };

  const handleToggleFavorite = async (playlistId: string) => {
    try {
      const response = await axios.post(`http://localhost:5059/api/playlists/${playlistId}/favorite`);
      setPlaylists(playlists.map(p => p.id === playlistId ? response.data : p));
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist: any) => (
          <li key={playlist.id}>
            <h3>{playlist.name}</h3>
            {playlist.imagePath && <img src={playlist.imagePath} alt={playlist.name} />}
            <p>{playlist.description}</p>
            <button onClick={() => handleToggleFavorite(playlist.id)}>
              {playlist.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete</button>
            <button>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistList;
