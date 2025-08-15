import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Import our new types
import type {
  ExamDetailedAnalysisData,
  AnalysisScreenState,
  DetailedQuestionAnalysis,
} from '@/types/examAnalysis';

// Import components we'll create
import { QuestionAnalysisList } from '@/components/exam-analysis/QuestionAnalysisList';
import { PerformanceInsights } from '@/components/exam-analysis/PerformanceInsights';
import { TeacherExplanations } from '@/components/exam-analysis/TeacherExplanations';
import { StudyPlanView } from '@/components/exam-analysis/StudyPlanView';
import { FloatingBookmarkToolbar } from '@/components/exam-analysis/FloatingBookmarkToolbar';
import { AnalysisHeader } from '@/components/exam-analysis/AnalysisHeader';
import { PerformanceSummary } from '@/components/exam-analysis/PerformanceSummary';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Tab configuration
const TABS = [
  { id: 'overview', label: 'Overview', icon: 'stats-chart' },
  { id: 'questions', label: 'Questions', icon: 'list' },
  { id: 'insights', label: 'Insights', icon: 'analytics' },
  { id: 'teacher', label: 'Teachers', icon: 'school' },
  { id: 'study-plan', label: 'Study Plan', icon: 'calendar' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ExamDetailedAnalysisScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const insets = useSafeAreaInsets();
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  // Screen state
  const [screenState, setScreenState] = useState<AnalysisScreenState>({
    currentTab: 'overview', // Start with overview tab
    expandedQuestions: new Set(),
    selectedQuestions: new Set(),
    isMultiSelectMode: false,
    searchQuery: '',
    filterBy: {
      status: 'all',
      difficulty: 'all',
      topic: 'all',
    },
    sortBy: 'order',
  });

  // Data state
  const [analysisData, setAnalysisData] = useState<ExamDetailedAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const tabTranslateX = useSharedValue(0);
  const summaryOpacity = useSharedValue(0);

  // Load analysis data
  useEffect(() => {
    loadAnalysisData();
  }, [examId]);

  // Initialize animations
  useEffect(() => {
    if (analysisData) {
      summaryOpacity.value = withTiming(1, { duration: 800 });
    }
  }, [analysisData]);

  const loadAnalysisData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data for development - replace with actual API call
      const mockData: ExamDetailedAnalysisData = await generateMockAnalysisData(examId || '');
      
      setAnalysisData(mockData);
    } catch (err) {
      setError('Failed to load analysis data');
      console.error('Analysis loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalysisData();
    setIsRefreshing(false);
  };

  const handleTabChange = (tabId: TabId) => {
    if (tabId === screenState.currentTab) return;
    
    const tabIndex = TABS.findIndex(tab => tab.id === tabId);
    tabTranslateX.value = withSpring(tabIndex * (screenWidth / TABS.length));
    
    setScreenState(prev => ({
      ...prev,
      currentTab: tabId,
      selectedQuestions: new Set(), // Clear selection when changing tabs
      isMultiSelectMode: false,
    }));
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleQuestionToggle = (questionId: string) => {
    setScreenState(prev => {
      const newExpanded = new Set(prev.expandedQuestions);
      if (newExpanded.has(questionId)) {
        newExpanded.delete(questionId);
      } else {
        newExpanded.add(questionId);
      }
      return { ...prev, expandedQuestions: newExpanded };
    });
  };

  const handleMultiSelect = (questionId: string) => {
    setScreenState(prev => {
      const newSelected = new Set(prev.selectedQuestions);
      if (newSelected.has(questionId)) {
        newSelected.delete(questionId);
      } else {
        newSelected.add(questionId);
      }
      
      return {
        ...prev,
        selectedQuestions: newSelected,
        isMultiSelectMode: newSelected.size > 0,
      };
    });
  };

  const handleClearSelection = () => {
    setScreenState(prev => ({
      ...prev,
      selectedQuestions: new Set(),
      isMultiSelectMode: false,
    }));
  };

  const handleBulkBookmark = () => {
    if (screenState.selectedQuestions.size === 0) return;
    
    // Implement bulk bookmark logic
    Alert.alert(
      'Bookmark Questions',
      `Add ${screenState.selectedQuestions.size} questions to bookmarks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Bookmark',
          onPress: () => {
            // TODO: Implement actual bookmark logic
            console.log('Bookmarking questions:', Array.from(screenState.selectedQuestions));
            handleClearSelection();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  // Animated styles
  const summaryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: summaryOpacity.value,
    transform: [{ translateY: interpolate(summaryOpacity.value, [0, 1], [20, 0]) }],
  }));

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    if (!analysisData) return [];
    
    let filtered = analysisData.questions;
    
    // Apply status filter
    if (screenState.filterBy.status !== 'all') {
      filtered = filtered.filter(q => {
        switch (screenState.filterBy.status) {
          case 'correct': return q.isCorrect;
          case 'incorrect': return !q.isCorrect;
          case 'bookmarked': return q.isBookmarked;
          default: return true;
        }
      });
    }
    
    // Apply difficulty filter
    if (screenState.filterBy.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficultyLevel === screenState.filterBy.difficulty);
    }
    
    // Apply topic filter
    if (screenState.filterBy.topic !== 'all') {
      filtered = filtered.filter(q => q.topic === screenState.filterBy.topic);
    }
    
    // Apply search
    if (screenState.searchQuery) {
      const query = screenState.searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (screenState.sortBy) {
        case 'time':
          return b.timeSpent - a.timeSpent;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
          return difficultyOrder[a.difficultyLevel] - difficultyOrder[b.difficultyLevel];
        case 'accuracy':
          return Number(b.isCorrect) - Number(a.isCorrect);
        default:
          return 0; // Keep original order
      }
    });
    
    return filtered;
  }, [analysisData, screenState.filterBy, screenState.searchQuery, screenState.sortBy]);

  // Render tab content
  const renderTabContent = () => {
    if (!analysisData) return null;
    
    switch (screenState.currentTab) {
      case 'overview':
        return (
          <View style={styles.overviewTab}>
            <PerformanceSummary
              analysisData={analysisData}
              style={styles.overviewSummary}
            />
          </View>
        );
      case 'questions':
        return (
          <QuestionAnalysisList
            questions={filteredQuestions}
            expandedQuestions={screenState.expandedQuestions}
            selectedQuestions={screenState.selectedQuestions}
            isMultiSelectMode={screenState.isMultiSelectMode}
            onQuestionToggle={handleQuestionToggle}
            onMultiSelect={handleMultiSelect}
            onLongPress={(questionId) => {
              setScreenState(prev => ({ ...prev, isMultiSelectMode: true }));
              handleMultiSelect(questionId);
            }}
          />
        );
      case 'insights':
        return (
          <PerformanceInsights
            analysisData={analysisData}
          />
        );
      case 'teacher':
        return (
          <TeacherExplanations
            questions={analysisData.questions.filter(q => q.teacherExplanation)}
          />
        );
      case 'study-plan':
        return (
          <StudyPlanView
            studyPlan={analysisData.studyPlan}
            weakAreas={analysisData.subjectAnalysis.filter(s => s.masteryLevel === 'needs-practice')}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analyzing your performance...</Text>
      </View>
    );
  }

  if (error || !analysisData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={tokens.colors.error} />
        <Text style={styles.errorTitle}>Analysis Unavailable</Text>
        <Text style={styles.errorDescription}>
          {error || 'Unable to load exam analysis'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalysisData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <AnalysisHeader
          title={analysisData.examTitle}
          onBack={handleBack}
          onShare={() => {
            // TODO: Implement share functionality
          }}
          isMultiSelectMode={screenState.isMultiSelectMode}
          selectedCount={screenState.selectedQuestions.size}
          onClearSelection={handleClearSelection}
        />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <View style={styles.tabIndicatorContainer}>
            <Animated.View 
              style={[
                styles.tabIndicator,
                {
                  width: screenWidth / TABS.length,
                  transform: [{ translateX: tabTranslateX }],
                }
              ]}
            />
          </View>
          
          {TABS.map((tab, index) => {
            const isActive = tab.id === screenState.currentTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => handleTabChange(tab.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={isActive ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                />
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.primary}
            />
          }
        >
          {renderTabContent()}
          
          {/* Bottom spacing for floating toolbar */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Floating Bookmark Toolbar */}
        {screenState.isMultiSelectMode && (
          <FloatingBookmarkToolbar
            selectedCount={screenState.selectedQuestions.size}
            onBookmark={handleBulkBookmark}
            onCancel={handleClearSelection}
          />
        )}
      </View>
    </>
  );
}

// Mock data generator for development
async function generateMockAnalysisData(examId: string): Promise<ExamDetailedAnalysisData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockQuestions: DetailedQuestionAnalysis[] = Array.from({ length: 10 }, (_, i) => ({
    id: `q${i + 1}`,
    question: `What is the value of x in the equation ${i + 2}x + ${i + 5} = ${(i + 2) * 5 + (i + 5)}?`,
    options: [
      { text: `${i + 1}` },
      { text: `${i + 2}` },
      { text: `5` },
      { text: `${i + 3}` },
    ],
    selectedAnswer: Math.random() > 0.7 ? 2 : Math.floor(Math.random() * 4),
    correctAnswer: 2,
    isCorrect: Math.random() > 0.3,
    timeSpent: 60 + Math.random() * 120,
    averageTime: 90,
    timeEfficiency: Math.random() > 0.5 ? 'normal' : 'fast',
    difficultyLevel: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
    points: 10,
    pointsEarned: Math.random() > 0.3 ? 10 : 0,
    topic: ['Algebra', 'Geometry', 'Calculus'][Math.floor(Math.random() * 3)],
    subject: 'Mathematics',
    masteryLevel: ['proficient', 'developing', 'needs-practice'][Math.floor(Math.random() * 3)] as any,
    systemExplanation: {
      text: `To solve this equation, we need to isolate x by subtracting ${i + 5} from both sides and then dividing by ${i + 2}.`,
      steps: [
        {
          step: 1,
          description: `Subtract ${i + 5} from both sides`,
          formula: `${i + 2}x = ${(i + 2) * 5}`,
        },
        {
          step: 2,
          description: `Divide both sides by ${i + 2}`,
          formula: `x = 5`,
        },
      ],
      keyPoints: ['Linear equations', 'Isolation of variables', 'Order of operations'],
      relatedConcepts: ['Basic algebra', 'Equation solving'],
    },
    teacherExplanation: Math.random() > 0.5 ? {
      text: 'This is a fundamental linear equation problem. Remember to always perform the same operation on both sides.',
      videoUrl: 'https://example.com/video',
      videoDuration: 180,
      teacherProfile: {
        id: 't1',
        name: 'Dr. Sarah Johnson',
        specialization: ['Mathematics', 'Algebra'],
      },
    } : undefined,
    isBookmarked: Math.random() > 0.7,
    bookmarkTags: [],
    reviewStatus: 'not-reviewed',
  }));

  return {
    examId,
    examTitle: 'Mathematics Quiz - Algebra & Geometry',
    subject: 'Mathematics',
    topics: ['Algebra', 'Geometry'],
    difficulty: 'intermediate',
    totalQuestions: 10,
    correctAnswers: 7,
    totalScore: 70,
    maxScore: 100,
    percentage: 70,
    grade: 'B',
    timeSpent: 1800, // 30 minutes
    timeLimit: 2700, // 45 minutes
    questions: mockQuestions,
    subjectAnalysis: [
      {
        subject: 'Mathematics',
        topic: 'Algebra',
        questionsCount: 6,
        correctCount: 4,
        accuracy: 67,
        averageTime: 85,
        totalPoints: 60,
        pointsEarned: 40,
        masteryLevel: 'developing',
        strengths: ['Linear equations', 'Basic operations'],
        weaknesses: ['Complex equations', 'Word problems'],
        recommendations: [
          {
            type: 'practice',
            description: 'Practice more complex linear equations',
            priority: 'high',
            estimatedTime: 30,
          },
        ],
      },
    ],
    timeAnalysis: {
      totalTimeSpent: 1800,
      timeLimit: 2700,
      timeUtilization: 67,
      efficiency: 'good',
      timeByDifficulty: { easy: 300, medium: 900, hard: 600, expert: 0 },
      timeByAccuracy: { correct: 1100, incorrect: 700 },
      fastestQuestion: {
        id: 'q1',
        time: 45,
        question: 'What is 2 + 2?',
        wasCorrect: true,
      },
      slowestQuestion: {
        id: 'q5',
        time: 150,
        question: 'Solve the complex equation...',
        wasCorrect: false,
      },
      timePerQuestion: mockQuestions.map(q => ({
        questionId: q.id,
        timeSpent: q.timeSpent,
        percentage: (q.timeSpent / 1800) * 100,
        wasCorrect: q.isCorrect,
      })),
    },
    studyPlan: [
      {
        id: 'sp1',
        title: 'Review Algebra Fundamentals',
        description: 'Focus on areas where you struggled',
        priority: 'high',
        estimatedDuration: 45,
        type: 'review',
        topics: ['Linear equations', 'Quadratic equations'],
        difficulty: 'medium',
        resources: [],
        isCompleted: false,
      },
    ],
    achievements: ['Quick Starter', 'Algebra Apprentice'],
    insights: [
      {
        type: 'strength',
        title: 'Strong Foundation',
        description: 'You have a solid understanding of basic concepts',
      },
      {
        type: 'weakness',
        title: 'Time Management',
        description: 'Consider practicing with time limits',
        severity: 'warning',
      },
    ],
    analyzedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
  },
  
  loadingText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.md,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.xl,
  },
  
  errorTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  
  errorDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  
  retryButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
  },
  
  retryButtonText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
  },
  
  summary: {
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.sm, // Reduced spacing
    flexShrink: 0, // Prevent growing
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '30',
    position: 'relative',
    flexShrink: 0, // Ensure tabs always show
    minHeight: 70, // Increased height for better touch targets
    ...tokens.shadows.sm, // Add subtle shadow
  },
  
  tabIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  
  tabIndicator: {
    height: 3, // Slightly thicker for better visibility
    backgroundColor: tokens.colors.primary,
    borderRadius: 2, // Rounded indicator
  },
  
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
    marginHorizontal: 2, // Small spacing between tabs
    marginVertical: tokens.spacing.xs,
  },
  
  activeTab: {
    backgroundColor: tokens.colors.primary + '10', // Subtle background for active tab
  },
  
  tabLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
    fontWeight: '500', // Slightly bolder for better readability
  },
  
  activeTabLabel: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semiBold,
  },
  
  content: {
    flex: 1,
    minHeight: 200, // Ensure content area has minimum height
    backgroundColor: tokens.colors.background, // Ensure consistent background
  },
  
  bottomSpacing: {
    height: 100, // Space for floating toolbar
  },
  
  overviewTab: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    padding: tokens.spacing.lg, // Increased padding for better spacing
  },
  
  overviewSummary: {
    marginBottom: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
  },
});