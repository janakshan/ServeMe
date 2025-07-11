import { useThemedStyles } from "@/contexts/ServiceThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authApi } from "../../services/api/auth";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const styles = useThemedStyles(createStyles);

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (e) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
                <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.description}>We've sent you password reset instructions.</Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.cardTitle}>Email Sent!</Text>
          <Text style={styles.contentDescription}>
            We've sent password reset instructions to {email}
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.resetBtnText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.description}>Don't worry, we'll help you recover your account securely.</Text>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.contentDescription}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styles.input.placeholderTextColor}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go Back"
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetPassword}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Send Reset Email"
          >
            <Text style={styles.resetBtnText}>
              {loading ? "Sending..." : "Send Reset Email"}
            </Text>
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
    contentDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginBottom: tokens.spacing.xl,
      lineHeight: tokens.typography.body * 1.4,
    },
    label: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
      marginTop: tokens.spacing.sm,
      fontWeight: tokens.typography.semibold,
    },
    input: {
      backgroundColor: tokens.colors.inputBackground,
      borderWidth: 2,
      borderColor: tokens.colors.inputBorder,
      borderRadius: tokens.borderRadius.input,
      padding: tokens.spacing.inputPadding.vertical,
      fontSize: tokens.typography.body,
      color: tokens.colors.onBackground,
      marginBottom: tokens.spacing.md,
      width: "100%",
      placeholderTextColor: tokens.colors.placeholder,
    },
    buttonRow: {
      flexDirection: "row",
      gap: tokens.spacing.md,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
    },
    resetBtn: {
      backgroundColor: tokens.colors.primaryDark,
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
      flex: 2,
      ...tokens.shadows.sm,
    },
    resetBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    backBtn: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: tokens.colors.primaryLight,
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
      flex: 1,
    },
    backBtnText: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    error: {
      color: tokens.colors.error,
      marginBottom: tokens.spacing.sm,
      textAlign: "center",
      fontSize: tokens.typography.caption,
    },
  });

export default ForgotPasswordScreen;
