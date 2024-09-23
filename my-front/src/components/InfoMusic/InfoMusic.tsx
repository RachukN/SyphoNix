import React, { useEffect, useState } from 'react';
import PlayerControls from '../Player/PlayerControls';
import { useGlobalPlayer } from '../Player/GlobalPlayer';

const InfoMusic: React.FC = () => {
  const { player } = useGlobalPlayer();
  const [currentTrack, setCurrentTrack] = useState<{
    name: string;
    artist: string;
    albumImage: string;
  } | null>(null);

  useEffect(() => {
    const initializePlayer = async () => {
      if (player) {
        player.addListener('player_state_changed', (state) => {
          if (state) {
            const track = state.track_window.current_track;
            setCurrentTrack({
              name: track.name,
              artist: track.artists.map((artist: any) => artist.name).join(', '),
              albumImage: track.album.images[0]?.url || '',
            });
          }
        });
      }
    };

    initializePlayer();

    return () => {
      if (player) {
        player.removeListener('player_state_changed');
      }
    };
  }, [player]);

  return (
    <div>

      {currentTrack ? (
        <div>
          <img src={currentTrack.albumImage} alt="Album Cover" style={{ width: '200px', height: '200px' }} />
          
        </div>
      ) : (
        <p>No track is currently playing.</p>
      )}

      <PlayerControls /> 
    </div>
  );
};

export default InfoMusic;
