import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

const MOCK_EXAMS = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    subject: "Programming",
    difficulty: "beginner",
    questionsCount: 20,
    timeLimit: 30,
    passingScore: 70,
    maxScore: 100,
    attempts: 3,
    maxAttempts: 5,
    bestScore: 85,
    description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
    isCompleted: true,
  },
  {
    id: "2",
    title: "React Native Components",
    subject: "Programming",
    difficulty: "intermediate",
    questionsCount: 25,
    timeLimit: 45,
    passingScore: 75,
    maxScore: 100,
    attempts: 1,
    maxAttempts: 3,
    bestScore: 92,
    description: "Advanced concepts in React Native including hooks, navigation, and state management.",
    isCompleted: true,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    subject: "Design",
    difficulty: "beginner",
    questionsCount: 15,
    timeLimit: 25,
    passingScore: 65,
    maxScore: 100,
    attempts: 0,
    maxAttempts: 5,
    bestScore: 0,
    description: "Basic principles of user interface and user experience design.",
    isCompleted: false,
  },
  {
    id: "4",
    title: "Advanced CSS Techniques",
    subject: "Design",
    difficulty: "advanced",
    questionsCount: 30,
    timeLimit: 60,
    passingScore: 80,
    maxScore: 100,
    attempts: 2,
    maxAttempts: 3,
    bestScore: 78,
    description: "Master advanced CSS features including animations, grid, and responsive design.",
    isCompleted: false,
  },
  {
    id: "5",
    title: "Digital Marketing Basics",
    subject: "Business",
    difficulty: "beginner",
    questionsCount: 18,
    timeLimit: 35,
    passingScore: 70,
    maxScore: 100,
    attempts: 0,
    maxAttempts: 4,
    bestScore: 0,
    description: "Introduction to digital marketing strategies and tools.",
    isCompleted: false,
  },
];

const MOCK_QUESTIONS = [
  {
    id: "1",
    question: "What is the correct way to declare a variable in JavaScript?",
    options: [
      "var myVariable;",
      "variable myVariable;",
      "v myVariable;",
      "declare myVariable;",
    ],
    correctAnswer: 0,
    explanation: "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
  },
  {
    id: "2",
    question: "Which of the following is a JavaScript framework?",
    options: [
      "HTML",
      "CSS",
      "React",
      "Python",
    ],
    correctAnswer: 2,
    explanation: "React is a popular JavaScript library/framework for building user interfaces.",
  },
  {
    id: "3",
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Dynamic Object Method",
      "Document Operation Mode",
    ],
    correctAnswer: 0,
    explanation: "DOM stands for Document Object Model, which represents the structure of HTML documents.",
  },
];

const DIFFICULTY_FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];
const SUBJECT_FILTERS = ["All", "Programming", "Design", "Business"];

