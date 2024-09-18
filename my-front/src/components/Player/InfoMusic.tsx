import React, { useState } from 'react';

const InfoMusic = () => {
  const [currentTrack] = useState({
    name: 'Track Name',
    artist: 'Artist Name',
    albumImage: 'https://example.com/album.jpg', // Посилання на зображення обкладинки альбому
  });

  return (
    <div className="info-music">
      <div className="track-info">
        <img src={currentTrack.albumImage} alt="Album cover" className="album-cover" />
        <div className="track-details">
          <h4>{currentTrack.name}</h4>
          <p>{currentTrack.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoMusic;
