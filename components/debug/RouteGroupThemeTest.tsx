import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEducationTheme, useBookingTheme, useHealthcareTheme, useEntertainmentTheme } from '@/contexts/ScopedThemeProviders';
import { useRouteGroupNavigation } from '@/utils/navigationStackReset';

// Component to test theme isolation within Education route group
export function EducationThemeTest() {
  try {
    const { tokens, serviceType } = useEducationTheme();
    
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: tokens.colors.primary }]}>
          Education Theme Test
        </Text>
        <Text style={styles.subtitle}>
          Service Type: {serviceType}
        </Text>
        <Text style={styles.subtitle}>
          Primary Color: {tokens.colors.primary}
        </Text>
        <View style={[styles.colorSwatch, { backgroundColor: tokens.colors.primary }]} />
      </View>
    );
  } catch (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          ❌ Education Theme Error: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }
}

// Component to test theme isolation within Booking route group
export function BookingThemeTest() {
  try {
    const { tokens, serviceType } = useBookingTheme();
    
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: tokens.colors.primary }]}>
          Booking Theme Test
        </Text>
        <Text style={styles.subtitle}>
          Service Type: {serviceType}
        </Text>
        <Text style={styles.subtitle}>
          Primary Color: {tokens.colors.primary}
        </Text>
        <View style={[styles.colorSwatch, { backgroundColor: tokens.colors.primary }]} />
      </View>
    );
  } catch (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          ❌ Booking Theme Error: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }
}

// Component to test navigation route group detection
export function RouteGroupNavigationTest() {
  const { currentGroup, segments, isInService } = useRouteGroupNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route Group Navigation Test</Text>
      <Text style={styles.subtitle}>Current Group: {currentGroup || 'None'}</Text>
      <Text style={styles.subtitle}>Is In Service: {isInService() ? 'Yes' : 'No'}</Text>
      <Text style={styles.subtitle}>
        Segments: {segments?.join(' > ') || 'None'}
      </Text>
    </View>
  );
}

// Component to test cross-route-group theme access (should fail)
export function CrossGroupThemeTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cross-Group Theme Access Test</Text>
      
      {/* This should work only within Education route group */}
      <View style={styles.testSection}>
        <Text style={styles.subtitle}>Education Theme Access:</Text>
        <EducationThemeTest />
      </View>
      
      {/* This should work only within Booking route group */}
      <View style={styles.testSection}>
        <Text style={styles.subtitle}>Booking Theme Access:</Text>
        <BookingThemeTest />
      </View>
      
      {/* Navigation test should always work */}
      <View style={styles.testSection}>
        <RouteGroupNavigationTest />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  error: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  colorSwatch: {
    width: 50,
    height: 20,
    borderRadius: 4,
    marginTop: 8,
  },
  testSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});