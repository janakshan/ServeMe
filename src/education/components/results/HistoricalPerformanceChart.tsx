import React, { useState, useEffect, useMemo } from 'react';
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
  interpolate,
} from 'react-native-reanimated';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 40;
const CHART_HEIGHT = 200;

// Data types
export interface PerformanceDataPoint {
  date: string; // ISO date string
  score: number; // Percentage score
  examTitle: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeSpent: number; // in minutes
  questionsCount: number;
  correctAnswers: number;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  examCount: number;
  trend: 'improving' | 'stable' | 'declining';
  trendPercentage: number; // Change from previous period
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  data: PerformanceDataPoint[];
}

export interface HistoricalPerformanceData {
  userId: string;
  performanceHistory: PerformanceDataPoint[];
  subjectBreakdown: SubjectPerformance[];
  overallStats: {
    totalExams: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementTrend: 'improving' | 'stable' | 'declining';
    streakData: Array<{ date: string; active: boolean }>;
  };
  timeRange: {
    start: string;
    end: string;
  };
}

interface HistoricalPerformanceChartProps {
  data: HistoricalPerformanceData;
  onDataPointTap?: (point: PerformanceDataPoint) => void;
  onSubjectTap?: (subject: SubjectPerformance) => void;
}

// Simple Line Chart Component
const LineChart = ({ 
  data, 
  width, 
  height, 
  color = '#6A1B9A',
  showGrid = true,
  animated = true,
  onPointTap
}: {
  data: PerformanceDataPoint[];
  width: number;
  height: number;
  color?: string;
  showGrid?: boolean;
  animated?: boolean;
  onPointTap?: (point: PerformanceDataPoint, index: number) => void;
}) => {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animationProgress.value = withDelay(300, withTiming(1, { duration: 1500 }));
    } else {
      animationProgress.value = 1;
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
  }));

  if (data.length === 0) return null;

  const minScore = Math.max(0, Math.min(...data.map(d => d.score)) - 10);
  const maxScore = Math.min(100, Math.max(...data.map(d => d.score)) + 10);
  const scoreRange = maxScore - minScore;

  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => ({
    x: padding + (index / (data.length - 1)) * chartWidth,
    y: padding + ((maxScore - point.score) / scoreRange) * chartHeight,
    data: point,
    index,
  }));

  // Create path for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '').trim();

  // Create gradient area path
  const areaPath = pathData + 
    ` L ${points[points.length - 1].x} ${height - padding}` +
    ` L ${padding} ${height - padding} Z`;

  return (
    <Animated.View style={[{ width, height }, animatedStyle]}>
      <svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && (
          <g>
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + ratio * chartHeight;
              const score = maxScore - ratio * scoreRange;
              return (
                <g key={index}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding - 8}
                    y={y + 4}
                    fontSize="10"
                    fill="#6B7280"
                    textAnchor="end"
                  >
                    {Math.round(score)}%
                  </text>
                </g>
              );
            })}
            
            {/* Vertical grid lines */}
            {points.map((point, index) => {
              if (index % Math.ceil(points.length / 4) !== 0) return null;
              return (
                <line
                  key={index}
                  x1={point.x}
                  y1={padding}
                  x2={point.x}
                  y2={height - padding}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            })}
          </g>
        )}

        {/* Area gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <path
          d={areaPath}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="white"
              stroke={color}
              strokeWidth="3"
              onPress={() => onPointTap?.(point.data, point.index)}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={color}
            />
          </g>
        ))}
      </svg>
    </Animated.View>
  );
};

// Subject Performance Card
const SubjectCard = ({ 
  subject, 
  onTap,
  index 
}: { 
  subject: SubjectPerformance; 
  onTap?: (subject: SubjectPerformance) => void;
  index: number;
}) => {
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

  const getTrendIcon = () => {
    switch (subject.trend) {
      case 'improving': return 'trending-up';
      case 'declining': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (subject.trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Animated.View style={cardAnimatedStyle}>
      <TouchableOpacity
        style={[styles.subjectCard, { borderLeftColor: subject.color }]}
        onPress={() => onTap?.(subject)}
        activeOpacity={0.8}
      >
        <View style={styles.subjectHeader}>
          <View style={[styles.subjectIcon, { backgroundColor: `${subject.color}15` }]}>
            <Ionicons name={subject.icon} size={20} color={subject.color} />
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>{subject.subject}</Text>
            <Text style={styles.subjectStats}>
              {subject.examCount} exam{subject.examCount !== 1 ? 's' : ''} • Avg: {Math.round(subject.averageScore)}%
            </Text>
          </View>
          <View style={styles.subjectTrend}>
            <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}15` }]}>
              <Ionicons name={getTrendIcon()} size={14} color={getTrendColor()} />
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {subject.trendPercentage > 0 ? '+' : ''}{Math.round(subject.trendPercentage)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Mini chart */}
        <View style={styles.miniChart}>
          <LineChart
            data={subject.data.slice(-10)} // Last 10 data points
            width={200}
            height={40}
            color={subject.color}
            showGrid={false}
            animated={false}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Streak Calendar Component
