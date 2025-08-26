import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import * as Haptics from 'expo-haptics';

import type { DetailedQuestionAnalysis } from '@/types/examAnalysis';

interface SystemExplanationPanelProps {
  explanation: DetailedQuestionAnalysis['systemExplanation'];
  style?: ViewStyle;
}

export const SystemExplanationPanel: React.FC<SystemExplanationPanelProps> = ({
  explanation,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createPanelStyles, themeContext);

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Simple Explanation */}
      <View style={styles.explanationContent}>
        <Text style={styles.explanationText}>{explanation.text}</Text>
      </View>

      {/* Single Image */}
      {explanation.images && explanation.images.length > 0 && (
        <View style={styles.imageSection}>
          {imageError ? (
            <View style={styles.imageErrorContainer}>
              <Ionicons name="image-outline" size={40} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.imageErrorText}>Image unavailable</Text>
            </View>
          ) : (
            <Image
              source={{ uri: explanation.images[0].url }}
              style={styles.explanationImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          )}
          {explanation.images[0].caption && (
            <Text style={styles.imageCaption}>{explanation.images[0].caption}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const createPanelStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
    ...tokens.shadows.sm,
  },
  
  explanationContent: {
    marginBottom: tokens.spacing.md,
  },
  
  explanationText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 24,
    fontWeight: '400',
  },
  
  imageSection: {
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surfaceVariant + '30',
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
  },
  
  explanationImage: {
    width: '100%',
    height: 180,
    backgroundColor: tokens.colors.surfaceVariant + '30',
  },
  
  imageCaption: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
  },
  
  imageErrorContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant + '30',
  },
  
  imageErrorText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
  },
});