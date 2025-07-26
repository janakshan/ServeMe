import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { router } from 'expo-router';
import { useRouteGroupNavigation } from '@/utils/navigationStackReset';

interface EducationScreenHeaderProps {
  title: string;
  subtitle?: string;
  minHeight?: number;
  showBackButton?: boolean;
  showBranding?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };
  rightActions?: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  }>;
  children?: React.ReactNode;
}

export function EducationScreenHeader({ 
  title, 
  subtitle, 
  minHeight = 200,
  showBackButton = true,
  showBranding = true,
  onBackPress,
  rightAction,
  rightActions,
  children 
}: EducationScreenHeaderProps) {
  const themeContext = useEducationTheme();
  const { tokens, getGradient } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { backWithReset } = useRouteGroupNavigation();
  
  const backgroundGradient = getGradient('header');

  const handleBackPress = () => {
    // Use custom onBackPress if provided, otherwise use default navigation
    if (onBackPress) {
      console.log('EducationScreenHeader: Using custom onBackPress');
      onBackPress();
    } else {
      // For intra-service navigation, use regular router.back()
      console.log('EducationScreenHeader: handleBackPress called, canGoBack:', router.canGoBack());
      if (router.canGoBack()) {
        console.log('EducationScreenHeader: Going back using router.back()');
        router.back();
      } else {
        console.log('EducationScreenHeader: No back history, using route group back navigation');
        // Use route group back navigation with stack awareness
        backWithReset();
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={backgroundGradient.colors as any}
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
              
              {(rightActions || rightAction) && (
                <View style={styles.rightActionsContainer}>
                  {rightActions ? (
                    rightActions.map((action, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          action.onPress();
                        }}
                        style={[styles.rightAction, { marginTop: index > 0 ? 8 : 0 }]}
                      >
                        <Ionicons
                          name={action.icon}
                          size={24}
                          color={tokens.colors.onPrimary}
                        />
                      </TouchableOpacity>
                    ))
                  ) : rightAction ? (
                    <TouchableOpacity
                      onPress={() => {
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
                  ) : null}
                </View>
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
    paddingBottom: tokens.spacing.xl,
    minHeight: 220, // Consistent minimum height
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: tokens.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
    minHeight: 44,
    width: '100%',
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
    marginBottom: tokens.spacing.md,
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
    fontSize: 26,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
    lineHeight: 30,
    letterSpacing: -0.4,
    paddingHorizontal: tokens.spacing.md,
  },
  subtitle: {
    color: tokens.colors.onPrimary,
    fontWeight: '400',
    fontSize: tokens.typography.body - 1,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: tokens.typography.body * 1.3,
    letterSpacing: 0.1,
    paddingHorizontal: tokens.spacing.lg,
  },
  childrenContainer: {
    marginTop: tokens.spacing.md,
  },
  rightActionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
});