import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// Import with error handling for optional dependencies
let captureRef: any = null;
let MediaLibrary: any = null;
let Sharing: any = null;

try {
  captureRef = require('react-native-view-shot').captureRef;
} catch (e) {
  console.warn('react-native-view-shot not available:', e);
}

try {
  MediaLibrary = require('expo-media-library');
} catch (e) {
  console.warn('expo-media-library not available:', e);
}

try {
  Sharing = require('expo-sharing');
} catch (e) {
  console.warn('expo-sharing not available:', e);
}
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { PerformanceLevel, CelebrationConfig } from '../../utils/celebrationSystem';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = Math.min(screenWidth - 40, 400);
const CARD_HEIGHT = Math.floor(CARD_WIDTH * 1.4); // 1:1.4 aspect ratio

// Result data interface
export interface ShareableResultData {
  examTitle: string;
  subject: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  performanceLevel: PerformanceLevel;
  streak: number;
  achievements?: string[];
  userName?: string;
  userAvatar?: string;
  celebrationConfig: CelebrationConfig;
}

export interface ShareableResultCardProps {
  data: ShareableResultData;
  template?: 'modern' | 'minimalist' | 'celebration' | 'achievement';
  onShare?: (imageUri: string) => void;
  onTemplateChange?: (template: 'modern' | 'minimalist' | 'celebration' | 'achievement') => void;
  visible: boolean;
  onClose: () => void;
}

// Card Templates
const ModernTemplate: React.FC<{ data: ShareableResultData; styles: any; tokens: any }> = ({ data, styles, tokens }) => (
  <LinearGradient
    colors={[data.celebrationConfig.colors.primary, data.celebrationConfig.colors.secondary]}
    style={styles.cardContainer}
  >
    {/* Header */}
    <View style={styles.cardHeader}>
      <View style={styles.brandingSection}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>ServeMe</Text>
          </LinearGradient>
        </View>
        <Text style={styles.tagline}>Education Excellence</Text>
      </View>
      <View style={styles.performanceBadge}>
        <Text style={styles.performanceEmoji}>{data.celebrationConfig.emoji}</Text>
      </View>
    </View>

    {/* Main Content */}
    <View style={styles.mainContent}>
      <Text style={styles.examTitle}>{data.examTitle}</Text>
      <Text style={styles.subject}>{data.subject}</Text>
      
      <View style={styles.scoreSection}>
        <Text style={styles.mainScore}>{data.percentage}%</Text>
        <Text style={styles.scoreLabel}>Score Achieved</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{data.correctAnswers}/{data.totalQuestions}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.floor(data.timeSpent / 60)}m</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{data.difficulty}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {data.streak > 0 && (
        <View style={styles.streakSection}>
          <Ionicons name="flame" size={16} color="#FFA500" />
          <Text style={styles.streakText}>{data.streak} day streak!</Text>
        </View>
      )}

      {data.achievements && data.achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>🏆 New Achievements</Text>
          <View style={styles.achievementsList}>
            {data.achievements.slice(0, 2).map((achievement, index) => (
              <Text key={index} style={styles.achievementItem}>• {achievement}</Text>
            ))}
            {data.achievements.length > 2 && (
              <Text style={styles.achievementItem}>+ {data.achievements.length - 2} more</Text>
            )}
          </View>
        </View>
      )}
    </View>

    {/* Footer */}
    <View style={styles.cardFooter}>
      <Text style={styles.inspirationalQuote}>
        {data.celebrationConfig.messages.primary[0]}
      </Text>
      <Text style={styles.watermark}>
        {data.userName ? `${data.userName} • ` : ''}ServeMe Education
      </Text>
    </View>

    {/* Decorative Elements */}
    <View style={styles.decorativeOrb1} />
    <View style={styles.decorativeOrb2} />
    <View style={styles.decorativeOrb3} />
  </LinearGradient>
);

