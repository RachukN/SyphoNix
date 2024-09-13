// TopNavigation.tsx
import React from 'react';
import './Filter.css';
const Filter: React.FC = () => {
  return (
    <div className="top-navigation">
      <div className="nav-left">
        <button className="nav-button">Усе</button>
        <button className="nav-button">Музика</button>
        <button className="nav-button">Подкасти</button>
      </div>
      
    </div>
  );
};

export default Filter;
