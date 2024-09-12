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

interface SearchResult {
  id: string;
  name: string;
  href: string;
  type: string;
  images: { url: string }[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const response = await axios.get('https://api.spotify.com/v1/browse/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 20,
            locale: 'en_US',
          },
        });

        if (response.status === 200 && response.data.categories.items) {
          setCategories(response.data.categories.items);
        } else {
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

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'album,artist,track,playlist',
          limit: 10,
          market: 'US',
        },
      });

      // Process response to handle various result types
      const albums = response.data.albums?.items || [];
      const artists = response.data.artists?.items || [];
      const tracks = response.data.tracks?.items || [];
      const playlists = response.data.playlists?.items || [];

      // Flatten results into a single array
      const results = [...albums, ...artists, ...tracks, ...playlists].map((item: any) => ({
        id: item.id,
        name: item.name,
        href: item.external_urls.spotify,
        type: item.type,
        images: item.images || [],
      }));

      setSearchResults(results);
      setError('');
    } catch (error: any) {
      console.error('Error during search:', error?.response || error.message || error);
      setError('An error occurred during the search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Spotify Categories</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for albums, artists, tracks, playlists..."
            style={{ padding: '10px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px' }}>Search</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginTop: '20px' }}>
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

        <h2>Search Results</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {searchResults.map((result) => (
            <div key={result.id} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
              {result.images.length > 0 && (
                <a href={result.href} target="_blank" rel="noopener noreferrer">
                  <img
                    src={result.images[0].url}
                    alt={result.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </a>
              )}
              <p>{result.name}</p>
              <p>Type: {result.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
