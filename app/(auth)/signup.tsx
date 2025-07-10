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
      await signup(email, password, name);
      router.replace("/(app)/(tabs)");
    } catch (e) {
      setError(e.message || "Signup failed");
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
          <Text style={styles.title}>Create your Account</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign Up</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#546E7A"
          />

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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#546E7A"
            />
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#42A5F5"
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
              placeholderTextColor="#546E7A"
            />
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPassword((v) => !v)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#42A5F5"
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={styles.signupBtnText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>
              <Text style={{ color: "#666666" }}>Already have an account?</Text>{" "}
              <Text style={{ color: "#42A5F5", fontWeight: "bold" }}>
                Sign in
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
  signupBtn: {
    backgroundColor: "#1565C0",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 14,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  signupBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  spacer: {
    flex: 1,
  },
  loginLink: {
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

export default SignupScreen;
