import React from 'react';
import Timer from '../components/Timer';
import DurationSelector from '../components/DurationSelector';
import BreathingGuide from '../components/BreathingGuide';
import BackgroundSounds from '../components/BackgroundSounds';
import SessionStats from '../components/SessionStats';
import { TimerProvider } from '../contexts/TimerContext';
import { SoundProvider } from '../contexts/SoundContext';

const MeditationTimer: React.FC = () => {
  return (
    <TimerProvider>
      <SoundProvider>
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center">
          <header className="w-full py-6 text-center">
            <h1 className="text-3xl md:text-4xl font-light">Peaceful Mind</h1>
            <p className="text-slate-400 mt-2">Meditation Timer</p>
          </header>
          
          <main className="flex-1 w-full max-w-4xl px-4 py-8 flex flex-col items-center justify-start">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-6">
                <Timer />
                <DurationSelector />
                <BackgroundSounds />
              </div>
              
              <div className="flex flex-col space-y-6">
                <BreathingGuide />
                <SessionStats />
              </div>
            </div>
          </main>
          
          <footer className="w-full py-4 text-center text-slate-500 text-sm">
            <p>Designed for mindfulness © {new Date().getFullYear()}</p>
          </footer>
        </div>
      </SoundProvider>
    </TimerProvider>
  );
};

export default MeditationTimer;