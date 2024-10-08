import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5059';  // Замініть на URL вашого бекенду

const Callback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Отримуємо всі параметри запиту з URL
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');  // Отримуємо userId з URL
    const accessToken = queryParams.get('access_token');  // Отримуємо accessToken з URL

    // Додаткове логування для діагностики
    console.log('Query Parameters:', location.search);
    console.log('Extracted UserId:', userId);
    console.log('Extracted AccessToken:', accessToken);

    // Якщо немає userId або accessToken, вивести повідомлення і зупинити виконання
    if (!userId) {
      console.error('Error: userId not found in the URL');
    }

    if (!accessToken) {
      console.error('Error: accessToken not found in the URL');
    }

    // Якщо userId і accessToken знайдені
    if (userId && accessToken) {
      localStorage.setItem('spotifyUserId', userId);  // Зберігаємо userId в localStorage
      localStorage.setItem('spotifyAccessToken', accessToken);  // Зберігаємо accessToken в localStorage

      // Перевірка збереження
      console.log('UserId stored in localStorage:', localStorage.getItem('spotifyUserId'));
      console.log('AccessToken stored in localStorage:', localStorage.getItem('spotifyAccessToken'));

      // Перенаправляємо на профіль користувача
      navigate(`/profile?userId=${userId}`);
    } else {
      // Якщо userId або accessToken не знайдено, повертаємося на головну сторінку
      console.error('Missing userId or accessToken, redirecting to home.');
      navigate('/');
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
};

export default Callback;
