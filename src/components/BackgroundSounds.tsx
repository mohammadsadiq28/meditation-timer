import React, { useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { useTimer } from '../contexts/TimerContext';

const AMBIENT_SOUNDS = [
  { name: 'Rain', id: 'rain' },
  { name: 'Forest', id: 'forest' },
  { name: 'Waves', id: 'waves' },
  { name: 'White Noise', id: 'white-noise' }
];

const BackgroundSounds: React.FC = () => {
  const { playSound, stopSound, currentSound, volume, setVolume } = useSound();
  const { isActive } = useTimer();
  
  const handleSoundSelect = (soundId: string) => {
    if (currentSound === soundId) {
      stopSound('ambient');
    } else {
      playSound('ambient', soundId);
    }
  };
  
  return (
    <div className="w-full p-4 bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Music size={20} /> 
        <span>Ambient Sounds</span>
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {AMBIENT_SOUNDS.map(sound => (
          <button
            key={sound.id}
            onClick={() => handleSoundSelect(sound.id)}
            className={`py-2 px-3 rounded-lg transition-colors ${
              currentSound === sound.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {sound.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setVolume(volume > 0 ? 0 : 50)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          aria-label={volume > 0 ? "Mute" : "Unmute"}
        >
          {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        
        <input 
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value, 10))}
          className="flex-1 h-2 rounded-lg appearance-none bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
        />
        
        <span className="text-sm text-slate-400 w-8 text-right">{volume}%</span>
      </div>
    </div>
  );
};

export default BackgroundSounds;