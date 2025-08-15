import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
  Alert,
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

interface TeacherExplanationCardProps {
  explanation: NonNullable<DetailedQuestionAnalysis['teacherExplanation']>;
  style?: ViewStyle;
}

interface VideoPlayerProps {
  videoUrl: string;
  duration: number;
  style?: ViewStyle;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, duration, style }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createVideoStyles, themeContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // TODO: Implement actual video play/pause
    // For now, simulate video progress
    if (!isPlaying) {
      simulateVideoProgress();
    }
  };

  const simulateVideoProgress = () => {
    // Simulate video progress for demo
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // TODO: Implement fullscreen video player
    Alert.alert('Video Player', 'Fullscreen video player would open here');
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={[styles.videoContainer, style]}>
      {/* Video Thumbnail/Player */}
      <View style={styles.videoPlayer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.videoOverlay}
        >
          <TouchableOpacity 
            onPress={handlePlayPause}
            style={styles.playButton}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleFullScreen}
            style={styles.fullScreenButton}
          >
            <Ionicons name="expand" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        
        {/* Mock video thumbnail */}
        <View style={styles.videoThumbnail}>
          <Ionicons name="videocam" size={48} color={tokens.colors.onSurfaceVariant} />
        </View>
      </View>
      
      {/* Video Controls */}
      <View style={styles.videoControls}>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[styles.progressFill, { width: `${progress * 100}%` }]} 
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface ResourceCardProps {
  resource: {
    title: string;
    url: string;
    type: 'video' | 'document' | 'link';
    duration?: number;
  };
  onPress: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createResourceStyles, themeContext);

  const getResourceIcon = () => {
    switch (resource.type) {
      case 'video': return 'videocam';
      case 'document': return 'document-text';
      case 'link': return 'link';
      default: return 'document';
    }
  };

  const getResourceColor = () => {
    switch (resource.type) {
      case 'video': return tokens.colors.error;
      case 'document': return tokens.colors.info;
      case 'link': return tokens.colors.primary;
      default: return tokens.colors.onSurfaceVariant;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.resourceCard}>
      <View style={[styles.resourceIcon, { backgroundColor: getResourceColor() + '20' }]}>
        <Ionicons 
          name={getResourceIcon() as any} 
          size={20} 
          color={getResourceColor()} 
        />
      </View>
      
      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle} numberOfLines={2}>
          {resource.title}
        </Text>
        <View style={styles.resourceMeta}>
          <Text style={styles.resourceType}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Text>
          {resource.duration && (
            <>
              <Text style={styles.resourceSeparator}>•</Text>
              <Text style={styles.resourceDuration}>
                {Math.floor(resource.duration / 60)}m {resource.duration % 60}s
              </Text>
            </>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={tokens.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
};

export const TeacherExplanationCard: React.FC<TeacherExplanationCardProps> = ({
  explanation,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createCardStyles, themeContext);

  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllResources, setShowAllResources] = useState(false);

  const handleTeacherPress = () => {
    // Navigate to teacher profile
    Alert.alert('Teacher Profile', `View ${explanation.teacherProfile.name}'s profile`);
  };

  const handleResourcePress = (resource: any) => {
    // Handle resource opening
    Alert.alert('Open Resource', `Opening: ${resource.title}`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleImagePress = (image: any, index: number) => {
    // Open image in fullscreen viewer
    Alert.alert('Image Viewer', `View image ${index + 1}: ${image.caption}`);
  };

  const visibleImages = showAllImages 
    ? explanation.images || []
    : (explanation.images || []).slice(0, 2);

  const visibleResources = showAllResources
    ? explanation.additionalResources || []
    : (explanation.additionalResources || []).slice(0, 3);

  return (
    <View style={[styles.container, style]}>
      {/* Header with Teacher Info */}
      <TouchableOpacity onPress={handleTeacherPress} style={styles.header}>
        <View style={styles.teacherInfo}>
          <View style={styles.teacherAvatar}>
            {explanation.teacherProfile.avatar ? (
              <Image 
                source={{ uri: explanation.teacherProfile.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person" size={24} color={tokens.colors.primary} />
            )}
          </View>
          
          <View style={styles.teacherDetails}>
            <Text style={styles.teacherName}>
              {explanation.teacherProfile.name}
            </Text>
            <Text style={styles.teacherSpecialization}>
              {explanation.teacherProfile.specialization.join(', ')}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerIcon}>
          <Ionicons name="school" size={20} color={tokens.colors.success} />
        </View>
      </TouchableOpacity>

      {/* Video Content */}
      {explanation.videoUrl && explanation.videoDuration && (
        <View style={styles.videoSection}>
          <VideoPlayer
            videoUrl={explanation.videoUrl}
            duration={explanation.videoDuration}
            style={styles.video}
          />
        </View>
      )}

      {/* Text Explanation */}
      {explanation.text && (
        <View style={styles.textSection}>
          <View style={styles.textHeader}>
            <Ionicons name="chatbubble-ellipses" size={16} color={tokens.colors.success} />
            <Text style={styles.textLabel}>Teacher's Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{explanation.text}</Text>
        </View>
      )}

      {/* Images */}
      {explanation.images && explanation.images.length > 0 && (
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Visual Examples</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imagesScroll}
          >
            {visibleImages.map((image, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => handleImagePress(image, index)}
                style={styles.imageContainer}
              >
                <Image 
                  source={{ uri: image.url }} 
                  style={styles.explanationImage}
                  resizeMode="cover"
                />
                {image.caption && (
                  <View style={styles.imageCaption}>
                    <Text style={styles.captionText} numberOfLines={2}>
                      {image.caption}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {explanation.images.length > 2 && (
            <TouchableOpacity 
              onPress={() => setShowAllImages(!showAllImages)}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {showAllImages 
                  ? 'Show Less' 
                  : `Show ${explanation.images.length - 2} More Images`
                }
              </Text>
              <Ionicons 
                name={showAllImages ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={tokens.colors.success} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Additional Resources */}
      {explanation.additionalResources && explanation.additionalResources.length > 0 && (
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <View style={styles.resourcesList}>
            {visibleResources.map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                onPress={() => handleResourcePress(resource)}
              />
            ))}
          </View>
          
          {explanation.additionalResources.length > 3 && (
            <TouchableOpacity 
              onPress={() => setShowAllResources(!showAllResources)}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {showAllResources 
                  ? 'Show Less' 
                  : `Show ${explanation.additionalResources.length - 3} More Resources`
                }
              </Text>
              <Ionicons 
                name={showAllResources ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={tokens.colors.success} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const createCardStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.success + '30',
    ...tokens.shadows.sm,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
  },
  
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    overflow: 'hidden',
  },
  
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  
  teacherDetails: {
    flex: 1,
  },
  
  teacherName: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  teacherSpecialization: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  videoSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  video: {
    width: '100%',
  },
  
  textSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  textHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  
  textLabel: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.success,
  },
  
  explanationText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: 22,
    backgroundColor: tokens.colors.success + '10',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
  },
  
  imagesSection: {
    marginBottom: tokens.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  imagesScroll: {
    marginBottom: tokens.spacing.sm,
  },
  
  imageContainer: {
    marginRight: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
    width: 160,
  },
  
  explanationImage: {
    width: 160,
    height: 120,
  },
  
  imageCaption: {
    padding: tokens.spacing.sm,
    backgroundColor: tokens.colors.surfaceVariant,
  },
  
  captionText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  
  resourcesSection: {
    marginBottom: 0,
  },
  
  resourcesList: {
    gap: tokens.spacing.sm,
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
    color: tokens.colors.success,
    fontWeight: tokens.typography.semiBold,
  },
});

const createVideoStyles = (tokens: any) => StyleSheet.create({
  videoContainer: {
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surfaceVariant,
  },
  
  videoPlayer: {
    height: 200,
    position: 'relative',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  videoThumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant,
  },
  
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  fullScreenButton: {
    position: 'absolute',
    top: tokens.spacing.md,
    right: tokens.spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  videoControls: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
  },
  
  progressContainer: {
    gap: tokens.spacing.xs,
  },
  
  progressTrack: {
    height: 4,
    backgroundColor: tokens.colors.outline,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.success,
  },
  
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  timeText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
});

const createResourceStyles = (tokens: any) => StyleSheet.create({
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.surfaceVariant + '30',
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  
  resourceContent: {
    flex: 1,
  },
  
  resourceTitle: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  resourceType: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  resourceSeparator: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginHorizontal: tokens.spacing.xs,
  },
  
  resourceDuration: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
});