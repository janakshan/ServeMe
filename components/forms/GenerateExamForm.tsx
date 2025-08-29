import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { Select } from '../ui/Select';
import { HierarchicalSelector } from '../ui/HierarchicalSelector';
import { Button } from '../ui/Button';
import {
  getSubjectOptions,
  getDifficultyOptions,
  generateMockExam,
  GenerateExamParams,
  Unit,
  EXAM_SUBJECTS,
} from '@/utils/examData';

interface GenerateExamFormProps {
  onSubmit: (examData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GenerateExamForm: React.FC<GenerateExamFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  
  // Form state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [hierarchicalSelections, setHierarchicalSelections] = useState<Array<{unitId: string; topicIds: string[]}>>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [includePreviousHistory, setIncludePreviousHistory] = useState(false);
  
  // Dynamic options
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Static options
  const subjectOptions = getSubjectOptions();
  const difficultyOptions = getDifficultyOptions();

  // Update units when subject changes
  useEffect(() => {
    if (selectedSubject) {
      // Get full unit data for hierarchical selector
      const subject = EXAM_SUBJECTS.find(s => s.id === selectedSubject);
      setAvailableUnits(subject?.units || []);
      setHierarchicalSelections([]);
    } else {
      setAvailableUnits([]);
      setHierarchicalSelections([]);
    }
  }, [selectedSubject]);


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedSubject) {
      newErrors.subject = 'Please select a subject';
    }
    
    const totalTopics = hierarchicalSelections.reduce((count, item) => count + item.topicIds.length, 0);
    if (hierarchicalSelections.length === 0 || totalTopics === 0) {
      newErrors.hierarchical = 'Please select at least one topic from any unit';
    }
    if (!selectedDifficulty) {
      newErrors.difficulty = 'Please select a difficulty level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Extract units and topics from hierarchical selection
    const units = hierarchicalSelections.map(item => item.unitId);
    const topics = hierarchicalSelections.flatMap(item => item.topicIds);
    
    const examParams: GenerateExamParams = {
      subject: selectedSubject,
      unit: units.join(','), // Multiple units as comma-separated
      topic: topics.join(','), // Multiple topics as comma-separated
      difficulty: selectedDifficulty,
      includePreviousHistory,
    };

    try {
      const generatedExam = generateMockExam(examParams);
      onSubmit(generatedExam);
    } catch (error) {
      Alert.alert(
        'Generation Error',
        'Failed to generate exam. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReset = () => {
    setSelectedSubject('');
    setHierarchicalSelections([]);
    setSelectedDifficulty('');
    setIncludePreviousHistory(false);
    setErrors({});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: tokens.spacing.lg,
    },
    formSection: {
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.lg,
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
      ...tokens.shadows.sm,
    },
    sectionTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.md,
      textAlign: 'left',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.colors.primaryLight + '10',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.primaryLight + '30',
    },
    switchLabel: {
      flex: 1,
      marginRight: tokens.spacing.md,
    },
    switchTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    switchDescription: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 18,
    },
    actionSection: {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      marginTop: tokens.spacing.xs,
      borderBottomLeftRadius: tokens.borderRadius.xl,
      borderBottomRightRadius: tokens.borderRadius.xl,
      ...tokens.shadows.sm,
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      alignItems: 'center',
    },
    primaryButton: {
      flex: 1,
      minHeight: 56,
      borderRadius: tokens.borderRadius.xl,
      ...tokens.shadows.md,
    },
    clearAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      gap: tokens.spacing.xs,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.xl,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      minHeight: 56,
    },
    clearActionText: {
      color: tokens.colors.onSurfaceVariant,
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.medium,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Single Card Form */}
      <View style={styles.formSection}>
        
        <Select
          label="Subject *"
          options={subjectOptions}
          value={selectedSubject}
          onValueChange={setSelectedSubject}
          placeholder="Choose a subject"
          error={errors.subject}
        />


        <HierarchicalSelector
          label="Units & Topics *"
          units={availableUnits}
          selectedItems={hierarchicalSelections}
          onSelectionChange={setHierarchicalSelections}
          placeholder={selectedSubject ? "Select units and their topics" : "Select a subject first"}
          disabled={!selectedSubject}
          error={errors.hierarchical}
          showSearch={true}
          showSelectAllToggle={true}
        />

        <Select
          label="Difficulty Level *"
          options={difficultyOptions}
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
          placeholder="Select difficulty level"
          error={errors.difficulty}
        />
        
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchTitle}>Include Previous History</Text>
            <Text style={styles.switchDescription}>
              Generate questions based on your previous exam performance and weak areas
            </Text>
          </View>
          <Switch
            value={includePreviousHistory}
            onValueChange={setIncludePreviousHistory}
            trackColor={{ 
              false: tokens.colors.surfaceVariant, 
              true: tokens.colors.primaryLight 
            }}
            thumbColor={
              includePreviousHistory 
                ? tokens.colors.primary 
                : tokens.colors.onSurfaceVariant
            }
          />
        </View>
      </View>

      {/* Enhanced Action Section */}
      <View style={styles.actionSection}>
        <View style={styles.buttonsRow}>
          <Button
            title="🎯 Generate Exam"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.primaryButton}
            themeType="education"
            useGradient
            size="large"
          />
          
          <TouchableOpacity 
            style={styles.clearAction}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="refresh-outline" 
              size={18} 
              color={tokens.colors.onSurfaceVariant} 
            />
            <Text style={styles.clearActionText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};