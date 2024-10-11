import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/Playlists.css';
import BGimage from '../../images/Vector 1.png';
import TopNavigation from '../Navigation/TopNavigation';
import SearchBar from '../Search/SearchBar';
import Default from '../../images/Frame 560 (1).png'; // Дефолтне фото
import { useTheme } from '../../services/ThemeContext';

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    description: string;
    external_urls: { spotify: string };
}

const PlaylistsPage: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [tempImageUrl, setTempImageUrl] = useState<string>(Default); // Дефолтне фото для форми
    const [showModal, setShowModal] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.items) {
                    setPlaylists(response.data.items);
                } else {
                    setError('Unexpected response format from Spotify API.');
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError('Error fetching playlists.');
            }
        };

        fetchPlaylists();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            setTempImageUrl(URL.createObjectURL(file)); // Встановлюємо тимчасове зображення для відображення у формі
        }
    };

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const convertImageToJPEG = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob!);
                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        const base64Data = base64data.split(',')[1]; // Отримуємо тільки базові дані
                        resolve(base64Data);
                    };
                }, 'image/jpeg');
            };

            img.onerror = (error) => reject(error);
        });
    };

    const handleCreatePlaylist = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const userIdResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userId = userIdResponse.data.id;

            const response = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: newPlaylistName,
                    description: newPlaylistDescription,
                    public: !isPrivate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newPlaylistId = response.data.id;
            let newPlaylist = response.data;

            if (uploadedImage) {
                const base64Image = await convertImageToJPEG(uploadedImage); // Конвертація в JPEG
                await axios.put(
                    `https://api.spotify.com/v1/playlists/${newPlaylistId}/images`,
                    base64Image,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'image/jpeg',
                        },
                    }
                );

                // Встановлюємо тимчасове зображення для відображення на UI
                newPlaylist = { 
                    ...newPlaylist, 
                    images: [{ url: tempImageUrl }] // Використовуємо локальне зображення
                };
            }

            setPlaylists((prevPlaylists) => [newPlaylist, ...prevPlaylists]); // Оновлюємо плейлисти
            setSuccessMessage('Playlist created successfully!');
            setNewPlaylistName('');
            setNewPlaylistDescription('');
            setIsPrivate(false);
            setUploadedImage(null);
            setTempImageUrl(Default); // Повертаємо дефолтне зображення після створення
            setShowModal(false); // Закриваємо форму після створення плейлиста
        } catch (error) {
            console.error('Error creating playlist:', error);
            setError('Failed to create playlist. Please try again.');
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className={`search-p ${isDarkMode ? 'dark' : 'light'}`}><SearchBar /></div>
            <div className='search-i'><TopNavigation  /></div>

            <div  className={`search-results-container-p ${isDarkMode ? 'dark' : 'light'}`}>
                <div className={`bg-img-p ${isDarkMode ? 'dark' : 'light'}`}><img src={BGimage} alt="background" /></div>
                <div className={`results-container-p ${isDarkMode ? 'dark' : 'light'}`}>
                    <button className='button-m' onClick={openModal}>Create Playlist</button>

                    <h2 className={`margine ${isDarkMode ? 'dark' : 'light'}`}>Your Playlists</h2>
                    <div className="music-c-c-p">
                        {playlists.map((playlist) => (
                            <div key={playlist.id} className="marg-c-p-c">
                                <img
                                    src={playlist.images?.[0]?.url || Default}
                                    alt={playlist.name}
                                    className="marg-c-p"
                                />
                                <Link to={`/playlist/${playlist.id}`}>
                                    <p className={`name-title-e ${isDarkMode ? 'dark' : 'light'}`}>{playlist.name}</p>
                                </Link>
                                <p style={{ fontSize: 'small', color: '#666' }}>
                                    {playlist.description.length > 16 ? `${playlist.description.substring(0, 12)}...` : playlist.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-modal-btn" onClick={closeModal}>✕</button>
                        <h2 className='stvoryty'>Створити плейлист</h2>

                        {/* Відображаємо поточне фото */}
                        <label htmlFor="image-upload" className="custom-file-upload">
                            <img className='img-play' src={tempImageUrl} alt="Selected or Default" style={{  cursor: 'pointer' }} />
                        </label>
                        <input
                            id="image-upload"
                            className='button-f-f'
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }} // Приховуємо елемент input
                            onChange={handleImageUpload}
                        />
<h2 className='name-playlist'>Назва</h2>

                        <input
                            className='input-f'
                            type="text"
                            placeholder="Назва плейлиста"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <h2 className='name-playlist-w'>Опис</h2>

                        <textarea
                            placeholder="Додати опис(не обов’язково)"
                            value={newPlaylistDescription}
                            onChange={(e) => setNewPlaylistDescription(e.target.value)}
                        />
                       

                        <button className='button-f' onClick={handleCreatePlaylist}>Create Playlist</button>
                        
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistsPage;
