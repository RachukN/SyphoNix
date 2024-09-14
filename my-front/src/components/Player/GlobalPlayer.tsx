// src/components/GlobalPlayer.tsx
import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';

interface GlobalPlayerProviderProps {
  children: ReactNode;
}

interface GlobalPlayerContextType {
  playTrack: (url: string) => void;
  currentTrack: string | null;
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType | undefined>(undefined);

export const GlobalPlayerProvider: React.FC<GlobalPlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (url: string) => {
    setCurrentTrack(url);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <GlobalPlayerContext.Provider value={{ playTrack, currentTrack }}>
      {children}
      <audio ref={audioRef} controls style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </GlobalPlayerContext.Provider>
  );
};

export const useGlobalPlayer = (): GlobalPlayerContextType => {
  const context = useContext(GlobalPlayerContext);
  if (!context) {
    throw new Error('useGlobalPlayer must be used within a GlobalPlayerProvider');
  }
  return context;
};
