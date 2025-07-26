import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouteGroupNavigation } from '@/utils/navigationStackReset';

interface UserData {
  name: string;
}

interface EducationHomeHeaderProps {
  userData: UserData;
}

export function EducationHomeHeader({ userData }: EducationHomeHeaderProps) {
  const theme = useEducationTheme();
  const { tokens, getGradient } = theme;
  const styles = useScopedThemedStyles(createStyles, theme);
  const { navigateToMainApp, backWithReset } = useRouteGroupNavigation();
  
  // Use the same gradient system as teachers screen header
  const backgroundGradient = getGradient('header');

  const handleBackPress = () => {
    // Use route group navigation with proper stack reset
    if (router.canGoBack()) {
      backWithReset();
    } else {
      // Fallback to main app with stack reset
      navigateToMainApp();
    }
  };

  const handleRankPress = () => {
    // Navigate to leaderboard page
    router.push('/(services)/education/(tabs)/leaderboard');
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.navButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={tokens.colors.onPrimary}
            />
          </TouchableOpacity>
          
          <View style={styles.brandingContainer}>
            <View style={styles.brandingIcon}>
              <Ionicons
                name="school"
                size={20}
                color={tokens.colors.onPrimary}
              />
            </View>
            <Text style={styles.brandingText}>ServeMe Edu</Text>
          </View>
          
          <TouchableOpacity
            onPress={handleRankPress}
            style={styles.navButton}
          >
            <Ionicons
              name="trophy-outline"
              size={24}
              color={tokens.colors.onPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greetingText}>{getTimeBasedGreeting()},</Text>
          <Text style={styles.nameText}>{userData.name}! 👋</Text>
          <Text style={styles.motivationText}>Ready to continue your learning journey?</Text>
        </View>


      </LinearGradient>
    </>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
  },
  navButton: {
    padding: tokens.spacing.sm,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: tokens.borderRadius.full,
  },
  brandingIcon: {
    marginRight: tokens.spacing.xs,
  },
  brandingText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  welcomeSection: {
    marginBottom: tokens.spacing.xl,
  },
  greetingText: {
    color: tokens.colors.onPrimary,
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.9,
  },
  nameText: {
    color: tokens.colors.onPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: tokens.spacing.xs,
    letterSpacing: -0.5,
  },
  motivationText: {
    color: tokens.colors.onPrimary,
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.8,
    lineHeight: 22,
  },
});