interface ExamCardProps {
  exam: any;
  onPress: (exam: any) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  const styles = useThemedStyles(createExamCardStyles);
  const { tokens } = useServiceTheme();

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
          <Text style={styles.difficultyText}>{exam.difficulty}</Text>
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

interface ExamModalProps {
  exam: any;
  visible: boolean;
  onClose: () => void;
}

const ExamModal: React.FC<ExamModalProps> = ({ exam, visible, onClose }) => {
  const styles = useThemedStyles(createExamModalStyles);
  const { tokens } = useServiceTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam?.timeLimit * 60 || 0);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && examStarted) {
      handleSubmitExam();
    }
  }, [timeLeft, examStarted]);

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(exam.timeLimit * 60);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === MOCK_QUESTIONS[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / MOCK_QUESTIONS.length) * 100);
    setShowResult(true);
    setExamStarted(false);
    
    Alert.alert(
      "Exam Completed!",
      `Your score: ${score}%\nCorrect answers: ${correctAnswers}/${MOCK_QUESTIONS.length}`,
      [{ text: "OK" }]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!exam) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>{exam.title}</Text>
          {examStarted && (
            <View style={styles.timer}>
              <Ionicons name="time" size={16} color={tokens.colors.error} />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          )}
        </View>

        {!examStarted ? (
          <View style={styles.startScreen}>
            <Text style={styles.examTitle}>{exam.title}</Text>
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
            </View>

            <TouchableOpacity style={styles.startExamButton} onPress={startExam}>
              <Text style={styles.startExamButtonText}>Start Exam</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.examScreen}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionCounter}>
                Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100}%`,
                      backgroundColor: tokens.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <ScrollView style={styles.questionContent}>
              <Text style={styles.questionText}>
                {MOCK_QUESTIONS[currentQuestion].question}
              </Text>

              <View style={styles.optionsContainer}>
                {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswers[currentQuestion] === index && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelect(index)}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.optionIndicator,
                          selectedAnswers[currentQuestion] === index && styles.selectedIndicator,
                        ]}
                      >
                        <Text style={styles.optionLetter}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, currentQuestion === 0 && styles.disabledNavButton]}
                onPress={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>

              {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitExam}>
                  <Text style={styles.submitButtonText}>Submit Exam</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.navButton} onPress={handleNextQuestion}>
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default function ExamsScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedExam, setSelectedExam] = useState(null);
  const [examModalVisible, setExamModalVisible] = useState(false);
  const styles = useThemedStyles(createStyles);

  const filteredExams = MOCK_EXAMS.filter(exam => {
    const matchesDifficulty = selectedDifficulty === "All" || 
      exam.difficulty === selectedDifficulty.toLowerCase();
    const matchesSubject = selectedSubject === "All" || exam.subject === selectedSubject;
    return matchesDifficulty && matchesSubject;
  });

  const handleExamPress = (exam: any) => {
    setSelectedExam(exam);
    setExamModalVisible(true);
  };

  const handleCloseExamModal = () => {
    setExamModalVisible(false);
    setSelectedExam(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Difficulty:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {DIFFICULTY_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedDifficulty === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedDifficulty(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === filter && styles.filterButtonTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Subject:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {SUBJECT_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedSubject === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedSubject(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedSubject === filter && styles.filterButtonTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.examsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Exams</Text>
          <Text style={styles.examCount}>
            {filteredExams.length} exams
          </Text>
        </View>

        {filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onPress={handleExamPress}
          />
        ))}
      </ScrollView>

      <ExamModal
        exam={selectedExam}
        visible={examModalVisible}
        onClose={handleCloseExamModal}
      />
    </View>
  );
}

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    filtersSection: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    filterLabel: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    filterContainer: {
      marginBottom: tokens.spacing.sm,
    },
    filterButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.full,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
    },
    filterButtonActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    filterButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: "500",
    },
    filterButtonTextActive: {
      color: tokens.colors.onPrimary,
    },
    examsContainer: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    sectionTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    examCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
  });

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
      color: tokens.colors.primary,
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
      fontWeight: tokens.typography.semiBold,
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

const createExamModalStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    closeButton: {
      padding: tokens.spacing.sm,
    },
    title: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      flex: 1,
      textAlign: "center",
    },
    timer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.colors.errorContainer,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
    },
    timerText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.error,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
    startScreen: {
      flex: 1,
      padding: tokens.spacing.xl,
      justifyContent: "center",
    },
    examTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      textAlign: "center",
      marginBottom: tokens.spacing.md,
    },
    examDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginBottom: tokens.spacing.xl,
      lineHeight: 22,
    },
    examInfo: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.xl,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.sm,
    },
    infoLabel: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
    },
    infoValue: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: "600",
    },
    startExamButton: {
      backgroundColor: tokens.colors.primary,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      alignItems: "center",
    },
    startExamButtonText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    examScreen: {
      flex: 1,
    },
    questionHeader: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    questionCounter: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginBottom: tokens.spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
    },
    progressFill: {
      height: "100%",
      borderRadius: tokens.borderRadius.sm,
    },
    questionContent: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    questionText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xl,
      lineHeight: 24,
    },
    optionsContainer: {
      marginBottom: tokens.spacing.md,
    },
    optionButton: {
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: tokens.borderRadius.md,
      marginBottom: tokens.spacing.md,
      overflow: "hidden",
    },
    selectedOption: {
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.primaryContainer,
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: tokens.spacing.md,
    },
    optionIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: tokens.colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    selectedIndicator: {
      backgroundColor: tokens.colors.primary,
    },
    optionLetter: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: "600",
    },
    optionText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      flex: 1,
    },
    navigationButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border,
    },
    navButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
      minWidth: 80,
      alignItems: "center",
    },
    disabledNavButton: {
      borderColor: tokens.colors.surfaceVariant,
    },
    navButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: "600",
    },
    submitButton: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      minWidth: 80,
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
  });