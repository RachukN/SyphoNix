// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import Profile from './components/Profile';
import Categories from './components/Categories';
import Music from './components/Music';
import { GlobalPlayerProvider } from './components/Player/GlobalPlayer';
import MainPage from './components/Mainpage';
import RockMusic from './components/RockMusic';

const App: React.FC = () => {
  return (
    <GlobalPlayerProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} /> {/* Ensure this route exists */}
        <Route path="/music" element={<Music />} /> 
         
        <Route path="/rockmusic" element={<RockMusic />} /> 
      
        
      </Routes>
    </Router>
    </GlobalPlayerProvider>
  );
};

export default App;
