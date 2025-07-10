import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import { useThemedStyles } from "@/contexts/ServiceThemeContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  
  const styles = useThemedStyles(createStyles);

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

      router.replace("/(app)/(tabs)");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bgWrap}>
      <View style={styles.blueBg} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrap}>
          <Text style={styles.logoipsum}>ServeMe</Text>
          <Text style={styles.title}>Sign in to your Account</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log In</Text>
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
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Log In"
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.signupLink}>
              <Text style={styles.signupLinkNormal}>Don't have an account?</Text>{" "}
              <Text style={styles.signupLinkHighlight}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (tokens, layout, variants) => StyleSheet.create({
  bgWrap: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  blueBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: tokens.colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  headerWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  logoipsum: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.display,
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
  },
  title: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.regular,
    fontSize: tokens.typography.subtitle,
    textAlign: "center",
    marginBottom: 0,
    lineHeight: tokens.typography.subtitle * tokens.typography.tight,
  },
  card: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.card,
    marginTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.cardPadding.horizontal,
    paddingVertical: tokens.spacing.cardPadding.vertical,
    ...tokens.shadows.md,
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
    backgroundColor: tokens.colors.primaryDark,
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    borderRadius: tokens.borderRadius.button,
    alignItems: "center",
    marginBottom: tokens.spacing.lg,
    marginTop: tokens.spacing.xxs,
    ...tokens.shadows.sm,
  },
  loginBtnText: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
    fontSize: tokens.typography.subtitle,
  },
  spacer: {
    flex: 1,
  },
  signupLink: {
    fontSize: tokens.typography.body,
    textAlign: "center",
    marginBottom: tokens.spacing.md,
    fontWeight: tokens.typography.medium,
  },
  signupLinkNormal: {
    color: tokens.colors.onSurfaceVariant,
  },
  signupLinkHighlight: {
    color: tokens.colors.primaryLight,
    fontWeight: tokens.typography.bold,
  },
  error: {
    color: tokens.colors.error,
    marginBottom: tokens.spacing.sm,
    textAlign: "center",
    fontSize: tokens.typography.caption,
  },
});

export default LoginScreen;
