// src/components/Player/GlobalPlayer.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for the context, including additional controls
interface GlobalPlayerContextType {
  player: Spotify.Player | null;
  deviceId: string | null;
  isPaused: boolean;
  playTrack: (trackUri: string) => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

// Create the context with initial values
const GlobalPlayerContext = createContext<GlobalPlayerContextType>({
  player: null,
  deviceId: null,
  isPaused: true,
  playTrack: () => {},
  pause: () => {},
  resume: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
});

// Define the props interface for GlobalPlayerProvider
interface GlobalPlayerProviderProps {
  children: ReactNode;
}

export const GlobalPlayerProvider: React.FC<GlobalPlayerProviderProps> = ({ children }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<number>(0); // 0 = off, 1 = track, 2 = context

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;
        setIsPaused(state.paused);
        setIsShuffling(state.shuffle);
        setRepeatMode(state.repeat_mode);
      });

      spotifyPlayer.connect();
    };
  }, []);

  const playTrack = (trackUri: string) => {
    if (player && deviceId) {
      player.activateElement().then(() => {
        player._options.getOAuthToken(access_token => {
          fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
        });
      });
    }
  };

  const pause = () => {
    player?.pause().then(() => setIsPaused(true));
  };

  const resume = () => {
    player?.resume().then(() => setIsPaused(false));
  };

  const nextTrack = () => {
    player?.nextTrack().then(() => console.log('Skipped to next track'));
  };

  const previousTrack = () => {
    player?.previousTrack().then(() => console.log('Went to previous track'));
  };

  const toggleShuffle = () => {
    player?._options.getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffling}&device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      }).then(() => setIsShuffling(!isShuffling));
    });
  };

  const toggleRepeat = () => {
    const newRepeatMode = (repeatMode + 1) % 3; // Cycles through 0, 1, 2
    player?._options.getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/repeat?state=${['off', 'track', 'context'][newRepeatMode]}&device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      }).then(() => setRepeatMode(newRepeatMode));
    });
  };

  return (
    <GlobalPlayerContext.Provider value={{
      player,
      deviceId,
      isPaused,
      playTrack,
      pause,
      resume,
      nextTrack,
      previousTrack,
      toggleShuffle,
      toggleRepeat,
    }}>
      {children}
    </GlobalPlayerContext.Provider>
  );
};

export const useGlobalPlayer = () => useContext(GlobalPlayerContext);
