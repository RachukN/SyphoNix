import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalPlayer } from './Player/GlobalPlayer'; // Import the global player context
import '../styles/TopTracks.css'; // Ensure this file exists with the styles

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  duration_ms: number;
  uri: string; // Use URI for full track playback
}

const TopTracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { player, deviceId } = useGlobalPlayer(); // Get player and device ID from global player context

  useEffect(() => {
    const fetchRecommendedTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        // Define seed values for recommendations
        const seedArtists = '4NHQUGzhtTLFvgF5SZesLK'; // Replace with your seed artist ID(s)
        const seedGenres = 'pop,rock'; // Replace with your seed genres
        const seedTracks = '0c6xIDDpzE81m2q797ordA'; // Replace with your seed track ID(s)

        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 10,
            market: 'US',
            seed_artists: seedArtists,
            seed_genres: seedGenres,
            seed_tracks: seedTracks,
          },
        });

        if (response.status === 200) {
          setTracks(response.data.tracks);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching recommended tracks:', error?.response || error.message || error);
        setError('An error occurred while fetching recommended tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedTracks();
  }, []);

  if (loading) {
    return <div>Loading recommended tracks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (tracks.length === 0) {
    return <div>No recommended tracks available.</div>;
  }

  // Helper function to format duration from milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle track click to play the full track using the Web Playback SDK
  const handleTrackClick = async (trackUri: string) => {
    if (!player || !deviceId) {
      alert('Spotify player is not ready.');
      return;
    }

    try {
      // Transfer playback to the Web Playback SDK device and start playing the track
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {
          uris: [trackUri],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('spotifyAccessToken')}`,
          },
          params: {
            device_id: deviceId,
          },
        }
      );
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Failed to play the track.');
    }
  };

  return (
    <div className="top-tracks">
      <ul className="tracks-list">
        {tracks.map((track, index) => (
          <li
            key={track.id}
            className="track-item"
            onClick={() => handleTrackClick(track.uri)} // Play track on click using URI
          >
            <span className="track-index">{index + 1}</span>
            <img
              src={track.album.images[0]?.url || 'default-album.png'}
              alt={track.name}
              className="track-image"
            />
            <div className="track-info">
              <p className="track-name">{track.name}</p>
              <p className="track-artist">{track.artists.map((artist) => artist.name).join(', ')}</p>
            </div>
            <div className="track-album">{track.album.name}</div>
            <div className="track-duration">{formatDuration(track.duration_ms)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
