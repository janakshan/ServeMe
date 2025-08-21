/**
 * Utility functions for user-friendly time formatting
 */

export const formatDuration = (seconds: number): string => {
  // Round to nearest second to avoid decimal display
  const roundedSeconds = Math.round(seconds);
  
  if (roundedSeconds < 60) {
    return `${roundedSeconds}s`;
  }
  
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDetailedDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

export const formatTimeEfficiency = (timeSpent: number, averageTime: number): {
  efficiency: 'fast' | 'normal' | 'slow';
  description: string;
  icon: string;
  color: string;
} => {
  const ratio = timeSpent / averageTime;
  
  if (ratio <= 0.7) {
    return {
      efficiency: 'fast',
      description: `${Math.round((1 - ratio) * 100)}% faster than average`,
      icon: 'flash',
      color: '#10B981', // green
    };
  } else if (ratio <= 1.3) {
    return {
      efficiency: 'normal',
      description: 'Average pace',
      icon: 'time',
      color: '#6366F1', // blue
    };
  } else {
    return {
      efficiency: 'slow',
      description: `${Math.round((ratio - 1) * 100)}% slower than average`,
      icon: 'hourglass',
      color: '#F59E0B', // amber
    };
  }
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

export const formatTimeOfDay = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
  
  const timeStr = date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) {
    return `Today at ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday at ${timeStr}`;
  } else {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

export const getTimeProgressColor = (timeSpent: number, timeLimit: number): string => {
  const utilization = timeSpent / timeLimit;
  
  if (utilization <= 0.5) {
    return '#10B981'; // green - good time management
  } else if (utilization <= 0.8) {
    return '#6366F1'; // blue - normal pace
  } else if (utilization <= 1.0) {
    return '#F59E0B'; // amber - cutting it close
  } else {
    return '#EF4444'; // red - overtime
  }
};

export const formatTimeProgress = (timeSpent: number, timeLimit: number): {
  percentage: number;
  status: 'excellent' | 'good' | 'close' | 'overtime';
  description: string;
  color: string;
} => {
  const utilization = timeSpent / timeLimit;
  const percentage = Math.min(utilization * 100, 100);
  
  if (utilization <= 0.5) {
    return {
      percentage,
      status: 'excellent',
      description: 'Excellent time management',
      color: '#10B981',
    };
  } else if (utilization <= 0.8) {
    return {
      percentage,
      status: 'good',
      description: 'Good pacing',
      color: '#6366F1',
    };
  } else if (utilization <= 1.0) {
    return {
      percentage,
      status: 'close',
      description: 'Cutting it close',
      color: '#F59E0B',
    };
  } else {
    return {
      percentage: 100,
      status: 'overtime',
      description: `${formatDuration(timeSpent - timeLimit)} overtime`,
      color: '#EF4444',
    };
  }
};