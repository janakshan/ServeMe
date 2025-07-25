import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { ServiceTypes } from '@/utils/constants';

/**
 * Simple test component to verify education theme is applied
 */
export function EducationThemeTest() {
  const { activeService, tokens } = useServiceTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <Text style={[styles.title, { color: tokens.colors.onBackground }]}>
        🎓 Education Theme Test
      </Text>
      
      <View style={[styles.card, { backgroundColor: tokens.colors.surface }]}>
        <Text style={[styles.text, { color: tokens.colors.onSurface }]}>
          Active Service: {activeService || 'None'}
        </Text>
        <Text style={[styles.text, { color: tokens.colors.onSurface }]}>
          Expected: {ServiceTypes.EDUCATION}
        </Text>
        
        <View style={[styles.colorPreview, { backgroundColor: tokens.colors.primary }]}>
          <Text style={[styles.colorText, { color: tokens.colors.onPrimary }]}>
            Primary Color: {tokens.colors.primary}
          </Text>
        </View>
        
        <Text style={[styles.text, { color: tokens.colors.onSurface }]}>
          Expected Purple: #6A1B9A
        </Text>
        
        {tokens.colors.primary === '#6A1B9A' ? (
          <Text style={[styles.success, { color: '#4CAF50' }]}>
            ✅ Education theme applied correctly!
          </Text>
        ) : (
          <Text style={[styles.error, { color: '#F44336' }]}>
            ❌ Education theme NOT applied. Current: {tokens.colors.primary}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  colorPreview: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  success: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
  error: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
});