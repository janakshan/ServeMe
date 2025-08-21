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
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';

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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

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

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
    console.warn(`Failed to load image at index ${index}: ${explanation.images?.[index]?.url}`);
  };

  const visibleKeyPoints = showAllKeyPoints 
    ? explanation.keyPoints 
    : explanation.keyPoints.slice(0, 3);

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="bulb" size={24} color={tokens.colors.warning} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>System Explanation</Text>
        </View>
      </View>

      {/* Main Explanation */}
      <View style={styles.mainExplanation}>
        <Text style={styles.explanationText}>{explanation.text}</Text>
      </View>

      {/* Rich Content Section */}
      {explanation.richContent && (
        <View style={styles.richContentSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color={tokens.colors.primary} />
            <Text style={styles.sectionTitle}>Detailed Explanation</Text>
          </View>
          <View style={styles.richContentContainer}>
            <ScrollView 
              style={styles.richContentScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <RichTextRenderer 
                content={explanation.richContent}
                maxWidth={undefined}
              />
            </ScrollView>
          </View>
        </View>
      )}

      {/* Images Section */}
      {explanation.images && explanation.images.length > 0 && (
        <View style={styles.imagesSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="images" size={20} color={tokens.colors.primary} />
            <Text style={styles.sectionTitle}>Visual Explanations</Text>
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>{explanation.images.length}</Text>
            </View>
          </View>
          {explanation.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => handleImagePress(index)}
            >
              {imageErrors.has(index) ? (
                <View style={[styles.explanationImage, styles.imageErrorContainer]}>
                  <Ionicons name="image" size={48} color={tokens.colors.onSurfaceVariant} />
                  <Text style={styles.imageErrorText}>Image failed to load</Text>
                  <Text style={styles.imageUrlText} numberOfLines={2}>{image.url}</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: image.url }}
                  style={[
                    styles.explanationImage,
                    expandedImages.has(index) && styles.expandedImage
                  ]}
                  resizeMode={expandedImages.has(index) ? "contain" : "cover"}
                  onError={() => handleImageError(index)}
                  onLoad={() => console.log(`Image loaded successfully: ${image.url}`)}
                />
              )}
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
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={tokens.colors.primary} />
            <Text style={styles.sectionTitle}>Key Concepts</Text>
            <View style={styles.keyPointsBadge}>
              <Text style={styles.keyPointsBadgeText}>{explanation.keyPoints.length}</Text>
            </View>
          </View>
          <View style={styles.keyPointsList}>
            {visibleKeyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <View style={styles.keyPointBullet}>
                  <Ionicons name="checkmark" size={14} color={tokens.colors.success} />
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
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={20} color={tokens.colors.primary} />
            <Text style={styles.sectionTitle}>Related Concepts</Text>
          </View>
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
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: tokens.colors.primary + '20',
    ...tokens.shadows.lg,
    marginBottom: tokens.spacing.lg,
    overflow: 'hidden',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: tokens.colors.primary + '20',
    position: 'relative',
  },
  
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.lg,
    ...tokens.shadows.md,
    borderWidth: 2,
    borderColor: tokens.colors.warning + '30',
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  headerSubtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  
  
  mainExplanation: {
    backgroundColor: tokens.colors.primary + '08',
    padding: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.primary,
    ...tokens.shadows.sm,
  },
  
  explanationText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 26,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  richContentSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  
  richContentContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '20',
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
    marginBottom: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surface,
    position: 'relative',
    ...tokens.shadows.lg,
    borderWidth: 2,
    borderColor: tokens.colors.outline + '30',
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
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surfaceVariant + '50',
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outline + '30',
  },
  
  imageCaption: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  
  expandIndicator: {
    position: 'absolute',
    top: tokens.spacing.lg,
    right: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface + 'E0',
    borderRadius: tokens.borderRadius.full,
    padding: tokens.spacing.md,
    ...tokens.shadows.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline + '40',
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    flex: 1,
  },
  
  imageBadge: {
    backgroundColor: tokens.colors.primary + '20',
    borderRadius: tokens.borderRadius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  
  imageBadgeText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  
  keyPointsBadge: {
    backgroundColor: tokens.colors.success + '20',
    borderRadius: tokens.borderRadius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  
  keyPointsBadgeText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.success,
  },
  
  keyPointsSection: {
    marginBottom: tokens.spacing.xl,
  },
  
  keyPointsList: {
    gap: tokens.spacing.sm,
  },
  
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: tokens.colors.success + '08',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.success,
  },
  
  keyPointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    marginTop: 1,
    borderWidth: 2,
    borderColor: tokens.colors.success + '40',
  },
  
  keyPointText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
    backgroundColor: tokens.colors.primary + '10',
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: tokens.colors.primary + '30',
    gap: tokens.spacing.sm,
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
    marginRight: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    ...tokens.shadows.sm,
  },
  
  conceptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.primary + '30',
  },
  
  conceptText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semiBold,
  },
  
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant + '30',
    padding: tokens.spacing.xl,
  },
  
  imageErrorText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
  },
  
  imageUrlText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});