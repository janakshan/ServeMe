import { useThemedStyles } from "@/contexts/ServiceThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ConfirmPhoneScreen = () => {
  const [email] = useState("admin@serveme.sg"); // This would come from signup form

  const styles = useThemedStyles(createStyles);

  const handleNext = () => {
    router.push("/(auth)/enter-otp");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.description}>
              We'll send a verification code to ensure your account security.
            </Text>
          </View>
        </SafeAreaView>
      </View>
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
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (tokens, layout, variants) =>
  StyleSheet.create({
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
      backgroundColor: tokens.colors.primaryDark,
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
      ...tokens.shadows.sm,
    },
    nextBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
  });

export default ConfirmPhoneScreen;
