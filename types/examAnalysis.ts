// Comprehensive type definitions for Exam Detailed Analysis functionality

export interface DetailedQuestionAnalysis {
  id: string;
  question: string;
  questionImage?: string;
  
  // Answer data
  options: Array<{
    text: string;
    image?: string;
    explanation?: string;
  }>;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  
  // Performance metrics
  timeSpent: number; // in seconds
  averageTime: number; // class average for this question
  timeEfficiency: 'fast' | 'normal' | 'slow';
  
  // Question metadata
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  pointsEarned: number;
  topic: string;
  subject: string;
  
  // Learning insights
  masteryLevel: 'needs-practice' | 'developing' | 'proficient' | 'mastered';
  commonMistakes?: string[];
  
  // Content
  systemExplanation: {
    text: string;
    steps?: Array<{
      step: number;
      description: string;
      formula?: string;
      image?: string;
    }>;
    keyPoints: string[];
    relatedConcepts: string[];
  };
  
  teacherExplanation?: {
    text?: string;
    videoUrl?: string;
    videoDuration?: number; // in seconds
    images?: Array<{
      url: string;
      caption: string;
    }>;
    additionalResources?: Array<{
      title: string;
      url: string;
      type: 'video' | 'document' | 'link';
    }>;
    teacherProfile: {
      id: string;
      name: string;
      avatar?: string;
      specialization: string[];
    };
  };
  
  // Bookmark data
  isBookmarked: boolean;
  bookmarkTags: string[];
  bookmarkedAt?: string; // ISO date
  reviewStatus: 'not-reviewed' | 'reviewed' | 'understood' | 'needs-more-practice';
}

export interface SubjectPerformanceAnalysis {
  subject: string;
  topic: string;
  questionsCount: number;
  correctCount: number;
  accuracy: number; // percentage
  averageTime: number; // seconds per question
  totalPoints: number;
  pointsEarned: number;
  masteryLevel: 'needs-practice' | 'developing' | 'proficient' | 'mastered';
  
  // Insights
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    type: 'practice' | 'review' | 'study' | 'tutor';
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime?: number; // minutes
  }>;
  
  // Comparison data
  classAverage?: number;
  percentileRank?: number;
  previousAttempts?: Array<{
    date: string;
    accuracy: number;
    improvement: number;
  }>;
}

export interface TimeAnalysisData {
  totalTimeSpent: number; // seconds
  timeLimit: number; // seconds
  timeUtilization: number; // percentage
  efficiency: 'excellent' | 'good' | 'needs-improvement';
  
  // Time distribution
  timeByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  
  timeByAccuracy: {
    correct: number;
    incorrect: number;
  };
  
  // Notable questions
  fastestQuestion: {
    id: string;
    time: number;
    question: string;
    wasCorrect: boolean;
  };
  
  slowestQuestion: {
    id: string;
    time: number;
    question: string;
    wasCorrect: boolean;
  };
  
  // Time patterns
  timePerQuestion: Array<{
    questionId: string;
    timeSpent: number;
    percentage: number; // of total time
    wasCorrect: boolean;
  }>;
}

export interface StudyPlanRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: number; // minutes
  type: 'review' | 'practice' | 'learn' | 'assess';
  
  // Related content
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  resources: Array<{
    title: string;
    type: 'video' | 'article' | 'practice' | 'quiz';
    url: string;
    duration?: number;
  }>;
  
  // Scheduling
  scheduledFor?: string; // ISO date
  isCompleted: boolean;
  completedAt?: string; // ISO date
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  color: string;
  isSystem: boolean; // system-generated vs user-created
  questionIds: string[];
  tags: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  studySessionCount: number;
  lastStudiedAt?: string;
  
  // Study settings
  reminderSettings?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm format
  };
}

export interface ExamDetailedAnalysisData {
  // Basic exam information
  examId: string;
  examTitle: string;
  subject: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Overall performance
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  
  // Time data
  timeSpent: number; // seconds
  timeLimit: number; // seconds
  
  // Detailed analysis
  questions: DetailedQuestionAnalysis[];
  subjectAnalysis: SubjectPerformanceAnalysis[];
  timeAnalysis: TimeAnalysisData;
  studyPlan: StudyPlanRecommendation[];
  
  // Comparison data
  classAverage?: number;
  percentileRank?: number;
  previousAttempts?: Array<{
    date: string;
    score: number;
    percentage: number;
    improvement: number;
  }>;
  
  // Achievements and insights
  achievements: string[];
  insights: Array<{
    type: 'strength' | 'weakness' | 'improvement' | 'recommendation';
    title: string;
    description: string;
    severity?: 'info' | 'warning' | 'critical';
  }>;
  
  // Metadata
  analyzedAt: string; // ISO date
  lastUpdated: string; // ISO date
}

// UI State interfaces
export interface AnalysisScreenState {
  currentTab: 'questions' | 'insights' | 'teacher' | 'study-plan';
  expandedQuestions: Set<string>;
  selectedQuestions: Set<string>;
  isMultiSelectMode: boolean;
  searchQuery: string;
  filterBy: {
    status: 'all' | 'correct' | 'incorrect' | 'bookmarked';
    difficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert';
    topic: string | 'all';
  };
  sortBy: 'order' | 'time' | 'difficulty' | 'accuracy';
}

// Hook return types
export interface UseBookmarksReturn {
  bookmarks: Set<string>;
  collections: BookmarkCollection[];
  toggleBookmark: (questionId: string) => void;
  addToCollection: (questionId: string, collectionId: string) => void;
  createCollection: (name: string, questionIds: string[]) => void;
  removeFromCollection: (questionId: string, collectionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
}

export interface UseAnalysisDataReturn {
  data: ExamDetailedAnalysisData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}