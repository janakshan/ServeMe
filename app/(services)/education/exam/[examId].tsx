import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { EducationScreenHeader } from "@/src/education/components/headers";
import { router, useLocalSearchParams } from 'expo-router';

// Mock exam data (in a real app, this would come from an API)
const MOCK_EXAMS = [
  {
    id: "1",
    title: "O/L Mathematics - Algebra",
    subject: "Mathematics",
    difficulty: "intermediate",
    questionsCount: 25,
    timeLimit: 45,
    passingScore: 60,
    maxScore: 100,
    attempts: 2,
    maxAttempts: 5,
    bestScore: 78,
    description: "Test your knowledge of algebraic expressions, equations, and problem-solving techniques.",
    isCompleted: true,
  },
  {
    id: "2",
    title: "A/L Biology - Human Biology",
    subject: "Science",
    difficulty: "advanced",
    questionsCount: 30,
    timeLimit: 60,
    passingScore: 75,
    maxScore: 100,
    attempts: 1,
    maxAttempts: 3,
    bestScore: 85,
    description: "Advanced concepts in human anatomy, physiology, and biological processes.",
    isCompleted: true,
  },
  {
    id: "3",
    title: "O/L Sinhala Literature",
    subject: "Languages",
    difficulty: "intermediate",
    questionsCount: 20,
    timeLimit: 40,
    passingScore: 65,
    maxScore: 100,
    attempts: 0,
    maxAttempts: 5,
    bestScore: 0,
    description: "Classical and modern Sinhala literature analysis and comprehension.",
    isCompleted: false,
  },
  // Add more exams as needed
];

export default function ExamStartScreen() {
  const { examId } = useLocalSearchParams();
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { tokens, getGradient } = themeContext;

  // Find the exam by ID
  const exam = MOCK_EXAMS.find(e => e.id === examId);

  if (!exam) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exam not found</Text>
      </View>
    );
  }

  const handleStartExam = () => {
    // Navigate to the actual exam taking screen
    router.push(`/(services)/education/exam/${examId}/take` as any);
  };

  const handleBackPress = () => {
    router.back();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return tokens.colors.success;
      case "intermediate":
        return tokens.colors.warning;
      case "advanced":
        return tokens.colors.error;
      case "expert":
        return tokens.colors.error;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const backgroundGradient = getGradient('background');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <EducationScreenHeader
          title="Exam Details"
          subtitle="Review exam information before starting"
          onBackPress={handleBackPress}
        />
        
        <View style={styles.contentWrapper}>
          <View style={styles.startScreen}>
            <View style={styles.examHeader}>
              <Text style={styles.examTitle}>{exam.title}</Text>
              <View style={styles.examMeta}>
                <View style={styles.subjectBadge}>
                  <Text style={styles.subjectText}>{exam.subject}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}>
                  <Text style={styles.difficultyText}>
                    {exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.examDescription}>{exam.description}</Text>
            
            <View style={styles.examInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Questions:</Text>
                <Text style={styles.infoValue}>{exam.questionsCount}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Time Limit:</Text>
                <Text style={styles.infoValue}>{exam.timeLimit} minutes</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Passing Score:</Text>
                <Text style={styles.infoValue}>{exam.passingScore}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Attempts Left:</Text>
                <Text style={styles.infoValue}>{exam.maxAttempts - exam.attempts}</Text>
              </View>
              {exam.bestScore > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Best Score:</Text>
                  <Text style={[styles.infoValue, { color: exam.bestScore >= exam.passingScore ? tokens.colors.success : tokens.colors.error }]}>
                    {exam.bestScore}%
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionSection}>
              {exam.attempts >= exam.maxAttempts && exam.bestScore < exam.passingScore ? (
                <TouchableOpacity style={styles.disabledButton} disabled>
                  <Text style={styles.disabledButtonText}>Max Attempts Reached</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.startExamButton} onPress={handleStartExam}>
                  <Text style={styles.startExamButtonText}>
                    {exam.attempts === 0 ? "Start Exam" : "Retake Exam"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      return {
        softBackground: "#FDFAFF",
        softSurface: "#F9F2FF",
      };
    } else if (primaryColor === "#0D47A1") {
      return {
        softBackground: "#F8FAFE",
        softSurface: "#F0F6FF",
      };
    } else if (primaryColor === "#2E7D32") {
      return {
        softBackground: "#F9FDF9",
        softSurface: "#F2F8F2",
      };
    } else if (primaryColor === "#E91E63") {
      return {
        softBackground: "#FFFAFC",
        softSurface: "#FFF2F7",
      };
    } else {
      return {
        softBackground: "#F8FAFE",
        softSurface: "#F0F6FF",
      };
    }
  };

  const backgroundColors = getSoftTintedColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    gradientBackground: {
      flex: 1,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: backgroundColors.softSurface,
      marginTop: -tokens.spacing.lg,
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    startScreen: {
      flex: 1,
      padding: tokens.spacing.xl,
      justifyContent: 'center',
    },
    examHeader: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xl,
    },
    examTitle: {
      fontSize: tokens.typography.display,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      textAlign: 'center',
      marginBottom: tokens.spacing.md,
      lineHeight: tokens.typography.display * 1.2,
    },
    examMeta: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    subjectBadge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.md,
    },
    subjectText: {
      fontSize: tokens.typography.body,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    difficultyBadge: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.md,
    },
    difficultyText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    examDescription: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: tokens.spacing.xl,
      lineHeight: tokens.typography.subtitle * 1.4,
    },
    examInfo: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      marginBottom: tokens.spacing.xl,
      ...tokens.shadows.sm,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md,
    },
    infoLabel: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurface,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.primary,
      fontWeight: tokens.typography.bold,
    },
    actionSection: {
      alignItems: 'center',
    },
    startExamButton: {
      backgroundColor: tokens.colors.primary,
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xl * 2,
      borderRadius: tokens.borderRadius.lg,
      alignItems: 'center',
      minWidth: 200,
      ...tokens.shadows.md,
    },
    startExamButtonText: {
      fontSize: tokens.typography.title,
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
    },
    disabledButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xl * 2,
      borderRadius: tokens.borderRadius.lg,
      alignItems: 'center',
      minWidth: 200,
    },
    disabledButtonText: {
      fontSize: tokens.typography.title,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: tokens.typography.bold,
    },
    errorText: {
      fontSize: tokens.typography.title,
      color: tokens.colors.error,
      textAlign: 'center',
      marginTop: tokens.spacing.xl,
    },
  });
};