import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { router } from 'expo-router';

interface MinimalHeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
  title?: string;
  showTitle?: boolean;
  backgroundColor?: string;
  headerHeight?: number;
  titleStyle?: TextStyle;
}

export function MinimalHeader({ 
  onBackPress,
  showBackButton = true,
  title,
  showTitle = !!title,
  backgroundColor,
  headerHeight = 60,
  titleStyle
}: MinimalHeaderProps) {
  const themeContext = useEducationTheme();
  const { tokens, getGradient } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const backgroundGradient = getGradient('header');

  const handleBackPress = () => {
    // Add haptic feedback to confirm button press
    if (typeof require !== 'undefined') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        // Haptics not available, ignore
      }
    }
    
    if (onBackPress) {
      onBackPress();
    } else {
      // Default navigation behavior - try router.back() first, then fallback to exams tab
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(services)/education/(tabs)/exams');
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={backgroundColor ? [backgroundColor, backgroundColor] : backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.headerContent, { minHeight: headerHeight }]}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                testID="minimal-header-back-button"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={tokens.colors.onPrimary}
                />
              </TouchableOpacity>
            )}
            
            {showTitle && title && (
              <View style={styles.titleContainer}>
                <Text style={[styles.titleText, titleStyle]}>
                  {title}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  headerContainer: {
    // Remove fixed height - let SafeAreaView + content determine height
    zIndex: 10,
    elevation: 10,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    // minHeight will be set dynamically via props
  },
  backButton: {
    padding: tokens.spacing.sm,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: tokens.spacing.md,
    zIndex: 100,
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 48 + tokens.spacing.md, // Offset for back button to center title
  },
  titleText: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
});