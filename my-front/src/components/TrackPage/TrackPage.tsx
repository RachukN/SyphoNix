import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbum = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlbum(response.data);
      } catch (error) {
        setError('Failed to fetch album data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (loading) return <div>Loading album...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{album.name}</h1>
      <img src={album.images[0]?.url} alt={album.name} />
      <p>Release date: {album.release_date}</p>
      <p>Tracks:</p>
      <ul>
        {album.tracks.items.map((track: any) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumPage;
