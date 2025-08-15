import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface ExamProgress {
  currentQuestion: number;
  totalQuestions: number;
  answered: number;
  timeRemaining: string;
  examTitle: string;
}

interface ExitExamModalProps {
  visible: boolean;
  examProgress: ExamProgress | null;
  onContinueExam: () => void;
  onExit: () => void;
  onClose: () => void;
}

export const ExitExamModal: React.FC<ExitExamModalProps> = ({
  visible,
  examProgress,
  onContinueExam,
  onExit,
  onClose,
}) => {
  const { tokens } = useEducationTheme();

  if (!examProgress) {
    return null;
  }

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
    },
    modalContainer: {
      width: '100%',
      maxWidth: 340,
      borderRadius: tokens.borderRadius.xl,
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.lg,
      elevation: 8,
    },
    header: {
      alignItems: 'center',
      paddingTop: tokens.spacing.xl,
      paddingHorizontal: tokens.spacing.lg,
      paddingBottom: tokens.spacing.lg,
      backgroundColor: tokens.colors.primary,
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    warningIcon: {
      marginBottom: tokens.spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: 'white',
      textAlign: 'center',
      marginBottom: tokens.spacing.sm,
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      lineHeight: 20,
    },
    content: {
      padding: tokens.spacing.lg,
    },
    message: {
      fontSize: 16,
      color: tokens.colors.onSurface,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: tokens.spacing.xl,
    },
    actions: {
      gap: tokens.spacing.md,
    },
    primaryButton: {
      backgroundColor: tokens.colors.primary,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      alignItems: 'center',
      ...tokens.shadows.sm,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    exitButton: {
      backgroundColor: 'transparent',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      borderColor: tokens.colors.error,
      alignItems: 'center',
    },
    exitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.colors.error,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.warningIcon}>
              <Ionicons name="warning" size={48} color="white" />
            </View>
            <Text style={styles.title}>Exit Exam?</Text>
            <Text style={styles.subtitle}>
              Are you sure you want to leave the exam?
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>
              Question {examProgress.currentQuestion} of {examProgress.totalQuestions} • {examProgress.answered} answered • {examProgress.timeRemaining} left
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={onContinueExam}
              >
                <Text style={styles.primaryButtonText}>Continue Exam</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.exitButton}
                onPress={onExit}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};