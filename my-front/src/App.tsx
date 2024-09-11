// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import Profile from './components/Profile';
import Categories from './components/Categories';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} /> {/* Ensure this route exists */}
      </Routes>
    </Router>
  );
};

export default App;
