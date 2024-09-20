import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Main/TopNavigation';
import Footer from '../Footer';
import PlayerControls from '../Player/PlayerControls';
import '../../styles/SongPage.css';

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string; id: string }[];
  popularity: number;
  explicit: boolean;
  duration_ms: number;
  uri: string;
}

interface Recommendation {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  uri: string;
}

interface AudioFeature {
  danceability: number;
  energy: number;
  tempo: number;
  valence: number;
}

const SongPage: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeature | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchTrackData = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) return;

      try {
        const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrack(trackResponse.data);

        const audioFeaturesResponse = await axios.get(
          `https://api.spotify.com/v1/audio-features?ids=${songId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAudioFeatures(audioFeaturesResponse.data.audio_features[0]);

        const recommendationsResponse = await axios.get(
          `https://api.spotify.com/v1/recommendations?seed_tracks=${songId}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecommendations(recommendationsResponse.data.tracks);
      } catch (error) {
        console.error('Failed to fetch track data.', error);
      }
    };

    if (songId) {
      fetchTrackData();
    }
  }, [songId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

  return (
    <div className="song-page-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <TopNavigation />
        {track && (
          <div className="track-details">
            <img src={track.album.images[0].url} alt={track.name} className="album-art" />
            <div className="track-info">
              <h1>{track.name}</h1>
              <p>
                {track.artists.map((artist) => artist.name).join(', ')} - {track.album.name}
              </p>
              <p>Duration: {formatDuration(track.duration_ms)}</p>
              <p>Popularity: {track.popularity}/100</p>
              <p>{track.explicit ? 'Explicit' : 'Clean'}</p>
              <button onClick={() => handlePlayTrack(track.uri)}>Play</button>
            </div>
          </div>
        )}

        {audioFeatures && (
          <div className="audio-features">
            <h2>Audio Features</h2>
            <p>Danceability: {audioFeatures.danceability}</p>
            <p>Energy: {audioFeatures.energy}</p>
            <p>Tempo: {audioFeatures.tempo} BPM</p>
            <p>Valence: {audioFeatures.valence}</p>
          </div>
        )}

        <div className="track-lyrics">
          <h2>Lyrics</h2>
          <p className={showMore ? 'expanded' : 'collapsed'}>
            {/* Placeholder for lyrics */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac leo libero. Vivamus
            tincidunt nisl vel turpis bibendum, in facilisis lectus bibendum. Phasellus vehicula
            laoreet orci.
          </p>
          <button onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>

        <div className="recommendations">
          <h2>Recommendations</h2>
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.id} className="recommendation-item">
                <img src={rec.album.images[0].url} alt={rec.name} />
                <div className="recommendation-info">
                  <p>{rec.name}</p>
                  <p>{rec.artists.map((artist) => artist.name).join(', ')}</p>
                  <button onClick={() => handlePlayTrack(rec.uri)}>Play</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
      <div className="player-controls">
        <PlayerControls />
      </div>
    </div>
  );
};

export default SongPage;
