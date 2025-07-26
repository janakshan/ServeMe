import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface Achievement {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  color?: string;
}

interface AchievementProgressProps {
  achievements: Achievement[];
  currentStreak?: number;
  totalPoints?: number;
  level?: number;
  nextLevelPoints?: number;
  variant?: 'compact' | 'detailed';
}

export function AchievementProgress({
  achievements = [],
  currentStreak = 0,
  totalPoints = 0,
  level = 1,
  nextLevelPoints = 1000,
  variant = 'detailed'
}: AchievementProgressProps) {
  const { tokens, getGradient } = useEducationTheme();
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bars
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Animate streak counter
    if (currentStreak > 0) {
      Animated.sequence([
        Animated.timing(streakAnim, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(streakAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animate points counter
    Animated.timing(pointsAnim, {
      toValue: totalPoints,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [currentStreak, totalPoints]);

  const levelProgress = (totalPoints % nextLevelPoints) / nextLevelPoints;
  const gradientColors = getGradient('accent').colors;

  return (
    <View style={styles.container}>
      {variant === 'detailed' && (
        <>
          {/* User Level & Points */}
          <View style={styles.levelSection}>
            <LinearGradient
              colors={gradientColors}
              style={styles.levelBadge}
            >
              <Ionicons name="trophy" size={20} color={tokens.colors.onPrimary} />
              <Text style={[styles.levelText, { color: tokens.colors.onPrimary }]}>
                Level {level}
              </Text>
            </LinearGradient>
            
            <View style={styles.pointsContainer}>
              <Animated.Text style={[styles.pointsText, { color: tokens.colors.primary }]}>
                {pointsAnim.interpolate({
                  inputRange: [0, totalPoints],
                  outputRange: [0, totalPoints],
                  extrapolate: 'clamp',
                }).interpolate((value) => Math.floor(value).toLocaleString())}
              </Animated.Text>
              <Text style={[styles.pointsLabel, { color: tokens.colors.onSurfaceVariant }]}>
                points
              </Text>
            </View>
          </View>

          {/* Level Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: tokens.colors.onSurface }]}>
                Progress to Level {level + 1}
              </Text>
              <Text style={[styles.progressValue, { color: tokens.colors.primary }]}>
                {Math.round(levelProgress * 100)}%
              </Text>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: tokens.colors.outlineVariant }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${levelProgress * 100}%`],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[tokens.colors.primary, tokens.colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </View>
        </>
      )}

      {/* Streak Counter */}
      {currentStreak > 0 && (
        <Animated.View 
          style={[
            styles.streakContainer,
            {
              backgroundColor: tokens.colors.warningContainer,
              transform: [{ scale: streakAnim }],
            }
          ]}
        >
          <Ionicons name="flame" size={16} color={tokens.colors.warning} />
          <Text style={[styles.streakText, { color: tokens.colors.onWarningContainer }]}>
            {currentStreak} day streak!
          </Text>
        </Animated.View>
      )}

      {/* Achievements Grid */}
      <View style={styles.achievementsSection}>
        <Text style={[styles.sectionTitle, { color: tokens.colors.onSurface }]}>
          Achievements
        </Text>
        <View style={styles.achievementsGrid}>
          {achievements.slice(0, variant === 'compact' ? 4 : 6).map((achievement, index) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              delay={index * 100}
              tokens={tokens}
            />
          ))}
          {achievements.length > (variant === 'compact' ? 4 : 6) && (
            <View style={[styles.moreBadge, { backgroundColor: tokens.colors.surfaceVariant }]}>
              <Text style={[styles.moreText, { color: tokens.colors.onSurfaceVariant }]}>
                +{achievements.length - (variant === 'compact' ? 4 : 6)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

interface AchievementBadgeProps {
  achievement: Achievement;
  delay: number;
  tokens: any;
}

function AchievementBadge({ achievement, delay, tokens }: AchievementBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: achievement.progress / achievement.maxProgress,
      duration: 1000,
      delay: delay + 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [delay, achievement.progress, achievement.maxProgress]);

  const isCompleted = achievement.progress >= achievement.maxProgress;
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <Animated.View
      style={[
        styles.achievementBadge,
        {
          backgroundColor: achievement.unlocked ? tokens.colors.primaryContainer : tokens.colors.surfaceVariant,
          borderColor: achievement.unlocked ? tokens.colors.primary : tokens.colors.outline,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.achievementIcon}>
        <Ionicons
          name={achievement.icon}
          size={20}
          color={achievement.unlocked ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
        />
      </View>
      
      <Text
        style={[
          styles.achievementTitle,
          {
            color: achievement.unlocked ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant,
          },
        ]}
        numberOfLines={2}
      >
        {achievement.title}
      </Text>

      {!isCompleted && (
        <View style={styles.achievementProgress}>
          <View style={[styles.miniProgressBar, { backgroundColor: tokens.colors.outlineVariant }]}>
            <Animated.View
              style={[
                styles.miniProgressFill,
                {
                  backgroundColor: achievement.color || tokens.colors.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.achievementProgressText, { color: tokens.colors.onSurfaceVariant }]}>
            {achievement.progress}/{achievement.maxProgress}
          </Text>
        </View>
      )}

      {isCompleted && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={12} color={tokens.colors.success} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  levelSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 24,
    fontWeight: '800',
  },
  pointsLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    gap: 6,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    width: 80,
    height: 90,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  achievementIcon: {
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  miniProgressBar: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 2,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  achievementProgressText: {
    fontSize: 8,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  moreBadge: {
    width: 80,
    height: 90,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
  },
});