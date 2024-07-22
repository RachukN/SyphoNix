import React, { useEffect, useState } from 'react';
import TrackItem from './TrackItem';
import { fetchTracks } from '../services/api';

const TrackList: React.FC = () => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const getTracks = async () => {
            const trackData = await fetchTracks();
            setTracks(trackData);
        };
        getTracks();
    }, []);

    return (
        <div>
            {tracks.map((track) => (
                <TrackItem
                    key={track.id}
                    name={track.name}
                    artist={track.artist}
                    album={track.album}
                    duration={track.duration}
                />
            ))}
        </div>
    );
};

export default TrackList;
