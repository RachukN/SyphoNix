// src/components/FollowedArtists.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import '../styles/Music.css'; // Ensure you have the correct path

// Define the interfaces for types used in this component
interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const FollowedArtists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        console.error('No access token found in local storage.');
        return;
      }

      try {
        setLoading(true);
        let fetchedArtists: Artist[] = [];
        let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist&limit=20';

        // Fetch followed artists, handling pagination if necessary
        while (nextUrl) {
          const response = await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200 && response.data.artists) {
            fetchedArtists = [...fetchedArtists, ...response.data.artists.items];
            nextUrl = response.data.artists.next; // Get the next page URL
          } else {
            setError('Unexpected response format from Spotify API.');
            console.error('Unexpected response format:', response);
            break;
          }
        }

        setArtists(fetchedArtists);
      } catch (error: any) {
        console.error('Error fetching followed artists:', error);
        setError(`An error occurred while fetching followed artists: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedArtists();
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
    return <div>Loading followed artists...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (artists.length === 0) {
    return <div>No followed artists available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="img-r" onClick={scrollRight} />

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
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="img-container"
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <img
                    src={artist.images.length > 0 ? artist.images[0].url : 'default-artist.png'}
                    alt={artist.name}
                    style={{ width: '140px', height: '140px', borderRadius: '50%' }} // Circular image
                  />
                  <p className='auth' style={{ margin: '10px 0' }}>{artist.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>Виконавець</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowedArtists;
