// src/components/SpotifyPlayButton.tsx
import React from 'react';

interface SpotifyPlayButtonProps {
  uri: string;
}

const SpotifyPlayButton: React.FC<SpotifyPlayButtonProps> = ({ uri }) => {
  // Generate the embed URL from the Spotify URI
  const embedUrl = `https://open.spotify.com/embed?uri=${uri}&theme=0`;

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <iframe
        src={embedUrl}
        width="300"
        height="80"
        frameBorder="0"
        allow="encrypted-media"
        allowTransparency={true}
        title="Spotify Play Button"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayButton;
