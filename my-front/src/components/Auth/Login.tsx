// src/components/Login.tsx
import React from 'react';
import './Login.css';
import Baner from './Vector 1 (1).png';
import Logo from './Group (3).png';
import Logo1 from './Group (4).png';
// Define the backend URL directly in your code
const BACKEND_URL = 'http://localhost:5059'; // Update this URL to your backend's actual URL

const Login: React.FC = () => {
  // Function to handle the login process
  const handleLogin = () => {
    // Redirect to the backend's login endpoint which initiates the Spotify authorization
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  return (
    <div className='conteiner'>
      
      <img className='baner' src={Baner} alt="Baner" />
      <img className='logo' src={Logo} alt="Logo" />
      <img className='logo1' src={Logo1} alt="Logo1" />
    <div className='auth1'>
      <div className='p'>Авторизуватися за допомогою Spotify </div>
      <button className='auth-b' onClick={handleLogin} >
        Авторизуватися
      </button>
    </div>
    </div>
  );
};

export default Login;
