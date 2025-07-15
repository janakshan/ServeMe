import { useThemedStyles, useServiceTheme } from "@/contexts/ServiceThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ConfirmPhoneScreen = () => {
  const [email] = useState("admin@serveme.sg"); // This would come from signup form

  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const headerGradient = getGradient('header');
  const buttonGradient = getGradient('button');
  const backgroundGradient = getGradient('background');

  const handleNext = () => {
    router.push("/(auth)/enter-otp");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={backgroundGradient.colors}
      start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <LinearGradient
        colors={headerGradient.colors}
        start={{ x: headerGradient.direction.x, y: headerGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.description}>
              We'll send a verification code to ensure your account security.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.contentSection}>
        {/* <Text style={styles.cardTitle}>Verify Your Email Address</Text> */}
        <Text style={styles.phoneNumber}>{email}</Text>
        <Text style={styles.contentDescription}>
          We will send the authentication code to your mobile number you
          entered. Do you want to continue?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
            <LinearGradient
              colors={buttonGradient.colors}
              start={{ x: buttonGradient.direction.x, y: buttonGradient.direction.y }}
              end={{ x: 1, y: 1 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const createStyles = (tokens, layout, variants) => {
  // Create soft blue-tinted backgrounds for better eye comfort
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#0D47A1") {
      // Professional blue theme - soft blue tints
      return {
        softBackground: "#F8FAFE", // Very light blue tint
        softSurface: "#F0F6FF", // Light blue tint for cards/surfaces
      };
    } else if (primaryColor === "#7B1FA2") {
      // Purple theme - soft purple tints
      return {
        softBackground: "#FDFAFF", // Very light purple tint
        softSurface: "#F9F2FF", // Light purple tint
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

  const tintedColors = getSoftTintedColors();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    headerSection: {
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
      backgroundColor: tintedColors.softSurface,
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.xl,
      marginTop: -tokens.spacing.md, // Overlap with header for smoother transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    cardTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.lg,
      textAlign: "center",
    },
    phoneNumber: {
      fontSize: tokens.typography.subtitle,
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
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
      gap: tokens.spacing.md,
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: tokens.colors.primaryLight,
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
    },
    cancelBtnText: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    nextBtn: {
      flex: 1,
      borderRadius: tokens.borderRadius.button,
      ...tokens.shadows.sm,
    },
    nextBtnGradient: {
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
    },
    nextBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
  });
};

export default ConfirmPhoneScreen;
