// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css'; // Import the CSS file for styles
import Search from '../images/Frame 57.png';
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="top-navigation">
      <div className="nav-left">
      <input
        type="text"
        className="search-input"
        
        placeholder="Пошук"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      >
        
        </input>
      <button className="search-button" onClick={handleSearch}>
        <img src={Search} alt="Search" className="search-icon" />
          
      </button>
    </div>
    </div>
  );
};

export default SearchBar;
