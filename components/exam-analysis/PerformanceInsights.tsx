import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

import type { ExamDetailedAnalysisData } from '@/types/examAnalysis';

interface PerformanceInsightsProps {
  analysisData: ExamDetailedAnalysisData;
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  analysisData,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  return (
    <View style={styles.container}>
      {/* Subject Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Performance</Text>
        {analysisData.subjectAnalysis.map((subject, index) => (
          <View key={index} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{subject.topic}</Text>
              <Text style={[styles.accuracy, { color: subject.accuracy >= 70 ? tokens.colors.success : tokens.colors.error }]}>
                {subject.accuracy}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${subject.accuracy}%`,
                    backgroundColor: subject.accuracy >= 70 ? tokens.colors.success : tokens.colors.error
                  }
                ]} 
              />
            </View>
            <Text style={styles.subjectStats}>
              {subject.correctCount} of {subject.questionsCount} correct • {subject.masteryLevel.replace('-', ' ')}
            </Text>
          </View>
        ))}
      </View>

      {/* Time Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Analysis</Text>
        <View style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Ionicons name="time" size={20} color={tokens.colors.primary} />
            <Text style={styles.timeLabel}>Total Time Used</Text>
            <Text style={styles.timeValue}>
              {Math.floor(analysisData.timeAnalysis.totalTimeSpent / 60)}m {analysisData.timeAnalysis.totalTimeSpent % 60}s
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="speedometer" size={20} color={tokens.colors.info} />
            <Text style={styles.timeLabel}>Efficiency</Text>
            <Text style={[styles.timeValue, { 
              color: analysisData.timeAnalysis.efficiency === 'excellent' ? tokens.colors.success : 
                     analysisData.timeAnalysis.efficiency === 'good' ? tokens.colors.primary : 
                     tokens.colors.warning 
            }]}>
              {analysisData.timeAnalysis.efficiency}
            </Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {analysisData.insights.map((insight, index) => (
          <View key={index} style={[styles.insightCard, { 
            borderLeftColor: insight.type === 'strength' ? tokens.colors.success : 
                            insight.type === 'weakness' ? tokens.colors.error : 
                            insight.type === 'improvement' ? tokens.colors.primary : 
                            tokens.colors.warning 
          }]}>
            <View style={styles.insightHeader}>
              <Ionicons 
                name={
                  insight.type === 'strength' ? 'checkmark-circle' : 
                  insight.type === 'weakness' ? 'alert-circle' : 
                  insight.type === 'improvement' ? 'trending-up' : 
                  'bulb'
                } 
                size={18} 
                color={
                  insight.type === 'strength' ? tokens.colors.success : 
                  insight.type === 'weakness' ? tokens.colors.error : 
                  insight.type === 'improvement' ? tokens.colors.primary : 
                  tokens.colors.warning
                } 
              />
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
      </View>

      {/* Study Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {analysisData.subjectAnalysis.map((subject, index) => 
          subject.recommendations.map((rec, recIndex) => (
            <TouchableOpacity key={`${index}-${recIndex}`} style={styles.recommendationCard}>
              <View style={styles.recHeader}>
                <View style={[styles.priorityBadge, { 
                  backgroundColor: rec.priority === 'high' ? tokens.colors.error + '20' : 
                                  rec.priority === 'medium' ? tokens.colors.warning + '20' : 
                                  tokens.colors.info + '20' 
                }]}>
                  <Text style={[styles.priorityText, { 
                    color: rec.priority === 'high' ? tokens.colors.error : 
                           rec.priority === 'medium' ? tokens.colors.warning : 
                           tokens.colors.info 
                  }]}>
                    {rec.priority.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={tokens.colors.onSurfaceVariant} />
              </View>
              <Text style={styles.recDescription}>{rec.description}</Text>
              {rec.estimatedTime && (
                <Text style={styles.recTime}>⏱️ ~{rec.estimatedTime} minutes</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  
  section: {
    marginBottom: tokens.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
  },
  
  subjectCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.sm,
  },
  
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  
  subjectName: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  accuracy: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: tokens.colors.outline,
    borderRadius: 3,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  subjectStats: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  timeCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    ...tokens.shadows.sm,
  },
  
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  
  timeLabel: {
    flex: 1,
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
  },
  
  timeValue: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  insightCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.md,
    borderLeftWidth: 4,
    ...tokens.shadows.sm,
  },
  
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
    gap: tokens.spacing.sm,
  },
  
  insightTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  insightDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  
  recommendationCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.sm,
  },
  
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  
  priorityBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  
  priorityText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
  },
  
  recDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
    lineHeight: 22,
  },
  
  recTime: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
});