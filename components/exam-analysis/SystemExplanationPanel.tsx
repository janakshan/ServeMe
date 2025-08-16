import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  const [showAllKeyPoints, setShowAllKeyPoints] = useState(false);
  const [expandedImages, setExpandedImages] = useState<Set<number>>(new Set());

  const handleShowMoreKeyPoints = () => {
    setShowAllKeyPoints(!showAllKeyPoints);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleImagePress = (index: number) => {
    setExpandedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const visibleKeyPoints = showAllKeyPoints 
    ? explanation.keyPoints 
    : explanation.keyPoints.slice(0, 3);

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="bulb" size={20} color={tokens.colors.warning} />
        </View>
        <Text style={styles.headerTitle}>System Explanation</Text>
      </View>

      {/* Main Explanation */}
      <View style={styles.mainExplanation}>
        <Text style={styles.explanationText}>{explanation.text}</Text>
      </View>

      {/* Rich Content Section */}
      {explanation.richContent && (
        <View style={styles.richContentSection}>
          <Text style={styles.sectionTitle}>Detailed Explanation</Text>
          <View style={styles.richContentContainer}>
            <ScrollView 
              style={styles.richContentScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.richContentText}>{explanation.richContent}</Text>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Images Section */}
      {explanation.images && explanation.images.length > 0 && (
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Visual Explanations</Text>
          {explanation.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => handleImagePress(index)}
            >
              <Image
                source={{ uri: image.url }}
                style={[
                  styles.explanationImage,
                  expandedImages.has(index) && styles.expandedImage
                ]}
                resizeMode={expandedImages.has(index) ? "contain" : "cover"}
              />
              {image.caption && (
                <View style={styles.imageCaptionContainer}>
                  <Text style={styles.imageCaption}>{image.caption}</Text>
                </View>
              )}
              <View style={styles.expandIndicator}>
                <Ionicons 
                  name={expandedImages.has(index) ? "contract" : "expand"} 
                  size={16} 
                  color={tokens.colors.onSurfaceVariant} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Key Points */}
      {explanation.keyPoints.length > 0 && (
        <View style={styles.keyPointsSection}>
          <Text style={styles.sectionTitle}>Key Concepts</Text>
          <View style={styles.keyPointsList}>
            {visibleKeyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <View style={styles.keyPointBullet}>
                  <Ionicons name="checkmark" size={12} color={tokens.colors.primary} />
                </View>
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
          
          {explanation.keyPoints.length > 3 && (
            <TouchableOpacity 
              onPress={handleShowMoreKeyPoints}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {showAllKeyPoints 
                  ? 'Show Less' 
                  : `Show ${explanation.keyPoints.length - 3} More`
                }
              </Text>
              <Ionicons 
                name={showAllKeyPoints ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={tokens.colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Related Concepts */}
      {explanation.relatedConcepts.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Related Concepts</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.conceptsScroll}
          >
            {explanation.relatedConcepts.map((concept, index) => (
              <TouchableOpacity key={index} style={styles.conceptChip}>
                <LinearGradient
                  colors={[tokens.colors.primary + '15', tokens.colors.primary + '10']}
                  style={styles.conceptGradient}
                >
                  <Ionicons name="link" size={14} color={tokens.colors.primary} />
                  <Text style={styles.conceptText}>{concept}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const createPanelStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.warning + '30',
    ...tokens.shadows.lg,
    marginBottom: tokens.spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '30',
  },
  
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    ...tokens.shadows.sm,
  },
  
  headerTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    flex: 1,
  },
  
  mainExplanation: {
    backgroundColor: '#FEFEFE',
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.warning + '20',
    ...tokens.shadows.sm,
  },
  
  explanationText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 24,
    fontWeight: '500',
  },
  
  richContentSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  richContentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.lg,
    maxHeight: 250,
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.warning,
    ...tokens.shadows.sm,
  },
  
  richContentScroll: {
    flex: 1,
  },
  
  richContentText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 26,
    fontFamily: 'System',
    fontWeight: '400',
  },
  
  imagesSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  imageContainer: {
    marginBottom: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    ...tokens.shadows.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
  },
  
  explanationImage: {
    width: '100%',
    height: 220,
    backgroundColor: tokens.colors.surfaceVariant + '50',
  },
  
  expandedImage: {
    height: 350,
  },
  
  imageCaptionContainer: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant + '30',
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '20',
  },
  
  imageCaption: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  expandIndicator: {
    position: 'absolute',
    top: tokens.spacing.md,
    right: tokens.spacing.md,
    backgroundColor: tokens.colors.surface + 'F0',
    borderRadius: tokens.borderRadius.full,
    padding: tokens.spacing.sm,
    ...tokens.shadows.sm,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  keyPointsSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  keyPointsList: {
    gap: tokens.spacing.sm,
  },
  
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  keyPointBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: tokens.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
    marginTop: 2,
  },
  
  keyPointText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    flex: 1,
    lineHeight: 20,
  },
  
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  
  showMoreText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semiBold,
  },
  
  relatedSection: {
    marginBottom: 0,
  },
  
  conceptsScroll: {
    marginTop: tokens.spacing.sm,
  },
  
  conceptChip: {
    marginRight: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
  },
  
  conceptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  
  conceptText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semiBold,
  },
});