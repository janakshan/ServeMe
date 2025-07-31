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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Celebration Component using Reanimated
const CelebrationOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const confettiPieces = Array.from({ length: 20 }, (_, i) => {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue((Math.random() - 0.5) * width);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    
    React.useEffect(() => {
      // Staggered start times
      const startDelay = Math.random() * 500;
      
      setTimeout(() => {
        translateY.value = withTiming(height + 100, { duration: 3000 + Math.random() * 1000 });
        translateX.value = withTiming(
          translateX.value + (Math.random() - 0.5) * 200, 
          { duration: 3000 + Math.random() * 1000 }
        );
        rotation.value = withTiming(360 * 4, { duration: 3000 + Math.random() * 1000 });
        opacity.value = withTiming(0, { duration: 3000 + Math.random() * 1000 });
        scale.value = withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(0.8, { duration: 2800 + Math.random() * 1000 })
        );
      }, startDelay);
    }, []);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    }));
    
    const colors = ['#6A1B9A', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
    const color = colors[i % colors.length];
    
    return (
      <Animated.View
        key={i}
        style={[
          {
            position: 'absolute',
            width: 12,
            height: 12,
            backgroundColor: color,
            borderRadius: 6,
            top: Math.random() * 100,
            left: width / 2 + (Math.random() - 0.5) * 100,
          },
          animatedStyle,
        ]}
      />
    );
  });
  
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
      pointerEvents: 'none',
    }}>
      {confettiPieces}
      {/* Celebration Emojis */}
      <View style={{
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 60, textAlign: 'center' }}>🎉</Text>
        <Text style={{ fontSize: 60, textAlign: 'center' }}>✨</Text>
        <Text style={{ fontSize: 60, textAlign: 'center' }}>🎊</Text>
      </View>
    </View>
  );
};

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  // Animation values
  const headerScale = useSharedValue(1);
  const questionScale = useSharedValue(1);
  const progressValue = useSharedValue(0);
  const celebrationScale = useSharedValue(0);
  const timerPulse = useSharedValue(1);
  const timerGlow = useSharedValue(0);
  
  // Sound system
  const [sounds] = useState<{[key: string]: Audio.Sound}>({});
  const scrollViewRef = useRef<ScrollView>(null);
  
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
  
  // Update progress animation and reset scroll position
  useEffect(() => {
    const progress = Math.max(0.01, Math.min(0.99, (currentQuestion + 1) / MOCK_QUESTIONS.length));
    progressValue.value = withSpring(progress);
    
    // Additional safeguard: Reset scroll position when question changes
    // Small delay to ensure DOM is updated
    const scrollTimer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 50);
    
    return () => clearTimeout(scrollTimer);
  }, [currentQuestion]);
  
  // Timer urgency animations
  useEffect(() => {
    if (isTimeCritical) {
      // Start pulsing animation when time is critical
      timerPulse.value = withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 }),
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
      timerGlow.value = withTiming(1, { duration: 300 });
    } else if (isTimeRunningLow) {
      // Subtle pulse when time is running low
      timerPulse.value = withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      );
      timerGlow.value = withTiming(0.5, { duration: 300 });
    } else {
      // Normal state
      timerPulse.value = withTiming(1, { duration: 300 });
      timerGlow.value = withTiming(0, { duration: 300 });
    }
  }, [isTimeCritical, isTimeRunningLow]);
  
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
  
  // Enhanced answer selection with gamification and haptics
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    const previousAnswer = newAnswers[currentQuestion];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    playSound('buttonTap');
    
    // Animation feedback
    questionScale.value = withSequence(
      withTiming(0.98, { duration: 150 }),
      withTiming(1, { duration: 150 })
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
        
        // Celebration for correct answer streaks
        if (streak >= 3) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
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
        // Reset scroll position to top when moving to next question
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
        // Reset scroll position to top when moving to previous question
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
    
    // Celebration animation
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
    
    playSound('celebration');
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
  
  const timerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerPulse.value }],
  }));
  
  const timerGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.1 + (timerGlow.value * 0.3),
    shadowRadius: 4 + (timerGlow.value * 8),
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

      {/* Reanimated Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay onComplete={() => setShowCelebration(false)} />
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

      {/* Enhanced Timer Section - All in One Row */}
      <View style={styles.timerSection}>
        <View style={styles.enhancedTimerRow}>
          {/* Question Count */}
          <View style={styles.questionCountContainer}>
            <Text style={styles.questionCountNumber}>
              {currentQuestion + 1}
            </Text>
            <Text style={styles.questionCountTotal}>
              of {MOCK_QUESTIONS.length}
            </Text>
            <Text style={styles.questionCountLabel}>Questions</Text>
          </View>
          
          {/* Circular Progress Indicator */}
          <View style={styles.compactCircularProgress}>
            {/* Background Ring */}
            <View style={styles.compactProgressRingBackground} />
            {/* Progress Ring */}
            <View style={styles.compactProgressRingContainer}>
              <View 
                style={[
                  styles.compactProgressRing,
                  {
                    transform: [
                      { 
                        rotate: `${(((currentQuestion + 1) / MOCK_QUESTIONS.length) * 180) - 90}deg` 
                      }
                    ]
                  }
                ]}
              />
            </View>
            {/* Center Content */}
            <View style={styles.compactProgressCenter}>
              <Text style={styles.compactProgressPercentage}>
                {Math.round(((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100)}%
              </Text>
            </View>
          </View>
          
          {/* Timer */}
          <Animated.View style={[
            styles.compactTimerContainer,
            isTimeRunningLow && styles.timerContainerWarning,
            isTimeCritical && styles.timerContainerCritical,
            timerAnimatedStyle,
            timerGlowStyle
          ]}>
            <View style={styles.compactTimerIconContainer}>
              <Ionicons 
                name={isTimeCritical ? "warning" : "time-outline"} 
                size={20} 
                color="#EF4444"
              />
            </View>
            <View style={styles.compactTimerTextContainer}>
              <Text style={styles.compactTimerText}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.compactTimerLabel}>Time Left</Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Enhanced Stats Row */}
        <View style={styles.enhancedStatsContainer}>
          <View style={styles.enhancedStatChip}>
            <View style={styles.statIconWrapper}>
              <Ionicons name="flash" size={18} color="#6A1B9A" />
            </View>
            <View style={styles.statTextWrapper}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
          
          {streak > 0 && (
            <View style={[styles.enhancedStatChip, styles.streakChip]}>
              <View style={styles.statIconWrapper}>
                <Ionicons name="flame" size={18} color="#F59E0B" />
              </View>
              <View style={styles.statTextWrapper}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          )}
          
          <View style={styles.enhancedStatChip}>
            <View style={styles.statIconWrapper}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>
            <View style={styles.statTextWrapper}>
              <Text style={styles.statValue}>
                {Math.round((correctCount/(totalAnswered || 1)) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Question Content */}
      <Animated.View style={[styles.content, questionAnimatedStyle]}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
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
                    styles.enhancedOptionCard,
                    isSelected && styles.enhancedSelectedOption,
                    showResult && isCorrect && styles.enhancedCorrectOption,
                    showResult && isSelected && !isCorrect && styles.enhancedWrongOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswers[currentQuestion] !== undefined}
                  activeOpacity={0.85}
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

        {/* Enhanced Mobile-First Navigation */}
        <View style={styles.enhancedNavigation}>
          <View style={styles.navigationSafeArea}>
            <View style={styles.navigationContent}>
              {currentQuestion > 0 && (
                <TouchableOpacity 
                  style={styles.enhancedNavButton}
                  onPress={handlePreviousQuestion}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-back" size={24} color="#6A1B9A" />
                  <Text style={styles.enhancedNavText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.navigationCenter}>
                <Text style={styles.navigationProgress}>
                  {currentQuestion + 1} of {MOCK_QUESTIONS.length}
                </Text>
              </View>
              
              {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
                <TouchableOpacity 
                  style={styles.enhancedSubmitButton} 
                  onPress={handleSubmitExam}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#6A1B9A', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.enhancedSubmitGradient}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={styles.enhancedSubmitText}>Submit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.enhancedNextButton}
                  onPress={handleNextQuestion}
                  activeOpacity={0.8}
                >
                  <Text style={styles.enhancedNextText}>Next</Text>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
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
    // Enhanced Timer Row - All Components in One Row
    enhancedTimerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
    },
    
    // Question Count Styles - Balanced width
    questionCountContainer: {
      width: 80, // Fixed width for consistent spacing
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    questionCountNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: '#6A1B9A',
      lineHeight: 28,
    },
    questionCountTotal: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginTop: -2,
    },
    questionCountLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
    },
    
    // Compact Circular Progress Styles
    compactCircularProgress: {
      width: 60,
      height: 60,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: tokens.spacing.md,
    },
    compactProgressRingBackground: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 4,
      borderColor: '#E5E7EB',
    },
    compactProgressRingContainer: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      overflow: 'hidden',
    },
    compactProgressRing: {
      width: 60,
      height: 30,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderWidth: 4,
      borderBottomWidth: 0,
      borderColor: '#6A1B9A',
      transformOrigin: '50% 100%',
    },
    compactProgressCenter: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    compactProgressPercentage: {
      fontSize: 12,
      fontWeight: '700',
      color: '#6A1B9A',
      lineHeight: 14,
    },
    
    // Compact Timer Styles - Fixed width to balance with question count
    compactTimerContainer: {
      width: 130, // Increased width to prevent content cropping
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 3,
      borderColor: '#EF4444',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 8,
      gap: tokens.spacing.sm,
      minHeight: 56,
      justifyContent: 'space-between',
    },
    compactTimerIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    compactTimerTextContainer: {
      alignItems: 'flex-end',
    },
    compactTimerText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#EF4444',
      letterSpacing: 0.3,
      lineHeight: 20,
    },
    compactTimerLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 1,
    },
    
    // Old Timer Row Styles (keeping for backward compatibility)
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
    // Enhanced Timer Styles
    enhancedTimerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.xl,
      borderWidth: 2,
      borderColor: '#FCA5A5',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      gap: tokens.spacing.md,
      minHeight: 70,
    },
    timerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerTextContainer: {
      alignItems: 'flex-end',
    },
    enhancedTimerText: {
      fontSize: 24,
      fontWeight: '800',
      color: '#EF4444',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(239, 68, 68, 0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    timerLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
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
    // Circular Progress Styles
    circularProgressContainer: {
      alignItems: 'center',
      marginBottom: tokens.spacing.lg,
      marginTop: tokens.spacing.md,
    },
    circularProgress: {
      width: 80,
      height: 80,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressRingBackground: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: '#E5E7EB',
    },
    progressRingContainer: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
    },
    progressRing: {
      width: 80,
      height: 40,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderWidth: 6,
      borderBottomWidth: 0,
      borderColor: '#6A1B9A',
      transformOrigin: '50% 100%',
    },
    progressCenter: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressPercentage: {
      fontSize: 16,
      fontWeight: '800',
      color: '#6A1B9A',
      lineHeight: 18,
    },
    progressLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 1,
    },
    // Old Progress Styles (keeping for backward compatibility)
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
    // Enhanced Stats Styles with better visibility
    enhancedStatsContainer: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      justifyContent: 'space-between',
      marginTop: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
    },
    enhancedStatChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.lg,
      gap: tokens.spacing.sm,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 18,
      elevation: 6,
      borderWidth: 2.5,
      borderColor: '#D1D5DB',
      minHeight: 54,
    },
    streakChip: {
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      borderWidth: 3,
      shadowColor: '#F59E0B',
      shadowOpacity: 0.2,
    },
    statIconWrapper: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    statTextWrapper: {
      flex: 1,
      alignItems: 'flex-start',
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1F2937',
      lineHeight: 20,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 1,
    },
    // Old Stats Styles (keeping for backward compatibility)
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
    },
    scrollViewContent: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xl * 2, // Extra bottom padding for better scrolling
      flexGrow: 1,
    },
    questionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      padding: tokens.spacing.xl,
      marginBottom: tokens.spacing.xl,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 12,
      borderWidth: 3,
      borderColor: '#6A1B9A',
      marginHorizontal: 2, // Space for shadow
    },
    questionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.lg,
    },
    questionNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#6A1B9A',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    questionNumberText: {
      fontSize: 18,
      fontWeight: '800',
      color: 'white',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: 8,
      borderRadius: tokens.borderRadius.lg,
      gap: 6,
      borderWidth: 1.5,
      borderColor: '#FCD34D',
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    pointsText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#D97706',
      letterSpacing: 0.3,
    },
    questionText: {
      fontSize: 20,
      lineHeight: 32,
      color: '#111827',
      fontWeight: '600',
      letterSpacing: 0.2,
      textAlign: 'left',
      marginBottom: tokens.spacing.sm,
    },
    questionImage: {
      width: '100%',
      height: 200,
      borderRadius: tokens.borderRadius.md,
      marginVertical: tokens.spacing.md,
      backgroundColor: '#F9FAFB',
    },
    // Enhanced Options Styles with better scroll handling
    optionsContainer: {
      gap: tokens.spacing.lg,
      marginBottom: tokens.spacing.xl * 1.5, // More bottom margin for scrolling
      paddingHorizontal: 4, // Add horizontal padding for shadow
      minHeight: 400, // Ensure minimum height for scroll area
    },
    enhancedOptionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: tokens.spacing.lg,
      borderWidth: 3,
      borderColor: '#9CA3AF', // Much more visible gray border
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 8,
      marginVertical: 4,
      marginHorizontal: 2, // Space for shadow
      minHeight: 75,
      transform: [{ scale: 1 }],
    },
    enhancedSelectedOption: {
      borderColor: '#6A1B9A',
      backgroundColor: '#F8F6FF',
      transform: [{ scale: 1.03 }],
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 25,
      elevation: 12,
      borderWidth: 4, // Even thicker border for selected state
    },
    enhancedCorrectOption: {
      borderColor: '#10B981',
      backgroundColor: '#F0FDF4',
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
      transform: [{ scale: 1.02 }],
    },
    enhancedWrongOption: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
      transform: [{ scale: 0.98 }],
    },
    // Old Options Styles (keeping for backward compatibility)
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
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
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
      fontSize: 17,
      lineHeight: 26,
      color: '#374151',
      fontWeight: '500',
      letterSpacing: 0.1,
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
    // Enhanced Mobile-First Navigation Styles
    enhancedNavigation: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    navigationSafeArea: {
      paddingBottom: 20, // Extra padding for home indicator
    },
    navigationContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      minHeight: 80,
    },
    navigationCenter: {
      flex: 1,
      alignItems: 'center',
    },
    navigationProgress: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      textAlign: 'center',
    },
    enhancedNavButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.xl,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      gap: 8,
      minWidth: 100,
      minHeight: 50,
    },
    enhancedNavText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6A1B9A',
    },
    enhancedNextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.xl,
      backgroundColor: '#6A1B9A',
      gap: 8,
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
      minWidth: 100,
      minHeight: 50,
    },
    enhancedNextText: {
      fontSize: 16,
      fontWeight: '700',
      color: 'white',
    },
    enhancedSubmitButton: {
      borderRadius: tokens.borderRadius.xl,
      overflow: 'hidden',
      shadowColor: '#6A1B9A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
      minWidth: 120,
      minHeight: 50,
    },
    enhancedSubmitGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.md,
      gap: 8,
      justifyContent: 'center',
    },
    enhancedSubmitText: {
      fontSize: 16,
      fontWeight: '700',
      color: 'white',
    },
    // Old Navigation Styles (keeping for backward compatibility)
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