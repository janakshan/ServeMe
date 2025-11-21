import { useAuthTheme, useAuthThemedStyles } from "@/contexts/AuthThemeProvider";
import { secureStorage } from "@/services/storage/secureStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    image: require("@/assets/images/onbording/edu.png"),
    title: "Your Smart Learning Journey Starts Here",
    description:
      "Access courses, prepare for exams, and join interactive classrooms designed to help you succeed in your studies.",
    buttonText: "Next",
    service: "education",
  },
  {
    id: 2,
    image: require("@/assets/images/onbording/ser.png"),
    title: "Expert Services at Your Doorstep",
    description:
      "Book trusted professionals for home cleaning, plumbing, carpentry, painting, and electrical work - all at affordable rates.",
    buttonText: "Next",
    service: "booking",
  },
  {
    id: 3,
    image: require("@/assets/images/onbording/saloon.png"),
    title: "Look Sharp, Feel Confident",
    description:
      "Book professional haircuts, beard trimming, and styling services with skilled barbers who understand your grooming needs.",
    buttonText: "Next",
    service: "entertainment",
  },
  {
    id: 4,
    image: require("@/assets/images/onbording/vec.png"),
    title: "Keep Your Ride Running Smooth",
    description:
      "Book trusted mechanics for car repairs, maintenance, servicing, and roadside assistance. Quality automotive care at your convenience.",
    buttonText: "Get Started",
    service: "booking",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>(
    new Array(onboardingData.length).fill(true)
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const themeContext = useAuthTheme();
  const styles = useAuthThemedStyles(createStyles, themeContext);

  // Theme is already scoped to auth context

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
      await secureStorage.setOnboardingStatus("completed");
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed when skipping
    await secureStorage.setOnboardingStatus("completed");
    router.replace("/(auth)/login");
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const handleImageLoad = (index: number) => {
    setImageLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const renderImageSkeleton = () => (
    <View style={styles.imageSkeleton}>
      <View style={styles.skeletonShimmer} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.navigationRow}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back to previous screen"
              accessibilityHint="Navigate to the previous onboarding screen"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={styles.backIcon.color}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            accessibilityHint="Skip the onboarding process and go directly to login"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        accessibilityRole="tablist"
        accessibilityLabel="Onboarding screens"
      >
        {onboardingData.map((item, index) => (
          <View
            key={item.id}
            style={styles.slide}
            accessibilityRole="tab"
            accessibilityLabel={`Screen ${index + 1} of ${
              onboardingData.length
            }: ${item.title}`}
          >
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                {imageLoadingStates[index] && renderImageSkeleton()}
                <Image
                  source={item.image}
                  style={[
                    styles.onboardingImage,
                    { opacity: imageLoadingStates[index] ? 0 : 1 },
                  ]}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel={`Illustration for ${item.title}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageLoad(index)}
                />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text
                style={styles.title}
                accessibilityRole="header"
                accessibilityLevel={1}
              >
                {item.title}
              </Text>
              <Text style={styles.description} accessibilityRole="text">
                {item.description}
              </Text>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel={
                  currentIndex === onboardingData.length - 1
                    ? "Get started with the app"
                    : "Continue to next screen"
                }
                accessibilityHint={
                  currentIndex === onboardingData.length - 1
                    ? "Complete onboarding and go to login"
                    : "Navigate to the next onboarding screen"
                }
              >
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
  topContainer: {
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  skipButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  skipText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.medium,
  },
  backButton: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
  },
  backIcon: {
    color: tokens.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: tokens.spacing.lg,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  imageWrapper: {
    width: width * 0.8,
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingImage: {
    width: "100%",
    height: "100%",
  },
  imageSkeleton: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.md,
    overflow: "hidden",
  },
  skeletonShimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: tokens.colors.surface,
  },
  contentContainer: {
    paddingBottom: tokens.spacing.xxl,
    alignItems: "center",
  },
  title: {
    fontSize: tokens.typography.headline1,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onBackground,
    textAlign: "center",
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.xxl,
    lineHeight: tokens.typography.headline1 * tokens.typography.tight,
  },
  description: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: tokens.typography.body * tokens.typography.normal,
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  nextButton: {
    backgroundColor: tokens.colors.primaryDark,
    borderRadius: tokens.borderRadius.button,
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    paddingHorizontal: tokens.spacing.buttonPadding.horizontal,
    width: width - tokens.spacing.lg * 2,
    alignItems: "center",
    ...tokens.shadows.sm,
  },
  nextButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
  },
});
