import * as Haptics from 'expo-haptics';
import { Achievement } from '../components/results/AchievementUnlock';

// Performance levels and their thresholds
export type PerformanceLevel = 'epic' | 'great' | 'good' | 'supportive';
export type CelebrationIntensity = 'minimal' | 'moderate' | 'high' | 'epic';

// Celebration configuration for different performance levels
export interface CelebrationConfig {
  level: PerformanceLevel;
  intensity: CelebrationIntensity;
  emoji: string;
  title: string;
  subtitle: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    confetti: boolean;
    particles: boolean;
    glow: boolean;
    shake: boolean;
    bounce: boolean;
  };
  sounds: {
    primary: string;
    secondary?: string;
  };
  haptics: {
    impact: 'Light' | 'Medium' | 'Heavy';
    pattern?: 'success' | 'warning' | 'error';
  };
  messages: {
    primary: string[];
    encouraging: string[];
    improvement?: string[];
  };
}

// Achievement criteria and rewards
export interface AchievementCriteria {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'streak' | 'speed' | 'completion' | 'mastery' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  condition: (examResult: ExamResult, userStats: UserStats) => boolean;
  progress?: (examResult: ExamResult, userStats: UserStats) => { current: number; total: number };
}

// Data types
export interface ExamResult {
  examId: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  timeLimit: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subject: string;
  topics: string[];
  previousAttempts: number;
  streak: number;
  questionsAnalysis: Array<{
    correct: boolean;
    timeSpent: number;
    difficulty: string;
  }>;
}

export interface UserStats {
  totalExams: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  subjectMastery: Record<string, number>;
  achievements: string[];
  level: number;
  xp: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

// Celebration configurations
const CELEBRATION_CONFIGS: Record<PerformanceLevel, CelebrationConfig> = {
  epic: {
    level: 'epic',
    intensity: 'epic',
    emoji: '🏆',
    title: 'Outstanding!',
    subtitle: 'Perfect mastery achieved!',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      accent: '#FFD700',
    },
    effects: {
      confetti: true,
      particles: true,
      glow: true,
      shake: true,
      bounce: true,
    },
    sounds: {
      primary: 'celebration',
      secondary: 'fanfare',
    },
    haptics: {
      impact: 'Heavy',
      pattern: 'success',
    },
    messages: {
      primary: [
        'Absolutely incredible!',
        'You\'re a true master!',
        'Perfect performance!',
        'You\'ve outdone yourself!',
        'Flawless execution!',
      ],
      encouraging: [
        'You\'re setting the standard!',
        'Your dedication is paying off!',
        'Keep up this amazing momentum!',
        'You\'re inspiring others!',
      ],
    },
  },
  great: {
    level: 'great',
    intensity: 'high',
    emoji: '⭐',
    title: 'Great Job!',
    subtitle: 'Excellent progress made!',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#F59E0B',
    },
    effects: {
      confetti: true,
      particles: false,
      glow: true,
      shake: false,
      bounce: true,
    },
    sounds: {
      primary: 'success',
    },
    haptics: {
      impact: 'Medium',
      pattern: 'success',
    },
    messages: {
      primary: [
        'Excellent work!',
        'You\'re doing great!',
        'Impressive performance!',
        'Well done!',
        'Strong effort!',
      ],
      encouraging: [
        'You\'re making real progress!',
        'Keep building on this success!',
        'Your hard work is showing!',
        'You\'re on the right track!',
      ],
    },
  },
  good: {
    level: 'good',
    intensity: 'moderate',
    emoji: '👍',
    title: 'Good Progress!',
    subtitle: 'You\'re moving forward!',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#10B981',
    },
    effects: {
      confetti: false,
      particles: false,
      glow: false,
      shake: false,
      bounce: true,
    },
    sounds: {
      primary: 'positive',
    },
    haptics: {
      impact: 'Medium',
    },
    messages: {
      primary: [
        'Nice progress!',
        'You\'re improving!',
        'Good effort!',
        'Keep it up!',
        'Solid work!',
      ],
      encouraging: [
        'Every step counts!',
        'You\'re building strong foundations!',
        'Consistent effort pays off!',
        'You\'re developing your skills!',
      ],
    },
  },
  supportive: {
    level: 'supportive',
    intensity: 'minimal',
    emoji: '📚',
    title: 'Keep Learning!',
    subtitle: 'Every attempt makes you stronger!',
    colors: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      accent: '#3B82F6',
    },
    effects: {
      confetti: false,
      particles: false,
      glow: false,
      shake: false,
      bounce: false,
    },
    sounds: {
      primary: 'gentle',
    },
    haptics: {
      impact: 'Light',
    },
    messages: {
      primary: [
        'Great effort!',
        'You\'re learning!',
        'Keep practicing!',
        'Every try counts!',
        'You\'re growing!',
      ],
      encouraging: [
        'Learning is a journey!',
        'Mistakes help us grow!',
        'You\'re building knowledge!',
        'Practice makes progress!',
      ],
      improvement: [
        'Try reviewing the explanations',
        'Focus on the challenging topics',
        'Consider taking more practice quizzes',
        'Break down complex problems step by step',
      ],
    },
  },
};

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: AchievementCriteria[] = [
  // Performance Achievements
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% on any exam',
    icon: 'trophy',
    category: 'performance',
    rarity: 'epic',
    xpReward: 500,
    condition: (result) => result.percentage >= 100,
  },
  {
    id: 'excellent_performer',
    name: 'Excellent Performer',
    description: 'Score 90% or higher',
    icon: 'star',
    category: 'performance',
    rarity: 'rare',
    xpReward: 200,
    condition: (result) => result.percentage >= 90,
  },
  {
    id: 'first_success',
    name: 'First Success',
    description: 'Complete your first exam',
    icon: 'flag',
    category: 'completion',
    rarity: 'common',
    xpReward: 100,
    condition: (_, stats) => stats.totalExams === 1,
  },
  
  // Streak Achievements
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Get a 3-day learning streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'common',
    xpReward: 150,
    condition: (_, stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 10-day learning streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'rare',
    xpReward: 400,
    condition: (_, stats) => stats.currentStreak >= 10,
  },
  {
    id: 'consistency_champion',
    name: 'Consistency Champion',
    description: 'Achieve a 30-day learning streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    condition: (_, stats) => stats.currentStreak >= 30,
  },
  
  // Speed Achievements
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete an exam in under 50% of time limit with 80%+ score',
    icon: 'flash',
    category: 'speed',
    rarity: 'uncommon',
    xpReward: 250,
    condition: (result) => 
      result.timeSpent <= result.timeLimit * 0.5 && result.percentage >= 80,
  },
  
  // Mastery Achievements
  {
    id: 'subject_master',
    name: 'Subject Master',
    description: 'Achieve 90%+ average in a subject',
    icon: 'school',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 300,
    condition: (result, stats) => 
      stats.subjectMastery[result.subject] >= 90,
  },
  
  // Improvement Achievements
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Improve by 30+ points from previous attempt',
    icon: 'trending-up',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 200,
    condition: (result) => {
      // This would need previous attempt data
      return result.previousAttempts > 0; // Simplified for now
    },
  },
];

