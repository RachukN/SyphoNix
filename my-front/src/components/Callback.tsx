import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5059';  // Replace with your backend URL

const Callback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code && state) {
      axios
        .get(`${BACKEND_URL}/auth/callback?code=${code}&state=${state}`)
        .then((response) => {
          const token = response.data.access_token;

          // Store the access token
          localStorage.setItem('spotifyAccessToken', token);
          console.log('Token stored:', localStorage.getItem('spotifyAccessToken')); // Log to confirm storage

          // Redirect to the home page
          navigate('/profile');
        })
        .catch((error) => {
          console.error('Error during the authorization process', error);
          navigate('/');
        });
    } else {
      console.error('No code or state found in the URL');
      navigate('/');
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
};

export default Callback;
