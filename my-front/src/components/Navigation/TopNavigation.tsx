import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNavigation.css';
import Bell from '../Main/Images/Bell.png';
import User from '../Main/Images/user-128.png'; // Your user image

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);

  const handleUserClick = () => {
    setDropdownActive(!dropdownActive); // Toggle the dropdown on click
  };

  const handleAccountClick = () => {
    navigate('/account'); // Redirect to the account page
  };

  const handleProfileClick = () => {
    navigate('/userprofile'); // Redirect to the user profile page
  };

  const handleLogoutClick = () => {
    // Add your logout logic here, and possibly redirect
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <div className="top-navigation">
      <div className="nav-left">
        {/* Add other left-side navigation items here */}
      </div>
      <div className="nav-right">
        <img src={Bell} alt="Bell" className="icon" />
        <div
          className="profile-container"
          onMouseEnter={() => setDropdownActive(true)}
          onMouseLeave={() => setDropdownActive(false)}
        >
          <img
            src={User}
            alt="User"
            className="icon profile-icon"
            style={{ cursor: 'pointer' }}
          />
          <div className={`user-dropdown ${dropdownActive ? 'active' : ''}`}>
            <a onClick={handleAccountClick}>Акаунт</a>
            <a onClick={handleProfileClick}>Профіль</a>
            <hr />
            <a onClick={handleLogoutClick}>Вийти</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
