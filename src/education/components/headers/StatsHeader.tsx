import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
}

interface StatsHeaderProps {
  stats: StatItem[];
  variant?: "default" | "cards" | "minimal" | "prominent";
  containerStyle?: any;
  columns?: number;
  showDividers?: boolean;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  stats,
  variant = "default",
  containerStyle,
  columns = 3,
  showDividers = false,
}) => {
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const getContainerVariantStyles = () => {
    switch (variant) {
      case "cards":
        return styles.cardsContainer;
      case "minimal":
        return styles.minimalContainer;
      case "prominent":
        return styles.prominentContainer;
      default:
        return styles.defaultContainer;
    }
  };

  const getStatItemStyles = () => {
    switch (variant) {
      case "cards":
        return styles.cardsStat;
      case "minimal":
        return styles.minimalStat;
      case "prominent":
        return styles.prominentStat;
      default:
        return styles.defaultStat;
    }
  };

  const getStatNumberStyles = () => {
    switch (variant) {
      case "prominent":
        return styles.prominentStatNumber;
      case "minimal":
        return styles.minimalStatNumber;
      default:
        return styles.defaultStatNumber;
    }
  };

  const getStatLabelStyles = () => {
    switch (variant) {
      case "prominent":
        return styles.prominentStatLabel;
      case "minimal":
        return styles.minimalStatLabel;
      default:
        return styles.defaultStatLabel;
    }
  };

  const renderStat = (stat: StatItem, index: number) => {
    const isLast = index === stats.length - 1;
    const showRightDivider = showDividers && !isLast;

    return (
      <View key={stat.id} style={[getStatItemStyles(), { flex: 1 }]}>
        {stat.icon && (
          <Ionicons
            name={stat.icon}
            size={variant === "prominent" ? 28 : 20}
            color={stat.color || tokens.colors.primary}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            getStatNumberStyles(),
            stat.color && { color: stat.color },
          ]}
        >
          {stat.value}
        </Text>
        <Text style={getStatLabelStyles()}>{stat.label}</Text>
        {stat.subtitle && (
          <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
        )}
        {showRightDivider && <View style={styles.divider} />}
      </View>
    );
  };

  // Group stats into rows based on columns
  const groupedStats = [];
  for (let i = 0; i < stats.length; i += columns) {
    groupedStats.push(stats.slice(i, i + columns));
  }

  return (
    <View style={[getContainerVariantStyles(), containerStyle]}>
      {groupedStats.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((stat, statIndex) => renderStat(stat, rowIndex * columns + statIndex))}
        </View>
      ))}
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    icon: {
      marginBottom: tokens.spacing.xs,
    },
    statSubtitle: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginTop: tokens.spacing.xs,
      textAlign: "center",
    },
    divider: {
      position: "absolute",
      right: 0,
      top: "20%",
      bottom: "20%",
      width: 1,
      backgroundColor: tokens.colors.border,
    },
    
    // Default variant styles
    defaultContainer: {
      flexDirection: "row",
      padding: tokens.spacing.md,
      backgroundColor: 'transparent',
    },
    defaultStat: {
      alignItems: "center",
      padding: tokens.spacing.md,
      marginHorizontal: tokens.spacing.xs,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.md,
    },
    defaultStatNumber: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.xs,
    },
    defaultStatLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
    },
    
    // Cards variant styles
    cardsContainer: {
      flexDirection: "row",
      padding: tokens.spacing.md,
      backgroundColor: 'transparent',
    },
    cardsStat: {
      alignItems: "center",
      padding: tokens.spacing.md,
      marginHorizontal: tokens.spacing.xs,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    
    // Minimal variant styles
    minimalContainer: {
      flexDirection: "row",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      backgroundColor: "transparent",
    },
    minimalStat: {
      alignItems: "center",
      padding: tokens.spacing.sm,
    },
    minimalStatNumber: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    minimalStatLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
    },
    
    // Prominent variant styles
    prominentContainer: {
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.primaryContainer,
      borderRadius: tokens.borderRadius.md,
      margin: tokens.spacing.md,
    },
    prominentStat: {
      alignItems: "center",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      marginHorizontal: tokens.spacing.xs,
      ...tokens.shadows.sm,
    },
    prominentStatNumber: {
      fontSize: tokens.typography.headline,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.xs,
    },
    prominentStatLabel: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      textAlign: "center",
      fontWeight: tokens.typography.semiBold,
    },
  });