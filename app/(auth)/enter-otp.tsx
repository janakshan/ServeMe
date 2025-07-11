import { useThemedStyles } from "@/contexts/ServiceThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EnterOTPScreen = () => {
  const { email, flow } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  const styles = useThemedStyles(createStyles);
  
  // Determine if this is for forgot password or signup flow
  const isForgotPasswordFlow = flow === "forgot-password";
  const displayEmail = email || "admin@serveme.sg";

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 5) {
      setError("Please enter all 5 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate based on the flow type
      if (isForgotPasswordFlow) {
        router.push({
          pathname: "/(auth)/reset-password",
          params: { email: displayEmail }
        });
      } else {
        router.push("/(auth)/signup-success");
      }
    } catch (e) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendCountdown(30);
    setError("");
    // Simulate resend API call
    console.log("Resending OTP...");

    // Countdown timer
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {isForgotPasswordFlow ? "Reset Password" : "Verification Code"}
            </Text>
            <Text style={styles.description}>
              {isForgotPasswordFlow 
                ? "Enter the 5-digit code we sent to your email to reset your password."
                : "Enter the 5-digit code we sent to your phone to verify your identity."
              }
            </Text>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.contentDescription}>
          A verification code has been sent to {displayEmail}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(index, key)
              }
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Verify OTP"
        >
          <Text style={styles.verifyBtnText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResend}
          disabled={resendCountdown > 0}
        >
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            <Text
              style={[
                styles.resendLink,
                resendCountdown > 0 && styles.resendLinkDisabled,
              ]}
            >
              {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
            </Text>
          </Text>
        </TouchableOpacity>
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
      paddingBottom: tokens.spacing.xl,
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
      lineHeight: tokens.typography.body * 1.4,
      marginBottom: tokens.spacing.xl,
    },
    error: {
      color: tokens.colors.error,
      marginBottom: tokens.spacing.md,
      textAlign: "center",
      fontSize: tokens.typography.caption,
    },
    otpContainer: {
      flexDirection: "row",
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.xl,
      justifyContent: "center",
    },
    otpInput: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderColor: tokens.colors.inputBorder,
      borderRadius: tokens.borderRadius.input,
      backgroundColor: tokens.colors.inputBackground,
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      textAlign: "center",
    },
    verifyBtn: {
      backgroundColor: tokens.colors.primaryDark,
      paddingVertical: tokens.spacing.buttonPadding.vertical,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.borderRadius.button,
      alignItems: "center",
      marginBottom: tokens.spacing.lg,
      width: "100%",
      ...tokens.shadows.sm,
    },
    verifyBtnDisabled: {
      backgroundColor: tokens.colors.onSurfaceVariant,
    },
    verifyBtnText: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.subtitle,
    },
    resendContainer: {
      alignItems: "center",
      marginBottom: tokens.spacing.lg,
    },
    resendText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
    },
    resendLink: {
      color: tokens.colors.primaryLight,
      fontWeight: tokens.typography.bold,
    },
    resendLinkDisabled: {
      color: tokens.colors.onSurfaceVariant,
    },
  });

export default EnterOTPScreen;
