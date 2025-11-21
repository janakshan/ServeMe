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
import { MOCK_COMPETITION_EXAMS, Exam, CompetitionExam, PracticeExam } from '@/utils/examData';
import { LiveCompetitionCard } from '@/components/ui/LiveCompetitionCard';

const MOCK_PRACTICE_EXAMS: PracticeExam[] = [
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
    examType: 'practice',
    createdAt: new Date('2024-01-10'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-12'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-08'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-15'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-18'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-22'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-25'),
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
    examType: 'practice',
    createdAt: new Date('2024-01-28'),
  },
];


const DIFFICULTY_FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];
const SUBJECT_FILTERS = ["All", "Mathematics", "Science", "Languages", "Social Studies"];

type ExamTab = 'practice' | 'generated' | 'competition';

const EXAM_TABS = [
  { id: 'practice' as ExamTab, label: 'Practice', icon: 'library' },
  { id: 'competition' as ExamTab, label: 'Competitions', icon: 'trophy' },
];

interface ExamCardProps {
  exam: Exam;
  onPress: (exam: Exam) => void;
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

  const getStatusColor = (exam: Exam) => {
    if (exam.bestScore >= exam.passingScore) {
      return tokens.colors.success;
    }
    if (exam.attempts >= exam.maxAttempts) {
      return tokens.colors.error;
    }
    return tokens.colors.warning;
  };

  const getCompetitionPhaseColor = (phase: string) => {
    switch (phase) {
      case 'registration': return tokens.colors.primary;
      case 'live': return tokens.colors.primaryLight;
      case 'results': return tokens.colors.success;
      case 'ended': return tokens.colors.onSurfaceVariant;
      default: return tokens.colors.onSurfaceVariant;
    }
  };

  const getCompetitionPhaseText = (phase: string) => {
    switch (phase) {
      case 'registration': return 'Registration Open';
      case 'live': return 'LIVE NOW';
      case 'results': return 'Results Available';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    });
  };

  const isCompetition = exam.examType === 'competition';
  const competitionExam = isCompetition ? exam as CompetitionExam : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompetition && styles.competitionCard,
      ]}
      onPress={() => onPress(exam)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {isCompetition && (
          <View style={styles.crownContainer}>
            <Ionicons name="trophy" size={18} color={tokens.colors.primary} />
          </View>
        )}
        
        <View style={styles.badgeContainer}>
          {isCompetition ? (
            <View style={styles.competitionBadge}>
              <Text style={styles.competitionBadgeText}>COMPETITION</Text>
            </View>
          ) : exam.examType === 'generated' ? (
            <View style={styles.generatedBadge}>
              <Text style={styles.generatedBadgeText}>GENERATED</Text>
            </View>
          ) : (
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectText}>{exam.subject}</Text>
            </View>
          )}
        </View>
        
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}>
          <Text style={styles.difficultyText}>{exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{exam.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {exam.description}
      </Text>

      {isCompetition && competitionExam && (
        <View style={styles.competitionInfo}>
          <View style={styles.competitionPhase}>
            <View style={[
              styles.phaseBadge, 
              { backgroundColor: getCompetitionPhaseColor(competitionExam.competitionData.phase) }
            ]}>
              <Text style={styles.phaseText}>
                {getCompetitionPhaseText(competitionExam.competitionData.phase)}
              </Text>
            </View>
          </View>
          
          <View style={styles.competitionStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.statText}>
                {competitionExam.competitionData.currentParticipants}/{competitionExam.competitionData.maxParticipants}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={16} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.statText}>
                {formatDate(competitionExam.competitionData.startDate)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="business" size={16} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.statText} numberOfLines={1}>
                {competitionExam.competitionData.organizerName}
              </Text>
            </View>
          </View>
        </View>
      )}

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
        {isCompetition && competitionExam ? (
          // Competition-specific actions
          competitionExam.competitionData.phase === 'registration' ? (
            competitionExam.competitionData.isRegistered ? (
              <TouchableOpacity style={styles.registeredButton} disabled>
                <Ionicons name="checkmark-circle" size={16} color={tokens.colors.primary} />
                <Text style={styles.registeredButtonText}>Registered</Text>
              </TouchableOpacity>
            ) : competitionExam.competitionData.registrationStatus === 'open' ? (
              <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.disabledButton} disabled>
                <Text style={styles.disabledButtonText}>
                  {competitionExam.competitionData.registrationStatus === 'closed' ? 'Registration Closed' : 'Competition Full'}
                </Text>
              </TouchableOpacity>
            )
          ) : competitionExam.competitionData.phase === 'live' && competitionExam.competitionData.isRegistered ? (
            <TouchableOpacity style={styles.liveButton}>
              <Ionicons name="play-circle" size={16} color={tokens.colors.onPrimary} />
              <Text style={styles.liveButtonText}>Join Competition</Text>
            </TouchableOpacity>
          ) : competitionExam.competitionData.phase === 'results' ? (
            <TouchableOpacity style={styles.resultsButton}>
              <Ionicons name="trophy" size={16} color={tokens.colors.success} />
              <Text style={styles.resultsButtonText}>View Results</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.disabledButton} disabled>
              <Text style={styles.disabledButtonText}>Competition Ended</Text>
            </TouchableOpacity>
          )
        ) : (
          // Regular exam actions
          exam.attempts >= exam.maxAttempts && exam.bestScore < exam.passingScore ? (
            <TouchableOpacity style={styles.disabledButton} disabled>
              <Text style={styles.disabledButtonText}>Max Attempts Reached</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>
                {exam.attempts === 0 ? "Start Exam" : "Retake Exam"}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </TouchableOpacity>
  );
};


