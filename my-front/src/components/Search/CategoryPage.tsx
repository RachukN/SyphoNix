import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './CategoryPage.css';
import Sidebar from '../Sidebar/Sidebar';
import SearchBar from './SearchBar';
import TopNavigation from '../Navigation/TopNavigation';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook
import { useTheme } from '../../services/ThemeContext';
import {  handlePlayTrackList, formatDuration } from '../../utils/SpotifyPlayer';
import SpotifyContentListAlbumGrid from '../Templates/SpotifyContentListAlbumGrid';
import LeftGreen from '../Main/Images/Frame 73 (2).png';
import RightGreen from '../Main/Images/Frame 72.png';
import LoadingCategories from '../Loading/LoadingCategory';
interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
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

const CategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>(); // Get category ID from URL
    const location = useLocation(); // Get data from state
    const { name, image } = location.state || {}; // Extract category name and image
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const { isDarkMode } = useTheme();
    const accessToken = localStorage.getItem('spotifyAccessToken');

    // Pagination state for albums and tracks
    const [albumPage, setAlbumPage] = useState(1);
    const albumsPerPage = 52;

    const [trackPage, setTrackPage] = useState(1);
    const tracksPerPage = 48;

    useEffect(() => {
        if (!accessToken) {
            console.error('No access token found.');
            return;
        }

        // Fetch playlists for category
        const fetchPlaylistsForCategory = async () => {
            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setPlaylists(response.data.playlists.items);
            } catch (error) {
                console.error('Error fetching playlists for category:', error);
            }
        };

        fetchPlaylistsForCategory();
    }, [categoryId, accessToken]);

    useEffect(() => {
        if (playlists.length > 0 && accessToken) {
            const fetchTracksFromPlaylists = async () => {
                try {
                    const allTracks: Track[] = [];

                    for (const playlist of playlists) {
                        const response = await axios.get(
                            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                
                            }
                        );

                        const playlistTracks = response.data.items.map((item: any) => ({
                            id: item.track.id,
                            name: item.track.name,
                            album: {
                                name: item.track.album.name,
                                images: item.track.album.images,
                            },
                            artists: item.track.artists.map((artist: any) => ({
                                id: artist.id,
                                name: artist.name,
                            })),
                            duration_ms: item.track.duration_ms,
                            uri: item.track.uri,
                        }));

                        allTracks.push(...playlistTracks); // Add tracks to the combined array
                    }

                    setTracks(allTracks);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching tracks from playlists:', error);
                }
            };

            fetchTracksFromPlaylists();
        }
    }, [playlists, accessToken]);

    // Get paginated albums and tracks
    const startAlbumIndex = (albumPage - 1) * albumsPerPage;
    const displayedAlbums = tracks.slice(startAlbumIndex, startAlbumIndex + albumsPerPage);

    const startTrackIndex = (trackPage - 1) * tracksPerPage;
    const displayedTracks = tracks.slice(startTrackIndex, startTrackIndex + tracksPerPage);

    const trackUris = tracks.map((track) => track.uri);

    const handlePlay = (startUri: string) => {
        handlePlayTrackList(trackUris, startUri); // Play all tracks, starting from the clicked one
    };

    const nextAlbumPage = () => {
        if (startAlbumIndex + albumsPerPage < tracks.length) {
            setAlbumPage(albumPage + 1);
        }
    };

    const prevAlbumPage = () => {
        if (albumPage > 1) {
            setAlbumPage(albumPage - 1);
        }
    };

    const nextTrackPage = () => {
        if (startTrackIndex + tracksPerPage < tracks.length) {
            setTrackPage(trackPage + 1);
        }
    };

    const prevTrackPage = () => {
        if (trackPage > 1) {
            setTrackPage(trackPage - 1);
        }
    };

    if (loading) {
        return <LoadingCategories/>;
    }

    return (
        <div className={`search-results-container ${isDarkMode ? 'dark' : 'light'}`}>
            <Sidebar />

            <div className="best-result">
                {image && <img src={image} alt={name} className="category-image-large" />}
                <h2 className={`best-name-pisen-n ${isDarkMode ? 'dark' : 'light'}`}>Категорія </h2>
            </div>

            <div className="results-section">
                <div className="pisen-g">
                    <h2 className={`best-name-pisen ${isDarkMode ? 'dark' : 'light'}`}>{language.songs}</h2>
                    
                    <div className="pagination-controls">
                        <button onClick={prevTrackPage} disabled={trackPage === 1}>
                        <img src={LeftGreen}  alt="Scroll Left" />
                    
                        </button>
                        <button onClick={nextTrackPage} disabled={startTrackIndex + tracksPerPage >= tracks.length}>
                        <img src={RightGreen} alt="Scroll Right"   />
          
                        </button>
                    </div>
                    <ul className={`tracks-list-g ${isDarkMode ? 'dark' : 'light'}`}>
                        {displayedTracks.map((track, index) => (
                            <li key={`${track.id}-${index}`} className={`track-item-g ${isDarkMode ? 'dark' : 'light'}`}>
                                <span className="track-index">{index + 1}</span>
                                <img
                                    onClick={() => handlePlay(track.uri)}
                                    src={track.album.images[0]?.url || 'default-album.png'}
                                    alt={track.name}
                                    className="track-image"
                                />
                                <div className="track-info">
                                    <p className="track-name">
                                        <Link to={`/track/${track.id}`}>
                                            <span
                                                className={`name-title-e ${isDarkMode ? 'dark' : 'light'}`}
                                                style={{ margin: '10px 0', cursor: 'pointer' }}
                                            >
                                                {track.name}
                                            </span>
                                        </Link>
                                    </p>
                                </div>
                                <div className="track-duration">{formatDuration(track.duration_ms)}</div>
                            </li>
                        ))}
                    </ul>

                    
                </div>
                <div className="pagination-controls-g">
                <button onClick={prevAlbumPage} disabled={albumPage === 1}>
                <img src={LeftGreen}  alt="Scroll Left" />
                    
                        </button>
                        <button onClick={nextAlbumPage} disabled={startAlbumIndex + albumsPerPage >= tracks.length}>
                        <img src={RightGreen} alt="Scroll Right"   />
          
                        </button>
                    </div>
                <div className="grid">

                    <SpotifyContentListAlbumGrid
                        items={displayedAlbums.map((track, index) => ({
                            id: `${track.id}-${index}`, // Ensure uniqueness by combining id and index
                            name: track.album.name,
                            images: track.album.images,
                            artists: track.artists,
                            uri: track.uri,
                        }))}
                        title={language.albums}
                    />
                  
                </div>
            </div>

            <div className={`search-g ${isDarkMode ? 'dark' : 'light'}`}>
                <SearchBar />
            </div>
            <div className="results-container">
                <TopNavigation />
            </div>
        </div>
    );
};

export default CategoryPage;
