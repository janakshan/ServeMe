import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const gridItemWidth = (width - 48) / 2; // Account for padding and margin

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  bgColor: string;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'courses',
    title: 'Browse Courses',
    subtitle: 'Explore all subjects',
    icon: 'library-outline',
    route: '/(services)/education/(tabs)/courses',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    id: 'live-classes',
    title: 'Live Classes',
    subtitle: 'Join sessions',
    icon: 'videocam-outline',
    route: '/(services)/education/(tabs)/live-classes',
    color: '#E91E63',
    bgColor: '#FCE4EC',
  },
  {
    id: 'exams',
    title: 'Practice Exams',
    subtitle: 'Test your skills',
    icon: 'document-text-outline',
    route: '/(services)/education/(tabs)/exams',
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    id: 'teachers',
    title: 'Find Teachers',
    subtitle: 'Connect with experts',
    icon: 'people-outline',
    route: '/(services)/education/(tabs)/teachers',
    color: '#4CAF50',
    bgColor: '#E8F5E8',
  },
  {
    id: 'progress',
    title: 'My Progress',
    subtitle: 'Track learning',
    icon: 'stats-chart-outline',
    route: '/(services)/education/(tabs)/leaderboard',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    id: 'schedule',
    title: 'Study Schedule',
    subtitle: 'Plan your time',
    icon: 'calendar-outline',
    route: '/(services)/education/(tabs)/live-classes',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
];

export function QuickAccessGrid() {
  const theme = useEducationTheme();
  const { tokens } = theme;
  const styles = useScopedThemedStyles(createStyles, theme);

  const handleItemPress = (item: QuickAccessItem) => {
    router.push(item.route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
      </View>
      
      <View style={styles.grid}>
        {QUICK_ACCESS_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.gridItem, { width: gridItemWidth }]}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[item.bgColor, item.bgColor + 'E0']}
              style={styles.itemGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons
                  name={item.icon}
                  size={28}
                  color={item.color}
                />
              </View>
              
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              
              <Text style={styles.itemSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
              
              <View style={styles.actionIndicator}>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={item.color}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (tokens: any, layout: any, variants: any) => StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: tokens.spacing.md,
  },
  itemGradient: {
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    height: 140,
    justifyContent: 'space-between',
    ...tokens.shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.sm,
    lineHeight: 20,
  },
  itemSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.xs,
  },
  actionIndicator: {
    position: 'absolute',
    bottom: tokens.spacing.lg,
    right: tokens.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});