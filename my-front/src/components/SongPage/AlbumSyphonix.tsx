import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../../styles/SongPage.css';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import bannerImage from '../Home/Images/Frame 148.png'; // Кастомне зображення для банера
import SearchBar from '../Search/SearchBar';
import Play from '../../images/Circle play.png';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Імпорт хука для мови
import { playlistIds } from '../Templates/SymphoNixAlbums';
// Import your custom images
import Album2 from '../../images/Rectangle 2 (1).png';
import Album3 from '../../images/Rectangle 2 (2).png';
import Album4 from '../../images/Rectangle 2 (3).png';
import Album5 from '../../images/Rectangle 2 (4).png';
import Album6 from '../../images/Rectangle 2 (5).png';
import Album7 from '../../images/Rectangle 2 (6).png';

interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
    duration_ms: number;
    popularity: number;
    uri: string;
}

const AlbumSyphonix: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Отримуємо ID плейлиста з URL
    const [playlist, setPlaylist] = useState<any>(null); // Зберігаємо деталі плейлиста
    const [tracks, setTracks] = useState<Track[]>([]); // Зберігаємо треки плейлиста
    const { isDarkMode } = useTheme();
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();

    // Кастомні зображення для плейлистів
    const albumImages = [Album2, Album3, Album4, Album5, Album6, Album7];

    // Функція для вибору кастомного фото на основі ID плейлиста
    const getCustomPhoto = (playlistId: string | undefined) => {
        if (!playlistId) return albumImages[0]; // Якщо playlistId немає, повертаємо перше зображення
        const index = playlistIds.indexOf(playlistId);
        return albumImages[index] || albumImages[0]; // Використовуємо зображення з масиву або перше як дефолтне
    };

    // Отримуємо інформацію про плейлист і треки
    useEffect(() => {
        const fetchPlaylist = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPlaylist(response.data);
                setTracks(response.data.tracks.items.map((item: any) => item.track));
            } catch (err) {
                console.error('Failed to fetch playlist.', err);
                setError('Failed to fetch playlist.');
            }
        };

        fetchPlaylist();
    }, [id]);

    // Форматування тривалості треку в хвилини та секунди
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Відтворення треків
    const handlePlayAllTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const trackUris = tracks.map(track => track.uri);

            if (trackUris.length === 0) {
                console.error('No tracks to play.');
                return;
            }

            // Відправка запиту на відтворення всіх треків
            await axios.put(
                `https://api.spotify.com/v1/me/player/play`,
                { uris: trackUris },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('All tracks are now playing.');
        } catch (error) {
            console.error('Failed to play all tracks.', error);
            setError('Failed to play all tracks.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="main-container-s">
            <div className='sidebar'><Sidebar /></div>

            <div className={`content-s-p ${isDarkMode ? 'dark' : 'light'}`}>
                {/* Виведення банера */}
                <div className="banner-container-user-s">
                    <img src={bannerImage} alt="Custom Banner" className="banner-image-user" />
                </div>

                {/* Виведення інформації про плейлист */}
                <div className='inf'>
                    {playlist && (
                        <>
                            <img
                                src={getCustomPhoto(id)} // Використання кастомного фото замість зображення з API
                                className="profile-image-s"
                                alt="Custom Playlist"
                            />
                            <div className='name'>
                                <div className={`profile-details-f ${isDarkMode ? 'dark' : 'light'}`}>
                                    <h3 className='title-f'>{language.playlist}</h3>
                                    <h1 className="minmar">{playlist.name}</h1>
                                    <h3 className="minmar">{language.quantity}: {tracks.length} {language.tracks}</h3>
                                    <h3 className="minmar">Автор: SyphoNix</h3> {/* Кастомний автор */}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Кнопка для відтворення всіх треків */}
                <div className="add-track-btn">
                    <img
                        src={Play}
                        alt="Play"
                        className="seting-img"
                        onClick={handlePlayAllTracks}
                    />
                </div>

                {/* Список треків */}
                <div className="top-tracks-f">
                    <ul className="tracks-list-f">
                        {tracks.map((track, index) => (
                            <li className={` track-item ${isDarkMode ? 'dark' : 'light'}`} key={`${track.id}-${index}`}>
                                <span className="track-index">{index + 1}</span>
                                <img
                                    src={track.album.images[0]?.url || getCustomPhoto(id)} // Використання кастомного фото для треків
                                    alt={track.name}
                                    className="track-image"
                                    style={{ margin: '10px 0', cursor: 'pointer' }}
                                />
                                <div className="track-info">
                                    <Link to={`/track/${track.id}`}>
                                        <span className={`name-title-e ${isDarkMode ? 'dark' : 'light'}`}>{track.album.name}</span>
                                    </Link>
                                    <p className="track-artists">
                                        {track.artists.map((artist: any) => (
                                            <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>{artist.name}</span>
                                            </Link>
                                        ))}
                                    </p>
                                </div>
                                <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}>{track.popularity || 'N/A'}</div>
                                <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{formatDuration(track.duration_ms)}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <Footer />
            </div>

            <div className='add'><SearchBar /></div>
            <div className='nav'><TopNavigation /></div>
        </div>
    );
};

export default AlbumSyphonix;
