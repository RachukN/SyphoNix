// src/components/Music.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import '../../styles/Music.css';
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';

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

const Music: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        const trackIds = [
          '7ouMYWpwJ422jRcDASZB7P', '4VqPOruhp5EdPBeR92t6lQ', '2takcwOaAZWiXQijPHIx7B',
          '1M4qEo4HE3PRaCOM7EXNJq', '1rgnBhdG2JDFTbYkYRZAku', '0VjIjW4GlUZAMYd2vXMi3b',
          '7qiZfU4dY1lWllzX7mPBI3', '3n3Ppam7vgaVa1iaRUc9Lp', '2TpxZ7JUBn3uw46aR7qd6V',
          '4RVwu0g32PAqgUiJoXsdF8', '2WfaOiMkCvy7F5fcp2zZ8L', '5KawlOMHjWeUjQtnuRs22c',
          '6UelLqGlWMcVH1E5c4H7lY', '6habFhsOp2NvshLv26DqMb', '7e89621JPkKaeDSTQ3avtg',
          '2Fxmhks0bxGSBdJ92vM42m', '6DCZcSspjsKoFjzjrWoCdn', '1fDsrQ23eTAVFElUMaf38X',
          '2xLMifQCjDGFmkHkpNLD9h', '0e7ipj03S05BNilyu5bRzt'
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
          uris: [trackUri],
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
    return <div><LoadingTrackAlbum/></div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (tracks.length === 0) {
    return <div>No tracks available.</div>;
  }

  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="  img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="  img-r" onClick={scrollRight} />

          <div
            ref={scrollRef}
            style={{
              width: '1100px',
              height: '250px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {tracks.map((track) => {
              if (!track || !track.album || !track.external_urls || !track.external_urls.spotify) {
                return null;
              }
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (track.external_urls && track.external_urls.spotify) {
                      handlePlayTrack(track.external_urls.spotify);
                    }
                  }}
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

export default Music;