const StreakCalendar = ({ 
  streakData, 
  currentStreak 
}: { 
  streakData: Array<{ date: string; active: boolean }>; 
  currentStreak: number;
}) => {
  // Get last 30 days
  const last30Days = streakData.slice(-30);
  
  return (
    <View style={styles.streakCalendar}>
      <View style={styles.streakHeader}>
        <Text style={styles.streakTitle}>Learning Streak</Text>
        <Text style={styles.streakValue}>{currentStreak} days</Text>
      </View>
      
      <View style={styles.streakGrid}>
        {last30Days.map((day, index) => (
          <View
            key={index}
            style={[
              styles.streakDay,
              day.active && styles.activeStreakDay,
            ]}
          />
        ))}
      </View>
      
      <Text style={styles.streakLabel}>Last 30 days</Text>
    </View>
  );
};

// Statistics Overview Component
const StatisticsOverview = ({ 
  stats 
}: { 
  stats: HistoricalPerformanceData['overallStats'] 
}) => {
  return (
    <View style={styles.statsOverview}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalExams}</Text>
        <Text style={styles.statLabel}>Total Exams</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{Math.round(stats.averageScore)}%</Text>
        <Text style={styles.statLabel}>Average Score</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.bestScore}%</Text>
        <Text style={styles.statLabel}>Best Score</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {stats.improvementTrend === 'improving' ? '📈' : 
           stats.improvementTrend === 'declining' ? '📉' : '➡️'}
        </Text>
        <Text style={styles.statLabel}>Trend</Text>
      </View>
    </View>
  );
};

