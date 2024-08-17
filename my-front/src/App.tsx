
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreatePlaylist from './components/Library/CreatePlaylist';
import EditPlaylist from './components/Library/EditPlaylist';
import PlaylistList from './components/Library/PlaylistList';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
     <Route path="/library/create" element={<CreatePlaylist />} />
             <Route path="/library/edit/:id" element={<EditPlaylist />} />
             <Route path="/library" element={<PlaylistList />} />
      </Routes>
    </Router>
  );
};

export default App;
