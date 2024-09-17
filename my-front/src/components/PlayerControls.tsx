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
  const { player, deviceId, play, repeat, shuffle } = useGlobalPlayer();
  const token = localStorage.getItem('spotifyAccessToken');
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'context'>('off');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    name: string;
    artist: string;
    albumImage: string;
  } | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null); // State to store the current device ID

  useEffect(() => {
    // Initialize player and set up event listeners
    const initializePlayer = async () => {
      if (player) {
        player.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID:', device_id);
          setCurrentDeviceId(device_id); // Update device ID when the player is ready
          setIsPlayerReady(true);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Player not ready with Device ID:', device_id);
          setIsPlayerReady(false);
        });

        player.addListener('player_state_changed', (state) => {
          if (state) {
            setIsPlaying(!state.paused);
            // Extract current track information
            const track = state.track_window.current_track;
            setCurrentTrack({
              name: track.name,
              artist: track.artists.map(artist => artist.name).join(', '),
              albumImage: track.album.images[0]?.url || '',
            });
          }
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error('Initialization error:', message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Authentication error:', message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Account error:', message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Playback error:', message);
        });

        const connected = await player.connect();
        if (connected) {
          console.log('Spotify Player connected successfully');
        } else {
          console.error('Failed to connect Spotify Player');
        }
      } else {
        console.error('Player is not initialized');
        setIsPlayerReady(false);
      }
    };

    if (player) {
      initializePlayer();
    }

    return () => {
      player?.disconnect();
    };
  }, [player]);

  const activatePlayer = async () => {
    if (player && currentDeviceId && token) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player`,
          { device_ids: [currentDeviceId], play: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Player activated successfully');
        setIsPlayerReady(true);
      } catch (error) {
        console.error('Error activating player:', error);
        setIsPlayerReady(false);
      }
    } else {
      console.error('Player or Device ID or Token is missing');
    }
  };

  const skipToNext = useCallback(
    debounce(async () => {
      if (!token || !currentDeviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/player/next?device_id=${currentDeviceId}`,
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
    [token, currentDeviceId]
  );

  const skipToPrevious = useCallback(
    debounce(async () => {
      if (!token || !currentDeviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/player/previous?device_id=${currentDeviceId}`,
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
    [token, currentDeviceId]
  );

  // Function to directly pause using the correct Device ID
  const pausePlayback = async () => {
    if (!currentDeviceId) {
      console.error('Current Device ID is not available');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${currentDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error pausing playback via direct API call:', errorData);
      } else {
        console.log('Paused playback via direct API call');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing playback via direct API call:', error);
    }
  };

  // Function to directly resume playback using the correct Device ID
  const resumePlayback = async () => {
    if (!currentDeviceId) {
      console.error('Current Device ID is not available');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${currentDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error resuming playback via direct API call:', errorData);
      } else {
        console.log('Resumed playback via direct API call');
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error resuming playback via direct API call:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback(); // Call the custom pause function
    } else {
      await resumePlayback(); // Call the custom resume function
    }
  };

  const toggleShuffle = async () => {
    try {
      shuffle(!isShuffling);
      setIsShuffling(!isShuffling);
      console.log(`Shuffle is now ${!isShuffling ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling shuffle:', error);
    }
  };

  const toggleRepeat = async () => {
    const nextRepeatMode = repeatMode === 'off' ? 'track' : repeatMode === 'track' ? 'context' : 'off';
    try {
      repeat(nextRepeatMode);
      setRepeatMode(nextRepeatMode);
      console.log(`Repeat mode set to ${nextRepeatMode}`);
    } catch (error) {
      console.error('Error toggling repeat mode:', error);
    }
  };

  return (
    <div className="player-controls">
      {currentTrack && (
        <div className="track-info">
          <img src={currentTrack.albumImage} alt="Album cover" style={{ width: 50, height: 50 }} />
          <div>
            <h4>{currentTrack.name}</h4>
            <p>{currentTrack.artist}</p>
          </div>
        </div>
      )}
      <button onClick={skipToPrevious} disabled={!isPlayerReady}>Previous</button>
      <button onClick={togglePlayPause} disabled={!isPlayerReady}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={skipToNext} disabled={!isPlayerReady}>Next</button>
      <button onClick={toggleShuffle} disabled={!isPlayerReady}>
        {isShuffling ? 'Disable Shuffle' : 'Enable Shuffle'}
      </button>
      <button onClick={toggleRepeat} disabled={!isPlayerReady}>
        {repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'track' ? 'Repeat Track' : 'Repeat Context'}
      </button>
    </div>
  );
};

export default PlayerControls
