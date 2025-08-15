import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { EducationHeader, EducationScreenHeader } from "@/src/education/components/headers";
import { router } from 'expo-router';

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
  {
    id: "4",
    title: "A/L Physics - Mechanics",
    subject: "Science",
    difficulty: "advanced",
    questionsCount: 35,
    timeLimit: 75,
    passingScore: 80,
    maxScore: 100,
    attempts: 3,
    maxAttempts: 3,
    bestScore: 72,
    description: "Advanced mechanics including motion, forces, energy, and momentum.",
    isCompleted: false,
  },
  {
    id: "5",
    title: "O/L Sri Lankan History",
    subject: "Social Studies",
    difficulty: "intermediate",
    questionsCount: 22,
    timeLimit: 35,
    passingScore: 60,
    maxScore: 100,
    attempts: 1,
    maxAttempts: 4,
    bestScore: 68,
    description: "Sri Lankan history from ancient times to modern era.",
    isCompleted: true,
  },
  {
    id: "6",
    title: "A/L Combined Mathematics",
    subject: "Mathematics",
    difficulty: "expert",
    questionsCount: 40,
    timeLimit: 90,
    passingScore: 85,
    maxScore: 100,
    attempts: 0,
    maxAttempts: 2,
    bestScore: 0,
    description: "Advanced calculus, statistics, and mathematical modeling.",
    isCompleted: false,
  },
  {
    id: "7",
    title: "O/L English Language",
    subject: "Languages",
    difficulty: "intermediate",
    questionsCount: 25,
    timeLimit: 50,
    passingScore: 65,
    maxScore: 100,
    attempts: 2,
    maxAttempts: 5,
    bestScore: 82,
    description: "English grammar, vocabulary, and comprehension skills.",
    isCompleted: true,
  },
  {
    id: "8",
    title: "A/L Chemistry - Organic Chemistry",
    subject: "Science",
    difficulty: "advanced",
    questionsCount: 28,
    timeLimit: 65,
    passingScore: 75,
    maxScore: 100,
    attempts: 1,
    maxAttempts: 3,
    bestScore: 79,
    description: "Advanced organic chemistry concepts and reactions.",
    isCompleted: true,
  },
];


const DIFFICULTY_FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];
const SUBJECT_FILTERS = ["All", "Mathematics", "Science", "Languages", "Social Studies"];

