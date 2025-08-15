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
import { MultiSelect } from '../ui/MultiSelect';
import { Button } from '../ui/Button';
import {
  getSubjectOptions,
  getUnitsBySubject,
  getTopicsByUnit,
  getDifficultyOptions,
  generateMockExam,
  GenerateExamParams,
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
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [includePreviousHistory, setIncludePreviousHistory] = useState(false);
  
  // Dynamic options
  const [unitOptions, setUnitOptions] = useState<Array<{label: string; value: string}>>([]);
  const [topicOptions, setTopicOptions] = useState<Array<{label: string; value: string}>>([]);
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Static options
  const subjectOptions = getSubjectOptions();
  const difficultyOptions = getDifficultyOptions();

  // Update units when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const units = getUnitsBySubject(selectedSubject);
      setUnitOptions(units);
      setSelectedUnits([]);
      setSelectedTopics([]);
      setTopicOptions([]);
    } else {
      setUnitOptions([]);
      setSelectedUnits([]);
      setSelectedTopics([]);
      setTopicOptions([]);
    }
  }, [selectedSubject]);

  // Update topics when units change
  useEffect(() => {
    if (selectedSubject && selectedUnits.length > 0) {
      const allTopics: Array<{label: string; value: string}> = [];
      selectedUnits.forEach(unitId => {
        const topics = getTopicsByUnit(selectedSubject, unitId);
        allTopics.push(...topics);
      });
      // Remove duplicates
      const uniqueTopics = allTopics.filter((topic, index, self) => 
        index === self.findIndex(t => t.value === topic.value)
      );
      setTopicOptions(uniqueTopics);
      setSelectedTopics([]);
    } else {
      setTopicOptions([]);
      setSelectedTopics([]);
    }
  }, [selectedSubject, selectedUnits]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedSubject) {
      newErrors.subject = 'Please select a subject';
    }
    if (selectedUnits.length === 0) {
      newErrors.units = 'Please select at least one unit';
    }
    if (selectedTopics.length === 0) {
      newErrors.topics = 'Please select at least one topic';
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

    const examParams: GenerateExamParams = {
      subject: selectedSubject,
      unit: selectedUnits.join(','), // Multiple units as comma-separated
      topic: selectedTopics.join(','), // Multiple topics as comma-separated
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
    setSelectedUnits([]);
    setSelectedTopics([]);
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
      paddingTop: tokens.spacing.lg,
    },
    formSection: {
      marginBottom: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      marginHorizontal: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
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
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.xs,
      paddingBottom: tokens.spacing.lg,
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

        <MultiSelect
          label="Units *"
          options={unitOptions}
          selectedValues={selectedUnits}
          onSelectionChange={setSelectedUnits}
          placeholder={selectedSubject ? "Choose units (multiple selection)" : "Select a subject first"}
          disabled={!selectedSubject}
          error={errors.units}
        />

        <MultiSelect
          label="Topics *"
          options={topicOptions}
          selectedValues={selectedTopics}
          onSelectionChange={setSelectedTopics}
          placeholder={selectedUnits.length > 0 ? "Choose topics (multiple selection)" : "Select units first"}
          disabled={selectedUnits.length === 0}
          error={errors.topics}
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