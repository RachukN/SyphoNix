// src/components/TopNavigation.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNavigation.css';
import Bell from './Bell.png';
import User from './user-128.png';

const TopNavigation: React.FC = () => {
  const navigate = useNavigate(); // Hook from react-router-dom to handle navigation

  const handleUserClick = () => {
    navigate('/userprofile'); // Redirect to the /profile page
  };

  return (
    <div className="top-navigation">
      <div className="nav-left">
        {/* Add other left-side navigation items here */}
      </div>
      <div className="nav-right">
        <img src={Bell} alt="Bell" className="icon" />
        <img
          src={User}
          alt="User"
          className="icon profile-icon"
          onClick={handleUserClick} // Add the onClick event to handle the redirect
          style={{ cursor: 'pointer' }} // Change the cursor to pointer to indicate clickability
        />
      </div>
    </div>
  );
};

export default TopNavigation;
