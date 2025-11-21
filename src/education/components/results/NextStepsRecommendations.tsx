import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { PerformanceLevel } from '../../utils/celebrationSystem';

const { width: screenWidth } = Dimensions.get('window');

// Recommendation types and priorities
export type RecommendationType = 
  | 'practice' 
  | 'review' 
  | 'advance' 
  | 'retake' 
  | 'study' 
  | 'challenge' 
  | 'social' 
  | 'schedule';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  priority: RecommendationPriority;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  xpReward?: number;
  action: {
    label: string;
    route?: string;
    params?: any;
    external?: boolean;
  };
  tags?: string[];
  progress?: {
    current: number;
    total: number;
  };
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    title: string;
    completed: boolean;
    current?: boolean;
  }>;
  progress: number;
  estimatedCompletion: string;
}

export interface NextStepsData {
  performanceLevel: PerformanceLevel;
  examSubject: string;
  examScore: number;
  weakTopics: string[];
  strongTopics: string[];
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  level: number;
  xp: number;
  nextLevelXP: number;
  recommendations: Recommendation[];
  learningPaths?: LearningPath[];
  upcomingDeadlines?: Array<{
    title: string;
    date: string;
    type: 'exam' | 'assignment' | 'quiz';
  }>;
}

interface NextStepsRecommendationsProps {
  data: NextStepsData;
  onRecommendationTap: (recommendation: Recommendation) => void;
  onLearningPathTap?: (path: LearningPath) => void;
  onViewAll?: () => void;
}

