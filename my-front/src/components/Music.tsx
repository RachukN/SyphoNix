// src/components/Music.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
    name: string;
  };
  artists: { name: string }[];
  preview_url: string;
  external_urls: { spotify: string };
}

const Music: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Example list of more track IDs
        const trackIds = [
          '7ouMYWpwJ422jRcDASZB7P', '4VqPOruhp5EdPBeR92t6lQ', '2takcwOaAZWiXQijPHIx7B', 
          '1M4qEo4HE3PRaCOM7EXNJq', '1rgnBhdG2JDFTbYkYRZAku', '0VjIjW4GlUZAMYd2vXMi3b',
          '7qiZfU4dY1lWllzX7mPBI3', '3n3Ppam7vgaVa1iaRUc9Lp', '2TpxZ7JUBn3uw46aR7qd6V', 
          '4RVwu0g32PAqgUiJoXsdF8', '2WfaOiMkCvy7F5fcp2zZ8L', '5KawlOMHjWeUjQtnuRs22c', 
          '6UelLqGlWMcVH1E5c4H7lY', '6habFhsOp2NvshLv26DqMb', '7e89621JPkKaeDSTQ3avtg',
          '2Fxmhks0bxGSBdJ92vM42m', '6DCZcSspjsKoFjzjrWoCdn', '1fDsrQ23eTAVFElUMaf38X',
          '2xLMifQCjDGFmkHkpNLD9h', '0e7ipj03S05BNilyu5bRzt', '3Vi5XqYrmQgOYBajMWSvCi',
          '4iJyoBOLtHqaGxP12qzhQI', '3tjFYV6RSFtuktYl3ZtYcq', '2YpeDb67231RjR0MgVLzsG',
          '6EJiVf7U0p1BBfs0qqeb1f', '7GX5flRQZVHRAGd6B4TmDO', '2dpaYNEQHiRxtZbfNsse99',
          '5OCJzvD7sykQEKHH7qAC3C', '0y60itmpH0aPKsFiGxmtnh', '4zCScT9VcI6yFyyol4vjS1',
          '1lDWb6b6ieDQ2xT7ewTC3G', '6K4t31amVTZDgR3sKmwUJJ', '5rFgFECQxxwRcdwMSe63gP',
          '5nV06rmGrvHA4me7FhsYgK', '2iZsGvnF2dve9S0sBtR9EF', '5xWzVVbrHOYitCAYpZ3nIM',
          '5W4kiuCdiBZOSnBPivCZRW', '7aFdi2eQtMmviJI4KPODTo', '0qz7dVHdzxZrK7FuGSlz8A',
          '6g0Orsxv6glTJCt4cHsRsQ', '0WqnBKkAvwhg8PvAX2N34J', '3I2wEPxHO0gbyU0WCJwqGx',
          '2WcikAQpyGF9EzZfA2UA9i', '4fdxNYGh5Ahlom7d6xA9To', '7qI3LUpfCfuWSYyk7pdmNY',
          '2V65y3PX4DkRhy1djlxd9p', '2nC3oWXUg11S6jNfGFFA3S', '3f4oA3u5fPZfWzVMhRZsF5',
          '6b2RcmUt1g9N9mQ3CbjX2Y', '4l1KmLWTQ9gR9R36U3X84I'
        ].join(',');

        const response = await axios.get(`https://api.spotify.com/v1/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: trackIds,
            market: 'US',
          },
        });

        if (response.status === 200 && response.data.tracks) {
          setTracks(response.data.tracks);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching tracks:', error?.response || error.message || error);
        setError('An error occurred while fetching tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return <div>Loading tracks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Music Tracks</h1>
        <div style={{ overflowX: 'auto', display: 'flex', gap: '20px', padding: '20px 0' }}>
          {tracks.map((track) => (
            track && track.external_urls && (
              <div key={track.id} style={{ minWidth: '200px', textAlign: 'center' }}>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {track.album.images.length > 0 && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  )}
                  <p style={{ margin: '10px 0' }}>{track.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>{track.artists.map(artist => artist.name).join(', ')}</p>
                </a>
                {track.preview_url && (
                  <audio controls>
                    <source src={track.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
