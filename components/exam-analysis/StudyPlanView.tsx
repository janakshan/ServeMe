import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import * as Haptics from 'expo-haptics';

import type { StudyPlanRecommendation, SubjectPerformanceAnalysis } from '@/types/examAnalysis';

interface StudyPlanViewProps {
  studyPlan: StudyPlanRecommendation[];
  weakAreas: SubjectPerformanceAnalysis[];
}

interface StudyItemProps {
  item: StudyPlanRecommendation;
  onComplete: () => void;
  onSchedule: () => void;
}

const StudyItem: React.FC<StudyItemProps> = ({ item, onComplete, onSchedule }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createItemStyles, themeContext);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return tokens.colors.error;
      case 'high': return '#FF6B35';
      case 'medium': return tokens.colors.warning;
      default: return tokens.colors.info;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return 'book-outline';
      case 'practice': return 'create-outline';
      case 'learn': return 'school-outline';
      case 'assess': return 'checkmark-circle-outline';
      default: return 'document-outline';
    }
  };

  const handleComplete = () => {
    onComplete();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSchedule = () => {
    onSchedule();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, item.isCompleted && styles.completedContainer]}>
      <View style={styles.header}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            {item.priority.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.typeContainer}>
          <Ionicons 
            name={getTypeIcon(item.type) as any} 
            size={16} 
            color={tokens.colors.onSurfaceVariant} 
          />
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>

      <Text style={[styles.title, item.isCompleted && styles.completedTitle]}>
        {item.title}
      </Text>
      
      <Text style={[styles.description, item.isCompleted && styles.completedDescription]}>
        {item.description}
      </Text>

      <View style={styles.meta}>
        <View style={styles.duration}>
          <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.durationText}>~{item.estimatedDuration} min</Text>
        </View>
        
        <View style={styles.topics}>
          <Ionicons name="pricetags" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.topicsText}>{item.topics.join(', ')}</Text>
        </View>
      </View>

      {item.resources.length > 0 && (
        <View style={styles.resources}>
          <Text style={styles.resourcesTitle}>Resources:</Text>
          {item.resources.slice(0, 2).map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceItem}>
              <Ionicons 
                name={resource.type === 'video' ? 'videocam' : resource.type === 'article' ? 'document-text' : 'link'} 
                size={14} 
                color={tokens.colors.primary} 
              />
              <Text style={styles.resourceText} numberOfLines={1}>
                {resource.title}
              </Text>
            </TouchableOpacity>
          ))}
          {item.resources.length > 2 && (
            <Text style={styles.moreResources}>
              +{item.resources.length - 2} more resources
            </Text>
          )}
        </View>
      )}

      <View style={styles.actions}>
        {!item.isCompleted ? (
          <>
            <TouchableOpacity onPress={handleSchedule} style={styles.scheduleButton}>
              <Ionicons name="calendar" size={16} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.scheduleText}>Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
              <LinearGradient
                colors={[tokens.colors.success, tokens.colors.success + 'CC']}
                style={styles.completeGradient}
              >
                <Text style={styles.completeText}>Start Now</Text>
                <Ionicons name="arrow-forward" size={16} color={tokens.colors.onPrimary} />
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={tokens.colors.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  studyPlan,
  weakAreas,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const handleItemComplete = (itemId: string) => {
    Alert.alert('Start Study Session', 'This would start the study session for this item.');
  };

  const handleItemSchedule = (itemId: string) => {
    Alert.alert('Schedule Study', 'This would open the schedule picker for this item.');
  };

  const sortedPlan = [...studyPlan].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <View style={styles.container}>
      {/* Overview */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Your Personalized Study Plan</Text>
        <Text style={styles.overviewDescription}>
          Based on your performance, we've created a customized study plan to help you improve.
        </Text>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studyPlan.length}</Text>
            <Text style={styles.statLabel}>Study Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(studyPlan.reduce((sum, item) => sum + item.estimatedDuration, 0) / 60)}h
            </Text>
            <Text style={styles.statLabel}>Est. Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weakAreas.length}</Text>
            <Text style={styles.statLabel}>Focus Areas</Text>
          </View>
        </View>
      </View>

      {/* Weak Areas Summary */}
      {weakAreas.length > 0 && (
        <View style={styles.weakAreasSection}>
          <Text style={styles.sectionTitle}>Areas Needing Attention</Text>
          {weakAreas.map((area, index) => (
            <View key={index} style={styles.weakAreaCard}>
              <View style={styles.weakAreaHeader}>
                <Text style={styles.weakAreaTopic}>{area.topic}</Text>
                <Text style={[styles.weakAreaAccuracy, { color: tokens.colors.error }]}>
                  {area.accuracy}%
                </Text>
              </View>
              <View style={styles.weakAreaProgress}>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${area.accuracy}%`,
                        backgroundColor: tokens.colors.error
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.masteryLevel}>{area.masteryLevel.replace('-', ' ')}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Study Plan Items */}
      <View style={styles.studyPlanSection}>
        <Text style={styles.sectionTitle}>Study Plan</Text>
        {sortedPlan.map((item) => (
          <StudyItem
            key={item.id}
            item={item}
            onComplete={() => handleItemComplete(item.id)}
            onSchedule={() => handleItemSchedule(item.id)}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.generateButton}>
          <LinearGradient
            colors={[tokens.colors.primary, tokens.colors.primaryDark]}
            style={styles.generateGradient}
          >
            <Ionicons name="refresh" size={20} color={tokens.colors.onPrimary} />
            <Text style={styles.generateText}>Generate New Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download" size={20} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.exportText}>Export Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  
  overview: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    ...tokens.shadows.sm,
  },
  
  overviewTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
  },
  
  overviewDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: tokens.spacing.lg,
  },
  
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
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
  
  weakAreasSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  weakAreaCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.error,
    ...tokens.shadows.sm,
  },
  
  weakAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  
  weakAreaTopic: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  weakAreaAccuracy: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
  },
  
  weakAreaProgress: {
    gap: tokens.spacing.xs,
  },
  
  progressTrack: {
    height: 4,
    backgroundColor: tokens.colors.outline,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  masteryLevel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  studyPlanSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  actionSection: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  
  generateButton: {
    flex: 1,
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
  },
  
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  
  generateText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
  },
  
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.surfaceVariant,
    borderRadius: tokens.borderRadius.md,
    gap: tokens.spacing.sm,
  },
  
  exportText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurfaceVariant,
  },
});

const createItemStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.sm,
  },
  
  completedContainer: {
    opacity: 0.7,
    backgroundColor: tokens.colors.surfaceVariant,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
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
  
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  
  typeText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  
  title: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
  },
  
  completedTitle: {
    textDecorationLine: 'line-through',
    color: tokens.colors.onSurfaceVariant,
  },
  
  description: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: tokens.spacing.md,
  },
  
  completedDescription: {
    color: tokens.colors.onSurfaceVariant,
  },
  
  meta: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  
  durationText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  topics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  
  topicsText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    flex: 1,
  },
  
  resources: {
    marginBottom: tokens.spacing.md,
  },
  
  resourcesTitle: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.xs,
  },
  
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.xs,
  },
  
  resourceText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    flex: 1,
  },
  
  moreResources: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant,
    borderRadius: tokens.borderRadius.md,
    gap: tokens.spacing.xs,
  },
  
  scheduleText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },
  
  completeButton: {
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
  },
  
  completeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  
  completeText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
  },
  
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.success + '20',
    borderRadius: tokens.borderRadius.md,
    gap: tokens.spacing.xs,
  },
  
  completedText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.success,
    fontWeight: tokens.typography.semiBold,
  },
});