// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Callback from './components/Auth/Callback';
import Profile from './components/UserProfil/Profile';
import Categories from './components/Search/Categories';
import { GlobalPlayerProvider } from './components/Player/GlobalPlayer';
import MainPage from './components/Main/Mainpage';
import Search from './components/Search/Search';
import SearchResults from './components/Search/SearchResults';
import UserProfile from './components/UserProfil/UserProfile';
import InfoMusic from './components/InfoMusic/InfoMusic';
import Layout from './components/Player/Layout';
import ArtistPage from './components/ArtistsPage/ArtistPage';
import SongPage from './components/SongPage/SongPage';
import AlbumPage from './components/SongPage/SongPage';
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
