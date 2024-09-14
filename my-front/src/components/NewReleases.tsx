// src/components/NewReleases.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import '../styles/Music.css';
import { useGlobalPlayer } from './Player/GlobalPlayer'; // Import GlobalPlayer context

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  external_urls: { spotify: string };
  uri: string; // Add if required for playback through GlobalPlayer
}

const NewReleases: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playTrack } = useGlobalPlayer(); // Use GlobalPlayer context

  useEffect(() => {
    const fetchNewReleases = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Fetch new releases from Spotify
        const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: 'US',
            limit: 20, // Fetch 20 new releases
          },
        });

        // Debugging response
        console.log('New Releases Response:', response.data);

        // Ensure the response structure matches expectations
        if (response.status === 200 && response.data.albums && response.data.albums.items) {
          setAlbums(response.data.albums.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching new releases:', error?.response || error.message || error);
        setError('An error occurred while fetching new releases.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
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
    return <div>Loading new releases...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (albums.length === 0) {
    return <div>No new releases available.</div>;
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
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  console.log('Playing track:', album.uri); // Debug log
                  playTrack(album.uri); // Play the track using GlobalPlayer
                }}
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                />
                <p className='auth' style={{ margin: '10px 0' }}>{album.name}</p>
                <p style={{ fontSize: 'small', color: '#666' }}>
                  {album.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
