import React from 'react';
import { LineChart, History } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';
import { formatTime } from '../utils/timeUtils';

const SessionStats: React.FC = () => {
  const { sessions, totalDuration, timeRemaining } = useTimer();
  
  // Calculate total meditation time
  const totalTime = sessions.reduce((total, session) => total + session.duration, 0);
  const totalTimeFormatted = formatTime(totalTime);
  
  // Calculate average session length
  const averageTime = sessions.length > 0 
    ? Math.floor(totalTime / sessions.length) 
    : 0;
  const averageTimeFormatted = formatTime(averageTime);
  
  // Calculate current streak
  const streak = calculateStreak(sessions);
  
  return (
    <div className="w-full p-4 bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <LineChart size={20} /> 
        <span>Statistics</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Total Time</p>
          <p className="text-xl font-medium">{totalTimeFormatted}</p>
        </div>
        
        <div className="bg-slate-700 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Sessions</p>
          <p className="text-xl font-medium">{sessions.length}</p>
        </div>
        
        <div className="bg-slate-700 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Average Time</p>
          <p className="text-xl font-medium">{averageTimeFormatted}</p>
        </div>
        
        <div className="bg-slate-700 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Streak</p>
          <p className="text-xl font-medium">{streak} days</p>
        </div>
      </div>
      
      {sessions.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2 flex items-center gap-2">
            <History size={16} /> 
            <span>Recent Sessions</span>
          </h3>
          
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(-5).reverse().map((session, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="py-2">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="text-right py-2">
                      {formatTime(session.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Calculate the current streak based on consecutive days
const calculateStreak = (sessions: Array<{ date: number, duration: number }>) => {
  if (sessions.length === 0) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => b.date - a.date);
  
  // Get unique dates (as day strings) for all sessions
  const sessionDates = new Set<string>();
  sortedSessions.forEach(session => {
    const date = new Date(session.date);
    sessionDates.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  });
  
  // Convert to array for easier processing
  const uniqueDates = Array.from(sessionDates);
  
  // Get today's date string
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  // Check if today is included
  const hasToday = uniqueDates.includes(todayString);
  
  // Calculate streak
  let streak = hasToday ? 1 : 0;
  const yesterday = new Date(today);
  
  // Loop through previous days
  for (let i = 1; i < 100; i++) { // Limit to reasonable number
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
    
    if (uniqueDates.includes(dateString)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export default SessionStats;