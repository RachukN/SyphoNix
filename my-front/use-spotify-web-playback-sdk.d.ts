// src/types/use-spotify-web-playback-sdk.d.ts
declare module 'use-spotify-web-playback-sdk' {
    // Importing the Spotify types directly
    import type { Player as SpotifyPlayer, PlaybackState } from '@types/spotify-web-playback-sdk';
  
    export interface SpotifyWebPlaybackSdkProps {
      name: string;
      getOAuthToken: () => Promise<string>;
      onPlayerStateChanged: (playerState: PlaybackState) => void; // Update with correct type
    }
  
    export interface SpotifyWebPlaybackSdkReturn {
      Script: React.FC<{ children: React.ReactNode }>;
      deviceId: string | null;
      connect: () => void;
      player: SpotifyPlayer | null; // Correctly reference the Spotify Player type
      isReady: boolean;
    }
  
    export default function useSpotifyWebPlaybackSdk(
      props: SpotifyWebPlaybackSdkProps
    ): SpotifyWebPlaybackSdkReturn;
  }
  