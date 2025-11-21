import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface EducationLoaderProps {
  message?: string;
  variant?: 'book' | 'graduation' | 'brain' | 'pencil' | 'default';
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
}

export function EducationLoader({
  message = "Loading your education journey...",
  variant = 'book',
  size = 'medium',
  showMessage = true
}: EducationLoaderProps) {
  const { tokens, getGradient } = useEducationTheme();
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Start rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Start breathing scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    scaleAnimation.start();

    return () => {
      rotateAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const getLoaderIcon = () => {
    switch (variant) {
      case 'book':
        return 'book';
      case 'graduation':
        return 'school';
      case 'brain':
        return 'bulb';
      case 'pencil':
        return 'pencil';
      default:
        return 'library';
    }
  };

  const getSizeValues = () => {
    switch (size) {
      case 'small':
        return { container: 60, icon: 24, text: 12 };
      case 'large':
        return { container: 120, icon: 48, text: 18 };
      default:
        return { container: 80, icon: 32, text: 14 };
    }
  };

  const sizeValues = getSizeValues();
  const gradientColors = getGradient('accent').colors;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <View style={styles.loaderContainer}>
        {/* Outer rotating ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              width: sizeValues.container + 20,
              height: sizeValues.container + 20,
              borderColor: tokens.colors.primary + '30',
              transform: [{ rotate }],
            },
          ]}
        />
        
        {/* Inner gradient circle */}
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.innerCircle,
            {
              width: sizeValues.container,
              height: sizeValues.container,
              borderRadius: sizeValues.container / 2,
            },
          ]}
        >
          <Ionicons
            name={getLoaderIcon()}
            size={sizeValues.icon}
            color={tokens.colors.onPrimary}
          />
        </LinearGradient>

        {/* Floating dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <FloatingDot
              key={index}
              delay={index * 200}
              color={tokens.colors.primary}
              size={4}
            />
          ))}
        </View>
      </View>

      {showMessage && (
        <Animated.Text
          style={[
            styles.message,
            {
              fontSize: sizeValues.text,
              color: tokens.colors.onSurface,
              opacity: fadeAnim,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

interface FloatingDotProps {
  delay: number;
  color: string;
  size: number;
}

function FloatingDot({ delay, color, size }: FloatingDotProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [delay]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loaderContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 1000,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dotsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 40,
    top: -20,
  },
  dot: {
    position: 'absolute',
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
});