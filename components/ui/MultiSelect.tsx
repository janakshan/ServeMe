import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ViewStyle,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { SelectionChip } from './SelectionChip';
import { ModernCheckbox } from './ModernCheckbox';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  style?: ViewStyle;
  error?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options",
  style,
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedOptions = () => {
    return options.filter(option => selectedValues.includes(option.value));
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const selectedOption = options.find(option => option.value === selectedValues[0]);
      return selectedOption?.label || placeholder;
    }
    return `${selectedValues.length} items selected`;
  };

  const toggleSelection = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const removeSelection = (value: string) => {
    const newSelection = selectedValues.filter(v => v !== value);
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(filteredOptions.map(option => option.value));
  };

  const clearAll = () => {
    onSelectionChange([]);
    setSearchQuery('');
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
    selectionContainer: {
      borderWidth: 1,
      borderColor: error ? tokens.colors.error : (selectedValues.length > 0 ? tokens.colors.primary : tokens.colors.border),
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: disabled ? tokens.colors.surfaceVariant : (selectedValues.length > 0 ? tokens.colors.primaryLight + '10' : tokens.colors.surfaceVariant),
      padding: tokens.spacing.md,
      ...tokens.shadows.sm,
      minHeight: 50,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: selectedValues.length > 0 ? tokens.spacing.sm : 0,
      paddingBottom: selectedValues.length > 0 ? tokens.spacing.xs : 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
      minHeight: 40,
    },
    selectButtonPressed: {
      backgroundColor: tokens.colors.primaryLight + '10',
    },
    selectText: {
      fontSize: tokens.typography.body,
      color: selectedValues.length > 0 ? tokens.colors.onSurface : tokens.colors.onSurfaceVariant,
      flex: 1,
      fontWeight: selectedValues.length > 0 ? tokens.typography.medium : tokens.typography.regular,
    },
    placeholderText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontStyle: 'italic',
    },
    disabledText: {
      color: tokens.colors.onSurfaceVariant,
    },
    iconContainer: {
      padding: tokens.spacing.xs,
      backgroundColor: selectedValues.length > 0 ? tokens.colors.primaryLight + '15' : 'transparent',
      borderRadius: tokens.borderRadius.sm,
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
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.xl,
      width: '100%',
      maxHeight: '80%',
      ...tokens.shadows.lg,
      elevation: 12,
    },
    modalHeader: {
      marginBottom: tokens.spacing.md,
    },
    modalTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      textAlign: 'center',
      marginBottom: tokens.spacing.sm,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.lg,
      paddingHorizontal: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
    },
    searchIcon: {
      marginRight: tokens.spacing.xs,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButton: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 2,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      ...tokens.shadows.sm,
    },
    selectAllButton: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    clearAllButton: {
      backgroundColor: 'transparent',
      borderColor: tokens.colors.border,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    selectAllButtonText: {
      color: 'white',
    },
    clearAllButtonText: {
      color: tokens.colors.onSurfaceVariant,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      marginBottom: tokens.spacing.sm,
      marginHorizontal: 2,
      minHeight: 56,
      backgroundColor: tokens.colors.surface,
      borderWidth: 2,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    selectedOptionItem: {
      backgroundColor: tokens.colors.primaryLight + '15',
      borderColor: tokens.colors.primary,
      ...tokens.shadows.md,
    },
    optionText: {
      fontSize: 16,
      color: tokens.colors.onSurface,
      flex: 1,
      fontWeight: '500',
      marginLeft: tokens.spacing.lg,
    },
    selectedOptionText: {
      color: tokens.colors.primary,
      fontWeight: '600',
    },
    doneButton: {
      marginTop: tokens.spacing.lg,
      alignSelf: 'stretch',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.borderRadius.lg,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      ...tokens.shadows.md,
    },
    doneButtonText: {
      fontSize: 16,
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.selectionContainer}>
        {/* Selected Chips Display */}
        {selectedValues.length > 0 && (
          <View style={styles.chipsContainer}>
            {getSelectedOptions().map((option) => (
              <SelectionChip
                key={option.value}
                label={option.label}
                onRemove={() => removeSelection(option.value)}
              />
            ))}
          </View>
        )}
        
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
            {getDisplayText()}
          </Text>
          <View style={styles.iconContainer}>
            <Ionicons
              name={modalVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color={selectedValues.length > 0 ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
            />
          </View>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || "Select Options"}
              </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons 
                name="search" 
                size={16} 
                color={tokens.colors.onSurfaceVariant} 
                style={styles.searchIcon} 
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search options..."
                placeholderTextColor={tokens.colors.onSurfaceVariant}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.selectAllButton]}
                onPress={selectAll}
              >
                <Text style={[styles.actionButtonText, styles.selectAllButtonText]}>
                  Select All ({filteredOptions.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearAllButton]}
                onPress={clearAll}
              >
                <Text style={[styles.actionButtonText, styles.clearAllButtonText]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = selectedValues.includes(item.value);
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                    onPress={() => toggleSelection(item.value)}
                    activeOpacity={0.8}
                  >
                    <ModernCheckbox 
                      checked={isSelected}
                      size={20}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ padding: tokens.spacing.lg, alignItems: 'center' }}>
                  <Text style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.body }}>
                    {searchQuery ? 'No matching options found' : 'No options available'}
                  </Text>
                </View>
              }
            />
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setModalVisible(false);
                setSearchQuery(''); // Clear search when closing
              }}
            >
              <Text style={styles.doneButtonText}>
                Done ({selectedValues.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};