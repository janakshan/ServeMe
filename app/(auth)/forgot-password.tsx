import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { authApi } from "../../services/api/auth";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
      <View style={styles.bgWrap}>
        <View style={styles.blueBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerWrap}>
            <Text style={styles.logoipsum}>ServeMe</Text>
            <Text style={styles.title}>Check Your Email</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Email Sent!</Text>
            <Text style={styles.description}>
              We've sent password reset instructions to {email}
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.resetBtnText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.bgWrap}>
      <View style={styles.blueBg} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrap}>
          <Text style={styles.logoipsum}>ServeMe</Text>
          <Text style={styles.title}>Reset your Password</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Forgot Password</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
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
            placeholderTextColor="#546E7A"
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
          
          <View style={styles.spacer} />
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
  description: {
    fontSize: 16,
    color: "#546E7A",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: "#1565C0",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    flex: 2,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  resetBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  backBtn: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#42A5F5",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    flex: 1,
  },
  backBtnText: {
    color: "#42A5F5",
    fontWeight: "bold",
    fontSize: 18,
  },
  spacer: {
    flex: 1,
  },
  error: {
    color: "#EF4444",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 15,
  },
});

export default ForgotPasswordScreen;