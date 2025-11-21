import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { ModernCheckbox } from './ModernCheckbox';
import { SelectionChip } from './SelectionChip';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Topic {
  id: string;
  name: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Unit {
  id: string;
  name: string;
  topics: Topic[];
}

interface HierarchicalSelection {
  unitId: string;
  topicIds: string[];
}

interface HierarchicalSelectorProps {
  label?: string;
  units: Unit[];
  selectedItems: HierarchicalSelection[];
  onSelectionChange: (selections: HierarchicalSelection[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  showSearch?: boolean;
  showSelectAllToggle?: boolean;
}

const customLayoutAnimation = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export const HierarchicalSelector: React.FC<HierarchicalSelectorProps> = ({
  label,
  units,
  selectedItems,
  onSelectionChange,
  placeholder = "Select units and topics",
  error,
  disabled = false,
  showSearch = true,
  showSelectAllToggle = true,
}) => {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return units;
    
    return units.map(unit => ({
      ...unit,
      topics: unit.topics.filter(topic =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(unit => 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.topics.length > 0
    );
  }, [units, searchQuery]);

  const getSelectedTopicsForUnit = (unitId: string): string[] => {
    const unitSelection = selectedItems.find(item => item.unitId === unitId);
    return unitSelection ? unitSelection.topicIds : [];
  };

  const getSelectedTopicsCount = (): number => {
    return selectedItems.reduce((count, item) => count + item.topicIds.length, 0);
  };

  const getSelectedUnitsWithTopics = () => {
    return selectedItems
      .filter(item => item.topicIds.length > 0)
      .map(item => {
        const unit = units.find(u => u.id === item.unitId);
        const topics = unit?.topics.filter(t => item.topicIds.includes(t.id)) || [];
        return { unit, topics };
      })
      .filter(item => item.unit);
  };

  const isUnitExpanded = (unitId: string): boolean => {
    return expandedUnits.has(unitId);
  };

  const toggleUnitExpansion = (unitId: string) => {
    LayoutAnimation.configureNext(customLayoutAnimation);
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const toggleTopicSelection = (unitId: string, topicId: string) => {
    const currentSelection = selectedItems.find(item => item.unitId === unitId);
    const currentTopics = currentSelection ? currentSelection.topicIds : [];
    
    const newTopics = currentTopics.includes(topicId)
      ? currentTopics.filter(id => id !== topicId)
      : [...currentTopics, topicId];

    const newSelections = selectedItems.filter(item => item.unitId !== unitId);
    
    if (newTopics.length > 0) {
      newSelections.push({ unitId, topicIds: newTopics });
    }

    onSelectionChange(newSelections);
  };

  const toggleUnitSelectAll = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    const currentTopics = getSelectedTopicsForUnit(unitId);
    const allTopicIds = unit.topics.map(t => t.id);
    const isAllSelected = allTopicIds.every(id => currentTopics.includes(id));

    const newSelections = selectedItems.filter(item => item.unitId !== unitId);
    
    if (!isAllSelected) {
      newSelections.push({ unitId, topicIds: allTopicIds });
    }

    onSelectionChange(newSelections);
  };

  const clearAllSelections = () => {
    onSelectionChange([]);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return tokens.colors.success;
      case 'intermediate': return tokens.colors.warning;
      case 'advanced': return tokens.colors.error;
      case 'expert': return tokens.colors.primary;
      default: return tokens.colors.onSurfaceVariant;
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'leaf-outline';
      case 'intermediate': return 'flash-outline';
      case 'advanced': return 'flame-outline';
      case 'expert': return 'diamond-outline';
      default: return 'help-circle-outline';
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: tokens.spacing.lg,
      width: '100%',
    },
    label: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.sm,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.xl,
      paddingHorizontal: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
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
    selectionSummary: {
      backgroundColor: tokens.colors.primaryLight + '10',
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.primaryLight + '30',
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm,
    },
    summaryTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.primary,
    },
    clearButton: {
      padding: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    clearButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: tokens.typography.medium,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.xs,
    },
    selectorContainer: {
      borderWidth: 1,
      borderColor: error ? tokens.colors.error : tokens.colors.border,
      borderRadius: tokens.borderRadius.xl,
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.sm,
      maxHeight: 400,
      width: '100%',
    },
    unitCard: {
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
    },
    unitHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    unitHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    unitIcon: {
      marginRight: tokens.spacing.sm,
      padding: tokens.spacing.xs,
      backgroundColor: tokens.colors.primary + '15',
      borderRadius: tokens.borderRadius.sm,
    },
    unitTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      flex: 1,
    },
    unitStats: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginRight: tokens.spacing.sm,
    },
    expandIcon: {
      padding: tokens.spacing.xs,
    },
    selectAllButton: {
      paddingVertical: tokens.spacing.xs,
      paddingHorizontal: tokens.spacing.sm,
      backgroundColor: tokens.colors.primaryLight + '20',
      borderRadius: tokens.borderRadius.sm,
      borderWidth: 1,
      borderColor: tokens.colors.primary + '30',
      marginRight: tokens.spacing.sm,
    },
    selectAllText: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.primary,
    },
    topicsContainer: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      backgroundColor: tokens.colors.surface,
    },
    topicItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      marginBottom: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    selectedTopicItem: {
      backgroundColor: tokens.colors.primaryLight + '15',
      borderColor: tokens.colors.primary + '30',
    },
    topicText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      flex: 1,
      marginLeft: tokens.spacing.md,
      fontWeight: tokens.typography.medium,
    },
    selectedTopicText: {
      color: tokens.colors.primary,
      fontWeight: tokens.typography.semibold,
    },
    difficultyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: 2,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
    },
    difficultyText: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.medium,
      marginLeft: 4,
    },
    errorText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.error,
      marginTop: tokens.spacing.xs,
      marginLeft: tokens.spacing.sm,
    },
    emptyState: {
      padding: tokens.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: tokens.spacing.sm,
    },
  });

  const selectedCount = getSelectedTopicsCount();
  const selectedUnitsWithTopics = getSelectedUnitsWithTopics();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={16} 
            color={tokens.colors.onSurfaceVariant} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search units or topics..."
            placeholderTextColor={tokens.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={!disabled}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      )}

      {selectedCount > 0 && (
        <View style={styles.selectionSummary}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              Selected: {selectedCount} topics from {selectedItems.length} units
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllSelections}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {selectedUnitsWithTopics.map(({ unit, topics }) =>
              topics.map(topic => (
                <SelectionChip
                  key={`${unit!.id}-${topic.id}`}
                  label={`${unit!.name}: ${topic.name}`}
                  onRemove={() => toggleTopicSelection(unit!.id, topic.id)}
                />
              ))
            )}
          </View>
        </View>
      )}

      <ScrollView style={styles.selectorContainer} nestedScrollEnabled>
        {filteredUnits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={tokens.colors.onSurfaceVariant} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No matching units or topics found' : 'No units available'}
            </Text>
          </View>
        ) : (
          filteredUnits.map((unit) => {
            const isExpanded = isUnitExpanded(unit.id);
            const selectedTopics = getSelectedTopicsForUnit(unit.id);
            const isAllSelected = unit.topics.length > 0 && unit.topics.every(t => selectedTopics.includes(t.id));
            
            return (
              <View key={unit.id} style={styles.unitCard}>
                <View style={styles.unitHeader}>
                  <View style={styles.unitHeaderLeft}>
                    <View style={styles.unitIcon}>
                      <Ionicons 
                        name="library-outline" 
                        size={18} 
                        color={tokens.colors.primary} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.unitTitle}>{unit.name}</Text>
                      <Text style={styles.unitStats}>
                        {selectedTopics.length}/{unit.topics.length} topics selected
                      </Text>
                    </View>
                  </View>
                  
                  {showSelectAllToggle && unit.topics.length > 0 && (
                    <TouchableOpacity
                      style={styles.selectAllButton}
                      onPress={() => toggleUnitSelectAll(unit.id)}
                    >
                      <Text style={styles.selectAllText}>
                        {isAllSelected ? 'Deselect All' : 'Select All'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.expandIcon}
                    onPress={() => toggleUnitExpansion(unit.id)}
                  >
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={tokens.colors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                </View>

                {isExpanded && (
                  <View style={styles.topicsContainer}>
                    {unit.topics.map((topic) => {
                      const isSelected = selectedTopics.includes(topic.id);
                      return (
                        <TouchableOpacity
                          key={topic.id}
                          style={[
                            styles.topicItem,
                            isSelected && styles.selectedTopicItem,
                          ]}
                          onPress={() => toggleTopicSelection(unit.id, topic.id)}
                          disabled={disabled}
                        >
                          <ModernCheckbox checked={isSelected} size={18} />
                          <Text
                            style={[
                              styles.topicText,
                              isSelected && styles.selectedTopicText,
                            ]}
                          >
                            {topic.name}
                          </Text>
                          {topic.difficulty && (
                            <View style={[
                              styles.difficultyBadge,
                              { borderColor: getDifficultyColor(topic.difficulty) + '30' }
                            ]}>
                              <Ionicons
                                name={getDifficultyIcon(topic.difficulty) as any}
                                size={12}
                                color={getDifficultyColor(topic.difficulty)}
                              />
                              <Text
                                style={[
                                  styles.difficultyText,
                                  { color: getDifficultyColor(topic.difficulty) }
                                ]}
                              >
                                {topic.difficulty}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};