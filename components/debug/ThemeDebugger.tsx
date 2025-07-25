import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { ServiceTypes } from '@/utils/constants';

/**
 * Debug component to test theme switching and validate no bleeding
 * Use this component to verify theme isolation during development
 */
export function ThemeDebugger() {
  const { 
    activeService, 
    tokens, 
    themeStack, 
    previousService,
    isTransitioning,
    setActiveService,
    resetToGlobalTheme,
    pushServiceTheme,
    popServiceTheme,
  } = useServiceTheme();

  const services = [
    { key: ServiceTypes.EDUCATION, name: 'Education', color: '#6A1B9A' },
    { key: ServiceTypes.BOOKING, name: 'Booking', color: '#0D47A1' },
    { key: ServiceTypes.HEALTHCARE, name: 'Healthcare', color: '#2E7D32' },
    { key: ServiceTypes.ENTERTAINMENT, name: 'Entertainment', color: '#E91E63' },
  ];

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: tokens.colors.background,
      padding: 16 
    }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: tokens.colors.onBackground,
        marginBottom: 16 
      }}>
        Theme Debugger
      </Text>

      {/* Current State */}
      <View style={{ 
        backgroundColor: tokens.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: tokens.colors.border,
        borderWidth: 1,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.onSurface, marginBottom: 8 }}>
          Current State
        </Text>
        <Text style={{ color: tokens.colors.onSurface }}>
          Active Service: {activeService || 'Global Theme'}
        </Text>
        <Text style={{ color: tokens.colors.onSurface }}>
          Previous Service: {previousService || 'None'}
        </Text>
        <Text style={{ color: tokens.colors.onSurface }}>
          Is Transitioning: {isTransitioning ? 'Yes' : 'No'}
        </Text>
        <Text style={{ color: tokens.colors.onSurface }}>
          Theme Stack: [{themeStack.join(', ')}]
        </Text>
        <Text style={{ color: tokens.colors.onSurface }}>
          Primary Color: {tokens.colors.primary}
        </Text>
      </View>

      {/* Theme Testing Buttons */}
      <View style={{ 
        backgroundColor: tokens.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: tokens.colors.border,
        borderWidth: 1,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.onSurface, marginBottom: 12 }}>
          Theme Testing
        </Text>
        
        {services.map(service => (
          <TouchableOpacity
            key={service.key}
            onPress={() => setActiveService(service.key)}
            style={{
              backgroundColor: service.color,
              padding: 12,
              borderRadius: 6,
              marginBottom: 8,
              opacity: activeService === service.key ? 1 : 0.7,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
              Switch to {service.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={resetToGlobalTheme}
          style={{
            backgroundColor: tokens.colors.onSurfaceVariant,
            padding: 12,
            borderRadius: 6,
            marginTop: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
            Reset to Global Theme
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stack Management Testing */}
      <View style={{ 
        backgroundColor: tokens.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: tokens.colors.border,
        borderWidth: 1,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.onSurface, marginBottom: 12 }}>
          Stack Management
        </Text>
        
        <TouchableOpacity
          onPress={() => pushServiceTheme(ServiceTypes.EDUCATION)}
          style={{
            backgroundColor: '#6A1B9A',
            padding: 12,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
            Push Education Theme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => popServiceTheme()}
          style={{
            backgroundColor: tokens.colors.primary,
            padding: 12,
            borderRadius: 6,
            marginBottom: 8,
          }}
          disabled={themeStack.length === 0}
        >
          <Text style={{ 
            color: 'white', 
            fontWeight: '600', 
            textAlign: 'center',
            opacity: themeStack.length === 0 ? 0.5 : 1 
          }}>
            Pop Theme Stack ({themeStack.length} items)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Color Validation */}
      <View style={{ 
        backgroundColor: tokens.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: tokens.colors.border,
        borderWidth: 1,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.onSurface, marginBottom: 12 }}>
          Color Validation
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Object.entries(tokens.colors).slice(0, 8).map(([key, value]) => (
            <View key={key} style={{ 
              width: '48%', 
              marginBottom: 8, 
              marginRight: '2%',
              flexDirection: 'row',
              alignItems: 'center' 
            }}>
              <View style={{ 
                width: 20, 
                height: 20, 
                backgroundColor: value,
                borderRadius: 4,
                marginRight: 8,
                borderColor: tokens.colors.border,
                borderWidth: 1,
              }} />
              <Text style={{ 
                fontSize: 12, 
                color: tokens.colors.onSurface,
                flex: 1 
              }}>
                {key}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}