import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { DetailedQuestionAnalysis } from '@/types/examAnalysis';
import { SystemExplanationPanel } from './SystemExplanationPanel';
import { TeacherExplanationCard } from './TeacherExplanationCard';

interface ExplanationTabsProps {
  question: DetailedQuestionAnalysis;
  style?: ViewStyle;
}

type TabType = 'system' | 'teacher';

interface TabHeaderProps {
  tabs: Array<{
    key: TabType;
    title: string;
    icon: string;
    available: boolean;
    badge?: string;
  }>;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({ tabs, activeTab, onTabChange }) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createTabHeaderStyles, themeContext);
  
  const tabIndicatorPosition = useSharedValue(0);
  const tabIndicatorWidth = useSharedValue(0);

  React.useEffect(() => {
    const availableTabs = tabs.filter(tab => tab.available);
    const availableActiveIndex = availableTabs.findIndex(tab => tab.key === activeTab);
    
    if (availableActiveIndex >= 0) {
      // Calculate proper position based on container width and available tabs
      const tabWidth = 100 / availableTabs.length; // Percentage width per tab
      const indicatorMargin = 2; // Small margin from edges
      tabIndicatorPosition.value = withTiming(availableActiveIndex * tabWidth + indicatorMargin, { duration: 300 });
      tabIndicatorWidth.value = withTiming(tabWidth - (indicatorMargin * 2), { duration: 300 });
    }
  }, [activeTab, tabs]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      left: `${tabIndicatorPosition.value}%`,
      width: `${tabIndicatorWidth.value}%`,
    };
  });

  const handleTabPress = (tab: TabType) => {
    if (tabs.find(t => t.key === tab)?.available) {
      onTabChange(tab);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
              !tab.available && styles.disabledTab,
            ]}
            onPress={() => handleTabPress(tab.key)}
            disabled={!tab.available}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={
                  !tab.available
                    ? tokens.colors.onSurfaceVariant + '60'
                    : activeTab === tab.key
                    ? tokens.colors.primary
                    : tokens.colors.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                  !tab.available && styles.disabledTabText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab.title}
              </Text>
              {tab.badge && tab.available && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      
      <LinearGradient
        colors={[tokens.colors.primary + '20', tokens.colors.primary + '10']}
        style={styles.gradientLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  );
};

export const ExplanationTabs: React.FC<ExplanationTabsProps> = ({
  question,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createExplanationTabsStyles, themeContext);

  const [activeTab, setActiveTab] = useState<TabType>('system');

  const tabs = [
    {
      key: 'system' as TabType,
      title: 'System Analysis',
      icon: 'bulb',
      available: true,
      badge: undefined, // No badge for System Analysis as requested
    },
    {
      key: 'teacher' as TabType,
      title: 'Teacher Explanation',
      icon: 'person',
      available: !!question.teacherExplanation,
      badge: question.teacherExplanation?.additionalResources?.length?.toString(),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'system':
        return (
          <SystemExplanationPanel
            explanation={question.systemExplanation}
            style={styles.contentPanel}
          />
        );
      case 'teacher':
        return question.teacherExplanation ? (
          <TeacherExplanationCard
            explanation={question.teacherExplanation}
            style={styles.contentPanel}
          />
        ) : (
          <View style={styles.noContentContainer}>
            <Ionicons name="person-outline" size={48} color={tokens.colors.onSurfaceVariant} />
            <Text style={styles.noContentTitle}>No Teacher Explanation</Text>
            <Text style={styles.noContentText}>
              This question doesn't have a teacher explanation available yet.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TabHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const createTabHeaderStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '20',
    position: 'relative',
  },
  
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.md,
    width: '100%',
  },
  
  tab: {
    flex: 1,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  
  activeTab: {
    backgroundColor: tokens.colors.primary + '08',
  },
  
  disabledTab: {
    opacity: 0.5,
  },
  
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    minHeight: 24,
    width: '100%',
    paddingHorizontal: tokens.spacing.xs,
  },
  
  tabText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.medium,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'nowrap',
  },
  
  activeTabText: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semiBold,
  },
  
  disabledTabText: {
    color: tokens.colors.onSurfaceVariant + '60',
  },
  
  badge: {
    backgroundColor: tokens.colors.primary + '20',
    borderRadius: tokens.borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  
  badgeText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: tokens.colors.primary,
    borderRadius: 2,
    marginHorizontal: tokens.spacing.md,
  },
  
  gradientLine: {
    height: 1,
    width: '100%',
  },
});

const createExplanationTabsStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    ...tokens.shadows.lg,
    marginBottom: tokens.spacing.lg,
  },
  
  contentContainer: {
    flex: 1,
  },
  
  contentPanel: {
    margin: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'transparent',
  },
  
  noContentContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant + '30',
    margin: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 2,
    borderColor: tokens.colors.outline + '20',
    borderStyle: 'dashed',
  },
  
  noContentTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  
  noContentText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});