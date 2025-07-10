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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

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
            placeholderTextColor="#546E7A"
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#546E7A"
            />
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
              testID="password-visibility-toggle"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#42A5F5"
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
              <Text style={{ color: "#666666" }}>Don't have an account?</Text>{" "}
              <Text style={{ color: "#42A5F5", fontWeight: "bold" }}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  bgWrap: {
    flex: 1,
    backgroundColor: "#F8FCFF",
  },
  blueBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: "#0D47A1",
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
    marginTop: 18,
    marginBottom: 12,
  },
  logoipsum: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 0,
    lineHeight: 22,
  },
  card: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 32,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    color: "#1A237E",
    marginBottom: 6,
    marginTop: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#E8F4FD",
    borderWidth: 2,
    borderColor: "#42A5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 14,
    width: "100%",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 14,
  },
  passwordInput: {
    backgroundColor: "#E8F4FD",
    borderWidth: 2,
    borderColor: "#42A5F5",
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: "#111827",
    width: "100%",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#42A5F5",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#42A5F5",
    borderColor: "#42A5F5",
  },
  rememberText: {
    fontSize: 15,
    color: "#1A237E",
  },
  forgot: {
    color: "#42A5F5",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
  },
  loginBtn: {
    backgroundColor: "#1565C0",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 2,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  spacer: {
    flex: 1,
  },
  signupLink: {
    color: "#546E7A",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  error: {
    color: "#EF4444",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 15,
  },
});

export default LoginScreen;
