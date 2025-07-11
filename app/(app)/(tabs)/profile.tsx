import { useThemedStyles } from "@/contexts/ServiceThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useAuth } from "../../../hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const styles = useThemedStyles(createStyles);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>My Profile</Text>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView style={styles.contentSection}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              }}
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.profileName}>
            {user?.name || "Smith Johnson"}
          </Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="create-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>My Bookings</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="location-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>My Addresses</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/payments')}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="card-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Payment</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/settings')}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="moon-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={styles.menuIcon.color}
              />
              <Text style={styles.menuText}>Terms & Conditions</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.menuIcon.color}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={styles.logoutIcon.color}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (tokens, layout, variants) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    headerSection: {
      backgroundColor: tokens.colors.primary,
      paddingBottom: tokens.spacing.lg,
      minHeight: 150,
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
      textAlign: "center",
    },
    contentSection: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: tokens.spacing.xl,
      backgroundColor: tokens.colors.surface,
      marginHorizontal: tokens.spacing.lg,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: tokens.spacing.md,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: tokens.colors.surfaceElevated,
    },
    cameraIconContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: tokens.colors.primary,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: tokens.colors.surface,
    },
    profileName: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    menuSection: {
      backgroundColor: tokens.colors.surface,
      // marginHorizontal: tokens.spacing.lg,
      marginBottom: tokens.spacing.xl,
      borderRadius: tokens.borderRadius.lg,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.md,
    },
    menuIcon: {
      color: tokens.colors.onSurfaceVariant,
    },
    logoutItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
    },
    logoutText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.error,
      marginLeft: tokens.spacing.md,
    },
    logoutIcon: {
      color: tokens.colors.error,
    },
  });
