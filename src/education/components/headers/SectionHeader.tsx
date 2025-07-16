import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

interface SectionHeaderProps {
  title: string;
  count?: number;
  countLabel?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "centered" | "minimal" | "prominent";
  containerStyle?: any;
  showDivider?: boolean;
  alignment?: "space-between" | "flex-start" | "center";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  count,
  countLabel,
  subtitle,
  icon,
  variant = "default",
  containerStyle,
  showDivider = false,
  alignment = "space-between",
}) => {
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "centered":
        return styles.centered;
      case "minimal":
        return styles.minimal;
      case "prominent":
        return styles.prominent;
      default:
        return styles.default;
    }
  };

  const getTitleVariantStyles = () => {
    switch (variant) {
      case "prominent":
        return styles.prominentTitle;
      case "minimal":
        return styles.minimalTitle;
      default:
        return styles.defaultTitle;
    }
  };

  const getCountVariantStyles = () => {
    switch (variant) {
      case "prominent":
        return styles.prominentCount;
      case "minimal":
        return styles.minimalCount;
      default:
        return styles.defaultCount;
    }
  };

  const getCountText = () => {
    if (count === undefined) return null;
    if (countLabel) return `${count} ${countLabel}`;
    return count.toString();
  };

  return (
    <View style={[styles.container, getVariantStyles(), containerStyle]}>
      <View style={[styles.header, { justifyContent: alignment }]}>
        <View style={styles.titleContainer}>
          {icon && (
            <Ionicons
              name={icon}
              size={variant === "prominent" ? 28 : 20}
              color={tokens.colors.onSurface}
              style={styles.icon}
            />
          )}
          <View>
            <Text style={[styles.title, getTitleVariantStyles()]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
        
        {count !== undefined && (
          <View style={styles.countContainer}>
            <Text style={[styles.count, getCountVariantStyles()]}>
              {getCountText()}
            </Text>
          </View>
        )}
      </View>
      
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    icon: {
      marginRight: tokens.spacing.sm,
    },
    title: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    subtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginTop: tokens.spacing.xs,
    },
    countContainer: {
      alignItems: "flex-end",
    },
    count: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    divider: {
      height: 1,
      backgroundColor: tokens.colors.border,
      marginTop: tokens.spacing.sm,
    },
    
    // Default variant styles
    default: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    defaultTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
    },
    defaultCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    
    // Centered variant styles
    centered: {
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.lg,
    },
    
    // Minimal variant styles
    minimal: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      backgroundColor: "transparent",
    },
    minimalTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
    },
    minimalCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    
    // Prominent variant styles
    prominent: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: tokens.colors.primaryContainer,
      borderRadius: tokens.borderRadius.md,
      margin: tokens.spacing.md,
    },
    prominentTitle: {
      fontSize: tokens.typography.headline,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onPrimaryContainer,
    },
    prominentCount: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimaryContainer,
      fontWeight: tokens.typography.semiBold,
    },
  });