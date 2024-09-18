// src/components/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';
import Sidebar from '../Sidebar/Sidebar';
import bannerImage from './Frame 148 (1).png';
import TopNavigation from '../Main/TopNavigation';
import Footer from '../Footer';
import defaultProfileImage from '../Main/user-128.png'; // Import the default profile image
import Seting from './Frame 129.png';
import TopArtists from '../TopArtists';
import TopTracks from '../TopTracks';
import PublicPlaylists from '../PublicPlaylists';
import FollowedArtists from '../FollowedArtists';
import PlayerControls from '../Player/PlayerControls';
interface UserProfile {
  display_name: string;
  email: string;
  country: string;
  followers: { total: number };
  images: { url: string }[];
  product: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError('An error occurred while fetching the user profile.');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  // Use the user's profile image or a default image if none is available
  const profileImageUrl = user.images.length > 0 ? user.images[0].url : defaultProfileImage;

  return (
    <div className="main-container">
      <div className='sidebar'><Sidebar /></div>
      
      <div className="content">
        
        <div className="banner-container-user">
          <img src={bannerImage} alt="Banner" className="banner-image-user" />
        </div>
        <div className='inf'>
        <img
          src={profileImageUrl}
          alt="Profile"
          className="profile-image"
        />
        <div className='name'>
        <div className='title'>Профіль</div>
        <div className="profile-details"> 
          <h1>{user.display_name}</h1>
        </div>
        </div>
        </div>
        <div className='seting'>
        <img src={Seting} alt="Seting" className="seting-img" />
        
        </div>
        <div className='cont'>
        <h2 className="section-title, m-5">Топ артисти цього місяця</h2>
        <h3 className="section-titleh ">Бачите лише ви</h3>
        
         <div className="h2"><TopArtists/></div>
         </div>
        <div className='cont'>
        <h2 className="section-title, h2">Топ треки цього місяця</h2>
        <h3 className="section-titleh">Бачите лише ви</h3>
        
         <div className="h2"><TopTracks/></div>
         
        </div>
        <div className='cont'>
        <h2 className="section-title, m-5">Публічні плейлісти</h2>
         <div className="h2"><PublicPlaylists/></div>
        </div>
        <div className='cont'>
        <h2 className="section-title, m-5">Підписки</h2>
         <div className="h2"><FollowedArtists/></div>
        </div>
        <Footer/>
        
      </div>
      <div className='filter-user'><TopNavigation /></div>
      <div className='player'><PlayerControls/></div>
    </div>
  );
};

export default UserProfile;
