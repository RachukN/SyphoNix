// src/components/Login.tsx
import React from 'react';

// Define the backend URL directly in your code
const BACKEND_URL = 'http://localhost:5059'; // Update this URL to your backend's actual URL

const Login: React.FC = () => {
  // Function to handle the login process
  const handleLogin = () => {
    // Redirect to the backend's login endpoint which initiates the Spotify authorization
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Spotify Authorization </h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
