import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SyphonixAlbumList from './SyphonixAlbumList'; // Import the reusable component
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

// Import your custom images
import Album2 from '../../images/Rectangle 2 (1).png';
import Album3 from '../../images/Rectangle 2 (2).png';
import Album4 from '../../images/Rectangle 2 (3).png';
import Album5 from '../../images/Rectangle 2 (4).png';
import Album6 from '../../images/Rectangle 2 (5).png';
import Album7 from '../../images/Rectangle 2 (6).png';
import LoadingCategories from '../Loading/LoadingCategory';

// Playlist IDs to fetch from Spotify
export const playlistIds = [
  '37i9dQZEVXbMDoHDwVN2tF',  // Top 50 (World)
  '2DLtp8b5QBMbh49C6IyY3t',  // Top 100 (World)
  '3iQL47pHJ9YeAbSeXv4Zbp',  // Top 50 (Ukraine)
  '0knx3De3ZRlNW0H6Zt4sOl',  // Hip Hop Top
  '37i9dQZF1DX4FRWkwZlvTk',  // Rap Top
  '1TrTx2HOQEMyeCYFBaSPXe',  // Viral
];

const SuphoNixAlbums: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        const playlistPromises = playlistIds.map((id) =>
          axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const responses = await Promise.all(playlistPromises);

        // Map the responses to extract playlist data
        const fetchedPlaylists = responses.map((response) => response.data);
        setPlaylists(fetchedPlaylists);
      } catch (error: any) {
        console.error('Error fetching playlists:', error?.response || error.message || error);
        setError('An error occurred while fetching the playlists.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlay = (uri: string) => {
    console.log(`Playing playlist with URI: ${uri}`);
    // Implement play logic or pass the appropriate play function here
  };

  if (loading) {
    return ;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // Define your custom images
  const playlistImages = [Album2, Album3, Album4, Album5, Album6, Album7];

  // Assign custom images and custom names (now consistently named as `customName`)
  const customNames = [
    'Топ 50 (світ)', 
    'Топ 100 (світ)', 
    'Топ 50 (Україна)', 
    'Хіп хоп топ', 
    'Реп топ', 
    'Вірусні'
  ];

  const playlistsWithCustomData = playlists.map((playlist, index) => ({
    ...playlist,
    customImage: playlistImages[index], // Use custom image for each playlist
    customName: customNames[index], // Assign custom names
    customAuthor: 'SuphoNix' // Assign the same custom author for all playlists
  }));

  return (
    <SyphonixAlbumList
      items={playlistsWithCustomData} // Pass playlists with custom images and names
      handlePlay={handlePlay} // Pass the handlePlay function
      title={language.topCharts}
    />
  );
};

export default SuphoNixAlbums;
