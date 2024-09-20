import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import TopNavigation from './Main/TopNavigation';
import bannerImage from './Main/Rectangle 4.png';
import './Mainpage.css'; // Styling for the main page and sidebar
import RockMusic from './RockMusic';
import Artists from './Artists';
import Shows from './Shows';
import NewReleases from './NewReleases';
import Music from './Music';
import SymphoNixAlbums from './SymphoNixAlbums';
import PopularAlbums from './PopularAlbums';
import PopularRadio from './PopularRadio';
import Footer from './Footer';
import Filter from './Filter';
const MainPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all'); // Track the current filter ("all", "music", etc.)

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); // Update the filter state when a new filter is selected
  };

  return (
    <div className="main-container">
      <div className='sidebar'><Sidebar /></div>
      <div className="content">
        <div className="banner-container">
          <img src={bannerImage} alt="Banner" className="banner-image" />
        </div>
        
        {/* Filter Section */}
        
        

        {/* Conditionally Render Sections Based on Filter */}
        <div className='cont'>
          <h2 className="section-title">Рок музика</h2>
          <RockMusic />
        </div>

        <div className='cont'>
          <h2 className="section-title">Відомі артисти</h2>
          <Artists />
        </div>

        {/* Only show this section when filter is "all" */}
        {filter === 'all' && (
          <div className='cont'>
            <h2 className="section-title">Шоу, які варто переглянути</h2>
            <Shows />
          </div>
        )}

        <div className='cont'>
          <NewReleases />
        </div>

        <div className='cont'>
          <h2 className="section-title">Щоденний мікс</h2>
          <Music />
        </div>

        <div className='cont'>
          <h2 className="section-title">Топ-чарти</h2>
          <SymphoNixAlbums />
        </div>

        <div className='cont'>
          <h2 className="section-title">Популярні альбоми</h2>
          <PopularAlbums />
        </div>

        <div className='cont'>
          <h2 className="section-title">Популярні радіо</h2>
          <PopularRadio />
        </div>
        <div className='cont'>
          <h2 className="section-title">Подкасти</h2>
          
        </div>
        <div className='filter'><TopNavigation /></div>
        <div className='filter-f'>
          <Filter onFilterChange={handleFilterChange} /> {/* Pass the handler to Filter */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
