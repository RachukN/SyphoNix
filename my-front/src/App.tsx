// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import Profile from './components/Profile';
import Categories from './components/Categories';
import { GlobalPlayerProvider } from './components/Player/GlobalPlayer';
import MainPage from './components/Mainpage';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import UserProfile from './components/Home/UserProfile';
import ImageGallery from './components/ImageGallery';
import InfoMusic from './components/Player/InfoMusic';
import Layout from './components/Player/Layout';
import ArtistPage from './components/Home/ArtistPage';
import SongPage from './components/Home/SongPage';
import AlbumPage from './components/Home/SongPage';
const App: React.FC = () => {
  return (

    <GlobalPlayerProvider>
      
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} /> 
        <Route path="/searchh" element={<Search />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/gal" element={<ImageGallery />} />
        <Route path="/infomusic" element={<InfoMusic />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/track/:songId" element={<SongPage />} />
        <Route path="/album/:albumId" element={<AlbumPage />} />

        </Route>
      </Routes>
    </Router>
    
    </GlobalPlayerProvider>
    
  );
};

export default App;