interface ExamCardProps {
  exam: any;
  onPress: (exam: any) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createExamCardStyles, themeContext);
  const { tokens } = themeContext;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return tokens.colors.success;
      case "intermediate":
        return tokens.colors.warning;
      case "advanced":
        return tokens.colors.error;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getStatusColor = (exam: any) => {
    if (exam.bestScore >= exam.passingScore) {
      return tokens.colors.success;
    }
    if (exam.attempts >= exam.maxAttempts) {
      return tokens.colors.error;
    }
    return tokens.colors.warning;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(exam)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{exam.subject}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}>
          <Text style={styles.difficultyText}>{exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{exam.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {exam.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="help-circle" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{exam.questionsCount} questions</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{exam.timeLimit} min</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{exam.passingScore}% to pass</Text>
        </View>
      </View>

      <View style={styles.scoreSection}>
        {exam.isCompleted ? (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Best Score:</Text>
            <Text style={[styles.scoreValue, { color: getStatusColor(exam) }]}>
              {exam.bestScore}%
            </Text>
          </View>
        ) : null}
        <View style={styles.attemptsRow}>
          <Text style={styles.attemptsLabel}>
            Attempts: {exam.attempts}/{exam.maxAttempts}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {exam.attempts >= exam.maxAttempts && exam.bestScore < exam.passingScore ? (
          <TouchableOpacity style={styles.disabledButton} disabled>
            <Text style={styles.disabledButtonText}>Max Attempts Reached</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>
              {exam.attempts === 0 ? "Start Exam" : "Retake Exam"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};


export default function ExamsScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { getGradient, tokens } = themeContext;

  const filteredExams = MOCK_EXAMS.filter(exam => {
    const matchesDifficulty = selectedDifficulty === "All" || 
      exam.difficulty === selectedDifficulty.toLowerCase();
    const matchesSubject = selectedSubject === "All" || exam.subject === selectedSubject;
    return matchesDifficulty && matchesSubject;
  });

  const handleExamPress = (exam: any) => {
    router.push(`/(services)/education/exam/${exam.id}` as any);
  };

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleGenerateExam = () => {
    router.push('/(services)/education/generate-exam');
  };

  // Create a subtle gradient background that transitions from header
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
          title="Practice Exams"
          subtitle="Test your knowledge and track progress"
          rightAction={{
            icon: "options-outline",
            onPress: handleFilterToggle,
          }}
        />
        
        <View style={styles.contentWrapper}>
          {isFilterVisible && (
            <EducationHeader
              variant="exams"
              filters={{
                options: DIFFICULTY_FILTERS.map((filter) => ({
                  id: filter,
                  label: filter,
                  value: filter,
                })),
                selectedValue: selectedDifficulty,
                onSelect: setSelectedDifficulty,
                label: "Difficulty:",
              }}
              secondaryFilters={{
                options: SUBJECT_FILTERS.map((filter) => ({
                  id: filter,
                  label: filter,
                  value: filter,
                })),
                selectedValue: selectedSubject,
                onSelect: setSelectedSubject,
                label: "Subject:",
              }}
              section={{
                title: "Available Exams",
                count: filteredExams.length,
                countLabel: "exams",
              }}
            />
          )}
          
          {!isFilterVisible && (
            <View style={styles.simpleHeader}>
              <View style={styles.simpleHeaderLeft}>
                <Text style={styles.simpleHeaderTitle}>
                  Available Exams
                </Text>
                <Text style={styles.simpleHeaderCount}>
                  {filteredExams.length} exams
                </Text>
              </View>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateExam}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color={tokens.colors.onPrimary} />
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            style={styles.examsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onPress={handleExamPress}
              />
            ))}
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.floatingActionButton}
            onPress={handleGenerateExam}
            activeOpacity={0.8}
          >
            <Ionicons name="create" size={24} color={tokens.colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      // Purple theme - soft purple tints
      return {
        softBackground: "#FDFAFF", // Very light purple tint
        softSurface: "#F9F2FF", // Light purple tint
      };
    } else if (primaryColor === "#0D47A1") {
      // Professional blue theme - soft blue tints
      return {
        softBackground: "#F8FAFE", // Very light blue tint
        softSurface: "#F0F6FF", // Light blue tint for cards/surfaces
      };
    } else if (primaryColor === "#2E7D32") {
      // Green theme - soft green tints
      return {
        softBackground: "#F9FDF9", // Very light green tint
        softSurface: "#F2F8F2", // Light green tint
      };
    } else if (primaryColor === "#E91E63") {
      // Pink theme - soft pink tints
      return {
        softBackground: "#FFFAFC", // Very light pink tint
        softSurface: "#FFF2F7", // Light pink tint
      };
    } else {
      // Default soft blue tints
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
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    examsContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      backgroundColor: 'transparent',
    },
    bottomSpacing: {
      height: 100, // Space for tab bar
    },
    simpleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border + '20',
    },
    simpleHeaderLeft: {
      flex: 1,
    },
    simpleHeaderTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    simpleHeaderCount: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    generateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      gap: tokens.spacing.xs,
      ...tokens.shadows.sm,
    },
    generateButtonText: {
      fontSize: tokens.typography.body,
      fontWeight: '600',
      color: tokens.colors.onPrimary,
    },
    floatingActionButton: {
      position: 'absolute',
      bottom: tokens.spacing.xl,
      right: tokens.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: tokens.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...tokens.shadows.lg,
      elevation: 8, // Android shadow
    },
  });
};

const createExamCardStyles = (tokens: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.sm,
    },
    subjectBadge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    subjectText: {
      fontSize: tokens.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    difficultyBadge: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    difficultyText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    title: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    description: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    infoText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    scoreSection: {
      marginBottom: tokens.spacing.md,
    },
    scoreRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.xs,
    },
    scoreLabel: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
    },
    scoreValue: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
    },
    attemptsRow: {
      alignItems: "flex-end",
    },
    attemptsLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    actionRow: {
      alignItems: "flex-end",
    },
    startButton: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
    },
    startButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    disabledButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
    },
    disabledButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: "600",
    },
  });

