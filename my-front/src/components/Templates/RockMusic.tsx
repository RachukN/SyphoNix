import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListTrack from './SpotifyContentListTrack'; // Use the track list component
import { handlePlayTrackList } from '../../utils/SpotifyPlayer'; // Import the new function
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const RockMusic: React.FC = () => {
  const [tracks, setTracks] = useState([]); // Store tracks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const { language } = useLanguage();
  useEffect(() => {
    const fetchRockTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: 'rock', type: 'track', market: 'US', limit: 21 },
        });

        setTracks(response.data.tracks.items);
      } catch (err) {
        setError('An error occurred while fetching rock tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchRockTracks();
  }, []);

  // Collect the URIs for the tracks
  const trackUris = tracks.map((track: any) => track.uri);

  // Handle the play action for the entire list
  const handlePlay = (startUri: string) => {
    handlePlayTrackList(trackUris, startUri); // Play all tracks, starting from the clicked one
  };

  if (loading) {
    return <div><LoadingTrackAlbum/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SpotifyContentListTrack items={tracks} handlePlay={handlePlay} title={language.rockTracks} />
  );
};

export default RockMusic;
