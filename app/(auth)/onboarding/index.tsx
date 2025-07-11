import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { secureStorage } from '@/services/storage/secureStorage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    image: require('@/assets/images/onbording/edu.png'),
    title: 'Your Smart Learning Journey Starts Here',
    description:
      'Access courses, prepare for exams, and join interactive classrooms designed to help you succeed in your studies.',
    buttonText: 'Next',
    service: 'education',
  },
  {
    id: 2,
    image: require('@/assets/images/onbording/ser.png'),
    title: 'Expert Services at Your Doorstep',
    description:
      'Book trusted professionals for home cleaning, plumbing, carpentry, painting, and electrical work - all at affordable rates.',
    buttonText: 'Next',
    service: 'booking',
  },
  {
    id: 3,
    image: require('@/assets/images/onbording/saloon.png'),
    title: 'Look Sharp, Feel Confident',
    description:
      'Book professional haircuts, beard trimming, and styling services with skilled barbers who understand your grooming needs.',
    buttonText: 'Next',
    service: 'entertainment',
  },
  {
    id: 4,
    image: require('@/assets/images/onbording/vec.png'),
    title: 'Keep Your Ride Running Smooth',
    description:
      'Book trusted mechanics for car repairs, maintenance, servicing, and roadside assistance. Quality automotive care at your convenience.',
    buttonText: 'Get Started',
    service: 'booking',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { resetToGlobalTheme } = useServiceTheme();
  
  const styles = useThemedStyles(createStyles);

  // Reset to global theme on component mount
  React.useEffect(() => {
    resetToGlobalTheme();
  }, []);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Mark onboarding as completed before navigating to login
      await secureStorage.setOnboardingStatus('completed');
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed when skipping
    await secureStorage.setOnboardingStatus('completed');
    router.replace('/(auth)/login');
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.onboardingImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>

              {renderDots()}

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (tokens, layout, variants) => ({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  skipText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.medium,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  onboardingImage: {
    width: width * 0.8,
    height: height * 0.4,
  },
  contentContainer: {
    paddingBottom: tokens.spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.typography.headline1,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onBackground,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.xxl,
    lineHeight: tokens.typography.headline1 * tokens.typography.tight,
  },
  description: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: tokens.typography.body * tokens.typography.normal,
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: tokens.spacing.xs,
  },
  activeDot: {
    backgroundColor: tokens.colors.primary,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: tokens.colors.border,
  },
  nextButton: {
    backgroundColor: tokens.colors.primaryDark,
    borderRadius: tokens.borderRadius.button,
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    paddingHorizontal: tokens.spacing.buttonPadding.horizontal,
    width: width - (tokens.spacing.lg * 2),
    alignItems: 'center',
    ...tokens.shadows.sm,
  },
  nextButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
  },
});
