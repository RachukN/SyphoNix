// src/components/Player/GlobalPlayer.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface GlobalPlayerContextType {
  player: Spotify.Player | null;
  deviceId: string | null;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  repeat: (mode: 'track' | 'context' | 'off') => void;
  shuffle: (state: boolean) => void;
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType>({
  player: null,
  deviceId: null,
  play: () => {},
  pause: () => {},
  next: () => {},
  previous: () => {},
  repeat: () => {},
  shuffle: () => {},
});

interface GlobalPlayerProviderProps {
  children: ReactNode;
}

export const GlobalPlayerProvider: React.FC<GlobalPlayerProviderProps> = ({ children }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      console.error('No Spotify access token found');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'My Spotify Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID:', device_id);
          setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device went offline with Device ID:', device_id);
          setDeviceId(null);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => {
          console.error('Initialization error:', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
          console.error('Authentication error:', message);
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
          console.error('Account error:', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
          console.error('Playback error:', message);
        });

        spotifyPlayer.addListener('player_state_changed', state => {
          console.log('Player state changed:', state);
        });

        spotifyPlayer.connect().then(success => {
          if (success) {
            console.log('Spotify Player connected successfully');
          } else {
            console.error('Failed to connect Spotify Player');
          }
        });
      };
    };

    document.body.appendChild(script);

    return () => {
      player?.disconnect();
    };
  }, []);

  const play = () => {
    if (!player) {
      console.error('Player is not available to play');
      return;
    }
    player.resume().catch(error => {
      console.error('Error playing track:', error);
      refreshToken();
    });
  };

  const pause = () => {
    if (!player) {
      console.error('Player is not available to pause');
      return;
    }
    player.pause().catch(error => {
      console.error('Error pausing track:', error);
      refreshToken();
    });
  };

  const next = () => {
    if (!player) {
      console.error('Player is not available to skip to next track');
      return;
    }
    player.nextTrack().catch(error => {
      console.error('Error skipping to next track:', error);
      refreshToken();
    });
  };

  const previous = () => {
    if (!player) {
      console.error('Player is not available to skip to previous track');
      return;
    }
    player.previousTrack().catch(error => {
      console.error('Error skipping to previous track:', error);
      refreshToken();
    });
  };

  const repeat = (mode: 'track' | 'context' | 'off') => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      console.error('No Spotify access token found for repeat');
      return;
    }

    axios.put(
      `https://api.spotify.com/v1/me/player/repeat?state=${mode}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(error => {
      console.error('Error setting repeat mode:', error);
      refreshToken();
    });
  };

  const shuffle = (state: boolean) => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
      console.error('No Spotify access token found for shuffle');
      return;
    }

    axios.put(
      `https://api.spotify.com/v1/me/player/shuffle?state=${state}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(error => {
      console.error('Error setting shuffle mode:', error);
      refreshToken();
    });
  };

  const refreshToken = async () => {
    console.log('Attempting to refresh Spotify access token...');
    // Implement the refresh token logic here
  };

  return (
    <GlobalPlayerContext.Provider value={{ player, deviceId, play, pause, next, previous, repeat, shuffle }}>
      {children}
    </GlobalPlayerContext.Provider>
  );
};

export const useGlobalPlayer = () => useContext(GlobalPlayerContext);
