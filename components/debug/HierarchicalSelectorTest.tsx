import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HierarchicalSelector } from '../ui/HierarchicalSelector';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

// Sample data for testing
const testUnits = [
  {
    id: 'algebra',
    name: 'Algebra',
    topics: [
      { id: 'linear-equations', name: 'Linear Equations', difficulty: 'intermediate' as const },
      { id: 'quadratic-equations', name: 'Quadratic Equations', difficulty: 'advanced' as const },
      { id: 'polynomials', name: 'Polynomials', difficulty: 'intermediate' as const },
      { id: 'factoring', name: 'Factoring', difficulty: 'beginner' as const },
    ],
  },
  {
    id: 'geometry',
    name: 'Geometry',
    topics: [
      { id: 'triangles', name: 'Triangles', difficulty: 'beginner' as const },
      { id: 'circles', name: 'Circles', difficulty: 'intermediate' as const },
      { id: 'coordinate-geometry', name: 'Coordinate Geometry', difficulty: 'advanced' as const },
    ],
  },
  {
    id: 'calculus',
    name: 'Calculus',
    topics: [
      { id: 'limits', name: 'Limits', difficulty: 'advanced' as const },
      { id: 'derivatives', name: 'Derivatives', difficulty: 'expert' as const },
      { id: 'integrals', name: 'Integrals', difficulty: 'expert' as const },
    ],
  },
];

export const HierarchicalSelectorTest: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Array<{unitId: string; topicIds: string[]}>>([]);
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.background,
    },
    title: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.lg,
      textAlign: 'center',
    },
    section: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      marginBottom: tokens.spacing.lg,
      ...tokens.shadows.sm,
    },
    sectionTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.md,
    },
    selectionInfo: {
      backgroundColor: tokens.colors.primaryLight + '10',
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary + '20',
    },
    infoText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
  });

  const totalTopics = selectedItems.reduce((count, item) => count + item.topicIds.length, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Hierarchical Selector Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Component</Text>
        <HierarchicalSelector
          label="Mathematics Units & Topics"
          units={testUnits}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          placeholder="Select your math topics"
          showSearch={true}
          showSelectAllToggle={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selection Summary</Text>
        <View style={styles.selectionInfo}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: 'bold' }}>Total Units Selected:</Text> {selectedItems.length}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: 'bold' }}>Total Topics Selected:</Text> {totalTopics}
          </Text>
          
          {selectedItems.map((item) => {
            const unit = testUnits.find(u => u.id === item.unitId);
            return (
              <Text key={item.unitId} style={styles.infoText}>
                <Text style={{ fontWeight: 'bold' }}>{unit?.name}:</Text> {item.topicIds.length} topics
              </Text>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};