// Main celebration system class
export class CelebrationSystem {
  /**
   * Determine performance level based on score
   */
  static getPerformanceLevel(percentage: number): PerformanceLevel {
    if (percentage >= 90) return 'epic';
    if (percentage >= 75) return 'great';
    if (percentage >= 60) return 'good';
    return 'supportive';
  }

  /**
   * Get celebration configuration for a performance level
   */
  static getCelebrationConfig(level: PerformanceLevel): CelebrationConfig {
    return CELEBRATION_CONFIGS[level];
  }

  /**
   * Get adaptive celebration config based on exam result
   */
  static getAdaptiveCelebration(
    result: ExamResult, 
    userStats: UserStats,
    context?: {
      isImprovement?: boolean;
      isFirstAttempt?: boolean;
      exceedsGoal?: boolean;
    }
  ): CelebrationConfig {
    const baseLevel = this.getPerformanceLevel(result.percentage);
    const config = { ...CELEBRATION_CONFIGS[baseLevel] };

    // Adapt based on context
    if (context?.isImprovement && baseLevel !== 'epic') {
      config.title += ' (Improved!)';
      config.subtitle = 'You\'re getting better!';
      config.effects.glow = true;
      config.colors.accent = '#10B981'; // Green for improvement
    }

    if (context?.isFirstAttempt) {
      config.messages.encouraging.unshift('Great first attempt!');
    }

    if (context?.exceedsGoal) {
      config.title += ' (Goal Exceeded!)';
      config.effects.bounce = true;
    }

    // Adjust for difficulty
    if (result.difficulty === 'expert' && result.percentage >= 70) {
      config.title = 'Incredible on Expert Level!';
      config.effects.particles = true;
    }

    return config;
  }

