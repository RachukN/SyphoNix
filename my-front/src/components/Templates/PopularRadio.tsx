// src/components/PopularRadio.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from '../Main/Images/Frame 73.png';
import Right from '../Main/Images/Frame 72.png';
import '../../styles/Music.css';

const PopularRadio: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPopularRadio = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Fetch popular playlists (which can be considered as radio)
        const response = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            country: 'UA',
            limit: 20, // Fetch 20 playlists
          },
        });

        if (response.status === 200 && response.data.playlists.items) {
          setPlaylists(response.data.playlists.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching popular radio:', error?.response || error.message || error);
        setError('An error occurred while fetching popular radio.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRadio();
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
    return <div>Loading popular radio...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (playlists.length === 0) {
    return <div>No popular radio available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="  img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="  img-r" onClick={scrollRight} />

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
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => window.open(playlist.external_urls.spotify, '_blank')}
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={playlist.images[0]?.url}
                  alt={playlist.name}
                  style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                />
                <p className='auth' style={{ margin: '10px 0' }}>{playlist.name}</p>
                <p style={{ fontSize: 'small', color: '#666' }}>SymphoNix</p> {/* Додає текст "SymphoNix" */}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PopularRadio;
