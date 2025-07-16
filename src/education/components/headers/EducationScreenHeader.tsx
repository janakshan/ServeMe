import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface EducationScreenHeaderProps {
  title: string;
  subtitle?: string;
  minHeight?: number;
  showBackButton?: boolean;
  showBranding?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };
  children?: React.ReactNode;
}

export function EducationScreenHeader({ 
  title, 
  subtitle, 
  minHeight = 200,
  showBackButton = true,
  showBranding = true,
  rightAction,
  children 
}: EducationScreenHeaderProps) {
  const { tokens, getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const backgroundGradient = getGradient('header');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={backgroundGradient.colors}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerSection, { height: minHeight }]}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              {showBackButton && (
                <TouchableOpacity
                  onPress={handleBackPress}
                  style={styles.backButton}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={tokens.colors.onPrimary}
                  />
                </TouchableOpacity>
              )}
              
              <View style={styles.headerCenter}>
                {showBranding && (
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
                )}
                <Text style={styles.title}>{title}</Text>
                {subtitle && (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                )}
              </View>
              
              {rightAction && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    rightAction.onPress();
                  }}
                  style={styles.rightAction}
                >
                  <Ionicons
                    name={rightAction.icon}
                    size={24}
                    color={tokens.colors.onPrimary}
                  />
                </TouchableOpacity>
              )}
            </View>
            
            {children && (
              <View style={styles.childrenContainer}>
                {children}
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  headerSection: {
    paddingBottom: tokens.spacing.lg,
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  headerContent: {
    width: '100%',
    paddingHorizontal: tokens.spacing.lg,
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  backButton: {
    padding: tokens.spacing.sm,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
  },
  rightAction: {
    padding: tokens.spacing.sm,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
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
  title: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: tokens.colors.onPrimary,
    fontWeight: '400',
    fontSize: tokens.typography.body,
    textAlign: 'center',
    opacity: 0.85,
    lineHeight: tokens.typography.body * 1.4,
    letterSpacing: 0.2,
  },
  childrenContainer: {
    marginTop: tokens.spacing.md,
  },
});