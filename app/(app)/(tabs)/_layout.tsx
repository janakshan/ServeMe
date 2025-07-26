import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMainAppThemedStyles } from '@/contexts/MainAppThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import type { DesignTokens } from '@/utils/tokens';
import type { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';
import { instantScreenOptions } from '@/utils/navigationAnimations';

export default function TabLayout() {
  const styles = useMainAppThemedStyles(createTabBarStyles);
  const insets = useSafeAreaInsets();

  const handleTabPress = () => {
    // Tab press handler - haptic feedback removed
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: styles.activeColor.color,
        tabBarInactiveTintColor: styles.inactiveColor.color,
        tabBarStyle: {
          ...styles.tabBarStyle,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 0,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: styles.headerBackground.backgroundColor,
        },
        headerTintColor: styles.headerTint.color,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarButton: (props) => {
          return (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                handleTabPress();
                props.onPress?.(e);
              }}
              style={[
                props.style,
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          animation: 'none', // Instant tab switching
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              color={color} 
              size={28} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="promotions"
        options={{
          title: 'Promotions',
          animation: 'none', // Instant tab switching
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "pricetag" : "pricetag-outline"} 
              color={color} 
              size={28} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          animation: 'none', // Instant tab switching
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              color={color} 
              size={28} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const createTabBarStyles = (
  tokens: DesignTokens, 
  layout: ServiceThemeOverride['layout'], 
  variants: ServiceThemeOverride['componentVariants']
) => ({
  activeColor: {
    color: tokens.colors.primary,
  },
  inactiveColor: {
    color: tokens.colors.onSurfaceVariant,
  },
  headerBackground: {
    backgroundColor: tokens.colors.primary,
  },
  headerTint: {
    color: tokens.colors.onPrimary,
  },
  tabBarStyle: {
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 0,
    height: 80,
    paddingTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    ...tokens.shadows.sm,
  },
});