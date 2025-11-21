import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  runOnJS,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Achievement types and categories
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'performance' | 'streak' | 'speed' | 'completion' | 'mastery' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: Date;
  progress?: {
    current: number;
    total: number;
  };
}

interface AchievementUnlockProps {
  achievements: Achievement[];
  onComplete: () => void;
  onViewAll?: () => void;
  sound?: boolean;
}

// Particle effect for epic achievements
const ParticleEffect = ({ 
  particleCount = 50, 
  colors = ['#6A1B9A', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
  onComplete 
}: {
  particleCount?: number;
  colors?: string[];
  onComplete: () => void;
}) => {
  const particles = useRef(Array.from({ length: particleCount }, (_, i) => ({
    translateX: useSharedValue(screenWidth / 2),
    translateY: useSharedValue(screenHeight / 2),
    rotation: useSharedValue(0),
    opacity: useSharedValue(1),
    scale: useSharedValue(1),
    color: colors[i % colors.length],
  }))).current;

  useEffect(() => {
    particles.forEach((particle, i) => {
      const delay = Math.random() * 300;
      const angle = (i / particleCount) * 360 + (Math.random() - 0.5) * 90;
      const distance = 100 + Math.random() * 150;
      
      const targetX = screenWidth / 2 + Math.cos(angle * Math.PI / 180) * distance;
      const targetY = screenHeight / 2 + Math.sin(angle * Math.PI / 180) * distance;
      
      setTimeout(() => {
        particle.translateX.value = withTiming(targetX, { 
          duration: 800 + Math.random() * 400,
          easing: Easing.out(Easing.quad)
        });
        particle.translateY.value = withTiming(targetY, { 
          duration: 800 + Math.random() * 400,
          easing: Easing.out(Easing.quad)
        });
        particle.rotation.value = withTiming(360 * 3, { duration: 1200 });
        particle.opacity.value = withTiming(0, { 
          duration: 1200,
          easing: Easing.out(Easing.quad)
        });
        particle.scale.value = withSequence(
          withTiming(1.5, { duration: 200 }),
          withTiming(0.5, { duration: 1000 })
        );
      }, delay);
    });
    
    setTimeout(() => {
      runOnJS(onComplete)();
    }, 2000);
  }, []);

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.translateX.value },
                { translateY: particle.translateY.value },
                { rotate: `${particle.rotation.value}deg` },
                { scale: particle.scale.value },
              ],
              opacity: particle.opacity.value,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Individual Achievement Card Component
