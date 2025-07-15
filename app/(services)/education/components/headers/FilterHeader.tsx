import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterHeaderProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  label?: string;
  variant?: "default" | "pills" | "outline" | "minimal";
  containerStyle?: any;
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiSelect?: (values: string[]) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  options,
  selectedValue,
  onSelect,
  label,
  variant = "default",
  containerStyle,
  multiSelect = false,
  selectedValues = [],
  onMultiSelect,
}) => {
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const getButtonVariantStyles = (isActive: boolean) => {
    switch (variant) {
      case "pills":
        return isActive ? styles.pillsActive : styles.pillsDefault;
      case "outline":
        return isActive ? styles.outlineActive : styles.outlineDefault;
      case "minimal":
        return isActive ? styles.minimalActive : styles.minimalDefault;
      default:
        return isActive ? styles.defaultActive : styles.defaultDefault;
    }
  };

  const getTextVariantStyles = (isActive: boolean) => {
    switch (variant) {
      case "pills":
        return isActive ? styles.pillsTextActive : styles.pillsTextDefault;
      case "outline":
        return isActive ? styles.outlineTextActive : styles.outlineTextDefault;
      case "minimal":
        return isActive ? styles.minimalTextActive : styles.minimalTextDefault;
      default:
        return isActive ? styles.defaultTextActive : styles.defaultTextDefault;
    }
  };

  const handlePress = (value: string) => {
    if (multiSelect && onMultiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onMultiSelect(newValues);
    } else {
      onSelect(value);
    }
  };

  const isSelected = (value: string) => {
    return multiSelect ? selectedValues.includes(value) : selectedValue === value;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isActive = isSelected(option.value);
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                getButtonVariantStyles(isActive),
              ]}
              onPress={() => handlePress(option.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  getTextVariantStyles(isActive),
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.surface,
    },
    label: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.sm,
      marginHorizontal: tokens.spacing.md,
      marginTop: tokens.spacing.sm,
    },
    scrollContainer: {
      backgroundColor: tokens.colors.surface,
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
    },
    filterButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      marginRight: tokens.spacing.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    filterButtonText: {
      fontSize: tokens.typography.body,
      fontWeight: "500",
    },
    
    // Default variant styles
    defaultDefault: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      height: 36,
    },
    defaultActive: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.primary,
      height: 36,
    },
    defaultTextDefault: {
      color: tokens.colors.onSurface,
    },
    defaultTextActive: {
      color: tokens.colors.onPrimary,
    },
    
    // Pills variant styles
    pillsDefault: {
      borderRadius: tokens.borderRadius.full,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    pillsActive: {
      borderRadius: tokens.borderRadius.full,
      backgroundColor: tokens.colors.primary,
    },
    pillsTextDefault: {
      color: tokens.colors.onSurfaceVariant,
    },
    pillsTextActive: {
      color: tokens.colors.onPrimary,
    },
    
    // Outline variant styles
    outlineDefault: {
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
    },
    outlineActive: {
      borderRadius: tokens.borderRadius.md,
      borderWidth: 2,
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.primaryContainer,
    },
    outlineTextDefault: {
      color: tokens.colors.onSurface,
    },
    outlineTextActive: {
      color: tokens.colors.onPrimaryContainer,
    },
    
    // Minimal variant styles
    minimalDefault: {
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: "transparent",
    },
    minimalActive: {
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.primaryContainer,
    },
    minimalTextDefault: {
      color: tokens.colors.onSurfaceVariant,
    },
    minimalTextActive: {
      color: tokens.colors.onPrimaryContainer,
    },
  });