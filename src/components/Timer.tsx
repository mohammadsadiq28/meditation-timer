import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';
import { useSound } from '../contexts/SoundContext';
import { formatTime } from '../utils/timeUtils';

const Timer: React.FC = () => {
  const { 
    timeRemaining, 
    totalDuration, 
    isActive, 
    isPaused, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    completeTimer
  } = useTimer();
  
  const { playSound, stopSound } = useSound();
  const timerRef = useRef<HTMLDivElement>(null);
  const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
  
  useEffect(() => {
    if (timeRemaining === 0 && isActive && !isPaused) {
      playSound('complete');
      completeTimer();
    }
  }, [timeRemaining, isActive, isPaused, completeTimer, playSound]);

  const handleStartPause = () => {
    if (isActive && !isPaused) {
      pauseTimer();
    } else {
      startTimer();
      playSound('start');
    }
  };

  const handleReset = () => {
    resetTimer();
    stopSound('ambient');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-800 rounded-xl shadow-lg">
      <div 
        ref={timerRef}
        className="relative w-60 h-60 mb-6 flex items-center justify-center rounded-full border-4 border-slate-700"
      >
        {/* Timer progress circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="120"
            cy="120"
            r="108"
            className="stroke-slate-700 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="120"
            cy="120"
            r="108"
            className="stroke-teal-500 fill-none transition-all duration-1000 ease-linear"
            strokeWidth="8"
            strokeDasharray={Math.PI * 216}
            strokeDashoffset={Math.PI * 216 * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display */}
        <div className="z-10 text-5xl font-light">{formatTime(timeRemaining)}</div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={handleStartPause}
          className="p-4 bg-teal-600 hover:bg-teal-500 rounded-full transition-colors"
          aria-label={isActive && !isPaused ? "Pause meditation" : "Start meditation"}
        >
          {isActive && !isPaused ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button 
          onClick={handleReset}
          className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
          aria-label="Reset timer"
          disabled={!isActive && timeRemaining === totalDuration}
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;