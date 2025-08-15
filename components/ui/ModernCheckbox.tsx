import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface ModernCheckboxProps {
  checked: boolean;
  size?: number;
}

export const ModernCheckbox: React.FC<ModernCheckboxProps> = ({
  checked,
  size = 24,
}) => {
  const { tokens } = useEducationTheme();

  const styles = StyleSheet.create({
    checkbox: {
      width: size,
      height: size,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: checked ? tokens.colors.primary : tokens.colors.border,
      backgroundColor: checked ? tokens.colors.primary : tokens.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...tokens.shadows.sm,
    },
  });

  return (
    <View style={styles.checkbox}>
      {checked && (
        <Ionicons
          name="checkmark"
          size={size * 0.7}
          color="white"
        />
      )}
    </View>
  );
};