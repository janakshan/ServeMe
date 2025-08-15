import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

import type { DetailedQuestionAnalysis } from '@/types/examAnalysis';
import { TeacherExplanationCard } from './TeacherExplanationCard';

interface TeacherExplanationsProps {
  questions: DetailedQuestionAnalysis[];
}

export const TeacherExplanations: React.FC<TeacherExplanationsProps> = ({
  questions,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="school-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No Teacher Explanations</Text>
        <Text style={styles.emptyDescription}>
          Teacher explanations will appear here when available for questions you got wrong or found challenging.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Explanations</Text>
        <Text style={styles.headerDescription}>
          Detailed explanations from your teachers for {questions.length} questions
        </Text>
      </View>

      {questions.map((question, index) => (
        <View key={question.id} style={styles.questionSection}>
          <View style={styles.questionHeader}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.questionText} numberOfLines={2}>
              {question.question}
            </Text>
          </View>
          
          {question.teacherExplanation && (
            <TeacherExplanationCard
              explanation={question.teacherExplanation}
              style={styles.explanationCard}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  
  header: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.lg,
  },
  
  headerTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
  },
  
  headerDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  
  questionSection: {
    marginBottom: tokens.spacing.xl,
  },
  
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  
  questionNumberText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
  },
  
  questionText: {
    flex: 1,
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    lineHeight: 22,
  },
  
  explanationCard: {
    marginLeft: tokens.spacing.xl + tokens.spacing.md,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xxl,
  },
  
  emptyTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  
  emptyDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
});