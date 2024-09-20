import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import bannerImage from './Frame 148 (2).png';
import TopNavigation from '../Main/TopNavigation';
import Footer from '../Footer';
import PlayerControls from '../Player/PlayerControls';
import Seting from './Frame 129 (2).png';
import LeftGray from '../Main/Frame 73.png';
import RightGray from '../Main/Frame 72 (1).png';
import LeftGreen from '../Main/Frame 73 (1).png';
import RightGreen from '../Main/Frame 72.png';
import Play from '../../images/Frame 76.png';
import { GlobalPlayerProvider } from '../Player/GlobalPlayer';
import '../../styles/ArtistPage.css';

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
  artists: { name: string }[];
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
    alert('Subscribed to the artist!');
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

  const handlePlayAlbum = async (uri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error playing album:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!artist) {
    return <div>Loading artist data...</div>;
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
          <button onClick={handleSubscribe} className="subscribe-button">
            Підписатися
          </button>
        </div>
  
        {/* Top Tracks Section */}
        <div className="cont-a">
          <div className="top-tracks">
            <h2 className="popularity">Популярні</h2>
            <ul className="tracks-list">
              {topTracks.map((track, index) => (
                <li key={track.id} className="track-item">
                  <span className="track-index">{index + 1}</span>
                  <img
                    src={track.album.images[0]?.url || "default-album.png"}
                    alt={track.name}
                    className="track-image"
                  />
                  <div className="track-info">
                    <p className="track-name">{track.name}</p>
                  </div>
                  <div className="track-album">{track.popularity}/50</div>
                  <div className="track-duration">{formatDuration(track.duration_ms)}</div>
                  <div onClick={() => handlePlayAlbum(track.uri)} className="play-icona">
                    <img src={Play} alt="Play" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
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
                    <p className="auth">{single.name}</p>
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
                    <div onClick={() => handlePlayAlbum(artist.uri)} className="play-iconaa">
                      <img src={Play} alt="Play" />
                    </div>
                    <p className="auth">{artist.name}</p>
                  
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
