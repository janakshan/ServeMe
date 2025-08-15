import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import type { ExamDetailedAnalysisData } from '@/types/examAnalysis';

interface PerformanceSummaryProps {
  analysisData: ExamDetailedAnalysisData;
  style?: ViewStyle;
}

interface ScoreCircleProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  delay?: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  percentage, 
  size, 
  strokeWidth, 
  delay = 0 
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(percentage / 100, { 
      duration: 1500 
    });
  }, [percentage]);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return tokens.colors.success;
    if (score >= 70) return tokens.colors.primary;
    if (score >= 50) return tokens.colors.warning;
    return tokens.colors.error;
  };

  const strokeColor = getPerformanceColor(percentage);

  // Simple circular progress implementation without SVG
  return (
    <View style={{ 
      width: size, 
      height: size, 
      borderRadius: size / 2,
      borderWidth: strokeWidth,
      borderColor: tokens.colors.outline,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Progress overlay */}
      <View style={{
        position: 'absolute',
        top: -strokeWidth,
        left: -strokeWidth,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: 'transparent',
        borderTopColor: strokeColor,
        borderRightColor: percentage > 25 ? strokeColor : 'transparent',
        borderBottomColor: percentage > 50 ? strokeColor : 'transparent',
        borderLeftColor: percentage > 75 ? strokeColor : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }} />
      
      <Text style={{
        fontSize: size * 0.2,
        fontWeight: 'bold',
        color: strokeColor,
      }}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
};

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  analysisData,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: tokens.colors.success, icon: 'trophy' };
    if (percentage >= 70) return { level: 'Good', color: tokens.colors.primary, icon: 'thumbs-up' };
    if (percentage >= 50) return { level: 'Fair', color: tokens.colors.warning, icon: 'trending-up' };
    return { level: 'Needs Improvement', color: tokens.colors.error, icon: 'school' };
  };

  const getTimeEfficiency = (timeUsed: number, timeLimit: number) => {
    const utilization = (timeUsed / timeLimit) * 100;
    if (utilization <= 60) return { level: 'Very Fast', color: tokens.colors.success, icon: 'flash' };
    if (utilization <= 80) return { level: 'Optimal', color: tokens.colors.primary, icon: 'speedometer' };
    if (utilization <= 95) return { level: 'Just in Time', color: tokens.colors.warning, icon: 'time' };
    return { level: 'Overtime', color: tokens.colors.error, icon: 'hourglass' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const performance = getPerformanceLevel(analysisData.percentage);
  const timeEff = getTimeEfficiency(analysisData.timeSpent, analysisData.timeLimit);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[tokens.colors.surface, tokens.colors.surfaceVariant + '40']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance Overview</Text>
          <Text style={styles.headerSubtitle}>
            {analysisData.subject} • {analysisData.topics.join(', ')}
          </Text>
        </View>

        {/* Main Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreDisplay}>
            <Text style={[styles.scoreText, { color: performance.color }]}>
              {Math.round(analysisData.percentage)}%
            </Text>
            <Text style={styles.scoreLabel}>Overall Score</Text>
            
            <View style={[styles.performanceBadge, { backgroundColor: performance.color + '20' }]}>
              <Ionicons 
                name={performance.icon as any} 
                size={16} 
                color={performance.color} 
              />
              <Text style={[styles.performanceText, { color: performance.color }]}>
                {performance.level}
              </Text>
            </View>
          </View>

          <View style={styles.scoreStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analysisData.correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analysisData.totalQuestions - analysisData.correctAnswers}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analysisData.totalQuestions}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Quick Stats for Tab Version */}
        <View style={styles.compactStats}>
          <View style={styles.compactStatItem}>
            <Ionicons name="time" size={16} color={timeEff.color} />
            <Text style={styles.compactStatLabel}>Time Used</Text>
            <Text style={styles.compactStatValue}>{formatTime(analysisData.timeSpent)}</Text>
          </View>
          <View style={styles.compactStatItem}>
            <Ionicons name="diamond" size={16} color={tokens.colors.warning} />
            <Text style={styles.compactStatLabel}>Grade</Text>
            <Text style={styles.compactStatValue}>{analysisData.grade}</Text>
          </View>
          <View style={styles.compactStatItem}>
            <Ionicons name="bar-chart" size={16} color={tokens.colors.info} />
            <Text style={styles.compactStatLabel}>Difficulty</Text>
            <Text style={styles.compactStatValue}>{analysisData.difficulty}</Text>
          </View>
        </View>

      </LinearGradient>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    ...tokens.shadows.md,
    // Remove fixed height - let content determine height
  },
  
  gradient: {
    padding: tokens.spacing.lg, // Restored to lg for tab version
  },
  
  header: {
    marginBottom: tokens.spacing.md, // Restored to md for tab version
  },
  
  headerTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  
  headerSubtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  scoreSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg, // Restored to lg for tab version
  },
  
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: tokens.spacing.md, // Restored to md for tab version
  },
  
  scoreText: {
    fontSize: 48, // Restored to original 48 for tab version
    fontWeight: '900',
    marginBottom: tokens.spacing.xs,
  },
  
  scoreLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.md,
  },
  
  performanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.sm, // Reduced from md to sm
    paddingVertical: tokens.spacing.xs, // Reduced from sm to xs
    borderRadius: tokens.borderRadius.full,
    gap: tokens.spacing.xs,
  },
  
  performanceText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
  },
  
  scoreStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant + '50',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.full,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  statLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: tokens.colors.outline,
    marginHorizontal: tokens.spacing.md,
  },
  
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: tokens.spacing.md, // Restored to md for tab version
    backgroundColor: tokens.colors.surfaceVariant + '30',
    borderRadius: tokens.borderRadius.md,
    marginTop: tokens.spacing.md, // Restored to md for tab version
  },
  
  compactStatItem: {
    flexDirection: 'column', // Changed back to vertical for tab version
    alignItems: 'center',
    gap: tokens.spacing.xs, // Restored proper spacing
  },
  
  compactStatLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  compactStatValue: {
    fontSize: tokens.typography.body, // Restored to body for tab version
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  
  metricTitle: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurfaceVariant,
  },
  
  metricValue: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  metricSubtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.sm,
  },
  
  metricBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  
  metricBadgeText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
  },
  
  accuracyBar: {
    height: 6,
    backgroundColor: tokens.colors.outline,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  accuracyFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    marginTop: tokens.spacing.xs,
  },
  
  comparisonText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  achievementsSection: {
    marginTop: tokens.spacing.md,
  },
  
  achievementsTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  
  achievementBadge: {
    backgroundColor: tokens.colors.success + '20',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: tokens.colors.success + '30',
  },
  
  achievementText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.success,
  },
  
  moreAchievements: {
    backgroundColor: tokens.colors.surfaceVariant,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
  },
  
  moreAchievementsText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
});