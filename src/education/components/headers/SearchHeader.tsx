import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";

interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: "default" | "minimal" | "elevated";
  containerStyle?: any;
  showIcon?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  variant = "default",
  containerStyle,
  showIcon = true,
}) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { tokens } = themeContext;

  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return styles.minimal;
      case "elevated":
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.searchBar, getVariantStyles()]}>
        {showIcon && (
          <Ionicons
            name="search"
            size={20}
            color={tokens.colors.onSurfaceVariant}
          />
        )}
        <TextInput
          style={[styles.searchInput, !showIcon && styles.searchInputNoIcon]}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.onSurfaceVariant}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      padding: tokens.spacing.md,
      backgroundColor: 'transparent',
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.lg,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    default: {
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.lg,
    },
    minimal: {
      backgroundColor: tokens.colors.background,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    elevated: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      ...tokens.shadows.sm,
    },
    searchInput: {
      flex: 1,
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
    },
    searchInputNoIcon: {
      marginLeft: 0,
    },
  });