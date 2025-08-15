import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import * as Haptics from 'expo-haptics';

interface AnalysisHeaderProps {
  title: string;
  onBack: () => void;
  onShare: () => void;
  isMultiSelectMode: boolean;
  selectedCount: number;
  onClearSelection: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  title,
  onBack,
  onShare,
  isMultiSelectMode,
  selectedCount,
  onClearSelection,
}) => {
  const themeContext = useEducationTheme();
  const { tokens, getGradient } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const backgroundGradient = getGradient('header');

  const handleBack = () => {
    onBack();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleShare = () => {
    onShare();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClear = () => {
    onClearSelection();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isMultiSelectMode) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={backgroundGradient.colors as any}
          start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.multiSelectHeader}>
            <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
              <Ionicons name="close" size={24} color={tokens.colors.onPrimary} />
            </TouchableOpacity>
            
            <View style={styles.multiSelectContent}>
              <Text style={styles.selectedCount}>
                {selectedCount} Selected
              </Text>
              <Text style={styles.selectedSubtitle}>
                Ready to bookmark
              </Text>
            </View>
            
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share" size={24} color={tokens.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.onPrimary} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <View style={styles.brandingContainer}>
              <View style={styles.brandingIcon}>
                <Ionicons name="analytics" size={16} color={tokens.colors.onPrimary} />
              </View>
              <Text style={styles.brandingText}>Analysis</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.subtitle}>Detailed Performance Review</Text>
          </View>
          
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={tokens.colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    paddingBottom: tokens.spacing.lg,
    minHeight: 140, // Compact but elegant height
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    minHeight: 60,
  },
  
  multiSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    minHeight: 60,
  },
  
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
  },
  
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
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
    fontSize: 20, // Slightly smaller for compact header
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  
  subtitle: {
    color: tokens.colors.onPrimary,
    fontWeight: '400',
    fontSize: tokens.typography.caption,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.1,
  },
  
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  multiSelectContent: {
    flex: 1,
    alignItems: 'center',
  },
  
  selectedCount: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  
  selectedSubtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onPrimary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
});