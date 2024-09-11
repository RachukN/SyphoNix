import React from 'react';

// Define the backend URL directly in your code
const BACKEND_URL = 'http://localhost:5059'; // Update to your backend's URL

const Login: React.FC = () => {
  const handleLogin = () => {
    // Use the backend URL directly
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Spotify Authorization with PKCE</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
