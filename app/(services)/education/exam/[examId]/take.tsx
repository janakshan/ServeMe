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
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { router, useLocalSearchParams } from 'expo-router';

// Mock questions data (in a real app, this would come from an API)
const MOCK_QUESTIONS = [
  {
    id: "1",
    question: "What is the value of x in the equation 2x + 5 = 15?",
    options: [
      "5",
      "10",
      "7.5",
      "20",
    ],
    correctAnswer: 0,
    explanation: "To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.",
  },
  {
    id: "2",
    question: "Which king built the ancient city of Polonnaruwa in Sri Lanka?",
    options: [
      "King Dutugemunu",
      "King Parakramabahu I",
      "King Kasyapa",
      "King Vijayabahu I",
    ],
    correctAnswer: 1,
    explanation: "King Parakramabahu I (1153-1186 CE) was responsible for the development of Polonnaruwa as a major city.",
  },
  {
    id: "3",
    question: "What is the main function of the heart in the human circulatory system?",
    options: [
      "To produce blood cells",
      "To pump blood throughout the body",
      "To filter waste products",
      "To store oxygen",
    ],
    correctAnswer: 1,
    explanation: "The heart's primary function is to pump blood throughout the body, delivering oxygen and nutrients to tissues.",
  },
  {
    id: "4",
    question: "Which literary work is considered the greatest epic poem in Sinhala literature?",
    options: [
      "Mahavamsa",
      "Sasadavata",
      "Kavsilumina",
      "Saddharma Ratnavaliya",
    ],
    correctAnswer: 2,
    explanation: "Kavsilumina, written by Alagiyavanna Mukaveti, is considered one of the greatest works in classical Sinhala literature.",
  },
  {
    id: "5",
    question: "What is the acceleration due to gravity on Earth?",
    options: [
      "9.8 m/s²",
      "10 m/s²",
      "8.9 m/s²",
      "11 m/s²",
    ],
    correctAnswer: 0,
    explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
  },
];

export default function ExamTakeScreen() {
  const { examId } = useLocalSearchParams();
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { tokens } = themeContext;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitExam();
    }
  }, [timeLeft, showResult]);

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
    
    Alert.alert(
      "Exam Completed!",
      `Your score: ${score}%\nCorrect answers: ${correctAnswers}/${MOCK_QUESTIONS.length}`,
      [
        { 
          text: "OK", 
          onPress: () => {
            // Navigate back to exams list
            router.push("/(services)/education/(tabs)/exams" as any);
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert(
      "Exit Exam",
      "Are you sure you want to exit? Your progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Exit", 
          style: "destructive", 
          onPress: () => router.back() 
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Exam in Progress</Text>
        <View style={styles.timer}>
          <Ionicons name="time" size={16} color={tokens.colors.error} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

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
            <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledNavButtonText]}>
              Previous
            </Text>
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
    </View>
  );
}

const createStyles = (tokens: any) =>
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
      paddingTop: tokens.spacing.xl + tokens.spacing.md, // Account for status bar
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
    disabledNavButtonText: {
      color: tokens.colors.onSurfaceVariant,
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