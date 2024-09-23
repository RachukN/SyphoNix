import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from '../Main/Images/Frame 73.png';
import Right from '../Main/Images/Frame 72.png';
import '../../styles/Music.css';
import { useGlobalPlayer } from '../Player/GlobalPlayer'; // Use global player for track playback

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  external_urls: { spotify: string } | null;
}

const PopularAlbums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playTrack } = useGlobalPlayer(); // Get playTrack function from global player context

  useEffect(() => {
    const fetchPopularAlbums = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // List of album IDs for fetching
        const albumIds = [
          '382ObEPsp2rxGrnsizN5TX', '1A2GTWGtFfWp7KSQTwWOyo', '2noRn2Aes5aoNVsU6iWThc',
          '3SpBlxme9WbeQdI9kx7KAV', '4aawyAB9vmqN3uQ7FjRGTy', '6JWc4iAiJ9FjyK0B59ABb4',
          '0sNOF9WDwhWunNAHPD3Baj', '4aEnNH9PuU1HF3TsZTru54', '3Kz2WfrGd5wbsVZDoIEb43',
          '0n9SWDBEftKwq09B01Pwzw'
        ].join(',');

        const response = await axios.get(`https://api.spotify.com/v1/albums`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: albumIds,
            market: 'US',
          },
        });

        if (response.status === 200 && response.data.albums) {
          setAlbums(response.data.albums);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching popular albums:', error?.response || error.message || error);
        setError('An error occurred while fetching popular albums.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAlbums();
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
    return <div>Loading popular albums...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (albums.length === 0) {
    return <div>No popular albums available.</div>;
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
            {albums.map((album) => {
              if (!album || !album.images || album.images.length === 0 || !album.external_urls) {
                return null; // Skip if album data is incomplete
              }
              return (
                <div
                  key={album.id}
                  onClick={() => album.external_urls?.spotify && playTrack(album.external_urls.spotify)} // Adjust as per play function
                  style={{
                    minWidth: '140px',
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={album.images[0]?.url || ''}
                    alt={album.name}
                    style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                  />
                  <p className='auth' style={{ margin: '10px 0' }}>{album.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>
                    {album.artists.map((artist) => artist.name).join(', ')}
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

export default PopularAlbums;
