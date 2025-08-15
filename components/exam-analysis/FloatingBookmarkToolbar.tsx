import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

interface FloatingBookmarkToolbarProps {
  selectedCount: number;
  onBookmark: () => void;
  onCancel: () => void;
}

export const FloatingBookmarkToolbar: React.FC<FloatingBookmarkToolbarProps> = ({
  selectedCount,
  onBookmark,
  onCancel,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withSpring(0, { tension: 300, friction: 20 });
    scale.value = withSequence(
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  }, [selectedCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleBookmark = () => {
    onBookmark();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancel = () => {
    onCancel();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { bottom: insets.bottom + tokens.spacing.lg },
        animatedStyle
      ]}
    >
      <LinearGradient
        colors={[tokens.colors.surface, tokens.colors.surfaceElevated]}
        style={styles.toolbar}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <View style={styles.info}>
            <Text style={styles.countText}>
              {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
              <LinearGradient
                colors={[tokens.colors.primary, tokens.colors.primaryDark]}
                style={styles.bookmarkGradient}
              >
                <Ionicons name="bookmark" size={20} color={tokens.colors.onPrimary} />
                <Text style={styles.bookmarkText}>Bookmark</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share" size={20} color={tokens.colors.onSurfaceVariant} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="folder-open" size={20} color={tokens.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: tokens.spacing.md,
    right: tokens.spacing.md,
    zIndex: 1000,
  },
  
  toolbar: {
    borderRadius: tokens.borderRadius.lg,
    ...tokens.shadows.lg,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  
  countText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
  },
  
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  
  bookmarkButton: {
    borderRadius: tokens.borderRadius.md,
    overflow: 'hidden',
  },
  
  bookmarkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  
  bookmarkText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
  },
  
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
});