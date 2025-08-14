import React from "react";
import { View, StyleSheet } from "react-native";
import { useEducationTheme, useScopedThemedStyles } from "@/contexts/ScopedThemeProviders";
import { SearchHeader } from "./SearchHeader";
import { FilterHeader } from "./FilterHeader";
import { SectionHeader } from "./SectionHeader";
import { StatsHeader } from "./StatsHeader";
import { InfoHeader } from "./InfoHeader";

interface EducationHeaderProps {
  variant?: "courses" | "teachers" | "live-classes" | "exams" | "leaderboard" | "custom";
  containerStyle?: any;
  
  // Search props
  search?: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    variant?: "default" | "minimal" | "elevated";
  };
  
  // Filter props
  filters?: {
    options: { id: string; label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
    label?: string;
    variant?: "default" | "pills" | "outline" | "minimal";
  };
  
  // Additional filters (for exams screen)
  secondaryFilters?: {
    options: { id: string; label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
    label?: string;
    variant?: "default" | "pills" | "outline" | "minimal";
  };
  
  // Section header props
  section?: {
    title: string;
    count?: number;
    countLabel?: string;
    subtitle?: string;
    variant?: "default" | "centered" | "minimal" | "prominent";
  };
  
  // Stats props
  stats?: {
    items: {
      id: string;
      label: string;
      value: string | number;
      icon?: any;
      color?: string;
      subtitle?: string;
    }[];
    variant?: "default" | "cards" | "minimal" | "prominent";
    columns?: number;
  };
  
  // Info props
  info?: {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: any;
    variant?: "default" | "card" | "banner" | "minimal" | "centered";
    children?: React.ReactNode;
  };
  
  // Custom children
  children?: React.ReactNode;
}

export const EducationHeader: React.FC<EducationHeaderProps> = ({
  variant = "custom",
  containerStyle,
  search,
  filters,
  secondaryFilters,
  section,
  stats,
  info,
  children,
}) => {
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const getVariantOrder = () => {
    switch (variant) {
      case "courses":
        return ["search", "filters", "section"];
      case "teachers":
        return ["search", "filters", "secondaryFilters", "section"];
      case "live-classes":
        return ["search", "filters", "section"];
      case "exams":
        return ["filters", "secondaryFilters", "section"];
      case "leaderboard":
        return ["info", "stats", "filters", "section"];
      default:
        return ["custom"];
    }
  };

  const renderComponent = (componentType: string) => {
    switch (componentType) {
      case "search":
        return search ? (
          <SearchHeader
            key="search"
            value={search.value}
            onChangeText={search.onChangeText}
            placeholder={search.placeholder}
            variant={search.variant}
          />
        ) : null;
        
      case "filters":
        return filters ? (
          <FilterHeader
            key="filters"
            options={filters.options}
            selectedValue={filters.selectedValue}
            onSelect={filters.onSelect}
            label={filters.label}
            variant={filters.variant}
          />
        ) : null;
        
      case "secondaryFilters":
        return secondaryFilters ? (
          <FilterHeader
            key="secondaryFilters"
            options={secondaryFilters.options}
            selectedValue={secondaryFilters.selectedValue}
            onSelect={secondaryFilters.onSelect}
            label={secondaryFilters.label}
            variant={secondaryFilters.variant}
          />
        ) : null;
        
      case "section":
        return section ? (
          <SectionHeader
            key="section"
            title={section.title}
            count={section.count}
            countLabel={section.countLabel}
            subtitle={section.subtitle}
            variant={section.variant}
          />
        ) : null;
        
      case "stats":
        return stats ? (
          <StatsHeader
            key="stats"
            stats={stats.items}
            variant={stats.variant}
            columns={stats.columns}
          />
        ) : null;
        
      case "info":
        return info ? (
          <InfoHeader
            key="info"
            title={info.title}
            subtitle={info.subtitle}
            description={info.description}
            icon={info.icon}
            variant={info.variant}
          >
            {info.children}
          </InfoHeader>
        ) : null;
        
      case "custom":
        return children;
        
      default:
        return null;
    }
  };

  const order = getVariantOrder();

  return (
    <View style={[styles.container, containerStyle]}>
      {order.map((componentType) => renderComponent(componentType))}
    </View>
  );
};

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
    },
  });