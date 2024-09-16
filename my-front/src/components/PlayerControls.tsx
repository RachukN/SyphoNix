import React from 'react';
import { useGlobalPlayer } from './Player/GlobalPlayer'; // Ensure you're using your global player context

const PlayerControls: React.FC = () => {
  const { player, deviceId } = useGlobalPlayer();

  const handlePause = async () => {
    if (!player) {
      console.error('Spotify Player is not available');
      return;
    }

    try {
      await player.pause();
      console.log('Playback paused');
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  const handlePlay = async () => {
    if (!player) {
      console.error('Spotify Player is not available');
      return;
    }

    try {
      await player.resume();
      console.log('Playback resumed');
    } catch (error) {
      console.error('Error resuming playback:', error);
    }
  };

  const handleNext = async () => {
    if (!player) {
      console.error('Spotify Player is not available');
      return;
    }

    try {
      await player.nextTrack();
      console.log('Skipped to next track');
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    if (!player) {
      console.error('Spotify Player is not available');
      return;
    }

    try {
      await player.previousTrack();
      console.log('Skipped to previous track');
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  return (
    <div className="player-controls">
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default PlayerControls;
