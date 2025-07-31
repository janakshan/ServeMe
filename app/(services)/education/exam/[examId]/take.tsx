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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { MinimalHeader } from '@/src/education/components/headers';
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
    questionImage: null,
    options: [
      { text: "5", image: null },
      { text: "10", image: null },
      { text: "7.5", image: null },
      { text: "20", image: null }
    ],
    correctAnswer: 0,
    explanation: "To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.",
    points: 10,
  },
  {
    id: "2", 
    question: "Which king built the ancient city of Polonnaruwa in Sri Lanka?",
    questionImage: null,
    options: [
      { text: "King Dutugemunu", image: null },
      { text: "King Parakramabahu I", image: null },
      { text: "King Kasyapa", image: null },
      { text: "King Vijayabahu I", image: null }
    ],
    correctAnswer: 1,
    explanation: "King Parakramabahu I (1153-1186 CE) was responsible for the development of Polonnaruwa as a major city.",
    points: 15,
  },
  {
    id: "3",
    question: "What is the main function of the heart in the human circulatory system?",
    questionImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    options: [
      { text: "To produce blood cells", image: null },
      { text: "To pump blood throughout the body", image: null },
      { text: "To filter waste products", image: null },
      { text: "To store oxygen", image: null }
    ],
    correctAnswer: 1,
    explanation: "The heart's primary function is to pump blood throughout the body, delivering oxygen and nutrients to tissues.",
    points: 10,
  },
  {
    id: "4",
    question: "Which geometric shape has exactly 3 sides?",
    questionImage: null,
    options: [
      { text: "Square", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop" },
      { text: "Circle", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" },
      { text: "Triangle", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&h=100&fit=crop" },
      { text: "Pentagon", image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=100&h=100&fit=crop" }
    ],
    correctAnswer: 2,
    explanation: "A triangle is a polygon with exactly three sides and three angles.",
    points: 20,
  },
  {
    id: "5",
    question: "What is the acceleration due to gravity on Earth?",
    questionImage: null,
    options: [
      { text: "9.8 m/s²", image: null },
      { text: "10 m/s²", image: null },
      { text: "8.9 m/s²", image: null },
      { text: "11 m/s²", image: null }
    ],
    correctAnswer: 0,
    explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
    points: 10,
  },
];

// Sound effects - will be loaded dynamically
const SOUND_ENABLED = true; // Enabled with proper sound files

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

export default function ModernExamTakeScreen() {
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
  const celebrationScale = useSharedValue(0);
  
  // Sound system
  const [sounds] = useState<{[key: string]: Audio.Sound}>({});
  const confettiRef = useRef<ConfettiCannon>(null);
  
  // Timer warning states
  const isTimeRunningLow = timeLeft <= 600; // Less than 10 minutes
  const isTimeCritical = timeLeft <= 300; // Less than 5 minutes
  
  // Unique ID counter for floating texts
  const floatingTextCounter = useRef(0);
  
  // Initialize sound effects
  useEffect(() => {
    const loadSounds = async () => {
      if (!SOUND_ENABLED) {
        console.log('Sound system disabled - enable in code when sound files are available');
        return;
      }
      
      try {
        console.log('Loading exam game sound effects...');
        
        // Load all sound effects
        const soundFiles = {
          buttonTap: require('@/assets/sounds/buttonTap.mp3'),
          correct: require('@/assets/sounds/correct.mp3'),
          wrong: require('@/assets/sounds/wrong.mp3'),
          levelUp: require('@/assets/sounds/levelUp.mp3'),
          celebration: require('@/assets/sounds/celebration.mp3'),
        };

        // Create Audio.Sound objects for each sound
        for (const [key, soundFile] of Object.entries(soundFiles)) {
          const { sound } = await Audio.Sound.createAsync(soundFile, {
            shouldPlay: false,
            isLooping: false,
            volume: 0.7, // Set volume to 70%
          });
          sounds[key] = sound;
        }
        
        console.log('All exam sound effects loaded successfully!');
        console.log('✅ buttonTap, correct, wrong, levelUp, celebration sounds ready');
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
        router.push("/(services)/education/(tabs)/exams" as any);
        return true;
      } else {
        handleBackPress();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showResult]);
  
  // Timer effect
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
  
  // Update progress animation
  useEffect(() => {
    const progress = Math.max(0.01, Math.min(0.99, (currentQuestion + 1) / MOCK_QUESTIONS.length));
    progressValue.value = withSpring(progress);
  }, [currentQuestion]);
  
  // Play sound effect
  const playSound = async (soundName: string) => {
    if (!SOUND_ENABLED) {
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
    floatingTextCounter.current += 1;
    const id = `floating-${floatingTextCounter.current}-${Date.now()}`;
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
        addFloatingText(`+${pointsEarned} points!`, '#10B981');
        
        if (streak > 0 && streak % 3 === 0) {
          addFloatingText(`Streak x${streakMultiplier}!`, '#F59E0B');
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
        addFloatingText('Try again!', '#EF4444');
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
      addFloatingText('First Correct! 🎉', '#4F46E5');
    }
    
    if (streak >= 5 && !achievements.includes('streak_master')) {
      newAchievements.push('streak_master');
      addFloatingText('Streak Master! 🔥', '#F59E0B');
    }
    
    if (correctCount === MOCK_QUESTIONS.length && !achievements.includes('perfect_score')) {
      newAchievements.push('perfect_score');
      addFloatingText('Perfect Score! 🏆', '#10B981');
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
      "Your progress will be lost. Are you sure?",
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
  
  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
      {/* Modern Clean Background */}
      <LinearGradient
        colors={['#FAFBFF', '#F5F7FF', '#F0F4FF']}
        style={styles.backgroundGradient}
      />
      
      {/* Subtle Floating Orbs */}
      <View style={styles.orbsContainer}>
        <View style={styles.orb1} />
        <View style={styles.orb2} />
        <View style={styles.orb3} />
      </View>

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={100}
          origin={{x: width/2, y: 0}}
          explosionSpeed={350}
          fallSpeed={3000}
          colors={['#4F46E5', '#10B981', '#F59E0B', '#EF4444']}
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
      
      {/* Course Details Style Header */}
      <MinimalHeader
        title="Mathematics Quiz"
        onBackPress={handleBackPress}
      />

      {/* Timer Section - Moved Above Question */}
      <View style={styles.timerSection}>
        <View style={styles.timerRow}>
          <View style={styles.questionProgressSection}>
            <Text style={styles.questionProgressText}>
              Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
            </Text>
          </View>
          
          <View style={[
            styles.timerContainer,
            isTimeRunningLow && styles.timerContainerWarning,
            isTimeCritical && styles.timerContainerCritical
          ]}>
            <Ionicons 
              name={isTimeCritical ? "warning" : "time-outline"} 
              size={20} 
              color="#EF4444"
            />
            <Text style={styles.timerTextRed}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100}%` }
              ]}
            />
          </View>
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statChip}>
            <Ionicons name="flash" size={16} color="#4F46E5" />
            <Text style={styles.statText}>{score} pts</Text>
          </View>
          {streak > 0 && (
            <View style={styles.statChip}>
              <Ionicons name="flame" size={16} color="#F59E0B" />
              <Text style={styles.statText}>{streak} streak</Text>
            </View>
          )}
          <View style={styles.statChip}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.statText}>
              {Math.round((correctCount/(totalAnswered || 1)) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Question Content */}
      <Animated.View style={[styles.content, questionAnimatedStyle]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{currentQuestion + 1}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Ionicons name="diamond" size={16} color="#F59E0B" />
                <Text style={styles.pointsText}>{MOCK_QUESTIONS[currentQuestion].points} pts</Text>
              </View>
            </View>
            {MOCK_QUESTIONS[currentQuestion].questionImage && (
              <Image 
                source={{ uri: MOCK_QUESTIONS[currentQuestion].questionImage }} 
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.questionText}>
              {MOCK_QUESTIONS[currentQuestion].question}
            </Text>
          </View>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrect = index === MOCK_QUESTIONS[currentQuestion].correctAnswer;
              const showResult = selectedAnswers[currentQuestion] !== undefined;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    isSelected && styles.selectedOption,
                    showResult && isCorrect && styles.correctOption,
                    showResult && isSelected && !isCorrect && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswers[currentQuestion] !== undefined}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionCircle,
                      isSelected && styles.selectedCircle,
                      showResult && isCorrect && styles.correctCircle,
                      showResult && isSelected && !isCorrect && styles.wrongCircle,
                    ]}>
                      {showResult && isCorrect ? (
                        <Ionicons name="checkmark" size={18} color="white" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <Ionicons name="close" size={18} color="white" />
                      ) : (
                        <Text style={[
                          styles.optionLetter,
                          isSelected && styles.selectedLetter
                        ]}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.optionTextContainer}>
                      {option.image && (
                        <Image 
                          source={{ uri: option.image }} 
                          style={styles.optionImage}
                          resizeMode="contain"
                        />
                      )}
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                        showResult && isCorrect && styles.correctText,
                        showResult && isSelected && !isCorrect && styles.wrongText,
                      ]}>
                        {option.text}
                      </Text>
                    </View>
                    {showResult && isCorrect && (
                      <View style={styles.correctBadge}>
                        <Ionicons name="add" size={14} color="#10B981" />
                        <Text style={styles.correctBadgeText}>
                          {MOCK_QUESTIONS[currentQuestion].points}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          {currentQuestion > 0 && (
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handlePreviousQuestion}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#6B7280" />
              <Text style={styles.navText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.spacer} />
          
          {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmitExam}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.submitText}>Submit Exam</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextQuestion}
              activeOpacity={0.7}
            >
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* Completion Overlay */}
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
              <Text style={styles.completionTitle}>🎉 Complete! 🎉</Text>
              <Text style={styles.completionSubtitle}>Great job on finishing!</Text>
            </View>

            {/* Results Card */}
            <View style={styles.resultsCard}>
              <LinearGradient
                colors={[tokens.colors.surface + 'F0', tokens.colors.surface + 'E0']}
                style={styles.resultsCardGradient}
              >
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => router.push("/(services)/education/(tabs)/exams" as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[tokens.colors.error + '20', tokens.colors.error + '30']}
                    style={styles.closeButtonGradient}
                  >
                    <Ionicons name="close" size={20} color={tokens.colors.error} />
                  </LinearGradient>
                </TouchableOpacity>
                
                <View style={styles.scoreSection}>
                  <Text style={styles.scoreLabel}>Final Score</Text>
                  <Text style={styles.scoreValue}>
                    {Math.round((correctCount / MOCK_QUESTIONS.length) * 100)}%
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push("/(services)/education/(tabs)/exams" as any)}
                  >
                    <LinearGradient
                      colors={[tokens.colors.primary, tokens.colors.primary + 'CC']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="refresh" size={20} color={tokens.colors.onPrimary} />
                      <Text style={styles.primaryButtonText}>Take Another</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
      </View>
    </>
  );
}

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFBFF',
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    orbsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    orb1: {
      position: 'absolute',
      top: '15%',
      right: '20%',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#E0E7FF',
      opacity: 0.3,
    },
    orb2: {
      position: 'absolute',
      bottom: '30%',
      left: '15%',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#DBEAFE',
      opacity: 0.25,
    },
    orb3: {
      position: 'absolute',
      top: '45%',
      left: '25%',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#EDE9FE',
      opacity: 0.2,
    },
    // Timer Section Styles (moved above question)
    timerSection: {
      backgroundColor: 'white',
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    timerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md,
    },
    questionProgressSection: {
      flex: 1,
    },
    questionProgressText: {
      fontSize: 16,
      color: '#6A1B9A',
      fontWeight: '600',
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF2F2',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: 10,
      borderRadius: tokens.borderRadius.xl,
      gap: 8,
      borderWidth: 1,
      borderColor: '#FCA5A5',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
    },
    timerTextRed: {
      fontSize: 14,
      fontWeight: '700',
      color: '#EF4444',
    },
    timerTextWarning: {
      color: '#EF4444',
      fontWeight: '700',
    },
    timerContainerWarning: {
      backgroundColor: '#FEF2F2',
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    timerContainerCritical: {
      backgroundColor: '#FEE2E2',
      borderWidth: 1,
      borderColor: '#FBBF24',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    progressContainer: {
      marginBottom: tokens.spacing.md,
    },
    progressTrack: {
      height: 6,
      backgroundColor: '#E5E7EB',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4F46E5',
      borderRadius: 3,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      justifyContent: 'center',
    },
    statChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 6,
      borderRadius: tokens.borderRadius.md,
      gap: 4,
    },
    statText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#374151',
    },
    // Content Styles
    content: {
      flex: 1,
      zIndex: 5,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
    },
    questionCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: tokens.spacing.xl,
      marginBottom: tokens.spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
    questionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.lg,
    },
    questionNumber: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#4F46E5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionNumberText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 6,
      borderRadius: tokens.borderRadius.md,
      gap: 4,
    },
    pointsText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#D97706',
    },
    questionText: {
      fontSize: 18,
      lineHeight: 28,
      color: '#1F2937',
      fontWeight: '500',
    },
    questionImage: {
      width: '100%',
      height: 200,
      borderRadius: tokens.borderRadius.md,
      marginVertical: tokens.spacing.md,
      backgroundColor: '#F9FAFB',
    },
    // Options Styles
    optionsContainer: {
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.xl,
    },
    optionCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: tokens.spacing.lg,
      borderWidth: 2.5,
      borderColor: '#D1D5DB', // More visible gray border
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 15,
      elevation: 3,
      marginVertical: 4,
    },
    selectedOption: {
      borderColor: '#6A1B9A',
      backgroundColor: '#F3F0FF',
      transform: [{ scale: 1.02 }],
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    correctOption: {
      borderColor: '#10B981',
      backgroundColor: '#F0FDF4',
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    wrongOption: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    optionCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F9FAFB',
      borderWidth: 2.5,
      borderColor: '#D1D5DB',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    selectedCircle: {
      backgroundColor: '#6A1B9A',
      borderColor: '#6A1B9A',
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    correctCircle: {
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    },
    wrongCircle: {
      backgroundColor: '#EF4444',
      borderColor: '#EF4444',
    },
    optionLetter: {
      fontSize: 16,
      fontWeight: '700',
      color: '#6B7280',
    },
    selectedLetter: {
      color: 'white',
    },
    optionTextContainer: {
      flex: 1,
      gap: tokens.spacing.sm,
    },
    optionText: {
      fontSize: 16,
      lineHeight: 24,
      color: '#374151',
      fontWeight: '500',
    },
    optionImage: {
      width: '100%',
      height: 120,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: '#F9FAFB',
    },
    selectedText: {
      color: '#1F2937',
      fontWeight: '600',
    },
    correctText: {
      color: '#059669',
      fontWeight: '600',
    },
    wrongText: {
      color: '#DC2626',
      fontWeight: '500',
    },
    correctBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DCFCE7',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      gap: 2,
    },
    correctBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#10B981',
    },
    // Navigation Styles
    navigation: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: '#F8FAFC',
      gap: 6,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    navText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#6B7280',
    },
    spacer: {
      flex: 1,
    },
    nextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: '#4F46E5',
      gap: 8,
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    nextText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    submitButton: {
      borderRadius: tokens.borderRadius.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    submitGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.md,
      gap: 8,
    },
    submitText: {
      fontSize: 16,
      fontWeight: '700',
      color: 'white',
    },
    
    // Completion overlay styles (keeping existing)
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
    closeButton: {
      position: 'absolute',
      top: tokens.spacing.md,
      right: tokens.spacing.md,
      borderRadius: tokens.borderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
      ...tokens.shadows.sm,
    },
    closeButtonGradient: {
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
    actionButtons: {
      width: '100%',
    },
    primaryButton: {
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
  });