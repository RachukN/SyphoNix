// src/components/MainPage.tsx
import React from 'react';
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
  return (
    <div className="main-container">
      
      <div className='sidebar'><Sidebar /></div>
      <div className="content">
        
        

        <div className="banner-container">
                <img src={bannerImage} alt="Banner" className="banner-image" />
        </div>
        
        <div className='cont'>
        <h2 className="section-title, h2">Рок музика</h2>
         <div className="h2"><RockMusic/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Відомі артисти</h2>
         <div className="h2"><Artists/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Шоу, які варто переглянути</h2>
         <div className="h2"><Shows/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Новинки для вас</h2>
         <div className="h2"><NewReleases/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Щоденний мікс</h2>
         <div className="h2"><Music/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Топ-чарти</h2>
         <div className="h2"><SymphoNixAlbums/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Популярні альбоми</h2>
         <div className="h2"><PopularAlbums/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, h2">Популярні радіо</h2>
         <div className="h2"><PopularRadio/></div>
        </div>
        <div className='cont' >
      <Footer/>
      
      </div>
      </div>
      
      <div className='filter'><TopNavigation /></div>
      <div className='filter-f'> <Filter/></div>
    </div>
  );
};

export default MainPage;
