import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string, id: string; }[];
  uri: string;
}

interface Device {
  id: string;
  is_active: boolean;
}

const NewTracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftArrow, setLeftArrow] = useState(LeftGray);
  const [rightArrow, setRightArrow] = useState(RightGreen);

  useEffect(() => {
    const fetchNewTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 21,
          },
        });

        if (response.status === 200 && response.data.items) {
          setTracks(response.data.items.map((item: any) => item.track));
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching new tracks:', error?.response || error.message || error);
        setError('An error occurred while fetching new tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewTracks();
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
          uris: [trackUri], // Use `uris` to play a single track
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
      if (error.response && error.response.status === 404) {
        console.log('Retrying to connect player...');
        setTimeout(() => handlePlayTrack(trackUri), 2000); // Retry after delay
      }
    }
  };

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft === 0) {
        setLeftArrow(LeftGray);
        setRightArrow(RightGreen);  
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {  
        setLeftArrow(LeftGreen); 
        setRightArrow(RightGray); 
      } else {
        setLeftArrow(LeftGreen);
        setRightArrow(RightGreen);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrows, 300); 
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrows, 300);
    }
  };

  if (loading) {
    return <div>Loading new tracks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (tracks.length === 0) {
    return <div>No new tracks available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={leftArrow} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
          <img src={rightArrow} alt="Scroll Right" className="img-r" onClick={scrollRight} />
          <div className='main-title'>Нові треки для вас</div>

          <div
            ref={scrollRef}
            className='music-c'
            onScroll={updateArrows}
          >
            {tracks.map((track) => {
              return (
                <div className="img-container" key={track.id}>
                  <div className='img-content'>
                    <img
                      src={track.album.images[0]?.url || 'default-album.png'}
                      alt={track.name}
                      className='m-5'
                    />
                    <div onClick={() => handlePlayTrack(track.uri)} className="play-icon">
                      <img src={Play} alt="Play" />
                    </div>
                  </div>
                  <div>
                    <p>
                      <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
                        {track.name}
                      </span>
                    </p>
                    <p className='artist-name' style={{ fontSize: 'small' }}>
                      {track.artists.map(artist => (
                        <Link key={artist.id} to={`/artist/${artist.id}`}>
                          <span className="result-name" style={{ cursor: 'pointer' }}>
                            {artist.name}
                          </span>
                        </Link>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTracks;
