import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

interface InfoHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "card" | "banner" | "minimal" | "centered";
  containerStyle?: any;
  children?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export const InfoHeader: React.FC<InfoHeaderProps> = ({
  title,
  subtitle,
  description,
  icon,
  variant = "default",
  containerStyle,
  children,
  backgroundColor,
  textColor,
}) => {
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return styles.card;
      case "banner":
        return styles.banner;
      case "minimal":
        return styles.minimal;
      case "centered":
        return styles.centered;
      default:
        return styles.default;
    }
  };

  const getTitleVariantStyles = () => {
    switch (variant) {
      case "banner":
        return styles.bannerTitle;
      case "minimal":
        return styles.minimalTitle;
      case "centered":
        return styles.centeredTitle;
      default:
        return styles.defaultTitle;
    }
  };

  const getSubtitleVariantStyles = () => {
    switch (variant) {
      case "banner":
        return styles.bannerSubtitle;
      case "minimal":
        return styles.minimalSubtitle;
      case "centered":
        return styles.centeredSubtitle;
      default:
        return styles.defaultSubtitle;
    }
  };

  const getDescriptionVariantStyles = () => {
    switch (variant) {
      case "banner":
        return styles.bannerDescription;
      case "minimal":
        return styles.minimalDescription;
      case "centered":
        return styles.centeredDescription;
      default:
        return styles.defaultDescription;
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case "banner":
        return 32;
      case "minimal":
        return 16;
      case "centered":
        return 28;
      default:
        return 20;
    }
  };

  const getContentAlignment = () => {
    switch (variant) {
      case "centered":
        return "center";
      default:
        return "flex-start";
    }
  };

  return (
    <View
      style={[
        getVariantStyles(),
        backgroundColor && { backgroundColor },
        containerStyle,
      ]}
    >
      <View style={[styles.content, { alignItems: getContentAlignment() }]}>
        {icon && (
          <Ionicons
            name={icon}
            size={getIconSize()}
            color={textColor || tokens.colors.onSurface}
            style={styles.icon}
          />
        )}
        
        <View style={[styles.textContainer, variant === "centered" && { alignItems: "center" }]}>
          <Text
            style={[
              getTitleVariantStyles(),
              textColor && { color: textColor },
            ]}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              style={[
                getSubtitleVariantStyles(),
                textColor && { color: textColor },
              ]}
            >
              {subtitle}
            </Text>
          )}
          
          {description && (
            <Text
              style={[
                getDescriptionVariantStyles(),
                textColor && { color: textColor },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      
      {children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    content: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    icon: {
      marginRight: tokens.spacing.sm,
      marginTop: 2,
    },
    textContainer: {
      flex: 1,
    },
    childrenContainer: {
      marginTop: tokens.spacing.md,
    },
    
    // Default variant styles
    default: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    defaultTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    defaultSubtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    defaultDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    
    // Card variant styles
    card: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      margin: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    
    // Banner variant styles
    banner: {
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.borderRadius.md,
      margin: tokens.spacing.md,
    },
    bannerTitle: {
      fontSize: tokens.typography.headline,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onPrimary,
      marginBottom: tokens.spacing.xs,
    },
    bannerSubtitle: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onPrimary,
      marginBottom: tokens.spacing.xs,
      opacity: 0.9,
    },
    bannerDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      lineHeight: 22,
      opacity: 0.8,
    },
    
    // Minimal variant styles
    minimal: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      backgroundColor: "transparent",
    },
    minimalTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    minimalSubtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    minimalDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 18,
    },
    
    // Centered variant styles
    centered: {
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      alignItems: "center",
    },
    centeredTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
      textAlign: "center",
    },
    centeredSubtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
      textAlign: "center",
    },
    centeredDescription: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 20,
      textAlign: "center",
    },
  });