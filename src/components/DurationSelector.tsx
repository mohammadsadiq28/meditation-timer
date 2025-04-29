import React from 'react';
import { Clock } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';

const PRESET_DURATIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '20 min', value: 20 * 60 },
  { label: '30 min', value: 30 * 60 }
];

const DurationSelector: React.FC = () => {
  const { setDuration, totalDuration, isActive } = useTimer();
  const [customMinutes, setCustomMinutes] = React.useState<string>('');
  
  const handlePresetSelect = (seconds: number) => {
    if (!isActive) {
      setDuration(seconds);
    }
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomMinutes(value);
  };
  
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive && customMinutes) {
      const minutes = parseInt(customMinutes, 10);
      if (minutes > 0 && minutes <= 180) { // Max 3 hours
        setDuration(minutes * 60);
      }
    }
  };
  
  return (
    <div className="w-full p-4 bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Clock size={20} /> 
        <span>Duration</span>
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
        {PRESET_DURATIONS.map((duration) => (
          <button
            key={duration.value}
            onClick={() => handlePresetSelect(duration.value)}
            disabled={isActive}
            className={`py-2 px-3 rounded-lg transition-colors ${
              totalDuration === duration.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {duration.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleCustomSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={customMinutes}
          onChange={handleCustomChange}
          placeholder="Custom (min)"
          disabled={isActive}
          className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isActive || !customMinutes}
          className={`bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors ${
            isActive || !customMinutes ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Set
        </button>
      </form>
    </div>
  );
};

export default DurationSelector;