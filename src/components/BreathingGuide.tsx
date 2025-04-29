import React, { useState, useEffect } from 'react';
import { Settings as Lungs } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';

const BREATHING_PATTERNS = [
  { name: 'Equal', inhale: 4, hold: 0, exhale: 4, id: 'equal' },
  { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, id: '478' },
  { name: 'Box', inhale: 4, hold: 4, exhale: 4, id: 'box' },
  { name: 'Deep', inhale: 6, hold: 2, exhale: 8, id: 'deep' }
];

const BreathingGuide: React.FC = () => {
  const { isActive, isPaused } = useTimer();
  const [activePattern, setActivePattern] = useState(BREATHING_PATTERNS[0]);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsInPhase, setSecondsInPhase] = useState(0);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setSecondsInPhase(prev => {
          const newSeconds = prev + 1;
          
          if (breathingPhase === 'inhale' && newSeconds >= activePattern.inhale) {
            setBreathingPhase(activePattern.hold > 0 ? 'hold' : 'exhale');
            return 0;
          } else if (breathingPhase === 'hold' && newSeconds >= activePattern.hold) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newSeconds >= activePattern.exhale) {
            setBreathingPhase('inhale');
            return 0;
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, breathingPhase, activePattern]);
  
  // Calculate the circle size based on the breathing phase
  const getCircleSize = () => {
    if (!isActive || isPaused) return 'scale-75';
    
    if (breathingPhase === 'inhale') {
      const progress = secondsInPhase / activePattern.inhale;
      return `scale-${75 + Math.floor(progress * 25)}`;
    } else if (breathingPhase === 'hold') {
      return 'scale-100';
    } else {
      const progress = secondsInPhase / activePattern.exhale;
      return `scale-${100 - Math.floor(progress * 25)}`;
    }
  };
  
  // Get instruction text
  const getInstructionText = () => {
    if (!isActive || isPaused) return 'Begin to focus on your breath';
    return breathingPhase === 'inhale' 
      ? 'Breathe in...' 
      : breathingPhase === 'hold' 
        ? 'Hold...' 
        : 'Breathe out...';
  };
  
  return (
    <div className="w-full p-4 bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Lungs size={20} /> 
        <span>Breathing Guide</span>
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="flex justify-center space-x-2 mb-6">
          {BREATHING_PATTERNS.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => setActivePattern(pattern)}
              className={`px-3 py-1 rounded-lg text-sm ${
                activePattern.id === pattern.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {pattern.name}
            </button>
          ))}
        </div>
        
        <div className="relative h-48 w-48 flex items-center justify-center mb-4">
          <div 
            className={`absolute rounded-full bg-blue-500/20 w-40 h-40 transition-transform duration-1000 ease-in-out ${
              breathingPhase === 'inhale' 
                ? 'scale-[0.75_+_0.25_*_' + (secondsInPhase / activePattern.inhale) + ']' 
                : breathingPhase === 'exhale'
                  ? 'scale-[1.0_-_0.25_*_' + (secondsInPhase / activePattern.exhale) + ']'
                  : 'scale-100'
            }`}
          />
          <div 
            className={`absolute rounded-full bg-blue-500/40 w-32 h-32 transition-transform duration-1000 ease-in-out ${
              breathingPhase === 'inhale' 
                ? 'scale-[0.75_+_0.25_*_' + (secondsInPhase / activePattern.inhale) + ']' 
                : breathingPhase === 'exhale'
                  ? 'scale-[1.0_-_0.25_*_' + (secondsInPhase / activePattern.exhale) + ']'
                  : 'scale-100'
            }`}
          />
          <p className="z-10 text-lg font-light text-center text-white">
            {getInstructionText()}
          </p>
        </div>
        
        <div className="text-sm text-center text-slate-400">
          {isActive && !isPaused && (
            <p>
              Inhale: {activePattern.inhale}s
              {activePattern.hold > 0 && ` • Hold: ${activePattern.hold}s`} 
              • Exhale: {activePattern.exhale}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;