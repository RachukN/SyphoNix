import React, { useState, useEffect } from 'react';
import './Login.css';

const BACKEND_URL = 'https://localhost:5051'; // Замінили на правильний бекенд-URL

const Login: React.FC = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({
    baner: '',
    logo: '',
    logo1: '',
  });

  // Function to fetch images from the backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/Images`)  // Використовуємо правильний шлях до API для отримання всіх зображень
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched images:', data); // Додаємо логування, щоб перевірити, що API повертає

        const imageMap: { [key: string]: string } = {};

        data.forEach((img: any) => {
          if (img.imageName.includes('Vector 1')) {
            imageMap.baner = `${BACKEND_URL}/api/Images/${img.id}`;
          }
          if (img.imageName.includes('Group (3)')) {
            imageMap.logo = `${BACKEND_URL}/api/Images/${img.id}`;
          }
          if (img.imageName.includes('Group (4)')) {
            imageMap.logo1 = `${BACKEND_URL}/api/Images/${img.id}`;
          }
        });

        console.log('Image map:', imageMap); // Логування для перевірки, чи заповнено imageMap
        setImages(imageMap);
      })
      .catch(err => console.error('Failed to fetch images', err));
  }, []);

  // Function to handle the login process
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  return (
    <div className='conteiner'>
      {/* Динамічне завантаження зображень із сервера */}
      {images.baner && <img className='baner' src={images.baner} alt="Baner" />}
      {images.logo && <img className='logo2' src={images.logo} alt="Logo" />}
      {images.logo1 && <img className='logo1' src={images.logo1} alt="Logo1" />}

      <div className='auth1'>
        <div className='p'>Авторизуватися за допомогою Spotify</div>
        <button className='auth-b' onClick={handleLogin}>
          Авторизуватися
        </button>
      </div>
    </div>
  );
};

export default Login;
