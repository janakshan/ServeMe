import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { useSmartBackNavigation } from '@/hooks/useSmartBackNavigation';

export default function BookingTabLayout() {
  const { tokens } = useServiceTheme();
  const { goToMainApp } = useSmartBackNavigation();

  const handleBackNavigation = () => {
    console.log('🔙 Going back to main app with smart navigation');
    goToMainApp(); // Uses smart navigation with proper theme cleanup
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
        },
        headerStyle: {
          backgroundColor: tokens.colors.primary,
        },
        headerTintColor: tokens.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={handleBackNavigation}
            style={{ marginLeft: 15, padding: 5 }}
          >
            <Ionicons name="arrow-back" size={24} color={tokens.colors.onPrimary} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Book Now',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites" // FIXED: removed the typo (was "avorites")
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
