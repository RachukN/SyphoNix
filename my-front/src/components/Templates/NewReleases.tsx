import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string, id: string; }[];
  external_urls: { spotify: string } | null;
  uri: string;
}

interface Device {
  id: string;
  is_active: boolean;
}

const NewReleases: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftArrow, setLeftArrow] = useState(LeftGray);
  const [rightArrow, setRightArrow] = useState(RightGreen);
  useEffect(() => {
    const fetchNewReleases = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: 'US', // Adjust market as needed
            limit: 21,
          },
        });

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

  const handlePlayAlbum = async (albumUri: string) => {
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
          context_uri: albumUri,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Album is playing');
    } catch (error: any) {
      console.error('Error playing album:', error?.response || error.message || error);
      if (error.response && error.response.status === 404) {
        // Retry logic for specific errors
        console.log('Retrying to connect player...');
        setTimeout(() => handlePlayAlbum(albumUri), 2000); // Retry after delay
      }
    }
  };

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // If scrolled all the way to the left
      if (scrollLeft === 0) {
        setLeftArrow(LeftGray);
        setRightArrow(RightGreen);  // Enable right arrow for more content
      }
      // If scrolled all the way to the right
      else if (scrollLeft + clientWidth >= scrollWidth - 1) {  // Ensure close to the rightmost position
        setLeftArrow(LeftGreen); // Enable left arrow to go back
        setRightArrow(RightGray); // Disable right arrow
      }
      // Scrolling in between
      else {
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
      setTimeout(updateArrows, 300);  // Update after scrolling
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrows, 300);  // Update after scrolling
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
          <img src={leftArrow} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
          <img src={rightArrow} alt="Scroll Right" className="img-r" onClick={scrollRight} />
          <div className='main-title'>Новинки для вас</div>

          <div
            ref={scrollRef}
            className='music-c'
            onScroll={updateArrows}
          >
            {albums.map((album) => {
              if (!album || !album.external_urls || !album.uri) {
                return null;
              }
              return (
                <div

                  className="img-container"

                >
                  <div className='img-content'>
                    <img
                      src={album.images[0]?.url || 'default-album.png'}
                      alt={album.name}
                      style={{}}
                      className='m-5'
                      key={album.id}

                    />
                    <div onClick={() => handlePlayAlbum(album.uri)} className="play-icon">
                      <img src={Play} alt="Play" />
                    </div>
                  </div>
                  <div>
                  <p  >
                      <Link key={album.id} to={`/album/${album.id}`}>
                        <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
                          {album.name}
                        </span>
                      </Link>
                    </p>

                    <p className='artist-name' style={{ fontSize: 'small' }}>
                      {album.artists.map(artist => (
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

export default NewReleases;
