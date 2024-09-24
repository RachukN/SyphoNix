import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../../styles/SongPage.css';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import bannerImage from '../Home/Images/Frame 148.png';
import SearchBar from '../Search/SearchBar';
import Plus from'../Sidebar/Default.png';
import Play from '../../images/Circle play.png';
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

const PlaylistDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Отримуємо ID плейлиста з URL
    const [playlist, setPlaylist] = useState<any>(null); // Зберігаємо деталі плейлиста
    const [tracks, setTracks] = useState<Track[]>([]); // Зберігаємо треки плейлиста
    const [popularTracks, setPopularTracks] = useState<Track[]>([]); // Зберігаємо популярні треки
    const [showDropdown, setShowDropdown] = useState(false); // Контроль відображення випадаючого списку
    const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]); // Зберігаємо рекомендовані треки
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]); // Зберігаємо вибрані для видалення треки
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    // Отримуємо популярні треки
    useEffect(() => {
        const fetchPopularTracks = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                // Отримуємо нові релізи (альбоми)
                const albumsResponse = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const albums = albumsResponse.data.albums.items;

                // Для кожного альбому отримуємо його треки
                const tracksPromises = albums.map(async (album: any) => {
                    const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return tracksResponse.data.items.map((track: any) => ({
                        ...track,
                        album: {
                            name: album.name,
                            images: album.images,
                        },
                    }));
                });

                // Чекаємо, поки всі треки будуть отримані
                const tracksArrays = await Promise.all(tracksPromises);

                // Об'єднуємо всі треки в один масив
                const allTracks = tracksArrays.flat();

                setPopularTracks(allTracks);
            } catch (error) {
                console.error('Failed to fetch popular tracks', error);
            }
        };

        fetchPopularTracks();
    }, []);

    // Форматування тривалості треку в хвилини та секунди
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Додавання треку до плейлиста
    const handleAddTrack = async (trackUri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const requestData = {
                uris: [trackUri],
            };
            console.log('Request Data for adding track:', requestData);

            const response = await axios.post(
                `https://api.spotify.com/v1/playlists/${id}/tracks`,
                requestData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccessMessage('Трек додано до плейлиста');
            console.log('Track added successfully:', response.data);

            // Оновлюємо список треків після додавання
            const addedTrack = popularTracks.find(track => track.uri === trackUri);
            if (addedTrack) {
                setTracks((prevTracks) => [...prevTracks, addedTrack]);
            }

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response data:', error.response.data);
                setError(`Помилка: ${error.response.data.error.message}`);
            } else {
                console.error('Unexpected error:', error);
                setError('Не вдалося додати трек до плейлиста.');
            }
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Вибір треку для видалення
    const handleTrackSelection = (trackUri: string) => {
        setSelectedTracks((prev) =>
            prev.includes(trackUri) ? prev.filter((uri) => uri !== trackUri) : [...prev, trackUri]
        );
    };

    // Видалення вибраних треків
    const handleRemoveTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            await axios.delete(
                `https://api.spotify.com/v1/playlists/${id}/tracks`, {
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    tracks: selectedTracks.map(uri => ({ uri })), // Передаємо масив URI треків для видалення
                }
            });
            setTracks(tracks.filter(track => !selectedTracks.includes(track.uri))); // Оновлення UI після видалення
            setSelectedTracks([]);
        } catch (error) {
            console.error('Failed to remove tracks from playlist.', error);
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
    const handlePlayAllTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }
    
        try {
            // Collect all track URIs from the playlist
            const trackUris = tracks.map(track => track.uri);
    
            if (trackUris.length === 0) {
                console.error('No tracks to play.');
                return;
            }
    
            // Send a request to play all the tracks
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
    
    // Отримання рекомендацій на основі треків з плейлиста
    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get(`https://api.spotify.com/v1/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        seed_tracks: tracks.map(track => track.id).slice(0, 5).join(','), // Використовуємо перші 5 треків як seed
                    },
                });
                setRecommendedTracks(response.data.tracks.slice(0, 6)); // Відображаємо тільки перші 10 треків
            } catch (error) {
                console.error('Failed to fetch recommendations', error);
            }
        };

        if (tracks.length) fetchRecommendations();
    }, [tracks]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="main-container-s">
            <div className='sidebar'><Sidebar /></div>

            <div className="content-s-p">
                <div className="banner-container-user-s">
                    <img src={bannerImage} alt="Banner" className="banner-image-user" />
                </div>

                {/* Виведення інформації про плейлист */}
                <div className='inf'>
                    {playlist && (
                        <>
                            <img
                                src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : 'default-image.png'}
                                className="profile-image-s"
                                alt="Playlist"
                            />
                            <div className='name'>
                                <div className="profile-details-f">
                                    <h3 className='title-f'>Плейліст</h3>
                                    <h1 className="minmar">{playlist.name}</h1>
                                    <h3 className="minmar">Кількість: {tracks.length} треків</h3>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="add-track-btn"> 
                <img
                        src={Play}
                        alt="Play"
                        className="seting-img"
                        onClick={handlePlayAllTracks}
                    />
                <button  className='addp' onClick={toggleDropdown}>Add Tracks</button>
                {selectedTracks.length > 0 && (
                    <button className='addpp' onClick={handleRemoveTracks}>Remove Selected Tracks</button>
                )}
                </div>
                

                
                {showDropdown && (
                    <div className="dropdown">
                        <ul>    

                            <div className="tracks-list-f-p">

                                <div className='modal-p'> 
                                <ul className="tracks-list-f">
                                    <h2>Recommended Tracks</h2>
                                    <button onClick={toggleDropdown} className="close-dropdown-btn">
                                    ✕
                                    </button>
                                    {recommendedTracks.map((track, index) => (
                                        <li className="track-item" key={`${track.uri}-${index}`}>
                                            <span className="track-index">{index + 1}</span>
                                            <img
                                                src={track.album.images[0]?.url || "default-album.png"}
                                                alt={track.name}
                                                className="track-image"
                                                onClick={() => handlePlayTrack(track.uri)}
                                                style={{ margin: '10px 0', cursor: 'pointer' }}
                                            />
                                            <div className="track-info">
                                                <Link to={`/track/${track.id}`}>
                                                    <span className="name-title">{track.album.name}</span>
                                                </Link>
                                                <p className="track-artists">
                                                    {track.artists.map((artist: any) => (
                                                        <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                            <span className='artist-name'>{artist.name}</span>
                                                        </Link>
                                                    ))}
                                                </p>
                                            </div>
                                            <div className="track-album">{track.popularity || 'N/A'}</div>
                                            <div className="track-duration">{formatDuration(track.duration_ms)}</div>
                                            <button onClick={() => handleAddTrack(track.uri)}>
                                            <img src={Plus} alt="Library" className="plus" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                        </ul>
                    </div>
                )}

                {/* Виведення повідомлення про успішне додавання треку */}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* Виведення треків у плейлисті */}
                <div className="top-tracks-f">
                    {tracks.length === 0 ? (
                        <p>This playlist is empty</p>
                    ) : (
                        <ul className="tracks-list-f">
                            {tracks.map((track, index) => (
                                <li className="track-item" key={`${track.uri}-${index}`}>
                                    <span className="track-index">{index + 1}</span>
                                    <img
                                        src={track.album.images[0]?.url || "default-album.png"}
                                        alt={track.name}
                                        className="track-image"
                                        onClick={() => handlePlayTrack(track.uri)}
                                        style={{ margin: '10px 0', cursor: 'pointer' }}
                                    />
                                    <div className="track-info">
                                        <Link to={`/track/${track.id}`}>
                                            <span className="name-title">{track.album.name}</span>
                                        </Link>
                                        <p className="track-artists">
                                            {track.artists.map((artist: any) => (
                                                <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                    <span className='artist-name'>{artist.name}</span>
                                                </Link>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="track-album">{track.popularity || 'N/A'}</div>
                                    <div className="track-duration">{formatDuration(track.duration_ms)}</div>

                                    <input
                                        type="checkbox"
                                        checked={selectedTracks.includes(track.uri)}
                                        onChange={() => handleTrackSelection(track.uri)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Кнопка для видалення вибраних треків */}
                

                {/* Виведення 10 рекомендованих треків */}


                <Footer />
            </div>
            <div className='add'><SearchBar /></div>
            <div className='nav'><TopNavigation /></div>
        </div>
    );
};

export default PlaylistDetailsPage;
