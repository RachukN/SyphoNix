import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import BGimage from '../images/Vector 1.png';
import SearchBar from './SearchBar';
import TopNavigation from './Navigation/TopNavigation';

interface TrackResult {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
  uri: string;
}

interface AlbumResult {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  uri: string;
}

interface ArtistResult {
  id: string;
  name: string;
  images: { url: string }[];
  uri: string;
}

const SearchResults: React.FC = () => {
  const [tracks, setTracks] = useState<TrackResult[]>([]);
  const [albums, setAlbums] = useState<AlbumResult[]>([]);
  const [artists, setArtists] = useState<ArtistResult[]>([]);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const location = useLocation();

  // Refs for scrolling
  const artistScrollRef = useRef<HTMLDivElement>(null);
  const albumScrollRef = useRef<HTMLDivElement>(null);
  const trackScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      axios
        .get(`https://api.spotify.com/v1/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: query, type: 'track,artist,album', limit: 10 },
        })
        .then((response) => {
          const { tracks, albums, artists } = response.data;
          setTracks(tracks.items.filter((item: any) => item.album && item.album.images.length > 0));
          setAlbums(albums.items.filter((item: any) => item.images.length > 0));
          setArtists(artists.items.filter((item: any) => item.images.length > 0));
        })
        .catch((err) => {
          setError('Failed to fetch search results.');
          console.error(err);
        });
    }
  }, [location.search]);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'My Web Player',
        getOAuthToken: cb => { cb(token); }
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Player is ready with Device ID:', device_id);
        setDeviceId(device_id); // Save the device ID
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    };
  }, []);

  const getActiveDeviceId = async (): Promise<string | null> => {
    if (!deviceId) return null;
    return deviceId;
  };

  const checkAndPlayTrack = async (trackUri: string) => {
    const deviceId = await getActiveDeviceId();
    const token = localStorage.getItem('spotifyAccessToken');

    if (!deviceId) {
      alert('No active Spotify device found. Please open Spotify on your device and try again.');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [trackUri], // Play the specific track URI
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
      console.error('Error playing track:', error?.response?.data || error.message);
    }
  };

  const checkAndPlayAlbum = async (albumUri: string) => {
    const deviceId = await getActiveDeviceId();
    const token = localStorage.getItem('spotifyAccessToken');

    if (!deviceId) {
      alert('No active Spotify device found. Please open Spotify on your device and try again.');
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
      console.error('Error playing album:', error?.response?.data || error.message);
    }
  };

  // Scroll logic for artists, albums, and tracks
  const scrollLeft = (scrollRef: React.RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (scrollRef: React.RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="search-results-container">
      <div className='bg-img'><img src={BGimage} alt="image" /></div>
      <div className="results-container">
        <div className='results-container'><TopNavigation /></div>

        <div className='search'><SearchBar /></div>


      </div>
      {error && <p className="error-message">{error}</p>}
      <div className='result'>
        {/* Artists Section */}
        <div >
          <h2>Artists</h2>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div className='margin'>
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={Left} alt="Scroll Left" className="img-l" onClick={() => scrollLeft(artistScrollRef)} />
                <img src={Right} alt="Scroll Right" className="img-r" onClick={() => scrollRight(artistScrollRef)} />

                <div
                  ref={artistScrollRef}
                  className='music-c-c'

                >
                  {artists.map((artist) => {
                    if (!artist || !artist.uri) return null;
                    return (
                      <div
                        key={artist.id}
                        className="img-container-c"

                      >
                        <img
                          src={artist.images[0]?.url || 'default-artist.png'}
                          alt={artist.name}
                          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                        />
                        <p className='auth' style={{ margin: '10px 0' }}>{artist.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div>
          <h2>Albums</h2>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={Left} alt="Scroll Left" className="img-l" onClick={() => scrollLeft(albumScrollRef)} />
              <img src={Right} alt="Scroll Right" className="img-r" onClick={() => scrollRight(albumScrollRef)} />
              <div
                ref={albumScrollRef}
                className="music-c-c"
                style={{ display: 'flex', overflowX: 'hidden', gap: '20px', padding: '10px 0' }}
              >
                <div className='margin'></div>
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="marg-c"
                    onClick={() => checkAndPlayAlbum(album.uri)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={album.images[0]?.url}
                      alt={album.name}
                      style={{ width: '140px', height: '140px', borderRadius: '10px' }}
                      className="marg-c"
                    />
                    <p className="auth" style={{ margin: '10px 0' }}>{album.name}</p>
                    <p style={{ fontSize: 'small', color: '#666' }}>
                      {album.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2>Tracks</h2>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={Left} alt="Scroll Left" className="img-l" onClick={() => scrollLeft(trackScrollRef)} />
              <img src={Right} alt="Scroll Right" className="img-r" onClick={() => scrollRight(trackScrollRef)} />
              <div
                ref={trackScrollRef}
                className="music-c-c"
                style={{ display: 'flex', overflowX: 'hidden', gap: '20px', padding: '10px 0' }}
              >
                <div className='margin'></div>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="marg-c"
                    onClick={() => checkAndPlayTrack(track.uri)}
                    style={{ cursor: 'pointer' }}
                  >
                    
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      style={{ width: '140px', height: '140px', borderRadius: '10px' }}
                      className="marg-c"
                    />
                    <p className="auth">{track.name}</p>
                    <p className="artist-name">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>



  );
};

export default SearchResults;
