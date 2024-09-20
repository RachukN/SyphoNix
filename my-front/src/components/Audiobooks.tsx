import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Audiobooks.css'; // Ensure this file contains your grid and card styles

interface Audiobook {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  authors: { name: string }[];
  narrators: { name: string }[];
  publisher: string;
  total_chapters: number;
  uri: string;
}

const Audiobooks: React.FC = () => {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Example audiobook IDs from Spotify (Replace these with actual audiobook IDs)
  const audiobookIds = [
    "2fD3Nl91z6jV8aa9ytcCLs",
    "2gdqHZ4x5T7PXPqkxInphy",
"7iutDRgblzqjEoXkue8LJQ"
  ];

  useEffect(() => {
    const fetchAudiobooks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/audiobooks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: audiobookIds.join(','), // Comma-separated list of audiobook IDs
            market: '', // Specify the market where audiobooks are available
          },
        });

        if (response.status === 200 && response.data.audiobooks) {
          setAudiobooks(response.data.audiobooks);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (err) {
        console.error('Error fetching audiobooks:', err);
        setError('An error occurred while fetching audiobooks.');
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, [audiobookIds]);

  if (loading) {
    return <div>Loading audiobooks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="audiobooks-grid">
      {audiobooks.map((audiobook) => (
        audiobook ? (
          <div className="audiobook-card" key={audiobook.id}>
            <img
              src={audiobook.images && audiobook.images.length > 0 ? audiobook.images[0].url : 'default-audiobook.png'}
              alt={audiobook.name}
              className="audiobook-image"
            />
            <h3 className="audiobook-title">{audiobook.name}</h3>
            <p className="audiobook-authors">
              {audiobook.authors.map((author) => author.name).join(', ')}
            </p>
            <p className="audiobook-description">
              {audiobook.description ? audiobook.description.slice(0, 100) : "No description available"}...
            </p>
            <p className="audiobook-narrators">
              Narrated by: {audiobook.narrators.map((narrator) => narrator.name).join(', ')}
            </p>
            <p className="audiobook-publisher">Publisher: {audiobook.publisher}</p>
            <p className="audiobook-chapters">Total Chapters: {audiobook.total_chapters}</p>
          </div>
        ) : (
          <div className="audiobook-card" key={Math.random()}>
            <p>Sorry, this audiobook is not available in your region.</p>
          </div>
        )
      ))}
    </div>
  );
};

export default Audiobooks;
