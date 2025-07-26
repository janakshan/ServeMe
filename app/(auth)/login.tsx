import { useAuthTheme, useAuthThemedStyles } from "@/contexts/AuthThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRouteGroupNavigation } from "@/utils/navigationStackReset";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { getGradient } = useAuthTheme();
  const styles = useAuthThemedStyles(createStyles);
  const { navigateToMainApp } = useRouteGroupNavigation();

  const headerGradient = getGradient("header");
  const buttonGradient = getGradient("button");
  const backgroundGradient = getGradient("background");

  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync("stored_email");
      const storedPassword = await SecureStore.getItemAsync("stored_password");
      const storedRememberMe = await SecureStore.getItemAsync("remember_me");

      if (storedEmail && storedPassword && storedRememberMe === "true") {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error loading stored credentials:", error);
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);

      if (rememberMe) {
        await SecureStore.setItemAsync("stored_email", email);
        await SecureStore.setItemAsync("stored_password", password);
        await SecureStore.setItemAsync("remember_me", "true");
      } else {
        await SecureStore.deleteItemAsync("stored_email");
        await SecureStore.deleteItemAsync("stored_password");
        await SecureStore.deleteItemAsync("remember_me");
      }

      navigateToMainApp();
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={backgroundGradient.colors}
      start={{
        x: backgroundGradient.direction.x,
        y: backgroundGradient.direction.y,
      }}
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.description}>
              Welcome back! Please enter your credentials to access your
              account.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.contentSection}>
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
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={styles.passwordInput.placeholderTextColor}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
            testID="password-visibility-toggle"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={styles.eyeIcon.color}
            />
          </Pressable>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={styles.rememberMe}
            onPress={() => setRememberMe((v) => !v)}
            testID="remember-me-button"
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              testID="remember-me-checkbox"
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={styles.forgot}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Log In"
          style={styles.loginBtn}
        >
          <LinearGradient
            colors={buttonGradient.colors}
            start={{
              x: buttonGradient.direction.x,
              y: buttonGradient.direction.y,
            }}
            end={{ x: 1, y: 1 }}
            style={styles.loginBtnGradient}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signupPrompt}>
            Don't have an account?{" "}
            <Text style={styles.signupLinkText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.orLoginWith}>Or login with</Text>

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

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signupLink}>
            By signing In, you agree to the{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Data Processing Agreement</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const createStyles = (tokens: any, layout: any, variants: any) => {
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
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.xl,
    },
    rememberMe: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: tokens.spacing.xs,
      borderWidth: 2,
      borderColor: tokens.colors.primaryLight,
      backgroundColor: tokens.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: tokens.spacing.sm,
    },
    checkboxChecked: {
      backgroundColor: tokens.colors.primaryLight,
      borderColor: tokens.colors.primaryLight,
    },
    rememberText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurface,
    },
    forgot: {
      color: tokens.colors.primaryLight,
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.semibold,
      textAlign: "right",
    },
    loginBtn: {
      borderRadius: tokens.borderRadius.button,
      marginBottom: tokens.spacing.lg,
      marginTop: tokens.spacing.xxs,
      ...tokens.shadows.sm,
    },
    loginBtnGradient: {
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
    },
    loginBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    signupPrompt: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginVertical: tokens.spacing.md,
    },
    signupLinkText: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.bold,
    },
    error: {
      color: tokens.colors.error,
      marginBottom: tokens.spacing.sm,
      textAlign: "center",
      fontSize: tokens.typography.caption,
    },
    orLoginWith: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      marginVertical: tokens.spacing.lg,
    },
    socialButtonsContainer: {
      flexDirection: "row",
      gap: tokens.spacing.md,
      marginTop: tokens.spacing.lg,
      marginBottom: tokens.spacing.xl,
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
    signupLink: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: tokens.typography.caption * 1.4,
    },
    linkText: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.medium,
    },
  });
};

export default LoginScreen;
