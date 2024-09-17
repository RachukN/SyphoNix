
// src/components/RockMusic.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import '../styles/Music.css';

// Define the interfaces for types used in this component
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

interface Device {
  id: string;
  is_active: boolean;
}

const RockMusic: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handlePlayTrack = async (trackUri: string) => {
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
          uris: [trackUri], // Array of track URIs to play
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Track is playing');
    } catch (error: any) {
      console.error('Error playing track:', error?.response || error.message || error);
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
          <img src={Left} alt="Scroll Left" className=" img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className=" img-r" onClick={scrollRight} />

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
              // Ensure `track.external_urls` and `track.external_urls.spotify` are not null before accessing
              if (!track || !track.album || !track.external_urls || !track.external_urls.spotify) {
                return null; // Skip rendering if required data is missing
              }
              return (
                <div
                  key={track.id}
                  onClick={() => track.preview_url && handlePlayTrack(track.external_urls!.spotify)}
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