// Individual Recommendation Card
const RecommendationCard = ({ 
  recommendation, 
  index,
  onTap 
}: { 
  recommendation: Recommendation; 
  index: number;
  onTap: (rec: Recommendation) => void;
}) => {
  const { tokens } = useEducationTheme();
  
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 400 })
    );
    cardScale.value = withDelay(
      index * 100,
      withSpring(1, { tension: 100, friction: 8 })
    );
  }, [index]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const getTypeColor = (type: RecommendationType) => {
    switch (type) {
      case 'practice': return '#10B981';
      case 'review': return '#6366F1';
      case 'advance': return '#8B5CF6';
      case 'retake': return '#F59E0B';
      case 'study': return '#3B82F6';
      case 'challenge': return '#EF4444';
      case 'social': return '#EC4899';
      case 'schedule': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const priorityColor = getPriorityColor(recommendation.priority);
  const typeColor = getTypeColor(recommendation.type);

  return (
    <Animated.View style={[cardAnimatedStyle]}>
      <TouchableOpacity
        style={[styles.recommendationCard, { borderLeftColor: priorityColor }]}
        onPress={() => onTap(recommendation)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${typeColor}15` }]}>
              <Ionicons name={recommendation.icon} size={24} color={typeColor} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{recommendation.title}</Text>
              <View style={styles.cardMeta}>
                <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}15` }]}>
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {recommendation.priority}
                  </Text>
                </View>
                {recommendation.estimatedTime && (
                  <View style={styles.timeBadge}>
                    <Ionicons name="time" size={12} color="#6B7280" />
                    <Text style={styles.timeText}>{recommendation.estimatedTime}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.cardDescription}>{recommendation.description}</Text>

          {/* Progress (if applicable) */}
          {recommendation.progress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(recommendation.progress.current / recommendation.progress.total) * 100}%`,
                      backgroundColor: typeColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {recommendation.progress.current}/{recommendation.progress.total} completed
              </Text>
            </View>
          )}

          {/* Tags */}
          {recommendation.tags && recommendation.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recommendation.tags.slice(0, 3).map((tag, tagIndex) => (
                <View key={tagIndex} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {recommendation.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{recommendation.tags.length - 3}</Text>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.cardFooterLeft}>
              {recommendation.xpReward && (
                <View style={styles.xpBadge}>
                  <Ionicons name="flash" size={12} color="#F59E0B" />
                  <Text style={styles.xpText}>+{recommendation.xpReward} XP</Text>
                </View>
              )}
              {recommendation.difficulty && (
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{recommendation.difficulty}</Text>
                </View>
              )}
            </View>
            <View style={styles.actionButton}>
              <Text style={[styles.actionText, { color: typeColor }]}>
                {recommendation.action.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={typeColor} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Learning Path Card
const LearningPathCard = ({ 
  path, 
  onTap 
}: { 
  path: LearningPath; 
  onTap?: (path: LearningPath) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.learningPathCard}
      onPress={() => onTap?.(path)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.pathGradient}
      >
        <View style={styles.pathHeader}>
          <Text style={styles.pathTitle}>{path.name}</Text>
          <Text style={styles.pathCompletion}>{Math.round(path.progress)}% complete</Text>
        </View>
        <Text style={styles.pathDescription}>{path.description}</Text>
        
        {/* Progress Steps */}
        <View style={styles.pathSteps}>
          {path.steps.slice(0, 4).map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={[
                styles.stepIndicator,
                step.completed && styles.completedStep,
                step.current && styles.currentStep,
              ]}>
                {step.completed ? (
                  <Ionicons name="checkmark" size={12} color="white" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepText, step.completed && styles.completedStepText]}>
                {step.title}
              </Text>
            </View>
          ))}
          {path.steps.length > 4 && (
            <Text style={styles.moreStepsText}>+{path.steps.length - 4} more steps</Text>
          )}
        </View>

        <View style={styles.pathFooter}>
          <Text style={styles.estimatedTime}>~{path.estimatedCompletion}</Text>
          <View style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={14} color="white" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Main Component
export const NextStepsRecommendations: React.FC<NextStepsRecommendationsProps> = ({
  data,
  onRecommendationTap,
  onLearningPathTap,
  onViewAll,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | RecommendationType>('all');
  
  const containerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.9);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 300 });
    headerScale.value = withSpring(1, { tension: 100, friction: 8 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const getPerformanceMessage = () => {
    switch (data.performanceLevel) {
      case 'epic':
        return 'Outstanding performance! Ready for the next challenge?';
      case 'great':
        return 'Great job! Let\'s build on this momentum!';
      case 'good':
        return 'Good progress! Here\'s how to improve further:';
      default:
        return 'Every step counts! Let\'s focus on growth:';
    }
  };

  const getPerformanceColor = () => {
    switch (data.performanceLevel) {
      case 'epic': return '#10B981';
      case 'great': return '#3B82F6';
      case 'good': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // Filter recommendations
  const filteredRecommendations = selectedCategory === 'all' 
    ? data.recommendations 
    : data.recommendations.filter(rec => rec.type === selectedCategory);

  // Sort by priority
  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const categories = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'practice', label: 'Practice', icon: 'fitness' },
    { key: 'review', label: 'Review', icon: 'book' },
    { key: 'advance', label: 'Advance', icon: 'trending-up' },
    { key: 'challenge', label: 'Challenge', icon: 'flash' },
  ] as const;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Your Next Steps</Text>
        <Text style={[styles.headerSubtitle, { color: getPerformanceColor() }]}>
          {getPerformanceMessage()}
        </Text>
      </Animated.View>

      {/* Progress Overview */}
      <View style={styles.progressOverview}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{data.level}</Text>
          <Text style={styles.progressLabel}>Level</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{data.xp}</Text>
          <Text style={styles.progressLabel}>XP</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{data.currentStreak}</Text>
          <Text style={styles.progressLabel}>Streak</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{Math.round((data.weeklyProgress / data.weeklyGoal) * 100)}%</Text>
          <Text style={styles.progressLabel}>Weekly Goal</Text>
        </View>
      </View>

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.key as any)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.key ? tokens.colors.primary : '#6B7280'} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  { color: selectedCategory === category.key ? tokens.colors.primary : '#6B7280' }
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Learning Paths (if available) */}
        {data.learningPaths && data.learningPaths.length > 0 && selectedCategory === 'all' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Recommended Learning Paths</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.learningPathsContainer}>
                {data.learningPaths.slice(0, 3).map((path, index) => (
                  <LearningPathCard
                    key={path.id}
                    path={path}
                    onTap={onLearningPathTap}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💡 Personalized Recommendations</Text>
            {onViewAll && (
              <TouchableOpacity onPress={onViewAll}>
                <Text style={[styles.viewAllText, { color: tokens.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.recommendationsContainer}>
            {sortedRecommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                index={index}
                onTap={onRecommendationTap}
              />
            ))}
          </View>

          {sortedRecommendations.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
              <Text style={styles.emptyStateText}>
                No {selectedCategory !== 'all' ? selectedCategory : ''} recommendations at the moment.
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Deadlines */}
        {data.upcomingDeadlines && data.upcomingDeadlines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Upcoming Deadlines</Text>
            <View style={styles.deadlinesContainer}>
              {data.upcomingDeadlines.map((deadline, index) => (
                <View key={index} style={styles.deadlineItem}>
                  <View style={styles.deadlineIcon}>
                    <Ionicons 
                      name={deadline.type === 'exam' ? 'document-text' : 
                           deadline.type === 'assignment' ? 'create' : 'help-circle'} 
                      size={16} 
                      color="#EF4444" 
                    />
                  </View>
                  <View style={styles.deadlineContent}>
                    <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                    <Text style={styles.deadlineDate}>{deadline.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  progressOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  activeCategoryButton: {
    backgroundColor: '#F0F4FF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Learning Paths
  learningPathsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  learningPathCard: {
    width: screenWidth * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  pathGradient: {
    padding: 20,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  pathCompletion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  pathDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  pathSteps: {
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  stepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#10B981',
  },
  currentStep: {
    backgroundColor: '#F59E0B',
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  stepText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  completedStepText: {
    textDecorationLine: 'line-through',
  },
  moreStepsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  pathFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatedTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  continueText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  // Recommendations
  recommendationsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  difficultyBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Deadlines
  deadlinesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    gap: 12,
  },
  deadlineIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  deadlineDate: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 2,
  },
});