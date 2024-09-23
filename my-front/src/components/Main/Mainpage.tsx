import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import bannerImage from './Images/Rectangle 4.png';
import './Mainpage.css'; // Styling for the main page and sidebar
import RockMusic from '../Templates/RockMusic';
import Artists from '../ArtistsPage/Artists';
import Shows from '../Templates/Shows';
import NewReleases from '../Templates/NewReleases';
import SymphoNixAlbums from '../Templates/SymphoNixAlbums';
import PopularAlbums from '../Templates/PopularAlbums';
import PopularRadio from '../Templates/PopularRadio';
import Footer from '../Footer/Footer';
import Filter from '../Navigation/Filter';
import NewTracks from '../Templates/NewTrack';
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
          <NewTracks />
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
