// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

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
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('access_token');

    if (token) {
      console.log('Access token found in URL:', token);
      localStorage.setItem('spotifyAccessToken', token); // Store token in localStorage
      fetchProfile(token);
    } else {
      const storedToken = localStorage.getItem('spotifyAccessToken');
      if (storedToken) {
        console.log('Access token found in localStorage:', storedToken);
        fetchProfile(storedToken);
      } else {
        console.error('No access token found, redirecting to login');
        navigate('/');
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
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data', error);
      setError('Failed to fetch profile data. Please try again.');
      navigate('/');
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Ensure that profile is not null before rendering the details
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
        </ul>
      </div>
    </div>
  );
};

export default Profile;
