import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Mock questions data (in a real app, this would come from an API)
const MOCK_QUESTIONS = [
  {
    id: "1",
    question: "What is the value of x in the equation 2x + 5 = 15?",
    options: ["5", "10", "7.5", "20"],
    correctAnswer: 0,
    explanation: "To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.",
    points: 10,
  },
  {
    id: "2", 
    question: "Which king built the ancient city of Polonnaruwa in Sri Lanka?",
    options: ["King Dutugemunu", "King Parakramabahu I", "King Kasyapa", "King Vijayabahu I"],
    correctAnswer: 1,
    explanation: "King Parakramabahu I (1153-1186 CE) was responsible for the development of Polonnaruwa as a major city.",
    points: 15,
  },
  {
    id: "3",
    question: "What is the main function of the heart in the human circulatory system?",
    options: ["To produce blood cells", "To pump blood throughout the body", "To filter waste products", "To store oxygen"],
    correctAnswer: 1,
    explanation: "The heart's primary function is to pump blood throughout the body, delivering oxygen and nutrients to tissues.",
    points: 10,
  },
  {
    id: "4",
    question: "Which literary work is considered the greatest epic poem in Sinhala literature?",
    options: ["Mahavamsa", "Sasadavata", "Kavsilumina", "Saddharma Ratnavaliya"],
    correctAnswer: 2,
    explanation: "Kavsilumina, written by Alagiyavanna Mukaveti, is considered one of the greatest works in classical Sinhala literature.",
    points: 20,
  },
  {
    id: "5",
    question: "What is the acceleration due to gravity on Earth?",
    options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
    correctAnswer: 0,
    explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
    points: 10,
  },
];

// Sound effects - will be loaded dynamically
const SOUND_ENABLED = false; // Set to true when sound files are available

