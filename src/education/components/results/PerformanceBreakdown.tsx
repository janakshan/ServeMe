import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

const { width: screenWidth } = Dimensions.get('window');

interface QuestionAnalysis {
  id: string;
  question: string;
  questionImage?: string;
  selectedAnswer: number;
  correctAnswer: number;
  options: Array<{ text: string; image?: string }>;
  isCorrect: boolean;
  timeSpent: number;
  averageTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  points: number;
  explanation: string;
  topic: string;
  masteryLevel: 'needs-practice' | 'developing' | 'proficient' | 'mastered';
}

interface SubjectAnalysis {
  topic: string;
  questionsCount: number;
  correctCount: number;
  accuracy: number;
  averageTime: number;
  masteryLevel: 'needs-practice' | 'developing' | 'proficient' | 'mastered';
  recommendations: string[];
}

interface TimeAnalysis {
  totalTime: number;
  timeLimit: number;
  efficiency: 'excellent' | 'good' | 'needs-improvement';
  fastestQuestion: { id: string; time: number; question: string };
  slowestQuestion: { id: string; time: number; question: string };
  timeDistribution: Array<{ questionId: string; time: number; percentage: number }>;
}

interface PerformanceBreakdownProps {
  examId: string;
  examTitle: string;
  questions: QuestionAnalysis[];
  subjectAnalysis: SubjectAnalysis[];
  timeAnalysis: TimeAnalysis;
  overallAccuracy: number;
  classAverage?: number;
  previousAttempts?: Array<{ date: string; score: number }>;
  onClose: () => void;
}