  /**
   * Check for unlocked achievements
   */
  static checkAchievements(
    result: ExamResult, 
    userStats: UserStats
  ): Achievement[] {
    const unlocked: Achievement[] = [];

    for (const criteria of ACHIEVEMENT_DEFINITIONS) {
      // Skip if already unlocked
      if (userStats.achievements.includes(criteria.id)) continue;

      // Check condition
      if (criteria.condition(result, userStats)) {
        const achievement: Achievement = {
          id: criteria.id,
          title: criteria.name,
          description: criteria.description,
          icon: criteria.icon as any,
          category: criteria.category,
          rarity: criteria.rarity,
          xpReward: criteria.xpReward,
          unlockedAt: new Date(),
        };

        // Add progress if applicable
        if (criteria.progress) {
          achievement.progress = criteria.progress(result, userStats);
        }

        unlocked.push(achievement);
      }
    }

    return unlocked;
  }

  /**
   * Execute haptic feedback based on performance
   */
  static async executeHapticFeedback(level: PerformanceLevel): Promise<void> {
    const config = CELEBRATION_CONFIGS[level];
    
    try {
      switch (config.haptics.impact) {
        case 'Light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'Medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'Heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }

      // Additional pattern for special cases
      if (config.haptics.pattern === 'success' && level === 'epic') {
        // Double tap for epic achievements
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 200);
      }
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  /**
   * Get personalized message based on performance and context
   */
  static getPersonalizedMessage(
    result: ExamResult,
    userStats: UserStats,
    messageType: 'primary' | 'encouraging' | 'improvement' = 'primary'
  ): string {
    const config = this.getCelebrationConfig(this.getPerformanceLevel(result.percentage));
    const messages = config.messages[messageType] || config.messages.primary;
    
    // Add context-aware messages
    const contextMessages: string[] = [...messages];
    
    if (result.streak > 0) {
      contextMessages.push(`${result.streak} day streak going strong!`);
    }
    
    if (result.timeSpent < result.timeLimit * 0.7) {
      contextMessages.push('Great time management!');
    }
    
    if (result.difficulty === 'expert') {
      contextMessages.push('Tackling expert level - impressive!');
    }

    // Return random message
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }

  /**
   * Calculate XP bonus based on performance factors
   */
  static calculateXPBonus(result: ExamResult, userStats: UserStats): number {
    let bonus = 0;
    
    // Base XP from score
    bonus += Math.floor(result.percentage * 10);
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      beginner: 1,
      intermediate: 1.2,
      advanced: 1.5,
      expert: 2,
    };
    bonus *= difficultyMultiplier[result.difficulty];
    
    // Speed bonus
    if (result.timeSpent < result.timeLimit * 0.5) {
      bonus *= 1.3; // 30% speed bonus
    }
    
    // Streak bonus
    if (result.streak >= 7) {
      bonus *= 1.2; // 20% streak bonus
    }
    
    // First attempt bonus
    if (result.previousAttempts === 0) {
      bonus *= 1.1; // 10% first attempt bonus
    }

    return Math.floor(bonus);
  }

  /**
   * Get next steps recommendations based on performance
   */
  static getNextStepsRecommendations(
    result: ExamResult,
    userStats: UserStats
  ): Array<{ type: 'practice' | 'review' | 'advance' | 'retake'; title: string; description: string; priority: 'high' | 'medium' | 'low' }> {
    const recommendations = [];
    const level = this.getPerformanceLevel(result.percentage);

    if (level === 'epic') {
      recommendations.push({
        type: 'advance' as const,
        title: 'Try a Harder Challenge',
        description: 'You\'ve mastered this level! Ready for expert difficulty?',
        priority: 'high' as const,
      });
    } else if (level === 'great') {
      recommendations.push({
        type: 'practice' as const,
        title: 'Perfect Your Skills',
        description: 'Practice similar questions to achieve mastery',
        priority: 'medium' as const,
      });
    } else if (level === 'supportive') {
      recommendations.push({
        type: 'review' as const,
        title: 'Review Key Concepts',
        description: 'Focus on the topics you found challenging',
        priority: 'high' as const,
      });
      
      recommendations.push({
        type: 'retake' as const,
        title: 'Try Again When Ready',
        description: 'Retake this quiz after reviewing the material',
        priority: 'medium' as const,
      });
    }

    return recommendations;
  }
}

// Export utility functions
export const getCelebrationLevel = CelebrationSystem.getPerformanceLevel;
export const getAdaptiveCelebration = CelebrationSystem.getAdaptiveCelebration.bind(CelebrationSystem);
export const checkUnlockedAchievements = CelebrationSystem.checkAchievements.bind(CelebrationSystem);
export const executeHaptics = CelebrationSystem.executeHapticFeedback.bind(CelebrationSystem);
export const getPersonalizedMessage = CelebrationSystem.getPersonalizedMessage.bind(CelebrationSystem);
export const calculateXPBonus = CelebrationSystem.calculateXPBonus.bind(CelebrationSystem);
export const getNextSteps = CelebrationSystem.getNextStepsRecommendations.bind(CelebrationSystem);