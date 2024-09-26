import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../Navigation/NavBar';

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  external_urls: { spotify: string };
  followers: { total: number };
  href: string;
  id: string;
  images: { url: string }[];
  uri: string;
  product: string; // Для перевірки на Premium
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPremium, setIsPremium] = useState(false); // Статус Premium акаунта
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Витягуємо токен з URL або localStorage
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('access_token');

    if (token) {
      console.log('Access token found in URL:', token);
      localStorage.setItem('spotifyAccessToken', token); // Зберігаємо токен у localStorage
      fetchProfile(token);
    } else {
      const storedToken = localStorage.getItem('spotifyAccessToken');
      if (storedToken) {
        console.log('Access token found in localStorage:', storedToken);
        fetchProfile(storedToken);
      } else {
        console.error('No access token found, redirecting to login');
        navigate('/'); // Редірект на логін, якщо немає токена
      }
    }
  }, [location, navigate]);

  const fetchProfile = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userProfile = response.data;
      setProfile(userProfile);
      setIsPremium(userProfile.product === 'premium'); // Перевірка на Premium акаунт
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.error('Access denied. This token does not have permission.', error);
        setError('Access denied. This functionality is restricted to Premium users or invalid token.');
      } else {
        console.error('Error fetching profile data', error);
        setError('Failed to fetch profile data. Please try again.');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>{error}</h2>
        {/* Додаємо кнопку для переходу на сторінку Premium */}
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#1DB954',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => {
            window.location.href = 'https://www.spotify.com/premium/';
          }}
        >
          Придбати Spotify Premium
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Profile of {profile.display_name}</h1>
        {profile.images.length > 0 && (
          <img
            src={profile.images[0].url}
            alt="Profile"
            style={{ borderRadius: '50%', width: '200px', height: '200px' }}
          />
        )}
        <ul>
          <li>User ID: {profile.id}</li>
          <li>Email: {profile.email}</li>
          <li>
            Spotify URI: <a href={profile.uri}>{profile.uri}</a>
          </li>
          <li>
            Profile Link: <a href={profile.external_urls.spotify}>{profile.external_urls.spotify}</a>
          </li>
          <li>Country: {profile.country}</li>
          <li>Followers: {profile.followers.total}</li>
          <li>
            Account Type: {isPremium ? 'Premium' : 'Free'} {/* Відображення типу акаунта */}
          </li>
        </ul>

        {/* Виведення повідомлення про Premium статус */}
        {isPremium ? (
          <div>Ви користувач Premium. Відтворення музики дозволено.</div>
        ) : (
          <div>
            Ця функція доступна тільки для користувачів Premium.
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#1DB954',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px',
              }}
              onClick={() => {
                window.location.href = 'https://www.spotify.com/premium/';
              }}
            >
              Придбати Spotify Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
