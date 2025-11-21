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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
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
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  totalQuestions,
}) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createProgressStyles, themeContext);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.counterText}>
        Question {currentIndex + 1} of {totalQuestions}
      </Text>
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

  const getStatusIcon = () => {
    if (question.isCorrect) {
      return <Ionicons name="checkmark-circle" size={28} color={tokens.colors.success} />;
    } else {
      return <Ionicons name="close-circle" size={28} color={tokens.colors.error} />;
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
    >
      <View style={[
        styles.card,
        isSelected && styles.selectedCard,
        question.isCorrect ? styles.correctCard : styles.incorrectCard
      ]}>
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
                <View style={styles.pointsBadge}>
                <Text style={styles.pointsText}>
                  {question.pointsEarned}/{question.points}
                </Text>
              </View>

              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>
                  {question.difficultyLevel.toUpperCase()}
                </Text>
              </View>
            </View>

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

        <View style={styles.metaInfo}>
          <Text style={styles.topicText}>{question.topic}</Text>
          <Text style={styles.separatorDot}>•</Text>
          <Text style={styles.subjectText}>{question.subject}</Text>
        </View>

        <Text style={styles.questionText}>
          {question.question}
        </Text>

        {question.questionImage && (
          <Image
            source={{ uri: question.questionImage }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}

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
                    <Ionicons name="checkmark" size={20} color={tokens.colors.success} />
                  )}
                  {isSelectedAnswer && !isCorrectAnswer && (
                    <Ionicons name="close" size={20} color={tokens.colors.error} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

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
        getItemLayout={(_, index) => ({
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
    paddingHorizontal: tokens.spacing.lg,
  },
  
  emptyTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
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
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '30',
  },
  
  counterText: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: tokens.colors.outline + '30',
    borderRadius: 2,
    marginBottom: tokens.spacing.sm,
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
    margin: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surface,
    ...tokens.shadows.md,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '20',
    backgroundColor: tokens.colors.surface,
    minHeight: 68,
  },
  
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    gap: tokens.spacing.xs,
  },
  
  questionNumberContainer: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    marginRight: tokens.spacing.sm,
    minWidth: 44,
    alignItems: 'center',
    backgroundColor: tokens.colors.primary + '15',
    borderWidth: 1.5,
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
    gap: tokens.spacing.xs,
  },
  
  statusText: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: tokens.spacing.xs,
    marginLeft: tokens.spacing.sm,
  },
  
  badgeContainer: {
    flexDirection: 'column',
    gap: tokens.spacing.xs,
    alignItems: 'flex-end',
  },
  
  pointsBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    minWidth: 48,
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
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    minWidth: 56,
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
    gap: tokens.spacing.xs,
  },
  
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: tokens.colors.outline + '50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface + '10',
  },
  
  selectedCircle: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  
  bookmarkButton: {
    padding: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.surface + '10',
  },
  
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    gap: tokens.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '15',
  },
  
  topicText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: tokens.typography.semiBold,
  },
  
  separatorDot: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginHorizontal: 4,
  },
  
  subjectText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },
  
  questionText: {
    fontSize: tokens.typography.title,
    color: tokens.colors.onSurface,
    lineHeight: 26,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
    fontWeight: tokens.typography.semiBold,
    letterSpacing: 0.1,
  },
  
  questionImage: {
    width: '100%',
    height: 180,
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    alignSelf: 'center',
  },
  
  optionsSection: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
    letterSpacing: 0.2,
  },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '30',
    marginBottom: tokens.spacing.sm,
    backgroundColor: tokens.colors.surface,
    ...tokens.shadows.sm,
  },
  
  selectedOption: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '10',
    borderWidth: 2,
  },
  
  correctOption: {
    borderColor: tokens.colors.success,
    backgroundColor: tokens.colors.success + '10',
    borderWidth: 2,
  },
  
  incorrectOption: {
    borderColor: tokens.colors.error,
    backgroundColor: tokens.colors.error + '10',
    borderWidth: 2,
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
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '40',
    ...tokens.shadows.sm,
  },
  
  selectedBullet: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  
  correctBullet: {
    backgroundColor: tokens.colors.success,
    borderColor: tokens.colors.success,
  },
  
  incorrectBullet: {
    backgroundColor: tokens.colors.error,
    borderColor: tokens.colors.error,
  },
  
  optionLetter: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurfaceVariant,
  },
  
  selectedOptionLetter: {
    color: tokens.colors.onPrimary,
  },
  
  correctOptionLetter: {
    color: tokens.colors.onPrimary,
  },
  
  optionText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    flex: 1,
    lineHeight: 28,
    fontWeight: tokens.typography.medium,
    letterSpacing: 0.1,
  },
  
  selectedOptionText: {
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  resultIndicator: {
    marginLeft: tokens.spacing.xs,
    width: 20,
    alignItems: 'center',
  },
  
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '15',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surfaceVariant + '20',
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '15',
  },
  
  statItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    flex: 1,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
    ...tokens.shadows.sm,
  },
  
  statText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurface,
    fontWeight: tokens.typography.semiBold,
    textAlign: 'center',
    lineHeight: 14,
  },
  
  explanationCard: {
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
});