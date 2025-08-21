import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { DetailedQuestionAnalysis } from '@/types/examAnalysis';
import { ExplanationTabs } from './ExplanationTabs';
import { formatDuration, formatTimeEfficiency } from '@/utils/timeFormat';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeableQuestionCardsProps {
  questions: DetailedQuestionAnalysis[];
  selectedQuestions: Set<string>;
  isMultiSelectMode: boolean;
  onMultiSelect: (questionId: string) => void;
  onLongPress: (questionId: string) => void;
  onBookmark: (questionId: string) => void;
}

interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  questions: DetailedQuestionAnalysis[];
  onQuestionSelect: (index: number) => void;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  totalQuestions,
  questions,
  onQuestionSelect,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createProgressStyles, themeContext);

  return (
    <View style={styles.progressContainer}>
      {/* Question Counter */}
      <Text style={styles.counterText}>
        Question {currentIndex + 1} of {totalQuestions}
      </Text>
      
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
};

interface FullScreenQuestionCardProps {
  question: DetailedQuestionAnalysis;
  index: number;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onMultiSelect: () => void;
  onLongPress: () => void;
  onBookmark: () => void;
}

const FullScreenQuestionCard: React.FC<FullScreenQuestionCardProps> = ({
  question,
  index,
  isSelected,
  isMultiSelectMode,
  onMultiSelect,
  onLongPress,
  onBookmark,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createCardStyles, themeContext);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return tokens.colors.success;
      case 'medium': return tokens.colors.warning;
      case 'hard': return '#FF6B35';
      case 'expert': return tokens.colors.error;
      default: return tokens.colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = () => {
    if (question.isCorrect) {
      return <Ionicons name="checkmark-circle" size={28} color="#059669" />;
    } else {
      return <Ionicons name="close-circle" size={28} color="#DC2626" />;
    }
  };


  const handleLongPress = () => {
    onLongPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleBookmark = () => {
    onBookmark();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView
      style={styles.cardContainer}
      showsVerticalScrollIndicator={false}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={[
        styles.card,
        isSelected && styles.selectedCard,
        question.isCorrect ? styles.correctCard : styles.incorrectCard
      ]}>
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.leftSection}>
            <View style={styles.questionNumberContainer}>
              <Text style={styles.questionNumberText}>
                Q{index + 1}
              </Text>
            </View>
            
            <View style={styles.statusIndicator}>
              {getStatusIcon()}
              <Text style={[
                styles.statusText,
                { color: question.isCorrect ? tokens.colors.success : tokens.colors.error }
              ]}>
                {question.isCorrect ? 'Correct' : 'Incorrect'}
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.badgeContainer}>
              {/* Points Badge */}
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsText}>
                  {question.pointsEarned}/{question.points}
                </Text>
              </View>

              {/* Difficulty Badge */}
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>
                  {question.difficultyLevel.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {isMultiSelectMode ? (
                <TouchableOpacity
                  onPress={onMultiSelect}
                  style={[styles.selectionCircle, isSelected && styles.selectedCircle]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={tokens.colors.onPrimary} />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleBookmark}
                  style={styles.bookmarkButton}
                >
                  <Ionicons
                    name={question.isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color={question.isBookmarked ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Topic & Subject */}
        <View style={styles.metaInfo}>
          <Text style={styles.topicText}>{question.topic}</Text>
          <Text style={styles.separatorDot}>•</Text>
          <Text style={styles.subjectText}>{question.subject}</Text>
        </View>

        {/* Question Text */}
        <Text style={styles.questionText}>
          {question.question}
        </Text>

        {/* Question Image */}
        {question.questionImage && (
          <Image
            source={{ uri: question.questionImage }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}

        {/* Answer Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Answer Options</Text>
          {question.options.map((option, optionIndex) => {
            const isSelectedAnswer = question.selectedAnswer === optionIndex;
            const isCorrectAnswer = question.correctAnswer === optionIndex;
            
            return (
              <View
                key={optionIndex}
                style={[
                  styles.option,
                  isSelectedAnswer && styles.selectedOption,
                  isCorrectAnswer && styles.correctOption,
                  isSelectedAnswer && !isCorrectAnswer && styles.incorrectOption,
                ]}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionBullet,
                    isSelectedAnswer && styles.selectedBullet,
                    isCorrectAnswer && styles.correctBullet,
                    isSelectedAnswer && !isCorrectAnswer && styles.incorrectBullet,
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      isSelectedAnswer && styles.selectedOptionLetter,
                      isCorrectAnswer && styles.correctOptionLetter,
                    ]}>
                      {String.fromCharCode(65 + optionIndex)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelectedAnswer && styles.selectedOptionText,
                  ]}>
                    {option.text}
                  </Text>
                </View>
                
                <View style={styles.resultIndicator}>
                  {isCorrectAnswer && (
                    <Ionicons name="checkmark" size={20} color="#059669" />
                  )}
                  {isSelectedAnswer && !isCorrectAnswer && (
                    <Ionicons name="close" size={20} color="#DC2626" />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={tokens.colors.primary} />
            <Text style={styles.statText}>{formatDuration(question.timeSpent)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons 
              name={formatTimeEfficiency(question.timeSpent, question.averageTime).icon as any} 
              size={16} 
              color={formatTimeEfficiency(question.timeSpent, question.averageTime).color} 
            />
            <Text style={[styles.statText, { 
              color: formatTimeEfficiency(question.timeSpent, question.averageTime).color 
            }]}>
              {formatTimeEfficiency(question.timeSpent, question.averageTime).description}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons 
              name={question.masteryLevel === 'mastered' ? 'trophy' : 
                   question.masteryLevel === 'proficient' ? 'ribbon' : 
                   question.masteryLevel === 'developing' ? 'school' : 'help-circle'} 
              size={16} 
              color={question.masteryLevel === 'mastered' ? tokens.colors.warning : 
                    question.masteryLevel === 'proficient' ? tokens.colors.success :
                    question.masteryLevel === 'developing' ? tokens.colors.primary : tokens.colors.onSurfaceVariant} 
            />
            <Text style={styles.statText}>
              {question.masteryLevel.replace('-', ' ')}
            </Text>
          </View>
        </View>

      </View>
      
      {/* Explanation Tabs - Combined System and Teacher explanations */}
      <ExplanationTabs
        question={question}
        style={styles.explanationCard}
      />
    </ScrollView>
  );
};

export const SwipeableQuestionCards: React.FC<SwipeableQuestionCardsProps> = ({
  questions,
  selectedQuestions,
  isMultiSelectMode,
  onMultiSelect,
  onLongPress,
  onBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createContainerStyles, themeContext);

  const handleScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum !== currentIndex && pageNum >= 0 && pageNum < questions.length) {
      setCurrentIndex(pageNum);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentIndex, questions.length]);

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const renderQuestion = useCallback(({ item, index }: { item: DetailedQuestionAnalysis; index: number }) => (
    <FullScreenQuestionCard
      question={item}
      index={index}
      isSelected={selectedQuestions.has(item.id)}
      isMultiSelectMode={isMultiSelectMode}
      onMultiSelect={() => onMultiSelect(item.id)}
      onLongPress={() => onLongPress(item.id)}
      onBookmark={() => onBookmark(item.id)}
    />
  ), [selectedQuestions, isMultiSelectMode, onMultiSelect, onLongPress, onBookmark]);

  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No Questions Found</Text>
        <Text style={styles.emptyDescription}>
          Try adjusting your filters to see more questions.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Section */}
      <QuestionProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        questions={questions}
        onQuestionSelect={handleQuestionSelect}
      />

      {/* Swipeable Cards */}
      <FlatList
        ref={flatListRef}
        data={questions}
        renderItem={renderQuestion}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        decelerationRate="fast"
        bounces={false}
        style={styles.flatList}
      />
    </View>
  );
};

const createContainerStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  
  flatList: {
    flex: 1,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  
  emptyTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  
  emptyDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
});

const createProgressStyles = (tokens: any) => StyleSheet.create({
  progressContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '30',
  },
  
  counterText: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: tokens.colors.outline + '30',
    borderRadius: 2,
    marginBottom: tokens.spacing.md,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: 2,
  },
});

const createCardStyles = (tokens: any) => StyleSheet.create({
  cardContainer: {
    width: screenWidth,
    flex: 1,
  },
  
  card: {
    margin: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surface,
    ...tokens.shadows.xl,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
  },
  
  correctCard: {
    backgroundColor: tokens.colors.surface,
    borderLeftWidth: 6,
    borderLeftColor: tokens.colors.success,
    borderColor: tokens.colors.success + '30',
  },
  
  incorrectCard: {
    backgroundColor: tokens.colors.surface,
    borderLeftWidth: 6,
    borderLeftColor: tokens.colors.error,
    borderColor: tokens.colors.error + '30',
  },
  
  selectedCard: {
    borderWidth: 3,
    borderColor: tokens.colors.primary,
    ...tokens.shadows.xl,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '20',
    backgroundColor: tokens.colors.surface,
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  questionNumberContainer: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    marginRight: tokens.spacing.lg,
    minWidth: 52,
    alignItems: 'center',
    backgroundColor: tokens.colors.primary + '15',
    borderWidth: 2,
    borderColor: tokens.colors.primary + '30',
  },
  
  questionNumberText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
    textAlign: 'center',
    color: tokens.colors.primary,
  },
  
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  
  statusText: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  
  badgeContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  
  pointsBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    minWidth: 54,
    alignItems: 'center',
    backgroundColor: tokens.colors.warning + '15',
    borderWidth: 1,
    borderColor: tokens.colors.warning + '40',
  },
  
  pointsText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    textAlign: 'center',
    color: tokens.colors.warning,
  },
  
  difficultyBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    minWidth: 64,
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant + '50',
    borderWidth: 1,
    borderColor: tokens.colors.outline + '40',
  },
  
  difficultyText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    color: tokens.colors.onSurfaceVariant,
  },
  
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  
  selectionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  selectedCircle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  
  bookmarkButton: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  
  topicText: {
    fontSize: tokens.typography.body,
    color: '#6B7280',
    fontWeight: tokens.typography.semiBold,
  },
  
  separatorDot: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginHorizontal: tokens.spacing.xs,
  },
  
  subjectText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },
  
  questionText: {
    fontSize: tokens.typography.title,
    color: tokens.colors.onSurface,
    lineHeight: 30,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.xl,
    fontWeight: tokens.typography.semiBold,
    letterSpacing: 0.2,
  },
  
  questionImage: {
    width: '100%',
    height: 220,
    marginBottom: tokens.spacing.lg,
  },
  
  optionsSection: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: '#1F2937',
    marginBottom: tokens.spacing.md,
  },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: tokens.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  selectedOption: {
    borderColor: '#374151',
    backgroundColor: 'rgba(55, 65, 81, 0.1)',
  },
  
  correctOption: {
    borderColor: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  
  incorrectOption: {
    borderColor: '#DC2626',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  optionBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  selectedBullet: {
    backgroundColor: '#FFFFFF',
  },
  
  correctBullet: {
    backgroundColor: '#FFFFFF',
  },
  
  incorrectBullet: {
    backgroundColor: '#FFFFFF',
  },
  
  optionLetter: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
    color: '#374151',
  },
  
  selectedOptionLetter: {
    color: '#000000',
  },
  
  correctOptionLetter: {
    color: '#000000',
  },
  
  optionText: {
    fontSize: tokens.typography.body,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  
  selectedOptionText: {
    fontWeight: tokens.typography.bold,
    color: '#1F2937',
  },
  
  resultIndicator: {
    marginLeft: tokens.spacing.sm,
    width: 24,
    alignItems: 'center',
  },
  
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '20',
    gap: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant + '30',
    marginHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    flex: 1,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
  },
  
  statText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurface,
    fontWeight: tokens.typography.semiBold,
    flexShrink: 1,
  },
  
  explanationCard: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  
  explanationPanel: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  
  teacherPanel: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
});