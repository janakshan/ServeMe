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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { DetailedQuestionAnalysis } from '@/types/examAnalysis';

interface SystemExplanationPanelProps {
  explanation: DetailedQuestionAnalysis['systemExplanation'];
  style?: ViewStyle;
}

interface StepCardProps {
  step: {
    step: number;
    description: string;
    formula?: string;
    image?: string;
  };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isExpanded, onToggle }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStepStyles, themeContext);

  const expandHeight = useSharedValue(0);
  const rotateValue = useSharedValue(0);

  React.useEffect(() => {
    expandHeight.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    rotateValue.value = withTiming(isExpanded ? 180 : 0, { duration: 300 });
  }, [isExpanded]);

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: expandHeight.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const handlePress = () => {
    onToggle();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{step.step}</Text>
        </View>
        
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Step {step.step}</Text>
          <Text style={styles.stepDescription} numberOfLines={isExpanded ? undefined : 2}>
            {step.description}
          </Text>
        </View>
        
        <Animated.View style={chevronStyle}>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={tokens.colors.onSurfaceVariant} 
          />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View style={[styles.stepDetails, expandedStyle]}>
          <View style={styles.stepDetailsInner}>
            {step.formula && (
              <View style={styles.formulaContainer}>
                <Text style={styles.formulaLabel}>Formula:</Text>
                <View style={styles.formulaBox}>
                  <Text style={styles.formulaText}>{step.formula}</Text>
                </View>
              </View>
            )}
            
            {step.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: step.image }}
                  style={styles.stepImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export const SystemExplanationPanel: React.FC<SystemExplanationPanelProps> = ({
  explanation,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createPanelStyles, themeContext);

  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [showAllKeyPoints, setShowAllKeyPoints] = useState(false);

  const handleStepToggle = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const handleShowMoreKeyPoints = () => {
    setShowAllKeyPoints(!showAllKeyPoints);
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

      {/* Step-by-Step Solution */}
      {explanation.steps && explanation.steps.length > 0 && (
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Step-by-Step Solution</Text>
          {explanation.steps.map((step, index) => (
            <StepCard
              key={step.step}
              step={step}
              index={index}
              isExpanded={expandedSteps.has(step.step)}
              onToggle={() => handleStepToggle(step.step)}
            />
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
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.warning + '30',
    ...tokens.shadows.sm,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
  },
  
  headerTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  mainExplanation: {
    backgroundColor: tokens.colors.surfaceVariant + '40',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.lg,
  },
  
  explanationText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 22,
  },
  
  stepsSection: {
    marginBottom: tokens.spacing.lg,
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

const createStepStyles = (tokens: any) => StyleSheet.create({
  stepContainer: {
    marginBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant + '30',
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
  },
  
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  
  stepNumberText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepTitle: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  
  stepDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  
  stepDetails: {
    paddingTop: tokens.spacing.sm,
  },
  
  stepDetailsInner: {
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  
  formulaContainer: {
    marginBottom: tokens.spacing.md,
  },
  
  formulaLabel: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.xs,
  },
  
  formulaBox: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.primary,
  },
  
  formulaText: {
    fontSize: tokens.typography.body,
    fontFamily: 'monospace',
    color: tokens.colors.onSurface,
    textAlign: 'center',
  },
  
  imageContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.sm,
    overflow: 'hidden',
  },
  
  stepImage: {
    width: '100%',
    height: 120,
  },
});