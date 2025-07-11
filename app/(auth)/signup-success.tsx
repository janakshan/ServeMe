import { router } from "expo-router";
import { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@/contexts/ServiceThemeContext";

const SignupSuccessScreen = () => {
  const styles = useThemedStyles(createStyles);

  const handleBackToHome = () => {
    router.replace("/(app)/(tabs)");
  };

  // Optional: Auto-navigate after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment if you want auto-navigation
      // handleBackToHome();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Welcome to ServeMe</Text>
            <Text style={styles.description}>Welcome to ServeMe! Your account has been successfully created.</Text>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.contentSection}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Ionicons 
              name="checkmark" 
              size={40} 
              color={styles.checkIcon.color} 
            />
          </View>
        </View>
        
        <Text style={styles.cardTitle}>Account Created Successfully</Text>
        <Text style={styles.contentDescription}>
          Your account has been successfully created. You can now enjoy all the features and services ServeMe has to offer.
        </Text>
        
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleBackToHome}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (tokens, layout, variants) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  headerSection: {
    backgroundColor: tokens.colors.primary,
    paddingBottom: tokens.spacing.xxl,
    minHeight: 280,
  },
  headerSafeArea: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  headerContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.lg,
  },
  title: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.display,
    marginBottom: tokens.spacing.sm,
    lineHeight: tokens.typography.display * tokens.typography.tight,
    textAlign: "center",
  },
  description: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.light,
    fontSize: tokens.typography.body,
    marginBottom: 0,
    lineHeight: tokens.typography.body * 1.3,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: tokens.spacing.lg,
  },
  contentSection: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: tokens.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  checkIcon: {
    color: tokens.colors.onPrimary,
  },
  cardTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.lg,
    textAlign: "center",
  },
  contentDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: tokens.typography.body * 1.4,
    marginBottom: tokens.spacing.xl,
  },
  homeBtn: {
    backgroundColor: tokens.colors.primaryDark,
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.button,
    alignItems: "center",
    width: "100%",
    ...tokens.shadows.sm,
  },
  homeBtnText: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.subtitle,
  },
});

export default SignupSuccessScreen;