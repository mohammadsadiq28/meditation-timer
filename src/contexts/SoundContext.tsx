import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

type SoundContextType = {
  playSound: (type: 'start' | 'ambient' | 'complete', soundId?: string) => void;
  stopSound: (type: 'start' | 'ambient' | 'complete') => void;
  currentSound: string | null;
  volume: number;
  setVolume: (volume: number) => void;
};

// Sound URLs - these would be actual URLs in a production app
const SOUND_URLS = {
  // Alert/Notification sounds
  start: 'https://assets.mixkit.co/active_storage/sfx/2568/2568.wav',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2871/2871.wav',
  
  // Ambient sounds
  rain: 'https://assets.mixkit.co/active_storage/sfx/2532/2532.wav',
  forest: 'https://assets.mixkit.co/active_storage/sfx/2533/2533.wav',
  waves: 'https://assets.mixkit.co/active_storage/sfx/1139/1139.wav',
  'white-noise': 'https://assets.mixkit.co/active_storage/sfx/209/209.wav'
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  
  // Audio elements
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
    start: null,
    complete: null,
    ambient: null
  });
  
  // Initialize audio elements
  useEffect(() => {
    // Create audio elements
    audioRefs.current.start = new Audio();
    audioRefs.current.complete = new Audio();
    audioRefs.current.ambient = new Audio();
    
    // Set properties for ambient sound (looping)
    if (audioRefs.current.ambient) {
      audioRefs.current.ambient.loop = true;
    }
    
    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = volume / 100;
      }
    });
  }, [volume]);
  
  const playSound = (type: 'start' | 'ambient' | 'complete', soundId?: string) => {
    const audio = audioRefs.current[type];
    if (!audio) return;
    
    // Stop currently playing sound if it's the same type
    audio.pause();
    
    // Set the source based on type and soundId
    let source = '';
    if (type === 'start') {
      source = SOUND_URLS.start;
    } else if (type === 'complete') {
      source = SOUND_URLS.complete;
    } else if (type === 'ambient' && soundId) {
      source = SOUND_URLS[soundId as keyof typeof SOUND_URLS] || '';
      setCurrentSound(soundId);
    }
    
    if (source) {
      audio.src = source;
      audio.volume = volume / 100;
      audio.play().catch(err => console.error('Error playing sound:', err));
    }
  };
  
  const stopSound = (type: 'start' | 'ambient' | 'complete') => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      
      if (type === 'ambient') {
        setCurrentSound(null);
      }
    }
  };
  
  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        currentSound,
        volume,
        setVolume
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};