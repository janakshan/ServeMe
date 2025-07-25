import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';

interface AcademicCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress?: number;
  isCompleted?: boolean;
  stats?: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number;
    label: string;
  }>;
  badges?: string[];
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'detailed' | 'featured';
}

export function AcademicCard({
  title,
  subtitle,
  description,
  category,
  level = 'intermediate',
  progress,
  isCompleted = false,
  stats = [],
  badges = [],
  onPress,
  style,
  variant = 'default'
}: AcademicCardProps) {
  const { tokens, getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return tokens.colors.success;
      case 'intermediate':
        return tokens.colors.warning;
      case 'advanced':
        return tokens.colors.error;
      case 'expert':
        return tokens.colors.info;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'leaf';
      case 'intermediate':
        return 'library';
      case 'advanced':
        return 'school';
      case 'expert':
        return 'trophy';
      default:
        return 'book';
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const cardGradient = getGradient('card');

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={onPress ? 0.9 : 1}
    >
      <LinearGradient
        colors={cardGradient.colors as any}
        start={{ x: cardGradient.direction.x, y: cardGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: tokens.colors.primaryContainer }]}>
                <Text style={[styles.categoryText, { color: tokens.colors.onPrimaryContainer }]}>
                  {category}
                </Text>
              </View>
            )}
            
            <View style={styles.levelContainer}>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(level) }]}>
                <Ionicons
                  name={getLevelIcon(level)}
                  size={12}
                  color={tokens.colors.onPrimary}
                />
                <Text style={[styles.levelText, { color: tokens.colors.onPrimary }]}>
                  {level}
                </Text>
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: tokens.colors.onSurface }]} numberOfLines={2}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: tokens.colors.onSurfaceVariant }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Description */}
          {description && variant !== 'compact' && (
            <Text style={[styles.description, { color: tokens.colors.onSurfaceVariant }]} numberOfLines={3}>
              {description}
            </Text>
          )}

          {/* Progress Bar */}
          {progress !== undefined && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: tokens.colors.onSurface }]}>
                  Progress
                </Text>
                <Text style={[styles.progressValue, { color: tokens.colors.primary }]}>
                  {progress}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: tokens.colors.outlineVariant }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: isCompleted ? tokens.colors.success : tokens.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Stats Section */}
          {stats.length > 0 && variant !== 'compact' && (
            <View style={styles.statsSection}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Ionicons
                    name={stat.icon}
                    size={16}
                    color={tokens.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.statValue, { color: tokens.colors.onSurface }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: tokens.colors.onSurfaceVariant }]}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Badges */}
          {badges.length > 0 && variant === 'detailed' && (
            <View style={styles.badgesSection}>
              {badges.slice(0, 4).map((badge, index) => (
                <View key={index} style={[styles.badge, { backgroundColor: tokens.colors.secondaryContainer }]}>
                  <Text style={[styles.badgeText, { color: tokens.colors.onSecondaryContainer }]}>
                    {badge}
                  </Text>
                </View>
              ))}
              {badges.length > 4 && (
                <Text style={[styles.moreBadges, { color: tokens.colors.onSurfaceVariant }]}>
                  +{badges.length - 4} more
                </Text>
              )}
            </View>
          )}

          {/* Completion Badge */}
          {isCompleted && (
            <View style={styles.completionBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={tokens.colors.success}
              />
              <Text style={[styles.completionText, { color: tokens.colors.success }]}>
                Completed
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </CardContainer>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    marginVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  categoryText: {
    fontSize: tokens.typography.caption,
    fontWeight: '600',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
    gap: 4,
  },
  levelText: {
    fontSize: tokens.typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  titleSection: {
    marginBottom: tokens.spacing.sm,
  },
  title: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    lineHeight: tokens.typography.subtitle * 1.3,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: tokens.typography.body,
    lineHeight: tokens.typography.body * 1.2,
  },
  description: {
    fontSize: tokens.typography.body,
    lineHeight: tokens.typography.body * 1.4,
    marginBottom: tokens.spacing.md,
  },
  progressSection: {
    marginBottom: tokens.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  progressLabel: {
    fontSize: tokens.typography.caption,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: tokens.typography.caption,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
    marginTop: tokens.spacing.xs,
  },
  statLabel: {
    fontSize: tokens.typography.caption,
    marginTop: 2,
  },
  badgesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: tokens.borderRadius.sm,
  },
  badgeText: {
    fontSize: tokens.typography.caption,
    fontWeight: '500',
  },
  moreBadges: {
    fontSize: tokens.typography.caption,
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
    marginTop: tokens.spacing.sm,
  },
  completionText: {
    fontSize: tokens.typography.caption,
    fontWeight: '600',
  },
});