import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMainAppTheme } from '@/contexts/MainAppThemeProvider';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { useAuthTheme } from '@/contexts/AuthThemeProvider';
import type { DesignTokens } from '@/utils/tokens';
import type { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  minHeight?: number;
  themeType?: 'main-app' | 'education' | 'booking' | 'healthcare' | 'entertainment' | 'auth';
}

// Hook to get the appropriate theme based on themeType
function useScreenHeaderTheme(themeType?: ScreenHeaderProps['themeType']) {
  try {
    // Try to get theme from context - use the first available
    if (themeType === 'main-app') {
      return useMainAppTheme();
    } else if (themeType === 'education') {
      return useEducationTheme();
    } else if (themeType === 'auth') {
      return useAuthTheme();
    } else {
      // Auto-detect: try main app first, then education, then auth
      try {
        return useMainAppTheme();
      } catch {
        try {
          return useEducationTheme();
        } catch {
          try {
            return useAuthTheme();
          } catch {
            // Fallback: return a minimal theme
            return null;
          }
        }
      }
    }
  } catch (error) {
    return null;
  }
}

export function ScreenHeader({ title, subtitle, minHeight = 160, themeType }: ScreenHeaderProps) {
  const theme = useScreenHeaderTheme(themeType);
  
  // Fallback if no theme context is available
  if (!theme) {
    return (
      <View style={[fallbackStyles.headerSection, { minHeight }]}>
        <SafeAreaView style={fallbackStyles.headerSafeArea}>
          <View style={fallbackStyles.headerContent}>
            <Text style={fallbackStyles.title}>{title}</Text>
            {subtitle && (
              <Text style={fallbackStyles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const { styles, gradientColors } = createThemedStyles(theme.tokens, theme.layout, theme.componentVariants);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.headerSection, { minHeight }]}
    >
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Fallback styles when no theme context is available
const fallbackStyles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#0D47A1',
    paddingBottom: 24,
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  headerContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontWeight: '300',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 24,
    lineHeight: 20.8,
  },
});

const createThemedStyles = (
  tokens: DesignTokens, 
  layout: ServiceThemeOverride['layout'], 
  variants: ServiceThemeOverride['componentVariants']
) => {
  // Create a subtle gradient that's more professional
  const getSubtleGradient = () => {
    const primaryColor = tokens.colors.primary;
    
    // Create very subtle gradient - closer to solid but with slight depth
    if (primaryColor === '#0D47A1') {
      // Professional blue - minimal gradient
      return ['#1565C0', '#0D47A1', '#0A3D91'];
    } else if (primaryColor === '#7B1FA2') {
      // Purple theme - minimal gradient
      return ['#8E24AA', '#7B1FA2', '#6A1B9A'];
    } else if (primaryColor === '#2E7D32') {
      // Green theme - minimal gradient
      return ['#388E3C', '#2E7D32', '#1B5E20'];
    } else if (primaryColor === '#E91E63') {
      // Pink theme - minimal gradient
      return ['#EC407A', '#E91E63', '#C2185B'];
    } else {
      // Default minimal gradient
      return ['#1565C0', primaryColor, '#0A3D91'];
    }
  };

  return {
    gradientColors: getSubtleGradient(),
    styles: StyleSheet.create({
      headerSection: {
        paddingBottom: tokens.spacing.lg,
      },
    headerSafeArea: {
      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'center',
    },
    headerContent: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
    },
    title: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.display,
      textAlign: 'center',
      marginBottom: tokens.spacing.xs,
    },
    subtitle: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.light,
      fontSize: tokens.typography.body,
      textAlign: 'center',
      opacity: 0.9,
      paddingHorizontal: tokens.spacing.lg,
      lineHeight: tokens.typography.body * 1.3,
    },
    })
  };
};