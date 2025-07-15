import { useThemedStyles, useServiceTheme } from "@/contexts/ServiceThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ResetPasswordScreen = () => {
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const headerGradient = getGradient('header');
  const buttonGradient = getGradient('button');
  const backgroundGradient = getGradient('background');

  const handleResetPassword = async () => {
    setError("");

    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Navigate to login with success message
      router.replace("/(auth)/login");
    } catch (e) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.description}>
              Create a new password for your account to regain access.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.contentSection}>
        <Text style={styles.contentDescription}>
          Enter your new password below. Make sure it's secure and easy to remember.
        </Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={styles.passwordInput.placeholderTextColor}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={styles.eyeIcon.color}
            />
          </Pressable>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor={styles.passwordInput.placeholderTextColor}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowConfirmPassword((v) => !v)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={styles.eyeIcon.color}
            />
          </Pressable>
        </View>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleResetPassword}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Reset Password"
        >
          <LinearGradient
            colors={buttonGradient.colors}
            start={{ x: buttonGradient.direction.x, y: buttonGradient.direction.y }}
            end={{ x: 1, y: 1 }}
            style={styles.resetBtnGradient}
          >
            <Text style={styles.resetBtnText}>
              {loading ? "Resetting..." : "Reset Password"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go Back"
        >
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
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
      paddingBottom: tokens.spacing.xl,
      marginTop: -tokens.spacing.md, // Overlap with header for smoother transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
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
    passwordContainer: {
      position: "relative",
      width: "100%",
      marginBottom: tokens.spacing.md,
    },
    passwordInput: {
      backgroundColor: tokens.colors.inputBackground,
      borderWidth: 2,
      borderColor: tokens.colors.inputBorder,
      borderRadius: tokens.borderRadius.input,
      padding: tokens.spacing.inputPadding.vertical,
      paddingRight: 50,
      fontSize: tokens.typography.body,
      color: tokens.colors.onBackground,
      width: "100%",
      placeholderTextColor: tokens.colors.placeholder,
    },
    eyeBtn: {
      position: "absolute",
      right: tokens.spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      width: 40,
    },
    eyeIcon: {
      color: tokens.colors.primaryLight,
    },
    resetBtn: {
      borderRadius: tokens.borderRadius.button,
      marginBottom: tokens.spacing.lg,
      marginTop: tokens.spacing.sm,
      ...tokens.shadows.sm,
    },
    resetBtnGradient: {
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
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
      marginBottom: tokens.spacing.lg,
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
};

export default ResetPasswordScreen;