 /**
 * Format time in seconds to mm:ss format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format time in seconds to a human-readable format
 * @param seconds Time in seconds
 * @returns Human-readable time string
 */
export const formatTimeVerbose = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''}${
      remainingSeconds > 0 ? ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : ''
    }`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''}${
      minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''
    }`;
  }
};