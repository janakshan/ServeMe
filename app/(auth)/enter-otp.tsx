import { useThemedStyles, useServiceTheme } from "@/contexts/ServiceThemeContext";
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
import { LinearGradient } from "expo-linear-gradient";

const EnterOTPScreen = () => {
  const { email, flow } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const headerGradient = getGradient('header');
  const backgroundGradient = getGradient('background');
  
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
      </LinearGradient>
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
};

export default EnterOTPScreen;
