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
import PlayerControls from './components/PlayerControls';


const App: React.FC = () => {
  return (
    <GlobalPlayerProvider>
     <div className='player-item'><PlayerControls/></div> 
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} /> 
        <Route path="/searchh" element={<Search />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/userprofile" element={<UserProfile />} />
        
        
      </Routes>
    </Router>
    
    </GlobalPlayerProvider>
    
  );
};

export default App;
