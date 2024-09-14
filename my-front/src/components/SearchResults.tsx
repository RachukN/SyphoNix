// src/components/SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css'; // Import the CSS file for styles

interface SearchResult {
  id: string;
  name: string;
  type: string;
  images: { url: string }[];
}

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      axios
        .get(`https://api.spotify.com/v1/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: query, type: 'track,artist,album', limit: 10 },
        })
        .then((response) => {
          const { tracks, artists, albums } = response.data;
          // Filter results to only include items with images
          const combinedResults = [
            ...tracks.items,
            ...artists.items,
            ...albums.items,
          ].filter((item) => item.images && item.images.length > 0);
          setResults(combinedResults);
        })
        .catch((err) => {
          setError('Failed to fetch search results.');
          console.error(err);
        });
    }
  }, [location.search]);

  return (
    <div className="search-results-container">
      <h1>Search Results</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <img
              src={result.images[0]?.url}
              alt={result.name}
              className="result-image"
            />
            <p className="result-name">{result.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