export default function ExamsScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ExamTab>('practice');
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { getGradient, tokens } = themeContext;

  // Combine all exams with mock generated exams (in real app, these would come from state/API)
  const mockGeneratedExams: Exam[] = []; // This would be populated from user's generated exams
  const allExams: Exam[] = [...MOCK_PRACTICE_EXAMS, ...mockGeneratedExams, ...MOCK_COMPETITION_EXAMS];

  // Filter exams by active tab - include generated exams in practice tab
  const examsByTab = allExams.filter(exam => {
    if (activeTab === 'practice') {
      return exam.examType === 'practice' || exam.examType === 'generated';
    }
    return exam.examType === activeTab;
  });
  
  // Apply difficulty and subject filters to current tab's exams
  const filteredExams = examsByTab.filter(exam => {
    const matchesDifficulty = selectedDifficulty === "All" || 
      exam.difficulty === selectedDifficulty.toLowerCase();
    const matchesSubject = selectedSubject === "All" || exam.subject === selectedSubject;
    return matchesDifficulty && matchesSubject;
  });

  const handleExamPress = (exam: Exam) => {
    router.push(`/(services)/education/exam/${exam.id}` as any);
  };

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleGenerateExam = () => {
    router.push('/(services)/education/generate-exam');
  };

  const handleJoinCompetition = (exam: CompetitionExam) => {
    // Handle competition joining logic - could update participation count, etc.
    console.log('Joining competition:', exam.id);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'practice': return 'Practice Exams';
      case 'competition': return 'Competitions';
      default: return 'Exams';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'practice': return 'Test your knowledge and generate custom exams';
      case 'competition': return 'Join live competitions and challenges';
      default: return 'Select exam type';
    }
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
          title={getTabTitle()}
          subtitle={getTabSubtitle()}
          rightAction={{
            icon: "options-outline",
            onPress: handleFilterToggle,
          }}
        />
        
        <View style={styles.contentWrapper}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {EXAM_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={18} 
                  color={activeTab === tab.id ? tokens.colors.onPrimary : tokens.colors.onSurfaceVariant} 
                />
                <Text style={[
                  styles.tabButtonText,
                  activeTab === tab.id && styles.tabButtonTextActive,
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
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
{activeTab === 'practice' && (
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateExam}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={20} color={tokens.colors.onPrimary} />
                  <Text style={styles.generateButtonText}>Generate</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <ScrollView
            style={styles.examsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {filteredExams.map((exam) => {
              // Show special live competition card for live competitions
              if (exam.examType === 'competition') {
                const competitionExam = exam as CompetitionExam;
                if (competitionExam.competitionData.phase === 'live') {
                  return (
                    <LiveCompetitionCard
                      key={exam.id}
                      exam={competitionExam}
                      onJoin={handleJoinCompetition}
                    />
                  );
                }
              }
              
              // Show regular exam card for all other exams
              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onPress={handleExamPress}
                />
              );
            })}
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Floating Action Button - Only show for practice exams */}
          {activeTab === 'practice' && (
            <TouchableOpacity
              style={styles.floatingActionButton}
              onPress={handleGenerateExam}
              activeOpacity={0.8}
            >
              <Ionicons name="create" size={24} color={tokens.colors.onPrimary} />
            </TouchableOpacity>
          )}
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
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: tokens.colors.surface,
      marginHorizontal: tokens.spacing.md,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.xs,
      ...tokens.shadows.sm,
    },
    tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      gap: tokens.spacing.xs,
      backgroundColor: 'transparent',
    },
    tabButtonActive: {
      backgroundColor: tokens.colors.primary,
      ...tokens.shadows.sm,
    },
    tabButtonText: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.medium,
      color: tokens.colors.onSurfaceVariant,
    },
    tabButtonTextActive: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.semibold,
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
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    competitionCard: {
      borderWidth: 2,
      borderColor: tokens.colors.primary + '30',
      backgroundColor: tokens.colors.primaryLight + '05',
      ...tokens.shadows.lg,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
      minHeight: 32,
    },
    crownContainer: {
      marginRight: tokens.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.primary + '15',
      borderRadius: tokens.borderRadius.sm,
      padding: tokens.spacing.xs,
    },
    badgeContainer: {
      flex: 1,
      marginRight: tokens.spacing.sm,
    },
    competitionBadge: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    competitionBadgeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "700",
    },
    generatedBadge: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    generatedBadgeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
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
      marginBottom: tokens.spacing.sm,
      lineHeight: 22,
    },
    description: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
      lineHeight: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: tokens.spacing.xs,
    },
    infoText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: 'center',
      fontWeight: '500',
    },
    scoreSection: {
      marginBottom: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    scoreRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.xs,
      gap: tokens.spacing.sm,
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
      alignItems: "center",
      justifyContent: "center",
      marginTop: tokens.spacing.xs,
    },
    attemptsLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    actionRow: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: tokens.spacing.sm,
    },
    startButton: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    disabledButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      minWidth: 110,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: "600",
    },
    // Competition-specific styles
    competitionInfo: {
      backgroundColor: tokens.colors.primary + '08',
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary + '20',
    },
    competitionPhase: {
      marginBottom: tokens.spacing.sm,
      alignItems: 'center',
    },
    phaseBadge: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.lg,
      alignSelf: 'center',
    },
    phaseText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: '700',
    },
    competitionStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingTop: tokens.spacing.xs,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      gap: tokens.spacing.xs,
    },
    statText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
      textAlign: 'center',
    },
    // Competition action buttons
    registerButton: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 110,
    },
    registerButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    registeredButton: {
      backgroundColor: tokens.colors.primaryLight + '15',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.xs,
      minWidth: 110,
    },
    registeredButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.primary,
      fontWeight: "600",
    },
    liveButton: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.xs,
      minWidth: 110,
    },
    liveButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    resultsButton: {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      borderColor: tokens.colors.success,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.xs,
      minWidth: 110,
    },
    resultsButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.success,
      fontWeight: "600",
    },
  });

