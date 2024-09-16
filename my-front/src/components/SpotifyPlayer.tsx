import React, { useEffect, useState } from 'react';

const SpotifyPlayer: React.FC = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const accessToken = localStorage.getItem('spotifyAccessToken') || '';

  useEffect(() => {
    // Define the onSpotifyWebPlaybackSDKReady function
    const onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });

      spotifyPlayer.connect();
    };

    // Load the Spotify SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    script.onload = () => {
      // Assign onSpotifyWebPlaybackSDKReady globally
      window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (player) {
        player.disconnect();
      }
      // Assign an empty function instead of undefined
      if (window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = () => {};
      }
    };
  }, [accessToken, player]);

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay().then(() => {
        console.log('Playback toggled!');
      });
    }
  };

  if (!isReady) {
    return <div>Loading Spotify Player...</div>;
  }

  return (
    <div>
      <h1>Spotify Player</h1>
      <button onClick={handlePlayPause}>Play/Pause</button>
    </div>
  );
};

export default SpotifyPlayer;
