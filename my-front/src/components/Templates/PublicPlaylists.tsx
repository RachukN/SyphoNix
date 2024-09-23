// src/components/PublicPlaylists.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from '../Main/Images/Frame 73.png';
import Right from '../Main/Images/Frame 72.png';
import '../../styles/Music.css';
import Play from '../../images/Frame 76.png'

// Define the interfaces for types used in this component
interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
  external_urls: { spotify: string } | null;
  uri: string;
}

interface Device {
  id: string;
  is_active: boolean;
}

const PublicPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Fetch featured playlists from Spotify
        const response = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: 'US',
            limit: 20, // Fetch 20 public playlists
          },
        });

        if (response.status === 200 && response.data.playlists && response.data.playlists.items) {
          setPlaylists(response.data.playlists.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching public playlists:', error?.response || error.message || error);
        setError('An error occurred while fetching public playlists.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const getActiveDeviceId = async (): Promise<string | null> => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return null;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const devices: Device[] = response.data.devices;
      if (devices.length === 0) {
        console.error('No active devices found');
        return null;
      }

      // Return the first active device found, or fallback to the first available device
      const activeDevice = devices.find((device: Device) => device.is_active);
      return activeDevice ? activeDevice.id : devices[0].id;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return null;
    }
  };

  const handlePlayPlaylist = async (playlistUri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return;
    }

    const deviceId = await getActiveDeviceId();
    if (!deviceId) {
      alert('Please open Spotify on one of your devices to start playback.');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          context_uri: playlistUri, // Play the playlist using its URI
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Playlist is playing');
    } catch (error: any) {
      console.error('Error playing playlist:', error?.response || error.message || error);
    }
  };

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
    return <div>Loading public playlists...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (playlists.length === 0) {
    return <div>No public playlists available.</div>;
  }

  return (
    <div className='music-c'>
      <div className='public' style={{ padding: '20px', textAlign: 'center' }}>
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
            {playlists.map((playlist) => {
              // Ensure `playlist.external_urls` and `playlist.uri` are not null before accessing
              if (!playlist || !playlist.external_urls || !playlist.uri) {
                return null; // Skip rendering if required data is missing
              }
              return (
                <div
                  key={playlist.id}
                  onClick={() => handlePlayPlaylist(playlist.uri)}
                  className="img-container"
                  style={{
                    minWidth: '140px',
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <img
                    src={playlist.images[0]?.url || 'default-album.png'}
                    alt={playlist.name}
                    style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                  />
                  <div className="play-icon">
                  <img src={Play} alt="Play" />
                   </div>
                  <p className='auth' style={{ margin: '10px 0' }}>{playlist.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>
                    {playlist.owner.display_name}
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

export default PublicPlaylists;
