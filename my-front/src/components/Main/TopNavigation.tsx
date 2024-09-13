// TopNavigation.tsx
import React from 'react';
import './TopNavigation.css';
import Bell from './Bell.png';
import User from './user-128.png';

const TopNavigation: React.FC = () => {
  return (
    <div className="top-navigation">
      <div className="nav-left">
        <button className="nav-button">Усе</button>
        <button className="nav-button">Музика</button>
        <button className="nav-button">Подкасти</button>
      </div>
      <div className="nav-right">
        <img src={Bell} alt="Bell" className="icon" />
        <img src={User} alt="User" className="icon profile-icon" />
        
        
      </div>
    </div>
  );
};

export default TopNavigation;
