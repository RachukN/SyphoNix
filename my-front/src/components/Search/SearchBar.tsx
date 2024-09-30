import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import SearchIcon from '../../images/Frame 57.png';
import HomeIcon from '../Player/Images/Vector (26).png';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  query?: string; // Робимо властивість query необов'язковою
}

const SearchBar: React.FC<SearchBarProps> = ({ query: initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery); // Оновлюємо значення при отриманні нового запиту
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Викликаємо пошук при натисканні Enter
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
          onKeyPress={handleKeyPress} // Обробка Enter
        />
        <button className="search-button green" onClick={handleSearch}>
          <img src={SearchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
