import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '@/contexts/ServiceThemeContext';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const styles = useThemedStyles(createTabBarStyles);
  const insets = useSafeAreaInsets();

  const handleTabPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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

const createTabBarStyles = (tokens, layout, variants) => ({
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