const MinimalistTemplate: React.FC<{ data: ShareableResultData; styles: any; tokens: any }> = ({ data, styles, tokens }) => (
  <View style={styles.minimalistCard}>
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFE']}
      style={styles.cardContainer}
    >
      {/* Simple Header */}
      <View style={styles.minimalistHeader}>
        <Text style={styles.minimalistBrand}>ServeMe</Text>
        <View style={[styles.minimalistBadge, { backgroundColor: data.celebrationConfig.colors.primary }]}>
          <Text style={styles.minimalistBadgeText}>{data.celebrationConfig.level.toUpperCase()}</Text>
        </View>
      </View>

      {/* Clean Content */}
      <View style={styles.minimalistContent}>
        <Text style={styles.minimalistTitle}>{data.examTitle}</Text>
        <View style={styles.minimalistScoreContainer}>
          <Text style={[styles.minimalistScore, { color: data.celebrationConfig.colors.primary }]}>
            {data.percentage}%
          </Text>
        </View>
        
        <View style={styles.minimalistStats}>
          <Text style={styles.minimalistStat}>
            {data.correctAnswers} of {data.totalQuestions} correct
          </Text>
          <Text style={styles.minimalistStat}>
            Completed in {Math.floor(data.timeSpent / 60)} minutes
          </Text>
          <Text style={styles.minimalistStat}>
            {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)} difficulty
          </Text>
        </View>
      </View>

      {/* Simple Footer */}
      <View style={styles.minimalistFooter}>
        <Text style={styles.minimalistFooterText}>
          {data.celebrationConfig.subtitle}
        </Text>
      </View>
    </LinearGradient>
  </View>
);

const CelebrationTemplate: React.FC<{ data: ShareableResultData; styles: any; tokens: any }> = ({ data, styles, tokens }) => (
  <LinearGradient
    colors={['#1F2937', '#374151', '#4B5563']}
    style={styles.cardContainer}
  >
    {/* Celebration Header */}
    <View style={styles.celebrationHeader}>
      <Text style={styles.celebrationEmoji}>{data.celebrationConfig.emoji}</Text>
      <Text style={styles.celebrationTitle}>{data.celebrationConfig.title}</Text>
      <Text style={styles.celebrationSubtitle}>{data.celebrationConfig.subtitle}</Text>
    </View>

    {/* Glowing Score */}
    <View style={styles.glowingScoreContainer}>
      <LinearGradient
        colors={[data.celebrationConfig.colors.primary, data.celebrationConfig.colors.secondary]}
        style={styles.glowingScoreGradient}
      >
        <Text style={styles.glowingScore}>{data.percentage}%</Text>
      </LinearGradient>
    </View>

    {/* Exam Info */}
    <View style={styles.celebrationInfo}>
      <Text style={styles.celebrationExamTitle}>{data.examTitle}</Text>
      <Text style={styles.celebrationSubject}>{data.subject}</Text>
      
      <View style={styles.celebrationStats}>
        <View style={styles.celebrationStatItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.celebrationStatText}>{data.correctAnswers} Correct</Text>
        </View>
        <View style={styles.celebrationStatItem}>
          <Ionicons name="time" size={20} color="#3B82F6" />
          <Text style={styles.celebrationStatText}>{Math.floor(data.timeSpent / 60)}m</Text>
        </View>
        <View style={styles.celebrationStatItem}>
          <Ionicons name="trending-up" size={20} color="#F59E0B" />
          <Text style={styles.celebrationStatText}>{data.difficulty}</Text>
        </View>
      </View>
    </View>

    {/* Branding */}
    <View style={styles.celebrationBranding}>
      <Text style={styles.celebrationBrandText}>ServeMe Education</Text>
      <Text style={styles.celebrationMotivation}>
        {data.celebrationConfig.messages.encouraging[0]}
      </Text>
    </View>

    {/* Sparkle Effects */}
    <Text style={styles.sparkle1}>✨</Text>
    <Text style={styles.sparkle2}>⭐</Text>
    <Text style={styles.sparkle3}>💫</Text>
    <Text style={styles.sparkle4}>🎉</Text>
  </LinearGradient>
);

