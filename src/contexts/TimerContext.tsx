import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Session = {
  date: number; // timestamp
  duration: number; // in seconds
};

type TimerContextType = {
  timeRemaining: number;
  totalDuration: number;
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  sessions: Session[];
  setDuration: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [totalDuration, setTotalDuration] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessions, setSessions] = useLocalStorage<Session[]>('meditation-sessions', []);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeRemaining]);
  
  const setDuration = (seconds: number) => {
    setTotalDuration(seconds);
    setTimeRemaining(seconds);
    setIsCompleted(false);
  };
  
  const startTimer = () => {
    if (timeRemaining > 0) {
      setIsActive(true);
      setIsPaused(false);
      setIsCompleted(false);
    }
  };
  
  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTimeRemaining(totalDuration);
  };
  
  const completeTimer = () => {
    const completedDuration = totalDuration - timeRemaining;
    
    if (completedDuration > 0) {
      // Only record sessions that lasted for some time
      setSessions([...sessions, {
        date: Date.now(),
        duration: completedDuration
      }]);
    }
    
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);
  };
  
  return (
    <TimerContext.Provider
      value={{
        timeRemaining,
        totalDuration,
        isActive,
        isPaused,
        isCompleted,
        sessions,
        setDuration,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        completeTimer
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};