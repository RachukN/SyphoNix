// src/components/RockMusic.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import '../styles/Music.css';

import { useGlobalPlayer } from './Player/GlobalPlayer'; // Use global player for track playback

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
    name: string;
  } | null;
  artists: { name: string }[];
  preview_url: string | null;
  external_urls: { spotify: string } | null;
}

const RockMusic: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playTrack } = useGlobalPlayer(); // Get playTrack function from global player context

  useEffect(() => {
    const fetchRockTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Fetch rock tracks by specifying a genre
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: 'genre:rock', // Search query for rock genre
            type: 'track',
            market: 'UA',
            limit: 20, // Fetch 20 rock tracks
          },
        });

        if (response.status === 200 && response.data.tracks.items) {
          setTracks(response.data.tracks.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching rock tracks:', error?.response || error.message || error);
        setError('An error occurred while fetching rock tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchRockTracks();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div>Loading rock tracks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (tracks.length === 0) {
    return <div>No rock tracks available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="icon, img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="icon, img-r" onClick={scrollRight} />

          <div
            ref={scrollRef}
            className='music-c'
            style={{
              width: '1100px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
              
            }}
          >
            {tracks.map((track) => {
              if (!track || !track.album || !track.external_urls) {
                return null;
              }
              return (
                <div
                  key={track.id}
                  onClick={() => track.preview_url && playTrack(track.preview_url)}
                  style={{
                    minWidth: '140px',
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: track.preview_url ? 'pointer' : 'default',
                  }}
                >
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                  />
                  <p className='auth' style={{ margin: '10px 0' }}>{track.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>
                    {track.artists.map((artist) => artist.name).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RockMusic;
