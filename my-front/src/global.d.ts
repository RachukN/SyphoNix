export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any; // This ensures that you can use the Spotify object
  }
}