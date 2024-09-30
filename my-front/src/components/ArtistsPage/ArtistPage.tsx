import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import bannerImage from '../Home/Images/Frame 148 (2).png';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import PlayerControls from '../Player/PlayerControls';
import Seting from '../Home/Images/Frame 129.png';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import { GlobalPlayerProvider } from '../Player/GlobalPlayer';
import '../../styles/ArtistPage.css';
import LoadingPageWithSidebarA from '../Loading/LoadingTrackPageA';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
  popularity: number;
}

interface Track {
  id: string;
  name: string;
  popularity: number;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { id: string; name: string }[];
  duration_ms: number;
  uri: string;
}

interface Single {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  uri: string;
}

interface RelatedArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  uri: string;
}
interface Device {
  id: string;
  is_active: boolean;
}
const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<RelatedArtist[]>([]);
  const [error, setError] = useState('');
  const [leftArrowSingles, setLeftArrowSingles] = useState(LeftGray);
  const [rightArrowSingles, setRightArrowSingles] = useState(RightGreen);
  const [leftArrowRelated, setLeftArrowRelated] = useState(LeftGray);
  const [rightArrowRelated, setRightArrowRelated] = useState(RightGreen);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  
  
  const scrollRefSingles = useRef<HTMLDivElement>(null);
  const scrollRefRelated = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtist(artistResponse.data);

        const topTracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(topTracksResponse.data.tracks.slice(0, 5));

        const singlesResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSingles(singlesResponse.data.items);
        const followingResponse = await axios.get(
          `https://api.spotify.com/v1/me/following/contains`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              type: 'artist',
              ids: artistId,
            },
          }
        );
        setIsFollowing(followingResponse.data[0]); // Assumes a single ID was passed
        const relatedArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRelatedArtists(relatedArtistsResponse.data.artists);
      } catch (error) {
        console.error('Failed to fetch artist data.', error);
        setError('Failed to fetch artist data.');
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    try {
      if (isFollowing) {
        // Unfollow the artist
        await axios.delete(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Follow the artist
        await axios.put(
          `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsFollowing(!isFollowing); // Toggle follow state
    } catch (error) {
      console.error('Failed to update following status', error);
    }
  };


  const updateArrowsSingles = () => {
    if (scrollRefSingles.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRefSingles.current;

      if (scrollLeft === 0) {
        setLeftArrowSingles(LeftGray);
        setRightArrowSingles(RightGreen);
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setLeftArrowSingles(LeftGreen);
        setRightArrowSingles(RightGray);
      } else {
        setLeftArrowSingles(LeftGreen);
        setRightArrowSingles(RightGreen);
      }
    }
  };

  const updateArrowsRelated = () => {
    if (scrollRefRelated.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRefRelated.current;

      if (scrollLeft === 0) {
        setLeftArrowRelated(LeftGray);
        setRightArrowRelated(RightGreen);
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setLeftArrowRelated(LeftGreen);
        setRightArrowRelated(RightGray);
      } else {
        setLeftArrowRelated(LeftGreen);
        setRightArrowRelated(RightGreen);
      }
    }
  };

  const scrollLeftSingles = () => {
    if (scrollRefSingles.current) {
      scrollRefSingles.current.scrollBy({
        left: -scrollRefSingles.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsSingles, 300);
    }
  };

  const scrollRightSingles = () => {
    if (scrollRefSingles.current) {
      scrollRefSingles.current.scrollBy({
        left: scrollRefSingles.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsSingles, 300);
    }
  };

  const scrollLeftRelated = () => {
    if (scrollRefRelated.current) {
      scrollRefRelated.current.scrollBy({
        left: -scrollRefRelated.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsRelated, 300);
    }
  };

  const scrollRightRelated = () => {
    if (scrollRefRelated.current) {
      scrollRefRelated.current.scrollBy({
        left: scrollRefRelated.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsRelated, 300);
    }
  };
  const handlePlayTrack = async (uri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to play track.', error);
    }
  };
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


  if (error) {
    return <div>{error}</div>;
  }

  if (!artist) {
    return <div><LoadingPageWithSidebarA/></div>;
  }

  const profileImageUrl = artist.images.length > 0 ? artist.images[0].url : '';

  return (
    <div className="main-container-a">
      <div className="sidebar-a">
        <Sidebar />
      </div>

      <div className="content-a">
        <div className="banner-container-user-a">
          <img src={bannerImage} alt="Banner" className="banner-image-user-a" />
        </div>

        <div className="inf-a">
          <img
          key={artist.id}
            src={profileImageUrl}
            alt={artist.name}
            className="profile-image-a"
          />
          <div className="name-a">
            <div className="title-a">Виконавець</div>
            <div className="profile-details-a">
              <h1>{artist.name}</h1>
              <p className="title-a">{artist.followers.total} Слухачів</p>
            </div>
          </div>
        </div>

        <div className="seting-a">
          
          <img src={Seting} alt="Seting" className="seting-img" />
          <button

            onClick={handleSubscribe}
            className={isFollowing ? ' subscribed' : 'subscribe-button'}
          >
            {isFollowing ? 'Підписаний' : 'Підписатися'}
          </button>
        </div>
        <h2 className="popularity">Tоп треки виконавця</h2>
        <ul className="tracks-list">
  {topTracks.map((track, index) => (
    <li key={`${track.id}-${index}`} className="track-item"> {/* Ensure the key is unique */}
      <span className="track-index">{index + 1}</span>
      <img
        onClick={() => handlePlayTrack(track.uri)}
        src={track.album.images[0]?.url || "default-album.png"}
        alt={track.name}
        className="track-image"
      />
      <div className="track-info">
        <p className="track-name">
          <Link to={`/track/${track.id}`}>
            <span className="name-title" style={{ margin: '10px 0', cursor: 'pointer' }}>
              {track.name}
            </span>
          </Link>
        </p>
      </div>
      <div className="track-album">{track.popularity}</div>
      <div className="track-duration">{formatDuration(track.duration_ms)}</div>
      <div onClick={() => handlePlayAlbum(track.uri)} className="play-icona">
        <img src={Play} alt="Play" />
      </div>
    </li>
  ))}
</ul>


        {/* Singles Section with Scroll */}
        <h2 className="popularity">Сингли</h2>
        <div className="cont-sa">
          <div style={{ position: "relative", width: "100%" }}>
            <img
              src={leftArrowSingles}
              alt="Scroll Left"
              className="img-l"
              onClick={scrollLeftSingles}
            />
            <img
              src={rightArrowSingles}
              alt="Scroll Right"
              className="img-r"
              onClick={scrollRightSingles}
            />
            <div
  ref={scrollRefSingles}
  className="music-c"
  onScroll={updateArrowsSingles}
>
  {singles.map((single) => (
    <div key={single.id} className="img-container">
      <div className="img-content">
        <img
          src={single.images[0]?.url || "default-single.png"}
          alt={single.name}
          className="m-5m"
        />
        <div onClick={() => handlePlayAlbum(single.uri)} className="play-icona">
          <img src={Play} alt="Play" />
        </div>
        <Link to={`/album/${single.id}`}>
          <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
            {single.name.length > 16 ? `${single.name.substring(0, 12)}...` : single.name}
          </span>
        </Link>
        <p className="release-date">{single.release_date}</p>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>

        {/* Related Artists Section with Scroll */}
        <h2 className="popularity">Схожі артисти</h2>
        <div className="cont-sa">
          <div style={{ position: "relative", width: "100%" }}>
            <img
              src={leftArrowRelated}
              alt="Scroll Left"
              className="img-l"
              onClick={scrollLeftRelated}
            />
            <img
              src={rightArrowRelated}
              alt="Scroll Right"
              className="img-r"
              onClick={scrollRightRelated}
            />
            <div
  ref={scrollRefRelated}
  className="music-c"
  onScroll={updateArrowsRelated}
>
  {relatedArtists.map((artist) => (
    <div key={artist.id} className="img-container">
      <div className="img-contenta">
        <img
          src={artist.images[0]?.url || "default-artist.png"}
          alt={artist.name}
          className="m5m"
        />
      </div>
      <Link to={`/artist/${artist.id}`}>
        <div className="play-iconaa" />
      </Link>
      <Link to={`/artist/${artist.id}`}>
        <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
          {artist.name.length > 16 ? `${artist.name.substring(0, 12)}...` : artist.name}
        </span>
      </Link>
    </div>
  ))}
</div>

          </div>
        </div>

        <Footer />
      </div>

      <div className="filter-user-a">
        <TopNavigation />
      </div>

      <GlobalPlayerProvider>
        <div className="player-a">
          <PlayerControls />
        </div>
      </GlobalPlayerProvider>
    </div>
  );


};

export default ArtistPage;
