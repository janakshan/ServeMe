import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
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
import { SystemExplanationPanel } from './SystemExplanationPanel';
import { TeacherExplanationCard } from './TeacherExplanationCard';

interface QuestionAnalysisListProps {
  questions: DetailedQuestionAnalysis[];
  expandedQuestions: Set<string>;
  selectedQuestions: Set<string>;
  isMultiSelectMode: boolean;
  onQuestionToggle: (questionId: string) => void;
  onMultiSelect: (questionId: string) => void;
  onLongPress: (questionId: string) => void;
}

interface QuestionCardProps {
  question: DetailedQuestionAnalysis;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onToggle: () => void;
  onMultiSelect: () => void;
  onLongPress: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isExpanded,
  isSelected,
  isMultiSelectMode,
  onToggle,
  onMultiSelect,
  onLongPress,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createQuestionCardStyles, themeContext);

  // Animation values
  const expandHeight = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const selectionScale = useSharedValue(1);

  React.useEffect(() => {
    expandHeight.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    rotateValue.value = withTiming(isExpanded ? 180 : 0, { duration: 300 });
  }, [isExpanded]);

  React.useEffect(() => {
    selectionScale.value = withSpring(isSelected ? 0.95 : 1, {
      tension: 300,
      friction: 20,
    });
  }, [isSelected]);

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: expandHeight.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectionScale.value }],
  }));

  const handlePress = () => {
    if (isMultiSelectMode) {
      onMultiSelect();
    } else {
      onToggle();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLongPress = () => {
    if (!isMultiSelectMode) {
      onLongPress();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleBookmarkToggle = () => {
    // TODO: Implement bookmark toggle
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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
      return <Ionicons name="checkmark-circle" size={24} color={tokens.colors.success} />;
    } else {
      return <Ionicons name="close-circle" size={24} color={tokens.colors.error} />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <View style={[
        styles.card,
        isSelected && styles.selectedCard,
        question.isCorrect ? styles.correctCard : styles.incorrectCard
      ]}>
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={styles.cardPressable}
        >
          {/* Enhanced Header */}
          <View style={styles.cardHeader}>
            {/* Left Section - Question Number & Status */}
            <View style={styles.leftSection}>
              <View style={[
                styles.questionNumberContainer,
                { backgroundColor: question.isCorrect ? tokens.colors.success + '15' : tokens.colors.error + '15' }
              ]}>
                <Text style={[
                  styles.questionNumberText,
                  { color: question.isCorrect ? tokens.colors.success : tokens.colors.error }
                ]}>
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

            {/* Right Section - Badges & Actions */}
            <View style={styles.rightSection}>
              <View style={styles.badgeContainer}>
                {/* Points Badge */}
                <View style={[styles.pointsBadge, {
                  backgroundColor: question.isCorrect ? tokens.colors.success + '15' : tokens.colors.error + '15'
                }]}>
                  <Text style={[styles.pointsText, {
                    color: question.isCorrect ? tokens.colors.success : tokens.colors.error
                  }]}>
                    {question.pointsEarned}/{question.points}
                  </Text>
                </View>

                {/* Difficulty Badge */}
                <View style={[styles.difficultyBadge, { 
                  backgroundColor: getDifficultyColor(question.difficultyLevel) + '15' 
                }]}>
                  <Text style={[styles.difficultyText, { 
                    color: getDifficultyColor(question.difficultyLevel) 
                  }]}>
                    {question.difficultyLevel.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {isMultiSelectMode ? (
                  <View style={[styles.selectionCircle, isSelected && styles.selectedCircle]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color={tokens.colors.onPrimary} />
                    )}
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleBookmarkToggle}
                      style={styles.bookmarkButton}
                    >
                      <Ionicons
                        name={question.isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={18}
                        color={question.isBookmarked ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                      />
                    </TouchableOpacity>
                    
                    <Animated.View style={[styles.expandButton, chevronStyle]}>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={tokens.colors.onSurfaceVariant}
                      />
                    </Animated.View>
                  </>
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
          <Text style={styles.questionText} numberOfLines={isExpanded ? undefined : 2}>
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

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.statText}>{formatTime(question.timeSpent)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons 
                name={question.timeEfficiency === 'fast' ? 'flash' : 
                     question.timeEfficiency === 'slow' ? 'hourglass' : 'speedometer'} 
                size={16} 
                color={question.timeEfficiency === 'fast' ? tokens.colors.success : 
                       question.timeEfficiency === 'slow' ? tokens.colors.warning : 
                       tokens.colors.onSurfaceVariant} 
              />
              <Text style={styles.statText}>
                {question.timeEfficiency} pace
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons 
                name={question.masteryLevel === 'mastered' ? 'trophy' : 
                     question.masteryLevel === 'proficient' ? 'ribbon' : 
                     question.masteryLevel === 'developing' ? 'school' : 'help-circle'} 
                size={16} 
                color={tokens.colors.onSurfaceVariant} 
              />
              <Text style={styles.statText}>
                {question.masteryLevel.replace('-', ' ')}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Expanded Content */}
        {isExpanded && (
          <Animated.View style={[styles.expandedContent, expandedStyle]}>
            <View style={styles.expandedInner}>
              {/* Answer Options */}
              <View style={styles.optionsSection}>
                <Text style={styles.sectionTitle}>Answer Options</Text>
                {question.options.map((option, index) => {
                const isSelected = question.selectedAnswer === index;
                const isCorrect = question.correctAnswer === index;
                const showResult = true; // In analysis mode, always show results
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                      showResult && isCorrect && styles.correctOption,
                      showResult && isSelected && !isCorrect && styles.incorrectOption,
                    ]}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionBullet,
                        isSelected && styles.selectedBullet,
                        showResult && isCorrect && styles.correctBullet,
                        showResult && isSelected && !isCorrect && styles.incorrectBullet,
                      ]}>
                        <Text style={[
                          styles.optionLetter,
                          isSelected && styles.selectedOptionLetter,
                          showResult && isCorrect && styles.correctOptionLetter,
                        ]}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}>
                        {option.text}
                      </Text>
                    </View>
                    
                    {showResult && (
                      <View style={styles.resultIndicator}>
                        {isCorrect && (
                          <Ionicons name="checkmark" size={20} color={tokens.colors.success} />
                        )}
                        {isSelected && !isCorrect && (
                          <Ionicons name="close" size={20} color={tokens.colors.error} />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* System Explanation */}
            <SystemExplanationPanel
              explanation={question.systemExplanation}
              style={styles.explanationPanel}
            />

            {/* Teacher Explanation */}
            {question.teacherExplanation && (
              <TeacherExplanationCard
                explanation={question.teacherExplanation}
                style={styles.teacherPanel}
              />
            )}
          </View>
        </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

export const QuestionAnalysisList: React.FC<QuestionAnalysisListProps> = ({
  questions,
  expandedQuestions,
  selectedQuestions,
  isMultiSelectMode,
  onQuestionToggle,
  onMultiSelect,
  onLongPress,
}) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createListStyles, themeContext);

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
    <View style={styles.list}>
      <View style={styles.listContent}>
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isExpanded={expandedQuestions.has(question.id)}
            isSelected={selectedQuestions.has(question.id)}
            isMultiSelectMode={isMultiSelectMode}
            onToggle={() => onQuestionToggle(question.id)}
            onMultiSelect={() => onMultiSelect(question.id)}
            onLongPress={() => onLongPress(question.id)}
          />
        ))}
      </View>
    </View>
  );
};

const createListStyles = (tokens: any) => StyleSheet.create({
  list: {
    flex: 1,
  },
  
  listContent: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
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

const createQuestionCardStyles = (tokens: any) => StyleSheet.create({
  cardContainer: {
    marginBottom: tokens.spacing.md,
  },
  
  card: {
    backgroundColor: tokens.colors.surfaceVariant + '80',
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '50',
    overflow: 'hidden',
    ...tokens.shadows.md,
  },
  
  correctCard: {
    borderColor: tokens.colors.success + '60',
    backgroundColor: tokens.colors.success + '12',
  },
  
  incorrectCard: {
    borderColor: tokens.colors.error + '60',
    backgroundColor: tokens.colors.error + '12',
  },
  
  selectedCard: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '15',
    ...tokens.shadows.lg,
  },
  
  cardPressable: {
    padding: tokens.spacing.lg,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  questionNumberContainer: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    marginRight: tokens.spacing.md,
    minWidth: 40,
    alignItems: 'center',
  },
  
  questionNumberText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    textAlign: 'center',
  },
  
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  
  statusText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
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
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    minWidth: 45,
    alignItems: 'center',
  },
  
  pointsText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    textAlign: 'center',
  },
  
  difficultyBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    minWidth: 50,
    alignItems: 'center',
  },
  
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedCircle: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  
  bookmarkButton: {
    padding: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  
  expandButton: {
    padding: tokens.spacing.xs,
  },
  
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  
  topicText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: tokens.typography.semiBold,
  },
  
  separatorDot: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginHorizontal: tokens.spacing.xs,
  },
  
  subjectText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  questionText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 24,
    marginBottom: tokens.spacing.md,
    fontWeight: '500',
  },
  
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.md,
  },
  
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '40',
    gap: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant + '30',
    marginHorizontal: -tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    marginBottom: -tokens.spacing.lg,
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    flex: 1,
  },
  
  statText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  
  expandedContent: {
    paddingTop: tokens.spacing.sm,
  },
  
  expandedInner: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
  },
  
  optionsSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    marginBottom: tokens.spacing.sm,
  },
  
  selectedOption: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '10',
  },
  
  correctOption: {
    borderColor: tokens.colors.success,
    backgroundColor: tokens.colors.success + '10',
  },
  
  incorrectOption: {
    borderColor: tokens.colors.error,
    backgroundColor: tokens.colors.error + '10',
  },
  
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  
  selectedBullet: {
    backgroundColor: tokens.colors.primary,
  },
  
  correctBullet: {
    backgroundColor: tokens.colors.success,
  },
  
  incorrectBullet: {
    backgroundColor: tokens.colors.error,
  },
  
  optionLetter: {
    fontSize: tokens.typography.caption,
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
  },
  
  selectedOptionText: {
    fontWeight: tokens.typography.semiBold,
  },
  
  resultIndicator: {
    marginLeft: tokens.spacing.sm,
  },
  
  explanationPanel: {
    marginBottom: tokens.spacing.lg,
  },
  
  teacherPanel: {
    marginBottom: tokens.spacing.lg,
  },
});