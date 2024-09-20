// src/components/Layout.tsx
import React from 'react';
import PlayerControls from './PlayerControls';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
      <div >
        
        <Outlet />
        
        <PlayerControls />
      </div>
  );
};

export default Layout;
