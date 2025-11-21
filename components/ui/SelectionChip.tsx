import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface SelectionChipProps {
  label: string;
  onRemove: () => void;
  style?: ViewStyle;
}

export const SelectionChip: React.FC<SelectionChipProps> = ({
  label,
  onRemove,
  style,
}) => {
  const { tokens } = useEducationTheme();
  
  const styles = StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.primary + '15',
      borderColor: tokens.colors.primary,
      borderWidth: 1,
      borderRadius: 18,
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 6,
      minWidth: 60,
      minHeight: 34,
      alignSelf: 'flex-start',
    },
    chipText: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.colors.primary,
      marginRight: 10,
      flexShrink: 1,
      textAlign: 'left',
      includeFontPadding: false,
    },
    removeButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: tokens.colors.primary + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      flexShrink: 0,
    },
  });

  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.chipText}>
        {label}
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.8}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Ionicons 
          name="close" 
          size={12} 
          color={tokens.colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};