// Main Component
export const HistoricalPerformanceChart: React.FC<HistoricalPerformanceChartProps> = ({
  data,
  onDataPointTap,
  onSubjectTap,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | '3months' | 'year'>('month');
  const [selectedSubject, setSelectedSubject] = useState<string | 'all'>('all');
  
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      '3months': 90,
      year: 365,
    };
    
    const daysBack = timeRanges[selectedTimeRange];
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    return data.performanceHistory.filter(point => 
      new Date(point.date) >= cutoffDate &&
      (selectedSubject === 'all' || point.subject === selectedSubject)
    );
  }, [data.performanceHistory, selectedTimeRange, selectedSubject]);

  const timeRangeOptions = [
    { key: 'week', label: '7D' },
    { key: 'month', label: '1M' },
    { key: '3months', label: '3M' },
    { key: 'year', label: '1Y' },
  ] as const;

  const subjects = ['all', ...data.subjectBreakdown.map(s => s.subject)];

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance History</Text>
          <Text style={styles.headerSubtitle}>Track your learning progress over time</Text>
        </View>

        {/* Statistics Overview */}
        <View style={styles.section}>
          <StatisticsOverview stats={data.overallStats} />
        </View>

        {/* Controls */}
        <View style={styles.controlsSection}>
          {/* Time Range Selector */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Time Range:</Text>
            <View style={styles.timeRangeButtons}>
              {timeRangeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === option.key && styles.activeTimeRangeButton,
                  ]}
                  onPress={() => setSelectedTimeRange(option.key)}
                >
                  <Text 
                    style={[
                      styles.timeRangeButtonText,
                      { color: selectedTimeRange === option.key ? tokens.colors.primary : '#6B7280' }
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject Filter */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Subject:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.subjectFilters}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectFilter,
                      selectedSubject === subject && styles.activeSubjectFilter,
                    ]}
                    onPress={() => setSelectedSubject(subject)}
                  >
                    <Text 
                      style={[
                        styles.subjectFilterText,
                        { color: selectedSubject === subject ? tokens.colors.primary : '#6B7280' }
                      ]}
                    >
                      {subject === 'all' ? 'All Subjects' : subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Main Chart */}
        <View style={styles.section}>
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Score Trend</Text>
            {filteredData.length > 0 ? (
              <LineChart
                data={filteredData}
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                color={tokens.colors.primary}
                showGrid={true}
                animated={true}
                onPointTap={onDataPointTap}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="analytics" size={48} color="#D1D5DB" />
                <Text style={styles.emptyChartTitle}>No Data Available</Text>
                <Text style={styles.emptyChartText}>
                  No exam data found for the selected time range and subject.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Subject Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          <View style={styles.subjectsContainer}>
            {data.subjectBreakdown.map((subject, index) => (
              <SubjectCard
                key={subject.subject}
                subject={subject}
                onTap={onSubjectTap}
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Learning Streak */}
        <View style={styles.section}>
          <StreakCalendar
            streakData={data.overallStats.streakData}
            currentStreak={data.overallStats.streakData.filter(d => d.active).length}
          />
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>📊 Key Insights</Text>
            <View style={styles.insightsList}>
              {data.overallStats.improvementTrend === 'improving' && (
                <Text style={styles.insightItem}>
                  • Your performance is improving over time! Keep up the great work.
                </Text>
              )}
              
              {data.subjectBreakdown.find(s => s.trend === 'improving') && (
                <Text style={styles.insightItem}>
                  • Strong improvement in {data.subjectBreakdown.find(s => s.trend === 'improving')?.subject}
                </Text>
              )}
              
              {data.overallStats.averageScore >= 80 && (
                <Text style={styles.insightItem}>
                  • Excellent overall performance with {Math.round(data.overallStats.averageScore)}% average
                </Text>
              )}
              
              {data.overallStats.totalExams >= 10 && (
                <Text style={styles.insightItem}>
                  • Consistent learner with {data.overallStats.totalExams} completed exams
                </Text>
              )}
            </View>
          </View>
        </View>

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
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  // Statistics Overview
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  // Controls
  controlsSection: {
    marginTop: 16,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  controlGroup: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTimeRangeButton: {
    backgroundColor: '#F0F4FF',
    borderColor: '#6A1B9A',
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subjectFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  subjectFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSubjectFilter: {
    backgroundColor: '#F0F4FF',
    borderColor: '#6A1B9A',
  },
  subjectFilterText: {
    fontSize: 14,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  // Chart
  chartContainer: {
    alignItems: 'center',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CHART_HEIGHT,
    width: CHART_WIDTH,
  },
  emptyChartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  // Subject Cards
  subjectsContainer: {
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subjectStats: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  subjectTrend: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  miniChart: {
    alignItems: 'center',
    marginTop: 8,
  },
  // Streak Calendar
  streakCalendar: {
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    maxWidth: 300,
  },
  streakDay: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  activeStreakDay: {
    backgroundColor: '#F59E0B',
  },
  streakLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  // Insights
  insightsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
});