const AchievementTemplate: React.FC<{ data: ShareableResultData; styles: any; tokens: any }> = ({ data, styles, tokens }) => (
  <LinearGradient
    colors={['#6B73FF', '#9B59B6', '#8B63FF']}
    style={styles.cardContainer}
  >
    {/* Achievement Header */}
    <View style={styles.achievementHeader}>
      <Text style={styles.achievementHeaderTitle}>🏆 Achievement Unlocked!</Text>
    </View>

    {/* Main Achievement */}
    <View style={styles.mainAchievement}>
      <View style={styles.achievementIcon}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.achievementIconGradient}
        >
          <Ionicons name="trophy" size={40} color="white" />
        </LinearGradient>
      </View>
      <Text style={styles.achievementName}>
        {data.achievements && data.achievements.length > 0 ? data.achievements[0] : 'Excellence Achievement'}
      </Text>
      <Text style={styles.achievementDescription}>
        Scored {data.percentage}% on {data.examTitle}
      </Text>
    </View>

    {/* Performance Stats */}
    <View style={styles.achievementStats}>
      <View style={styles.achievementStatBox}>
        <Text style={styles.achievementStatValue}>{data.percentage}%</Text>
        <Text style={styles.achievementStatLabel}>Score</Text>
      </View>
      <View style={styles.achievementStatBox}>
        <Text style={styles.achievementStatValue}>{data.correctAnswers}/{data.totalQuestions}</Text>
        <Text style={styles.achievementStatLabel}>Correct</Text>
      </View>
      <View style={styles.achievementStatBox}>
        <Text style={styles.achievementStatValue}>{data.difficulty.slice(0, 3).toUpperCase()}</Text>
        <Text style={styles.achievementStatLabel}>Level</Text>
      </View>
    </View>

    {/* Additional Achievements */}
    {data.achievements && data.achievements.length > 1 && (
      <View style={styles.additionalAchievements}>
        <Text style={styles.additionalTitle}>Also Unlocked:</Text>
        {data.achievements.slice(1, 3).map((achievement, index) => (
          <Text key={index} style={styles.additionalItem}>🎯 {achievement}</Text>
        ))}
      </View>
    )}

    {/* Footer */}
    <View style={styles.achievementFooter}>
      <Text style={styles.achievementBrand}>ServeMe Education</Text>
      <Text style={styles.achievementTagline}>Unlocking Your Potential</Text>
    </View>
  </LinearGradient>
);

