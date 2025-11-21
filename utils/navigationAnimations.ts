import { AccessibilityInfo } from 'react-native';

// Expo Router types for navigation options
type StackNavigationOptions = {
  headerShown?: boolean;
  presentation?: 'card' | 'modal' | 'transparentModal';
  animationTypeForReplace?: 'push' | 'pop';
  animation?: 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'fade' | 'flip' | 'simple_push' | 'none';
  gestureEnabled?: boolean;
  gestureDirection?: 'horizontal' | 'vertical';
  animationDuration?: number;
  [key: string]: any;
};

/**
 * Accessibility-aware animation controller
 * Automatically adjusts animations based on user preferences
 */
let isReduceMotionEnabled = false;

// Check for reduced motion preference
AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
  isReduceMotionEnabled = enabled;
});

// Listen for changes to reduce motion setting
AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
  isReduceMotionEnabled = enabled;
});

/**
 * Apply accessibility-aware animation options
 */
const applyAccessibilityOptions = (options: Partial<StackNavigationOptions>): Partial<StackNavigationOptions> => {
  if (isReduceMotionEnabled) {
    return {
      ...options,
      animation: 'none', // Disable animations for accessibility
      animationDuration: 0,
    };
  }
  return options;
};

/**
 * Fast and smooth navigation animations for professional app experience
 * Using Expo Router's built-in animation options for optimal performance
 */

/**
 * Enhanced Animation Presets with UX-optimized transitions
 * Designed for premium user experience with spatial awareness
 */

// Primary slide transition with spring physics feel (replaces fade)
export const smoothSlideAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animationDuration: 250, // Fast but smooth
});

// Fast slide for frequent navigation (lighter content)
export const quickSlideAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animationDuration: 200, // Very fast for simple screens
});

// Content-heavy slide for detailed screens
export const contentSlideAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animationDuration: 300, // Slightly slower for content-rich screens
});

// Service entrance: vertical slide for "diving deeper" UX
export const serviceEntranceAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_bottom',
  gestureEnabled: true,
  gestureDirection: 'vertical',
  animationDuration: 280, // Premium feel for service entry
});

// Profile/Settings slide from right (traditional navigation)
export const settingsSlideAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animationDuration: 240,
});

// Fade for profile presentations (context-preserving)
export const profileFadeAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'fade',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animationDuration: 220, // Quick fade for profiles
});

// Instant transition (no animation at all) - for tabs
export const instantAnimation: Partial<StackNavigationOptions> = {
  animation: 'none',
  gestureEnabled: true,
};

// Modal transition with optimized timing
export const modalAnimation: Partial<StackNavigationOptions> = applyAccessibilityOptions({
  animation: 'slide_from_bottom',
  gestureEnabled: true,
  gestureDirection: 'vertical',
  animationDuration: 300, // Smooth modal presentation
});

/**
 * Combined screen options with enhanced UX animations
 */

// Standard screen options with smooth slide (primary choice)
export const fastScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...smoothSlideAnimation,
};

// Screen options for auth flows (quick slide for fast progression)
export const authScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...quickSlideAnimation,
};

// Screen options for content-heavy screens (courses, teachers, etc.)
export const contentScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...contentSlideAnimation,
};

// Screen options for service entrance (vertical slide)
export const serviceScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...serviceEntranceAnimation,
};

// Screen options for profile/settings (traditional right slide)
export const settingsScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...settingsSlideAnimation,
};

// Screen options for profile presentations (fade)
export const profileScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...profileFadeAnimation,
};

// Screen options for instant navigation (tabs)
export const instantScreenOptions: Partial<StackNavigationOptions> = {
  headerShown: false,
  ...instantAnimation,
};

// Screen options for modals
export const modalScreenOptions: Partial<StackNavigationOptions> = {
  presentation: 'modal',
  headerShown: false,
  ...modalAnimation,
};

/**
 * Enhanced helper function for contextual screen options
 */
export const createScreenOptions = (
  type: 'smooth' | 'quick' | 'content' | 'service' | 'settings' | 'profile' | 'instant' | 'modal' = 'smooth',
  headerShown: boolean = false
): Partial<StackNavigationOptions> => {
  const baseOptions = { headerShown };
  
  switch (type) {
    case 'quick':
      return { ...baseOptions, ...quickSlideAnimation };
    case 'content':
      return { ...baseOptions, ...contentSlideAnimation };
    case 'service':
      return { ...baseOptions, ...serviceEntranceAnimation };
    case 'settings':
      return { ...baseOptions, ...settingsSlideAnimation };
    case 'profile':
      return { ...baseOptions, ...profileFadeAnimation };
    case 'instant':
      return { ...baseOptions, ...instantAnimation };
    case 'modal':
      return { ...modalScreenOptions, headerShown };
    case 'smooth':
    default:
      return { ...baseOptions, ...smoothSlideAnimation };
  }
};

/**
 * Navigation timing constants for reference
 */
export const NAVIGATION_TIMING = {
  QUICK_SLIDE: 200,      // Fast interactions
  SMOOTH_SLIDE: 250,     // Primary navigation
  CONTENT_SLIDE: 300,    // Content-heavy screens
  SERVICE_ENTRANCE: 280, // Service entry
  SETTINGS_SLIDE: 240,   // Settings navigation
  PROFILE_FADE: 220,     // Profile presentations
  MODAL: 300,            // Modal presentations
  INSTANT: 0,            // No animation
} as const;

/**
 * Dynamic accessibility-aware animation getter
 * Use this for real-time accessibility support
 */
export const getAccessibleAnimation = (baseAnimation: Partial<StackNavigationOptions>): Partial<StackNavigationOptions> => {
  return applyAccessibilityOptions(baseAnimation);
};

/**
 * Performance optimized animations (60fps targeted)
 */
export const PERFORMANCE_OPTIMIZED = {
  // Use hardware acceleration hints
  useNativeDriver: true,
  // Optimize for 60fps
  enableTracing: false,
  // Reduce animation complexity for older devices
  reducedComplexity: false,
} as const;

/**
 * Content type to animation mapping for smart defaults
 */
export const CONTENT_ANIMATIONS = {
  // Light content - fast navigation
  AUTH: quickSlideAnimation,
  NAVIGATION: smoothSlideAnimation,
  
  // Medium content - balanced timing
  SETTINGS: settingsSlideAnimation,
  PROFILE: profileFadeAnimation,
  
  // Heavy content - slower for comprehension
  COURSES: contentSlideAnimation,
  TEACHERS: contentSlideAnimation,
  COURSE_DETAIL: contentSlideAnimation,
  
  // Special contexts
  SERVICE_ENTRY: serviceEntranceAnimation,
  TABS: instantAnimation,
  MODALS: modalAnimation,
} as const;

/**
 * Gesture configuration for enhanced UX
 */
export const GESTURE_CONFIG = {
  // Swipe back threshold
  gestureResponseDistance: 50,
  // Minimum velocity to trigger swipe
  gestureVelocityImpact: 0.3,
  // Enable edge swipe for iOS-like behavior
  gestureDirections: ['horizontal', 'vertical'] as const,
} as const;