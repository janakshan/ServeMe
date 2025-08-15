import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

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
      <View style={styles.container}>
        <View style={styles.multiSelectHeader}>
          <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
          
          <View style={styles.multiSelectContent}>
            <Text style={styles.selectedCount}>
              {selectedCount} Selected
            </Text>
          </View>
          
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share" size={24} color={tokens.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.onSurface} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle}>Detailed Analysis</Text>
        </View>
        
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={tokens.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    ...tokens.shadows.sm,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    minHeight: 60,
  },
  
  multiSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    minHeight: 60,
    backgroundColor: tokens.colors.primary + '10',
  },
  
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  title: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  subtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  multiSelectContent: {
    flex: 1,
    alignItems: 'center',
  },
  
  selectedCount: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
});