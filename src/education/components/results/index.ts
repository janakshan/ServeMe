// Enhanced Results System - Component Exports
// This file provides centralized exports for all result-related components

// Main Results Components
export { EnhancedResultsScreen } from './EnhancedResultsScreen';
export type { ExamResultData } from './EnhancedResultsScreen';

export { PerformanceBreakdown } from './PerformanceBreakdown';
export type { 
  QuestionAnalysis, 
  SubjectAnalysis, 
  TimeAnalysis, 
  PerformanceBreakdownProps 
} from './PerformanceBreakdown';

export { AchievementUnlock } from './AchievementUnlock';
export type { 
  Achievement, 
  AchievementUnlockProps 
} from './AchievementUnlock';

export { ShareableResultCard } from './ShareableResultCard';
export type { 
  ShareableResultData, 
  ShareableResultCardProps 
} from './ShareableResultCard';

export { NextStepsRecommendations } from './NextStepsRecommendations';
export type { 
  Recommendation, 
  LearningPath, 
  NextStepsData, 
  RecommendationType, 
  RecommendationPriority 
} from './NextStepsRecommendations';

export { HistoricalPerformanceChart } from './HistoricalPerformanceChart';
export type { 
  PerformanceDataPoint, 
  SubjectPerformance, 
  HistoricalPerformanceData 
} from './HistoricalPerformanceChart';

export { StudyGroupShare } from './StudyGroupShare';
export { TeacherDashboardNotification } from './TeacherDashboardNotification';
export { ParentNotification } from './ParentNotification';

// Utility Exports
export { 
  CelebrationSystem,
  getCelebrationLevel,
  getAdaptiveCelebration,
  checkUnlockedAchievements,
  executeHaptics,
  getPersonalizedMessage,
  calculateXPBonus,
  getNextSteps
} from '../../utils/celebrationSystem';

export type { 
  PerformanceLevel,
  CelebrationConfig,
  ExamResult,
  UserStats
} from '../../utils/celebrationSystem';

// Sound Service Exports
export { 
  soundService,
  playSound,
  executeHaptic,
  executeCelebrationFeedback,
  initializeSoundService
} from '../../services/soundService';

export type { 
  SoundType,
  HapticPattern
} from '../../services/soundService';