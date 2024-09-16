import React, { useEffect, useState } from 'react';

interface WebPlaybackProps {
  token: string;
}

declare global {
    interface Window {
      onSpotifyWebPlaybackSDKReady: () => void;
    }
  }
  

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPaused, setPaused] = useState(false);
  const [currentTrack, setTrack] = useState<any>(null);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      // Add event listeners
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
      });

      player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Initialization Error:', message);
      });

      player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Authentication Error:', message);
      });

      player.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account Error:', message);
      });

      player.connect();
    };

    // Load the SDK script
    if (!document.getElementById('spotify-player')) {
      const script = document.createElement('script');
      script.id = 'spotify-player';
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      document.body.appendChild(script);
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  if (!currentTrack) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="main-wrapper">
        <img src={currentTrack.album.images[0].url} className="now-playing__cover" alt="" />
        <div className="now-playing__side">
          <div className="now-playing__name">{currentTrack.name}</div>
          <div className="now-playing__artist">{currentTrack.artists[0].name}</div>
        </div>
        <div className="controls">
          <button onClick={() => player.previousTrack()}>&lt;&lt;</button>
          <button onClick={() => player.togglePlay()}>{isPaused ? 'PLAY' : 'PAUSE'}</button>
          <button onClick={() => player.nextTrack()}>&gt;&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default WebPlayback;
