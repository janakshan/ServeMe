import { useThemedStyles, useServiceTheme } from "@/contexts/ServiceThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const headerGradient = getGradient('header');
  const buttonGradient = getGradient('button');
  const backgroundGradient = getGradient('background');

  const handleSignup = async () => {
    setError("");

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
      // First, navigate to confirm phone screen
      router.push("/(auth)/confirm-phone");
    } catch (e) {
      setError(e.message || "Signup failed");
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.description}>
              Join thousands of users who trust ServeMe for their service needs.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.contentSection}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={styles.input.placeholderTextColor}
        />

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

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={styles.input.placeholderTextColor}
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor={styles.input.placeholderTextColor}
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
          onPress={handleSignup}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Sign Up"
          style={styles.signupBtn}
        >
          <LinearGradient
            colors={buttonGradient.colors}
            start={{ x: buttonGradient.direction.x, y: buttonGradient.direction.y }}
            end={{ x: 1, y: 1 }}
            style={styles.signupBtnGradient}
          >
            <Text style={styles.signupBtnText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.signinPrompt}>
            Already have an account?{" "}
            <Text style={styles.signinLinkText}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        {/* <Text style={styles.orSignupWith}>Or signup with</Text> */}

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.socialButtonText}>Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </View>
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
      paddingBottom: tokens.spacing.lg,
      minHeight: 220,
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
      paddingTop: tokens.spacing.lg,
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
    signupBtn: {
      borderRadius: tokens.borderRadius.button,
      marginBottom: tokens.spacing.lg,
      marginTop: tokens.spacing.sm,
      ...tokens.shadows.sm,
    },
    signupBtnGradient: {
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
    },
    signupBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    signinPrompt: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginVertical: tokens.spacing.lg,
    },
    signinLinkText: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.bold,
    },
    error: {
      color: tokens.colors.error,
      marginBottom: tokens.spacing.sm,
      textAlign: "center",
      fontSize: tokens.typography.caption,
    },
    orSignupWith: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginVertical: tokens.spacing.md,
    },
    socialButtonsContainer: {
      flexDirection: "row",
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
    },
    socialButton: {
      flex: 1,
      paddingVertical: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.outline,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
      backgroundColor: tokens.colors.surface,
    },
    socialButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: tokens.spacing.sm,
    },
    socialButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: tokens.typography.medium,
    },
  });
};

export default SignupScreen;
