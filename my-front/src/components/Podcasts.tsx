import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Podcasts.css'; // Ensure this file contains your styling

interface Episode {
  id: string;
  name: string;
  description: string;
  images: { url: string }[] | null; // Ensure images could be null
  release_date: string;
  audio_preview_url: string | null;
  duration_ms: number;
  explicit: boolean;
  uri: string;
}

const Podcasts: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Example episode IDs - Make sure these are valid IDs from Spotify
  const episodeIds = [
    "77o6BIVlYM3msb4MMIL1jH",
    "0Q86acNRm6V9GYx55SXKwf",
    "5Xt5DXGzch68nYYamXrNxZ",
    "6rqhFgbbKwnb9MLmUQDhG6",
    "6YuHzZczk79wTPnYpMfs6L",
    "3n9D2ZrGDu9pr6FPUl3lpy",
    "6rqhFgbbKwnb9MLmUQDhG7",
    "0m3Mst3mVcNhbcQna2Xln3",
    "6LJkXrWXVv0szuxSroONPM",
    "77o6BIVlYM3msb4MMIL1jA",
    "2XI6b0CVxgDke2XkPf2mDf",
    "0vvwcyFh8xz5F0wZVZwhWP",
    "4M1PSVbGfgXmSrn2JwU8Kw",
    "4Dg9V4khHLBvlXdwDwmLfT"
  ];

  useEffect(() => {
    const fetchEpisodes = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/episodes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: episodeIds.join(','), // Send the episode IDs as a comma-separated string
            market: 'US', // Specify the market
          },
        });

        if (response.status === 200 && response.data.episodes) {
          setEpisodes(response.data.episodes);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (err) {
        console.error('Error fetching episodes:', err);
        setError('An error occurred while fetching episodes.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [episodeIds]);

  if (loading) {
    return <div>Loading podcasts...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="podcasts-grid">
      {episodes.map((episode) => (
        episode && episode.images && episode.images.length > 0 ? (
          <div className="podcast-card" key={episode.id}>
            <img
              src={episode.images[0].url || 'default-episode.png'}
              alt={episode.name || "Podcast Episode"}
              className="podcast-image"
            />
            <h3 className="podcast-title">{episode.name || "Unknown Title"}</h3>
            <p className="podcast-description">
              {episode.description ? episode.description.slice(0, 100) : "No description available"}...
            </p>
          </div>
        ) : (
          <div className="podcast-card" key={episode?.id || Math.random()}>
            <img
              src="default-episode.png" // Provide a default image in case no images exist
              alt="Podcast Episode"
              className="podcast-image"
            />
            <h3 className="podcast-title">{episode?.name || "Unknown Title"}</h3>
            <p className="podcast-description">
              {episode?.description ? episode.description.slice(0, 100) : "No description available"}...
            </p>
          </div>
        )
      ))}
    </div>
  );
};

export default Podcasts;
