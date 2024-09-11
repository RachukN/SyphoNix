// src/components/Categories.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

interface Category {
  id: string;
  name: string;
  href: string;
  icons: { url: string }[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      console.error('No access token found, redirecting to home');
      navigate('/');
      return;
    }

    const fetchCategories = async () => {
      try {
        console.log('Fetching categories with token:', token); // Debug logging

        const response = await axios.get('https://api.spotify.com/v1/browse/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 20,
            locale: 'en_US',
          },
        });

        console.log('Response from Spotify API:', response); // Log the entire response

        if (response.status === 200 && response.data.categories.items) {
          setCategories(response.data.categories.items);
        } else {
          console.error('Unexpected response format:', response);
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error?.response || error.message || error);
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Spotify Categories</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {categories.map((category) => (
            <div key={category.id} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
              {category.icons.length > 0 && (
                <a href={category.href} target="_blank" rel="noopener noreferrer">
                  <img
                    src={category.icons[0].url}
                    alt={category.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </a>
              )}
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
