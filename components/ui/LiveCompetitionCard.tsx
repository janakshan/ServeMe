import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { CompetitionExam } from '@/utils/examData';
import { router } from 'expo-router';

interface LiveCompetitionCardProps {
  exam: CompetitionExam;
  onJoin: (exam: CompetitionExam) => void;
}

export const LiveCompetitionCard: React.FC<LiveCompetitionCardProps> = ({ exam, onJoin }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const [timeLeft, setTimeLeft] = useState('');
  const [isActive, setIsActive] = useState(true);
  const pulseAnim = new Animated.Value(1);

  // Live pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (exam.competitionData.phase === 'live') {
      pulseAnimation.start();
    }
    
    return () => pulseAnimation.stop();
  }, [exam.competitionData.phase]);

  // Calculate time remaining
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = exam.competitionData.endDate.getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft('Ended');
        setIsActive(false);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [exam.competitionData.endDate]);

  const getParticipationRate = () => {
    return (exam.competitionData.currentParticipants / exam.competitionData.maxParticipants) * 100;
  };

  const handleJoinCompetition = () => {
    if (exam.competitionData.isRegistered) {
      // Navigate to exam taking module with competition context
      router.push(`/(services)/education/exam/${exam.id}/take?competition=true&live=true&phase=${exam.competitionData.phase}` as any);
      onJoin(exam);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.lg,
      marginBottom: tokens.spacing.md,
      borderWidth: 2,
      borderColor: tokens.colors.primaryLight,
      ...tokens.shadows.lg,
      overflow: 'hidden',
    },
    liveIndicator: {
      position: 'absolute',
      top: -1,
      left: -1,
      right: -1,
      height: 4,
      backgroundColor: tokens.colors.primaryLight,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.md,
    },
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.lg,
      gap: tokens.spacing.xs,
    },
    liveBadgeText: {
      color: tokens.colors.onPrimary,
      fontSize: tokens.typography.caption,
      fontWeight: '700',
    },
    timer: {
      alignItems: 'center',
    },
    timerText: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      fontFamily: 'monospace',
    },
    timerLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginTop: 2,
    },
    title: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.sm,
      lineHeight: 22,
    },
    organizerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.md,
      gap: tokens.spacing.xs,
    },
    organizerText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    statsContainer: {
      backgroundColor: tokens.colors.primary + '08',
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.sm,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
    },
    statLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginTop: 2,
    },
    participantBar: {
      height: 6,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
      marginTop: tokens.spacing.xs,
      overflow: 'hidden',
    },
    participantProgress: {
      height: '100%',
      backgroundColor: tokens.colors.primaryLight,
      borderRadius: tokens.borderRadius.sm,
    },
    participantText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: tokens.spacing.xs,
    },
    joinButton: {
      backgroundColor: tokens.colors.primaryLight,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.sm,
      ...tokens.shadows.md,
    },
    joinButtonText: {
      color: tokens.colors.onPrimary,
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.bold,
    },
    prizeInfo: {
      backgroundColor: tokens.colors.warning + '10',
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.warning + '20',
    },
    prizeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurface,
      textAlign: 'center',
      fontWeight: '500',
    },
    pulsingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: tokens.colors.primaryLight,
    },
  });

  return (
    <View style={styles.container}>
      {/* Live indicator bar */}
      <View style={styles.liveIndicator} />
      
      {/* Header with live badge and timer */}
      <View style={styles.header}>
        <View style={styles.liveBadge}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.pulsingDot} />
          </Animated.View>
          <Text style={styles.liveBadgeText}>LIVE NOW</Text>
        </View>
        
        <View style={styles.timer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
          <Text style={styles.timerLabel}>Time Left</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{exam.title}</Text>

      {/* Organizer */}
      <View style={styles.organizerInfo}>
        <Ionicons name="business" size={14} color={tokens.colors.onSurfaceVariant} />
        <Text style={styles.organizerText}>{exam.competitionData.organizerName}</Text>
      </View>

      {/* Prize Information */}
      {exam.competitionData.prizes.length > 0 && (
        <View style={styles.prizeInfo}>
          <Text style={styles.prizeText}>
            🏆 {exam.competitionData.prizes[0].title} - {exam.competitionData.prizes[0].value}
          </Text>
        </View>
      )}

      {/* Competition Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exam.competitionData.currentParticipants}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exam.questionsCount}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exam.timeLimit}m</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>
        
        {/* Participation Progress Bar */}
        <View style={styles.participantBar}>
          <View 
            style={[
              styles.participantProgress, 
              { width: `${getParticipationRate()}%` }
            ]} 
          />
        </View>
        <Text style={styles.participantText}>
          {exam.competitionData.currentParticipants}/{exam.competitionData.maxParticipants} participants ({Math.round(getParticipationRate())}% full)
        </Text>
      </View>

      {/* Join Button */}
      {exam.competitionData.isRegistered ? (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoinCompetition}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={20} color={tokens.colors.onPrimary} />
          <Text style={styles.joinButtonText}>Join Competition Now</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.joinButton, { backgroundColor: tokens.colors.surfaceVariant }]}>
          <Ionicons name="lock-closed" size={20} color={tokens.colors.onSurfaceVariant} />
          <Text style={[styles.joinButtonText, { color: tokens.colors.onSurfaceVariant }]}>
            Registration Required
          </Text>
        </View>
      )}
    </View>
  );
};