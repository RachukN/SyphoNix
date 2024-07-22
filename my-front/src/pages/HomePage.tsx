import React from 'react';
import TrackList from '../components/TrackList';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Spotify Tracks</h1>
            <TrackList />
        </div>
    );
};

export default HomePage;