// Animated Progress Ring Component
const AnimatedProgressRing = ({ 
  progress, 
  size = 60, 
  strokeWidth = 6, 
  color = '#6A1B9A',
  delay = 0 
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  delay?: number;
}) => {
  const progressAnim = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    progressAnim.value = withDelay(
      delay,
      withTiming(progress, { duration: 1500, easing: Easing.out(Easing.cubic) })
    );
  }, [progress, delay]);

  const animatedProps = useAnimatedStyle(() => ({
    strokeDashoffset: circumference - (progressAnim.value * circumference),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Animated.View style={animatedProps}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Animated.View>
      </svg>
      <View style={[styles.progressCenter, { width: size, height: size }]}>
        <Text style={[styles.progressText, { color }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
};

// Question Analysis Card Component
const QuestionAnalysisCard = ({ 
  question, 
  index 
}: { 
  question: QuestionAnalysis; 
  index: number;
}) => {
  const { tokens } = useEducationTheme();
  const [expanded, setExpanded] = useState(false);
  
  const cardScale = useSharedValue(0.95);
  const contentHeight = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withDelay(
      index * 100,
      withSpring(1, { tension: 100, friction: 8 })
    );
  }, [index]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const expandedAnimatedStyle = useAnimatedStyle(() => ({
    height: expanded ? 'auto' : 0,
    opacity: expanded ? 1 : 0,
  }));

  const getStatusIcon = () => {
    if (question.isCorrect) {
      return <Ionicons name="checkmark-circle" size={24} color="#10B981" />;
    }
    return <Ionicons name="close-circle" size={24} color="#EF4444" />;
  };

  const getStatusColor = () => {
    return question.isCorrect ? '#10B981' : '#EF4444';
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered': return '#10B981';
      case 'proficient': return '#3B82F6';
      case 'developing': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  return (
    <Animated.View style={[styles.questionCard, cardAnimatedStyle]}>
      <TouchableOpacity 
        style={styles.questionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.questionHeaderLeft}>
          <View style={[styles.questionNumber, { borderColor: getStatusColor() }]}>
            <Text style={[styles.questionNumberText, { color: getStatusColor() }]}>
              {index + 1}
            </Text>
          </View>
          <View style={styles.questionHeaderText}>
            <Text style={styles.questionTitle} numberOfLines={2}>
              {question.question}
            </Text>
            <View style={styles.questionMeta}>
              <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(question.difficultyLevel)}15` }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(question.difficultyLevel) }]}>
                  {question.difficultyLevel}
                </Text>
              </View>
              <Text style={styles.topicText}>{question.topic}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.questionHeaderRight}>
          {getStatusIcon()}
          <Text style={[styles.pointsText, { color: getStatusColor() }]}>
            {question.isCorrect ? `+${question.points}` : '0'} pts
          </Text>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={tokens.colors.onSurfaceVariant} 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.questionDetails, expandedAnimatedStyle]}>
          {question.questionImage && (
            <Image 
              source={{ uri: question.questionImage }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}

          {/* Answer Analysis */}
          <View style={styles.answerAnalysis}>
            <Text style={styles.analysisTitle}>Answer Analysis</Text>
            <View style={styles.answersGrid}>
              {question.options.map((option, optionIndex) => (
                <View 
                  key={optionIndex}
                  style={[
                    styles.answerOption,
                    optionIndex === question.correctAnswer && styles.correctAnswer,
                    optionIndex === question.selectedAnswer && !question.isCorrect && styles.wrongAnswer,
                    optionIndex === question.selectedAnswer && question.isCorrect && styles.selectedCorrect,
                  ]}
                >
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + optionIndex)}
                  </Text>
                  <Text style={styles.optionText}>{option.text}</Text>
                  {optionIndex === question.correctAnswer && (
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                  )}
                  {optionIndex === question.selectedAnswer && !question.isCorrect && (
                    <Ionicons name="close" size={16} color="#EF4444" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.performanceMetrics}>
            <View style={styles.metric}>
              <Ionicons name="time" size={16} color="#6B7280" />
              <Text style={styles.metricLabel}>Time Spent</Text>
              <Text style={styles.metricValue}>{question.timeSpent}s</Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="people" size={16} color="#6B7280" />
              <Text style={styles.metricLabel}>Avg Time</Text>
              <Text style={styles.metricValue}>{question.averageTime}s</Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="trending-up" size={16} color={getMasteryColor(question.masteryLevel)} />
              <Text style={styles.metricLabel}>Mastery</Text>
              <Text style={[styles.metricValue, { color: getMasteryColor(question.masteryLevel) }]}>
                {question.masteryLevel.replace('-', ' ')}
              </Text>
            </View>
          </View>

          {/* Explanation */}
          {question.explanation && (
            <View style={styles.explanation}>
              <Text style={styles.explanationTitle}>💡 Explanation</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Subject Analysis Component
const SubjectAnalysisCard = ({ analysis }: { analysis: SubjectAnalysis }) => {
  const { tokens } = useEducationTheme();
  
  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered': return '#10B981';
      case 'proficient': return '#3B82F6';
      case 'developing': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle}>{analysis.topic}</Text>
        <View style={styles.subjectAccuracy}>
          <AnimatedProgressRing 
            progress={analysis.accuracy / 100}
            size={50}
            strokeWidth={4}
            color={getMasteryColor(analysis.masteryLevel)}
          />
        </View>
      </View>
      
      <View style={styles.subjectStats}>
        <View style={styles.subjectStat}>
          <Text style={styles.subjectStatValue}>{analysis.correctCount}/{analysis.questionsCount}</Text>
          <Text style={styles.subjectStatLabel}>Correct</Text>
        </View>
        <View style={styles.subjectStat}>
          <Text style={styles.subjectStatValue}>{analysis.averageTime}s</Text>
          <Text style={styles.subjectStatLabel}>Avg Time</Text>
        </View>
        <View style={styles.subjectStat}>
          <Text style={[styles.subjectStatValue, { color: getMasteryColor(analysis.masteryLevel) }]}>
            {analysis.masteryLevel.replace('-', ' ')}
          </Text>
          <Text style={styles.subjectStatLabel}>Level</Text>
        </View>
      </View>

      {analysis.recommendations.length > 0 && (
        <View style={styles.recommendations}>
          <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <Text key={index} style={styles.recommendationItem}>
              • {recommendation}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export const PerformanceBreakdown: React.FC<PerformanceBreakdownProps> = ({
  examTitle,
  questions,
  subjectAnalysis,
  timeAnalysis,
  overallAccuracy,
  classAverage,
  previousAttempts,
  onClose,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [activeTab, setActiveTab] = useState<'questions' | 'subjects' | 'time'>('questions');
  
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      default: return '#F59E0B';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'questions':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.tabDescription}>
              Detailed analysis of each question's performance
            </Text>
            {questions.map((question, index) => (
              <QuestionAnalysisCard
                key={question.id}
                question={question}
                index={index}
              />
            ))}
          </ScrollView>
        );
      
      case 'subjects':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.tabDescription}>
              Performance breakdown by subject topics
            </Text>
            {subjectAnalysis.map((analysis, index) => (
              <SubjectAnalysisCard key={index} analysis={analysis} />
            ))}
          </ScrollView>
        );
      
      case 'time':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.tabDescription}>
              Time management and efficiency analysis
            </Text>
            
            {/* Time Overview */}
            <View style={styles.timeOverviewCard}>
              <Text style={styles.cardTitle}>⏱️ Time Overview</Text>
              <View style={styles.timeOverviewContent}>
                <View style={styles.timeMetric}>
                  <Text style={styles.timeMetricValue}>
                    {Math.floor(timeAnalysis.totalTime / 60)}m {timeAnalysis.totalTime % 60}s
                  </Text>
                  <Text style={styles.timeMetricLabel}>Total Time</Text>
                </View>
                <View style={styles.timeMetric}>
                  <Text style={styles.timeMetricValue}>
                    {Math.floor(timeAnalysis.timeLimit / 60)}m
                  </Text>
                  <Text style={styles.timeMetricLabel}>Time Limit</Text>
                </View>
                <View style={styles.timeMetric}>
                  <Text style={[styles.timeMetricValue, { color: getEfficiencyColor(timeAnalysis.efficiency) }]}>
                    {timeAnalysis.efficiency}
                  </Text>
                  <Text style={styles.timeMetricLabel}>Efficiency</Text>
                </View>
              </View>
            </View>

            {/* Time Distribution */}
            <View style={styles.timeDistributionCard}>
              <Text style={styles.cardTitle}>📊 Time Distribution</Text>
              {timeAnalysis.timeDistribution.map((item, index) => (
                <View key={index} style={styles.timeDistributionItem}>
                  <Text style={styles.timeDistributionQuestion}>
                    Q{index + 1}
                  </Text>
                  <View style={styles.timeDistributionBar}>
                    <View 
                      style={[
                        styles.timeDistributionFill,
                        { 
                          width: `${item.percentage}%`,
                          backgroundColor: item.percentage > 80 ? '#EF4444' : item.percentage > 60 ? '#F59E0B' : '#10B981'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.timeDistributionTime}>
                    {item.time}s
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={['#FAFBFF', '#F5F7FF']}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Performance Analysis</Text>
            <Text style={styles.headerSubtitle}>{examTitle}</Text>
          </View>
        </View>

        {/* Overall Stats */}
        <View style={styles.overallStats}>
          <View style={styles.overallStatItem}>
            <AnimatedProgressRing 
              progress={overallAccuracy / 100}
              size={60}
              color={tokens.colors.primary}
              delay={200}
            />
            <Text style={styles.overallStatLabel}>Your Score</Text>
          </View>
          
          {classAverage && (
            <View style={styles.overallStatItem}>
              <AnimatedProgressRing 
                progress={classAverage / 100}
                size={60}
                color="#6B7280"
                delay={400}
              />
              <Text style={styles.overallStatLabel}>Class Average</Text>
            </View>
          )}

          <View style={styles.overallStatItem}>
            <View style={styles.improvementIndicator}>
              <Text style={styles.improvementValue}>
                {previousAttempts && previousAttempts.length > 0 
                  ? `+${Math.round(overallAccuracy - previousAttempts[previousAttempts.length - 1].score)}%`
                  : 'First Attempt'
                }
              </Text>
              <Ionicons 
                name={previousAttempts && previousAttempts.length > 0 && overallAccuracy > previousAttempts[previousAttempts.length - 1].score 
                  ? "trending-up" 
                  : "help-circle"
                } 
                size={20} 
                color={previousAttempts && previousAttempts.length > 0 && overallAccuracy > previousAttempts[previousAttempts.length - 1].score
                  ? "#10B981" 
                  : "#6B7280"
                } 
              />
            </View>
            <Text style={styles.overallStatLabel}>Improvement</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'questions', label: 'Questions', icon: 'list' },
            { key: 'subjects', label: 'Subjects', icon: 'library' },
            { key: 'time', label: 'Time', icon: 'time' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={20} 
                color={activeTab === tab.key ? tokens.colors.primary : tokens.colors.onSurfaceVariant} 
              />
              <Text 
                style={[
                  styles.tabButtonText,
                  { color: activeTab === tab.key ? tokens.colors.primary : tokens.colors.onSurfaceVariant }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </LinearGradient>
    </Animated.View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  overallStatItem: {
    alignItems: 'center',
    gap: 8,
  },
  overallStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  improvementIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  improvementValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  progressCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#F8F6FF',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingTop: 16,
  },
  tabDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  questionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  questionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  questionHeaderText: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  topicText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  questionHeaderRight: {
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  questionImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  answerAnalysis: {
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  answersGrid: {
    gap: 8,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  correctAnswer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  wrongAnswer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  selectedCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  optionLetter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  explanation: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  subjectCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  subjectAccuracy: {
    marginLeft: 16,
  },
  subjectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  subjectStat: {
    alignItems: 'center',
  },
  subjectStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  subjectStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  recommendations: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
    marginBottom: 2,
  },
  timeOverviewCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  timeOverviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeMetric: {
    alignItems: 'center',
  },
  timeMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  timeMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  timeDistributionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeDistributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  timeDistributionQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    width: 30,
  },
  timeDistributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeDistributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeDistributionTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 30,
    textAlign: 'right',
  },
});