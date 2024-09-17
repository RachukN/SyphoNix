// src/components/PlayerControls.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalPlayer } from './Player/GlobalPlayer';
import axios from 'axios';

// Helper function for debouncing API calls
const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const PlayerControls: React.FC = () => {
  const { player, deviceId, play, pause } = useGlobalPlayer();
  const token = localStorage.getItem('spotifyAccessToken');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const checkPlayerConnection = async () => {
      if (player) {
        const connected = await player.connect();
        if (connected) {
          console.log('Spotify Player connected successfully');
          setIsPlayerReady(true);
        } else {
          console.error('Failed to connect Spotify Player');
          setIsPlayerReady(false);
        }
      }
    };

    checkPlayerConnection();

    // Check connection status periodically
    const intervalId = setInterval(checkPlayerConnection, 5000); // Recheck every 5 seconds

    return () => clearInterval(intervalId);
  }, [player]);

  const activatePlayer = async () => {
    if (player && deviceId) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player`,
          { device_ids: [deviceId], play: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Player activated successfully');
      } catch (error) {
        console.error('Error activating player:', error);
      }
    }
  };

  const skipToNext = useCallback(
    debounce(async () => {
      if (!token || !deviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          'https://api.spotify.com/v1/me/player/next',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Skipped to next track');
      } catch (error) {
        console.error('Error skipping to next track:', error);
      }
    }, 500),
    [token, deviceId]
  );

  const skipToPrevious = useCallback(
    debounce(async () => {
      if (!token || !deviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          'https://api.spotify.com/v1/me/player/previous',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Skipped to previous track');
      } catch (error) {
        console.error('Error skipping to previous track:', error);
      }
    }, 500),
    [token, deviceId]
  );

  const togglePlayPause = async () => {
    if (!player) {
      console.error('Spotify Player is not available');
      return;
    }

    try {
      const state = await player.getCurrentState();
      if (!state) {
        console.error('No state available, attempting to reconnect...');
        await player.connect();
        await activatePlayer(); // Try activating the player
        return;
      }

      if (state.paused) {
        await play(); // Use play function from the context
        console.log('Resumed playback');
      } else {
        await pause(); // Use pause function from the context
        console.log('Paused playback');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  return (
    <div className="player-controls">
      <button onClick={skipToPrevious} disabled={!isPlayerReady}>Previous</button>
      <button onClick={togglePlayPause} disabled={!isPlayerReady}>Play/Pause</button>
      <button onClick={skipToNext} disabled={!isPlayerReady}>Next</button>
    </div>
  );
};

export default PlayerControls;
