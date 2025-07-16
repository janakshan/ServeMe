import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import * as Haptics from 'expo-haptics';

interface TabItem {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
}

interface EducationTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TAB_ITEMS: TabItem[] = [
  {
    name: 'index',
    title: 'Courses',
    icon: 'book-outline',
    activeIcon: 'book',
  },
  {
    name: 'teachers',
    title: 'Teachers',
    icon: 'person-outline',
    activeIcon: 'person',
  },
  {
    name: 'live-classes',
    title: 'Live',
    icon: 'videocam-outline',
    activeIcon: 'videocam',
  },
  {
    name: 'exams',
    title: 'Exams',
    icon: 'clipboard-outline',
    activeIcon: 'clipboard',
  },
  {
    name: 'leaderboard',
    title: 'Ranks',
    icon: 'trophy-outline',
    activeIcon: 'trophy',
  },
];

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;

export function EducationTabBar({ state, descriptors, navigation }: EducationTabBarProps) {
  const { tokens } = useServiceTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.index]);

  const handleTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
    }
  };

  const indicatorTranslateX = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2, TAB_WIDTH * 3, TAB_WIDTH * 4],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { borderTopColor: tokens.colors.border }]}>
      <LinearGradient
        colors={[tokens.colors.surface + 'F8', tokens.colors.surface + 'FF']}
        style={styles.gradient}
      >
          {/* Tab Items */}
          <View style={styles.tabsContainer}>
            {TAB_ITEMS.map((item, index) => {
              const route = state.routes[index];
              const isActive = state.index === index;
              const tabItem = TAB_ITEMS.find(tab => tab.name === route.name) || item;

              return (
                <TouchableOpacity
                  key={route.key}
                  style={[styles.tab, { width: TAB_WIDTH }]}
                  onPress={() => handleTabPress(route, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <Ionicons
                      name={isActive ? (tabItem.activeIcon || tabItem.icon) : tabItem.icon}
                      size={24}
                      color={isActive ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isActive ? tokens.colors.primary : tokens.colors.onSurfaceVariant,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {tabItem.title}
                    </Text>
                    {isActive && (
                      <View style={[styles.activeIndicatorDot, { backgroundColor: tokens.colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
  },
  gradient: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 34, // Account for home indicator
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});