const AchievementCard = ({ 
  achievement, 
  index, 
  isLast,
  onNext 
}: { 
  achievement: Achievement; 
  index: number;
  isLast: boolean;
  onNext: () => void;
}) => {
  const { tokens } = useEducationTheme();
  
  const containerScale = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  
  const [showParticles, setShowParticles] = useState(false);

  const getRarityConfig = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: ['#FFD700', '#FFA500', '#FF6B35'],
          glowColor: '#FFD700',
          borderColor: '#FFD700',
          textColor: '#B45309',
          bgColor: '#FEF3C7',
          shouldShowParticles: true,
        };
      case 'epic':
        return {
          gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
          glowColor: '#8B5CF6',
          borderColor: '#8B5CF6',
          textColor: '#5B21B6',
          bgColor: '#F3F4F6',
          shouldShowParticles: true,
        };
      case 'rare':
        return {
          gradient: ['#3B82F6', '#2563EB', '#1D4ED8'],
          glowColor: '#3B82F6',
          borderColor: '#3B82F6',
          textColor: '#1E40AF',
          bgColor: '#EBF8FF',
          shouldShowParticles: false,
        };
      case 'uncommon':
        return {
          gradient: ['#10B981', '#059669', '#047857'],
          glowColor: '#10B981',
          borderColor: '#10B981',
          textColor: '#065F46',
          bgColor: '#ECFDF5',
          shouldShowParticles: false,
        };
      default:
        return {
          gradient: ['#6B7280', '#4B5563', '#374151'],
          glowColor: '#6B7280',
          borderColor: '#6B7280',
          textColor: '#374151',
          bgColor: '#F9FAFB',
          shouldShowParticles: false,
        };
    }
  };

  const rarityConfig = getRarityConfig(achievement.rarity);

  useEffect(() => {
    const runAnimation = async () => {
      // Haptic feedback based on rarity
      if (achievement.rarity === 'legendary' || achievement.rarity === 'epic') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (achievement.rarity === 'rare') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Show particles for epic+ achievements
      if (rarityConfig.shouldShowParticles) {
        setShowParticles(true);
      }

      // Container entrance
      containerOpacity.value = withTiming(1, { duration: 400 });
      containerScale.value = withSpring(1, { 
        tension: 100, 
        friction: 8 
      });

      // Glow effect for rare+ achievements
      if (achievement.rarity !== 'common') {
        glowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.6, { duration: 800 }),
            withTiming(0.2, { duration: 800 })
          ),
          -1,
          true
        );
      }

      // Icon animation
      setTimeout(() => {
        iconScale.value = withSequence(
          withSpring(1.3, { tension: 150, friction: 6 }),
          withSpring(1, { tension: 100, friction: 8 })
        );
        
        if (achievement.rarity === 'legendary') {
          iconRotation.value = withRepeat(
            withTiming(360, { duration: 2000 }),
            -1,
            false
          );
        }
      }, 200);

      // Text reveal
      setTimeout(() => {
        textOpacity.value = withTiming(1, { duration: 600 });
      }, 400);

      // Badge reveal
      setTimeout(() => {
        badgeScale.value = withSpring(1, { 
          tension: 120, 
          friction: 8 
        });
      }, 600);
    };

    runAnimation();
  }, [achievement]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    shadowOpacity: glowOpacity.value * 0.5,
  }));

  return (
    <View style={styles.achievementContainer}>
      {showParticles && (
        <ParticleEffect
          particleCount={achievement.rarity === 'legendary' ? 60 : 40}
          colors={rarityConfig.gradient}
          onComplete={() => setShowParticles(false)}
        />
      )}

      <Animated.View style={[styles.achievementCard, containerAnimatedStyle]}>
        <LinearGradient
          colors={[`${rarityConfig.glowColor}10`, `${rarityConfig.glowColor}05`]}
          style={styles.cardGradient}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowOverlay,
              glowAnimatedStyle,
              {
                shadowColor: rarityConfig.glowColor,
                backgroundColor: `${rarityConfig.glowColor}20`,
              },
            ]}
          />

          {/* Achievement Icon */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.iconBackground,
                iconAnimatedStyle,
                { 
                  borderColor: rarityConfig.borderColor,
                  backgroundColor: rarityConfig.bgColor,
                },
              ]}
            >
              <LinearGradient
                colors={rarityConfig.gradient}
                style={styles.iconGradient}
              >
                <Ionicons 
                  name={achievement.icon} 
                  size={40} 
                  color="white"
                />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Achievement Content */}
          <Animated.View style={[styles.achievementContent, textAnimatedStyle]}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            
            {/* XP Reward */}
            <Animated.View style={[styles.xpBadge, badgeAnimatedStyle]}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.xpGradient}
              >
                <Ionicons name="flash" size={16} color="white" />
                <Text style={styles.xpText}>+{achievement.xpReward} XP</Text>
              </LinearGradient>
            </Animated.View>

            {/* Progress (if applicable) */}
            {achievement.progress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      {
                        width: `${(achievement.progress.current / achievement.progress.total) * 100}%`,
                        backgroundColor: rarityConfig.borderColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress.current}/{achievement.progress.total}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Rarity Badge */}
          <Animated.View style={[styles.rarityBadge, badgeAnimatedStyle]}>
            <LinearGradient
              colors={rarityConfig.gradient}
              style={styles.rarityGradient}
            >
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={onNext}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[tokens.colors.primary, tokens.colors.primaryLight]}
          style={styles.continueGradient}
        >
          <Text style={styles.continueText}>
            {isLast ? 'Awesome!' : 'Continue'}
          </Text>
          {!isLast && <Ionicons name="arrow-forward" size={20} color="white" />}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Main Achievement Unlock Component
export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievements,
  onComplete,
  onViewAll,
  sound = true,
}) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(achievements.length > 0);
  
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [visible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    overlayOpacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(() => {
        setVisible(false);
        onComplete();
      })();
    });
  };

  if (!visible || achievements.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.overlayGradient}
        >
          {/* Achievement Counter */}
          {achievements.length > 1 && (
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {currentIndex + 1} of {achievements.length}
              </Text>
              <View style={styles.counterDots}>
                {achievements.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.counterDot,
                      index === currentIndex && styles.activeCounterDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Current Achievement */}
          <AchievementCard
            achievement={achievements[currentIndex]}
            index={currentIndex}
            isLast={currentIndex === achievements.length - 1}
            onNext={handleNext}
          />

          {/* Skip All Button */}
          {achievements.length > 1 && currentIndex < achievements.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleClose}>
              <Text style={styles.skipText}>Skip All</Text>
            </TouchableOpacity>
          )}

          {/* View All Achievements Link */}
          {onViewAll && currentIndex === achievements.length - 1 && (
            <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
              <Text style={styles.viewAllText}>View All Achievements</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  counterContainer: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  counterText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  counterDots: {
    flexDirection: 'row',
    gap: 6,
  },
  counterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeCounterDot: {
    backgroundColor: 'white',
  },
  achievementContainer: {
    alignItems: 'center',
    width: '100%',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  achievementCard: {
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    marginBottom: 30,
  },
  cardGradient: {
    padding: 24,
    backgroundColor: 'white',
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    shadowRadius: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  xpBadge: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  xpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  progressContainer: {
    width: '100%',
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  rarityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  rarityGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 20,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  skipButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});