export const ShareableResultCard: React.FC<ShareableResultCardProps> = ({
  data,
  template = 'modern',
  onShare,
  onTemplateChange,
  visible,
  onClose,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const cardRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const renderTemplate = () => {
    const templateProps = { data, styles, tokens };
    
    switch (template) {
      case 'minimalist':
        return <MinimalistTemplate {...templateProps} />;
      case 'celebration':
        return <CelebrationTemplate {...templateProps} />;
      case 'achievement':
        return <AchievementTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  const captureAndShare = async () => {
    if (!cardRef.current || isCapturing) return;

    // Check if required dependencies are available
    if (!captureRef) {
      Alert.alert(
        'Feature Unavailable', 
        'Screenshot functionality is not available in this build.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsCapturing(true);

    try {
      // Capture the result card as an image
      const imageUri = await captureRef(cardRef.current, {
        format: 'png',
        quality: 1,
        width: CARD_WIDTH * 2, // 2x resolution for better quality
        height: CARD_HEIGHT * 2,
      });

      // Save to gallery if permission granted and MediaLibrary is available
      if (Platform.OS !== 'web' && MediaLibrary) {
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            await MediaLibrary.saveToLibraryAsync(imageUri);
          }
        } catch (error) {
          console.log('Could not save to gallery:', error);
        }
      }

      // Share or provide callback
      if (onShare) {
        onShare(imageUri);
      } else {
        await shareImage(imageUri);
      }
    } catch (error) {
      console.error('Error capturing result card:', error);
      Alert.alert(
        'Error', 
        'Failed to create shareable image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const shareImage = async (imageUri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Your Achievement!',
        });
      } else {
        // Fallback to native share
        await Share.share({
          url: imageUri,
          title: 'Check out my quiz result!',
          message: `I scored ${data.percentage}% on ${data.examTitle}! 🎉`,
        });
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Your Success</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View ref={cardRef} collapsable={false}>
            {renderTemplate()}
          </View>
        </View>

        {/* Template Options */}
        <View style={styles.templateOptions}>
          <Text style={styles.templateTitle}>Choose Style:</Text>
          <View style={styles.templateButtons}>
            {[
              { key: 'modern', icon: 'layers', label: 'Modern' },
              { key: 'minimalist', icon: 'remove', label: 'Clean' },
              { key: 'celebration', icon: 'happy', label: 'Celebration' },
              { key: 'achievement', icon: 'trophy', label: 'Achievement' },
            ].map((templateOption) => (
              <TouchableOpacity
                key={templateOption.key}
                style={[
                  styles.templateButton,
                  template === templateOption.key && styles.activeTemplateButton,
                ]}
                onPress={() => {
                  onTemplateChange?.(templateOption.key as any);
                }}
              >
                <Ionicons 
                  name={templateOption.icon as any} 
                  size={20} 
                  color={template === templateOption.key ? tokens.colors.primary : 'white'} 
                />
                <Text 
                  style={[
                    styles.templateButtonText,
                    { color: template === templateOption.key ? tokens.colors.primary : 'white' }
                  ]}
                >
                  {templateOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Share Actions */}
        <View style={styles.shareActions}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={captureAndShare}
            disabled={isCapturing}
          >
            <LinearGradient
              colors={[tokens.colors.primary, tokens.colors.primaryLight]}
              style={styles.shareGradient}
            >
              {isCapturing ? (
                <Text style={styles.shareText}>Creating Image...</Text>
              ) : (
                <>
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.shareText}>Share Achievement</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={captureAndShare}>
            <View style={styles.saveButtonContent}>
              <Ionicons name="download" size={20} color={tokens.colors.primary} />
              <Text style={[styles.saveButtonText, { color: tokens.colors.primary }]}>
                Save to Gallery
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  cardPreview: {
    alignItems: 'center',
    marginVertical: 20,
  },
  // Modern Template Styles
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandingSection: {
    flex: 1,
  },
  logoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  logoGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6A1B9A',
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  performanceBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceEmoji: {
    fontSize: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainScore: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  achievementsSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementsList: {
    gap: 2,
  },
  achievementItem: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  cardFooter: {
    alignItems: 'center',
  },
  inspirationalQuote: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  watermark: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  decorativeOrb1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorativeOrb2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorativeOrb3: {
    position: 'absolute',
    top: '40%',
    right: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  // Minimalist Template Styles
  minimalistCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  minimalistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  minimalistBrand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  minimalistBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  minimalistBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  minimalistContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimalistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  minimalistScoreContainer: {
    marginBottom: 20,
  },
  minimalistScore: {
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
  },
  minimalistStats: {
    alignItems: 'center',
    gap: 8,
  },
  minimalistStat: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  minimalistFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  minimalistFooterText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // Celebration Template Styles
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  glowingScoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  glowingScoreGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowingScore: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
  celebrationInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  celebrationExamTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  celebrationSubject: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  celebrationStats: {
    flexDirection: 'row',
    gap: 16,
  },
  celebrationStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  celebrationStatText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  celebrationBranding: {
    alignItems: 'center',
  },
  celebrationBrandText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  celebrationMotivation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Sparkle effects
  sparkle1: {
    position: 'absolute',
    top: 80,
    left: 30,
    fontSize: 20,
  },
  sparkle2: {
    position: 'absolute',
    top: 120,
    right: 40,
    fontSize: 16,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 120,
    left: 40,
    fontSize: 18,
  },
  sparkle4: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    fontSize: 22,
  },
  // Achievement Template Styles
  achievementHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  mainAchievement: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementIcon: {
    marginBottom: 12,
  },
  achievementIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  achievementName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  achievementStatBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  achievementStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  achievementStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  additionalAchievements: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  additionalTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  additionalItem: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementFooter: {
    alignItems: 'center',
  },
  achievementBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  achievementTagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  // Template Options
  templateOptions: {
    marginVertical: 20,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  templateButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  templateButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  activeTemplateButton: {
    backgroundColor: 'white',
  },
  templateButtonText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  // Share Actions
  shareActions: {
    gap: 12,
    paddingBottom: 40,
  },
  shareButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});