import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  error?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  style,
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: tokens.spacing.md,
    },
    label: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: error ? tokens.colors.error : (selectedOption ? tokens.colors.primary : tokens.colors.border),
      borderRadius: tokens.borderRadius.md,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      backgroundColor: disabled ? tokens.colors.surfaceVariant : (selectedOption ? tokens.colors.primaryLight + '10' : tokens.colors.surfaceVariant),
      minHeight: 48,
      ...tokens.shadows.sm,
    },
    selectButtonPressed: {
      backgroundColor: tokens.colors.primaryLight + '10',
      borderColor: tokens.colors.primary,
      borderWidth: 2,
      ...tokens.shadows.sm,
    },
    selectText: {
      fontSize: tokens.typography.body,
      fontWeight: selectedOption ? '600' : '400',
      color: selectedOption ? tokens.colors.onSurface : tokens.colors.onSurfaceVariant,
      flex: 1,
    },
    disabledText: {
      color: tokens.colors.onSurfaceVariant,
    },
    iconContainer: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: selectedOption ? tokens.colors.primary : tokens.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: tokens.spacing.xs,
    },
    errorText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.error,
      marginTop: tokens.spacing.xs,
      marginLeft: tokens.spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
    },
    modalContent: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      width: '100%',
      maxHeight: '70%',
      ...tokens.shadows.lg,
      elevation: 10,
    },
    modalTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.md,
      textAlign: 'center',
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      marginBottom: tokens.spacing.sm,
      minHeight: 56,
      borderWidth: 2,
    },
    selectedOption: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
      ...tokens.shadows.md,
      transform: [{ scale: 1.02 }],
    },
    unselectedOption: {
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.border,
    },
    optionIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedOptionIcon: {
      backgroundColor: 'white',
      borderColor: 'white',
    },
    optionText: {
      fontSize: 16,
      color: tokens.colors.onSurface,
      flex: 1,
      fontWeight: '500',
    },
    selectedOptionText: {
      color: 'white',
      fontWeight: '700',
    },
    closeButton: {
      marginTop: tokens.spacing.md,
      alignSelf: 'center',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.borderRadius.md,
      minWidth: 100,
      ...tokens.shadows.sm,
    },
    closeButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.semibold,
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          modalVisible && styles.selectButtonPressed,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, disabled && styles.disabledText]}>
          {displayText}
        </Text>
        <View style={styles.iconContainer}>
          <Ionicons
            name={modalVisible ? "chevron-up" : "chevron-down"}
            size={16}
            color={selectedOption ? tokens.colors.onPrimary : tokens.colors.onSurfaceVariant}
          />
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {label || "Select Option"}
            </Text>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value ? styles.selectedOption : styles.unselectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.optionIcon,
                    item.value === value && styles.selectedOptionIcon,
                  ]}>
                    {item.value === value && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={tokens.colors.onPrimary}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};