interface FloatingTextProps {
  text: string;
  color: string;
  onComplete: () => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, color, onComplete }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-100, { duration: 2000 });
    opacity.value = withTiming(0, { duration: 2000 }, () => {
      runOnJS(onComplete)();
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const floatingTextStyle = {
    position: 'absolute' as const,
    top: height * 0.4,
    left: width * 0.4,
    zIndex: 1000,
  };

  const floatingTextContentStyle = {
    fontSize: 20,
    fontWeight: 'bold' as const,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  };

  return (
    <Animated.View style={[floatingTextStyle, animatedStyle]}>
      <Text style={[floatingTextContentStyle, { color }]}>{text}</Text>
    </Animated.View>
  );
};

// Simplified progress components for React Native

export default function GamifiedExamTakeScreen() {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { tokens } = themeContext;
  
  // Core exam state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [showResult, setShowResult] = useState(false);
  
  // Gamification state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<Array<{id: string, text: string, color: string}>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  // Animation values
  const headerScale = useSharedValue(1);
  const questionScale = useSharedValue(1);
  const progressValue = useSharedValue(0);
  const timerPulse = useSharedValue(1);
  const backgroundColorProgress = useSharedValue(0);
  const celebrationScale = useSharedValue(0);
  
  // Sound system
  const [sounds] = useState<{[key: string]: Audio.Sound}>({});
  const confettiRef = useRef<ConfettiCannon>(null);
  
  // Initialize sound effects
  useEffect(() => {
    const loadSounds = async () => {
      if (!SOUND_ENABLED) {
        console.log('Sound system disabled - enable in code when sound files are available');
        return;
      }
      
      try {
        // Sound loading logic would go here when enabled
        console.log('Sound system would load audio files here');
      } catch (error) {
        console.log('Sound loading error:', error);
      }
    };
    
    loadSounds();
    
    return () => {
      Object.values(sounds).forEach(sound => {
        sound?.unloadAsync();
      });
    };
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (showResult) {
        // If on completion screen, go back to exams
        router.push("/(services)/education/(tabs)/exams" as any);
        return true;
      } else {
        // If taking exam, show confirmation dialog
        handleBackPress();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [showResult]);
  
  // Timer effect with enhanced visuals
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Pulse effect when time is running low
        if (timeLeft <= 300 && timeLeft % 2 === 0) { // Last 5 minutes
          timerPulse.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 })
          );
          playSound('tick');
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitExam();
    }
  }, [timeLeft, showResult]);
  
  // Update progress animation
  useEffect(() => {
    const progress = Math.max(0.01, Math.min(0.99, (currentQuestion + 1) / MOCK_QUESTIONS.length));
    progressValue.value = withSpring(progress);
    
    // Background color animation based on progress
    backgroundColorProgress.value = withTiming(progress);
  }, [currentQuestion]);
  
  // Play sound effect
  const playSound = async (soundName: string) => {
    if (!SOUND_ENABLED) {
      // Visual feedback when sound is disabled
      console.log(`🔊 Sound effect: ${soundName}`);
      return;
    }
    
    try {
      const sound = sounds[soundName];
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.log('Sound play error:', error);
    }
  };
  
  // Add floating text animation
  const addFloatingText = (text: string, color: string) => {
    const id = Date.now().toString();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
  };
  
  // Remove floating text
  const removeFloatingText = (id: string) => {
    setFloatingTexts(prev => prev.filter(item => item.id !== id));
  };
  
  // Enhanced answer selection with gamification
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    const previousAnswer = newAnswers[currentQuestion];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    playSound('buttonTap');
    
    // Animation feedback
    questionScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // If this is a new answer (not changing existing)
    if (previousAnswer === undefined) {
      setTotalAnswered(prev => prev + 1);
      
      const isCorrect = answerIndex === MOCK_QUESTIONS[currentQuestion].correctAnswer;
      const questionPoints = MOCK_QUESTIONS[currentQuestion].points;
      
      if (isCorrect) {
        // Correct answer celebration
        setCorrectCount(prev => prev + 1);
        setStreak(prev => prev + 1);
        
        const streakMultiplier = Math.min(Math.floor(streak / 3) + 1, 5);
        const pointsEarned = questionPoints * streakMultiplier;
        setScore(prev => prev + pointsEarned);
        
        playSound('correct');
        addFloatingText(`+${pointsEarned} points!`, tokens.colors.success);
        
        if (streak > 0 && streak % 3 === 0) {
          addFloatingText(`Streak x${streakMultiplier}!`, tokens.colors.warning);
          playSound('levelUp');
        }
        
        // Confetti for correct answers
        if (streak >= 3) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        
      } else {
        // Wrong answer feedback
        setStreak(0);
        playSound('wrong');
        addFloatingText('Try again!', tokens.colors.error);
      }
      
      // Check for achievements
      checkAchievements();
    }
  };
  
  // Achievement system
  const checkAchievements = () => {
    const newAchievements: string[] = [];
    
    if (correctCount === 1 && !achievements.includes('first_correct')) {
      newAchievements.push('first_correct');
      addFloatingText('First Correct! 🎉', tokens.colors.primary);
    }
    
    if (streak >= 5 && !achievements.includes('streak_master')) {
      newAchievements.push('streak_master');
      addFloatingText('Streak Master! 🔥', tokens.colors.warning);
    }
    
    if (correctCount === MOCK_QUESTIONS.length && !achievements.includes('perfect_score')) {
      newAchievements.push('perfect_score');
      addFloatingText('Perfect Score! 🏆', tokens.colors.success);
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      playSound('levelUp');
    }
  };
  
  // Enhanced navigation with animations
  const handleNextQuestion = () => {
    if (currentQuestion < MOCK_QUESTIONS.length - 1) {
      playSound('buttonTap');
      
      // Slide animation
      questionScale.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
      
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      playSound('buttonTap');
      
      questionScale.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
      
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
      }, 200);
    }
  };
  
  // Epic completion celebration
  const handleSubmitExam = () => {
    setShowResult(true);
    
    // Epic celebration sequence
    celebrationScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(500, withSpring(1, { damping: 10 }))
    );
    
    // Confetti explosion
    setShowConfetti(true);
    confettiRef.current?.start();
    
    playSound('celebration');
    
    // Auto-hide confetti after celebration
    setTimeout(() => setShowConfetti(false), 5000);
  };
  
  // Handle back press with confirmation
  const handleBackPress = () => {
    Alert.alert(
      "Exit Exam?",
      "Your progress and points will be lost. Are you sure?",
      [
        { text: "Keep Playing! 🎮", style: "cancel" },
        { 
          text: "Exit", 
          style: "destructive", 
          onPress: () => router.back() 
        }
      ]
    );
  };
  
  // Format time with colors
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));
  
  const questionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: questionScale.value }],
  }));
  
  const timerAnimatedStyle = useAnimatedStyle(() => {
    const clampedValue = Math.max(1, Math.min(1.2, timerPulse.value));
    return {
      transform: [{ scale: clampedValue }],
      backgroundColor: interpolateColor(
        clampedValue,
        [1.0, 1.2],
        [tokens.colors.error + '20', tokens.colors.error + '40']
      ),
    };
  });
  
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const clampedProgress = Math.max(0.01, Math.min(0.99, backgroundColorProgress.value));
    return {
      backgroundColor: interpolateColor(
        clampedProgress,
        [0.01, 0.5, 0.99],
        [tokens.colors.background, tokens.colors.primary + '10', tokens.colors.success + '15']
      ),
    };
  });
  
  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));
  
  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={100}
          origin={{x: width/2, y: 0}}
          explosionSpeed={350}
          fallSpeed={3000}
          colors={[tokens.colors.primary, tokens.colors.success, tokens.colors.warning, tokens.colors.secondary]}
          autoStart={false}
        />
      )}
      
      {/* Floating Achievement Texts */}
      {floatingTexts.map(item => (
        <FloatingText
          key={item.id}
          text={item.text}
          color={item.color}
          onComplete={() => removeFloatingText(item.id)}
        />
      ))}
      
      {/* Enhanced Gaming Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[
            tokens.colors.primary + 'F0',
            tokens.colors.primary + 'E0',
            tokens.colors.success + '20'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBackPress} style={styles.closeButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.closeButtonGradient}
              >
                <Ionicons name="close" size={24} color={tokens.colors.onPrimary} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.gamingBadge}>
                <LinearGradient
                  colors={[tokens.colors.warning, tokens.colors.warning + 'CC']}
                  style={styles.gamingBadgeGradient}
                >
                  <Ionicons name="game-controller" size={20} color={tokens.colors.onPrimary} />
                  <Text style={styles.title}>Gaming Mode</Text>
                </LinearGradient>
              </View>
              <View style={styles.scoreContainer}>
                <View style={styles.scoreItem}>
                  <LinearGradient
                    colors={[tokens.colors.success + '30', tokens.colors.success + '20']}
                    style={styles.scoreBackground}
                  >
                    <Ionicons name="flash" size={16} color={tokens.colors.success} />
                    <Text style={styles.score}>{score}</Text>
                  </LinearGradient>
                </View>
                {streak > 0 && (
                  <View style={styles.scoreItem}>
                    <LinearGradient
                      colors={[tokens.colors.warning + '30', tokens.colors.warning + '20']}
                      style={styles.scoreBackground}
                    >
                      <Ionicons name="flame" size={16} color={tokens.colors.warning} />
                      <Text style={styles.streak}>{streak}</Text>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>
            
            <Animated.View style={[styles.timer, timerAnimatedStyle]}>
              <LinearGradient
                colors={[tokens.colors.error + '30', tokens.colors.error + '20']}
                style={styles.timerGradient}
              >
                <Ionicons name="time" size={16} color={tokens.colors.error} />
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </LinearGradient>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Enhanced Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.questionCounter}>
            Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
          </Text>
          <Text style={styles.accuracy}>
            🎯 {totalAnswered > 0 ? Math.round((correctCount/totalAnswered) * 100) : 0}% accuracy
          </Text>
        </View>
        
        {/* Animated Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100}%`,
                backgroundColor: tokens.colors.primary,
              },
            ]}
          />
          <View style={styles.progressOverlay} />
        </View>
      </View>

      {/* Question Content with Animations */}
      <Animated.View style={[styles.examScreen, questionAnimatedStyle]}>
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[tokens.colors.surface, tokens.colors.surface + 'F0']}
            style={styles.questionCard}
          >
            <Text style={styles.questionText}>
              {MOCK_QUESTIONS[currentQuestion].question}
            </Text>
          </LinearGradient>

          <View style={styles.optionsContainer}>
            {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrect = index === MOCK_QUESTIONS[currentQuestion].correctAnswer;
              const showResult = selectedAnswers[currentQuestion] !== undefined;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    showResult && isCorrect && styles.correctOption,
                    showResult && isSelected && !isCorrect && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswers[currentQuestion] !== undefined}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      showResult && isCorrect
                        ? [tokens.colors.success + '20', tokens.colors.success + '10']
                        : showResult && isSelected && !isCorrect
                        ? [tokens.colors.error + '20', tokens.colors.error + '10']
                        : isSelected
                        ? [tokens.colors.primary + '20', tokens.colors.primary + '10']
                        : [tokens.colors.surface, tokens.colors.surface + 'F0']
                    }
                    style={styles.optionGradient}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.optionIndicator,
                          isSelected && styles.selectedIndicator,
                          showResult && isCorrect && styles.correctIndicator,
                          showResult && isSelected && !isCorrect && styles.wrongIndicator,
                        ]}
                      >
                        {showResult && isCorrect && (
                          <Ionicons name="checkmark" size={16} color={tokens.colors.onPrimary} />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <Ionicons name="close" size={16} color={tokens.colors.onPrimary} />
                        )}
                        {!showResult && (
                          <Text style={styles.optionLetter}>
                            {String.fromCharCode(65 + index)}
                          </Text>
                        )}
                      </View>
                      <Text style={[
                        styles.optionText,
                        showResult && isCorrect && styles.correctText,
                        showResult && isSelected && !isCorrect && styles.wrongText,
                      ]}>
                        {option}
                      </Text>
                      {showResult && isCorrect && (
                        <View style={styles.pointsBadge}>
                          <Text style={styles.pointsText}>
                            +{MOCK_QUESTIONS[currentQuestion].points}
                          </Text>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Enhanced Navigation */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.disabledNavButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <Ionicons name="chevron-back" size={20} color={
              currentQuestion === 0 ? tokens.colors.onSurfaceVariant : tokens.colors.primary
            } />
            <Text style={[
              styles.navButtonText, 
              currentQuestion === 0 && styles.disabledNavButtonText
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitExam}>
              <LinearGradient
                colors={[tokens.colors.primary, tokens.colors.primary + 'CC']}
                style={styles.submitGradient}
              >
                <Ionicons name="trophy" size={20} color={tokens.colors.onPrimary} />
                <Text style={styles.submitButtonText}>Finish Exam!</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navButton} onPress={handleNextQuestion}>
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color={tokens.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* Epic Exam Completion UI */}
      {showResult && (
        <Animated.View style={[styles.completionOverlay, celebrationAnimatedStyle]}>
          <LinearGradient
            colors={[
              tokens.colors.primary + 'E0',
              tokens.colors.success + 'D0',
              tokens.colors.warning + 'C0',
              tokens.colors.primary + 'F0'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completionGradient}
          >
            {/* Completion Header */}
            <View style={styles.completionHeader}>
              <View style={styles.trophyContainer}>
                <LinearGradient
                  colors={[tokens.colors.warning, tokens.colors.warning + 'CC']}
                  style={styles.trophyBackground}
                >
                  <Ionicons name="trophy" size={60} color={tokens.colors.onPrimary} />
                </LinearGradient>
              </View>
              <Text style={styles.completionTitle}>🎉 Exam Complete! 🎉</Text>
              <Text style={styles.completionSubtitle}>Congratulations on finishing!</Text>
            </View>

            {/* Results Card with Close Button */}
            <View style={styles.resultsCard}>
              <LinearGradient
                colors={[tokens.colors.surface + 'F0', tokens.colors.surface + 'E0']}
                style={styles.resultsCardGradient}
              >
                {/* Close Button Inside Card */}
                <TouchableOpacity 
                  style={styles.cardCloseButton}
                  onPress={() => {
                    router.push("/(services)/education/(tabs)/exams" as any);
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[tokens.colors.error + '20', tokens.colors.error + '30']}
                    style={styles.cardCloseButtonGradient}
                  >
                    <Ionicons name="close" size={20} color={tokens.colors.error} />
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.scoreSection}>
                  <View style={styles.mainScore}>
                    <Text style={styles.scoreLabel}>Final Score</Text>
                    <Text style={styles.scoreValue}>
                      {Math.round((correctCount / MOCK_QUESTIONS.length) * 100)}%
                    </Text>
                    <View style={styles.scoreBar}>
                      <LinearGradient
                        colors={[tokens.colors.success, tokens.colors.success + 'AA']}
                        style={[
                          styles.scoreBarFill,
                          { width: `${Math.round((correctCount / MOCK_QUESTIONS.length) * 100)}%` }
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Statistics Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statisticItem}>
                    <LinearGradient
                      colors={[tokens.colors.primary + '20', tokens.colors.primary + '10']}
                      style={styles.statBackground}
                    >
                      <Ionicons name="flash" size={24} color={tokens.colors.primary} />
                      <Text style={styles.statValue}>{score}</Text>
                      <Text style={styles.statLabel}>Total Points</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.statisticItem}>
                    <LinearGradient
                      colors={[tokens.colors.success + '20', tokens.colors.success + '10']}
                      style={styles.statBackground}
                    >
                      <Ionicons name="checkmark-circle" size={24} color={tokens.colors.success} />
                      <Text style={styles.statValue}>{correctCount}/{MOCK_QUESTIONS.length}</Text>
                      <Text style={styles.statLabel}>Correct</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.statisticItem}>
                    <LinearGradient
                      colors={[tokens.colors.warning + '20', tokens.colors.warning + '10']}
                      style={styles.statBackground}
                    >
                      <Ionicons name="flame" size={24} color={tokens.colors.warning} />
                      <Text style={styles.statValue}>
                        {Math.max(...selectedAnswers.map((_, i) => {
                          let currentStreak = 0;
                          for (let j = 0; j <= i; j++) {
                            if (selectedAnswers[j] === MOCK_QUESTIONS[j].correctAnswer) {
                              currentStreak++;
                            } else {
                              currentStreak = 0;
                            }
                          }
                          return currentStreak;
                        }))}
                      </Text>
                      <Text style={styles.statLabel}>Best Streak</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.statisticItem}>
                    <LinearGradient
                      colors={[tokens.colors.secondary + '20', tokens.colors.secondary + '10']}
                      style={styles.statBackground}
                    >
                      <Ionicons name="medal" size={24} color={tokens.colors.secondary} />
                      <Text style={styles.statValue}>{achievements.length}</Text>
                      <Text style={styles.statLabel}>Achievements</Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Achievement Badges */}
                {achievements.length > 0 && (
                  <View style={styles.achievementsSection}>
                    <Text style={styles.achievementsTitle}>🏆 Achievements Unlocked</Text>
                    <View style={styles.badgesContainer}>
                      {achievements.map((achievement) => (
                        <View key={achievement} style={styles.achievementBadge}>
                          <LinearGradient
                            colors={[tokens.colors.warning, tokens.colors.warning + 'CC']}
                            style={styles.badgeGradient}
                          >
                            <Ionicons 
                              name={
                                achievement === 'first_correct' ? 'star' :
                                achievement === 'streak_master' ? 'flame' :
                                achievement === 'perfect_score' ? 'trophy' : 'medal'
                              } 
                              size={20} 
                              color={tokens.colors.onPrimary} 
                            />
                          </LinearGradient>
                          <Text style={styles.badgeText}>
                            {achievement === 'first_correct' ? 'First Correct!' :
                             achievement === 'streak_master' ? 'Streak Master!' :
                             achievement === 'perfect_score' ? 'Perfect Score!' : 'Achievement'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Performance Message */}
                <View style={styles.performanceMessage}>
                  <LinearGradient
                    colors={
                      Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 80
                        ? [tokens.colors.success + '20', tokens.colors.success + '10']
                        : Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60
                        ? [tokens.colors.warning + '20', tokens.colors.warning + '10']
                        : [tokens.colors.error + '20', tokens.colors.error + '10']
                    }
                    style={styles.messageBackground}
                  >
                    <Text style={styles.performanceText}>
                      {Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 80
                        ? "🌟 Outstanding Performance! You're mastering this subject!"
                        : Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60
                        ? "👍 Good Work! Keep practicing to improve further!"
                        : "💪 Keep Learning! Every attempt makes you stronger!"}
                    </Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  // TODO: Implement share functionality
                  Alert.alert("Share", "Share functionality coming soon!");
                }}
              >
                <LinearGradient
                  colors={[tokens.colors.surface, tokens.colors.surface + 'E0']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="share-social" size={20} color={tokens.colors.onSurface} />
                  <Text style={styles.secondaryButtonText}>Share Results</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToExamsButton}
                onPress={() => {
                  router.push("/(services)/education/(tabs)/exams" as any);
                }}
              >
                <LinearGradient
                  colors={[tokens.colors.success, tokens.colors.success + 'CC']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="arrow-back" size={20} color={tokens.colors.onPrimary} />
                  <Text style={styles.backToExamsButtonText}>Back to Exams</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  router.push("/(services)/education/(tabs)/exams" as any);
                }}
              >
                <LinearGradient
                  colors={[tokens.colors.primary, tokens.colors.primary + 'CC']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="rocket" size={20} color={tokens.colors.onPrimary} />
                  <Text style={styles.primaryButtonText}>Take Another!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingTop: tokens.spacing.xl + tokens.spacing.md,
      ...tokens.shadows.lg,
    },
    headerGradient: {
      paddingBottom: tokens.spacing.md,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.md,
    },
    closeButton: {
      borderRadius: tokens.borderRadius.full,
      overflow: 'hidden',
    },
    closeButtonGradient: {
      padding: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.full,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    gamingBadge: {
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: tokens.spacing.sm,
      ...tokens.shadows.md,
    },
    gamingBadgeGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      gap: tokens.spacing.xs,
    },
    title: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onPrimary,
    },
    scoreContainer: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    scoreItem: {
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      ...tokens.shadows.sm,
    },
    scoreBackground: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      gap: tokens.spacing.xs,
    },
    score: {
      fontSize: tokens.typography.body,
      fontWeight: 'bold',
      color: tokens.colors.success,
    },
    streak: {
      fontSize: tokens.typography.body,
      fontWeight: 'bold',
      color: tokens.colors.warning,
    },
    timer: {
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      ...tokens.shadows.sm,
    },
    timerGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      gap: tokens.spacing.xs,
    },
    timerText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.error,
      fontWeight: "bold",
    },
    progressSection: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface + 'E0',
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.sm,
    },
    questionCounter: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: '600',
    },
    accuracy: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: '600',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: tokens.borderRadius.sm,
    },
    progressOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    examScreen: {
      flex: 1,
    },
    questionContent: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    questionCard: {
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      marginBottom: tokens.spacing.xl,
      ...tokens.shadows.md,
    },
    questionText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurface,
      lineHeight: 28,
      fontWeight: '500',
    },
    optionsContainer: {
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.xl,
    },
    optionButton: {
      borderRadius: tokens.borderRadius.md,
      overflow: 'hidden',
      ...tokens.shadows.sm,
    },
    optionGradient: {
      padding: tokens.spacing.md,
    },
    selectedOption: {
      transform: [{ scale: 1.02 }],
    },
    correctOption: {
      borderWidth: 2,
      borderColor: tokens.colors.success,
    },
    wrongOption: {
      borderWidth: 2,
      borderColor: tokens.colors.error,
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionIndicator: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: tokens.colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    selectedIndicator: {
      backgroundColor: tokens.colors.primary,
    },
    correctIndicator: {
      backgroundColor: tokens.colors.success,
    },
    wrongIndicator: {
      backgroundColor: tokens.colors.error,
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
      lineHeight: 22,
    },
    correctText: {
      color: tokens.colors.success,
      fontWeight: '600',
    },
    wrongText: {
      color: tokens.colors.error,
    },
    pointsBadge: {
      backgroundColor: tokens.colors.success,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
    },
    pointsText: {
      color: tokens.colors.onPrimary,
      fontSize: tokens.typography.caption,
      fontWeight: '600',
    },
    navigationButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface + 'F0',
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border,
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
      minWidth: 100,
      justifyContent: 'center',
      gap: tokens.spacing.xs,
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
      borderRadius: tokens.borderRadius.md,
      overflow: 'hidden',
      minWidth: 140,
    },
    submitGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      justifyContent: 'center',
      gap: tokens.spacing.xs,
    },
    submitButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    floatingText: {
      position: 'absolute',
      top: height * 0.4,
      left: width * 0.4,
      zIndex: 1000,
    },
    floatingTextContent: {
      fontSize: tokens.typography.title,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    // Epic Completion UI Styles
    completionOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
    },
    completionGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.xl,
    },
    completionHeader: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xl,
      width: '100%',
    },
    trophyContainer: {
      marginBottom: tokens.spacing.lg,
    },
    trophyBackground: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      ...tokens.shadows.lg,
    },
    completionTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: tokens.colors.onPrimary,
      textAlign: 'center',
      marginBottom: tokens.spacing.sm,
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    completionSubtitle: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onPrimary,
      opacity: 0.9,
      textAlign: 'center',
    },
    resultsCard: {
      width: '100%',
      marginBottom: tokens.spacing.xl,
    },
    resultsCardGradient: {
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.xl,
      ...tokens.shadows.lg,
      position: 'relative',
    },
    cardCloseButton: {
      position: 'absolute',
      top: tokens.spacing.md,
      right: tokens.spacing.md,
      borderRadius: tokens.borderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
      ...tokens.shadows.sm,
    },
    cardCloseButtonGradient: {
      width: 32,
      height: 32,
      borderRadius: tokens.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreSection: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xl,
    },
    mainScore: {
      alignItems: 'center',
    },
    scoreLabel: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
      fontWeight: '500',
    },
    scoreValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.md,
    },
    scoreBar: {
      width: 200,
      height: 8,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
      overflow: 'hidden',
    },
    scoreBarFill: {
      height: '100%',
      borderRadius: tokens.borderRadius.sm,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.xl,
    },
    statisticItem: {
      width: '48%',
      marginBottom: tokens.spacing.md,
    },
    statBackground: {
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      alignItems: 'center',
      ...tokens.shadows.sm,
    },
    statValue: {
      fontSize: tokens.typography.title,
      fontWeight: 'bold',
      color: tokens.colors.onSurface,
      marginTop: tokens.spacing.sm,
      marginBottom: tokens.spacing.xs,
    },
    statLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
      textAlign: 'center',
    },
    achievementsSection: {
      marginBottom: tokens.spacing.xl,
    },
    achievementsTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: 'bold',
      color: tokens.colors.onSurface,
      textAlign: 'center',
      marginBottom: tokens.spacing.md,
    },
    badgesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: tokens.spacing.md,
    },
    achievementBadge: {
      alignItems: 'center',
      minWidth: 80,
    },
    badgeGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: tokens.spacing.xs,
      ...tokens.shadows.md,
    },
    badgeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurface,
      fontWeight: '600',
      textAlign: 'center',
    },
    performanceMessage: {
      marginBottom: tokens.spacing.lg,
    },
    messageBackground: {
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      ...tokens.shadows.sm,
    },
    performanceText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: 22,
    },
    actionButtons: {
      flexDirection: 'row',
      width: '100%',
      gap: tokens.spacing.sm,
      flexWrap: 'wrap',
    },
    primaryButton: {
      flex: 1,
      minWidth: '30%',
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      ...tokens.shadows.md,
    },
    secondaryButton: {
      flex: 1,
      minWidth: '30%',
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      ...tokens.shadows.sm,
    },
    backToExamsButton: {
      flex: 1,
      minWidth: '30%',
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      ...tokens.shadows.md,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.md,
      gap: tokens.spacing.sm,
    },
    primaryButtonText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onPrimary,
      fontWeight: 'bold',
    },
    secondaryButtonText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurface,
      fontWeight: '600',
    },
    backToExamsButtonText: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onPrimary,
      fontWeight: 'bold',
    },
  });