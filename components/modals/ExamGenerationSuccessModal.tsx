import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface ExamData {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  units?: string[];
  topics?: string[];
  questionsCount?: number;
  timeLimit?: number;
}

interface ExamGenerationSuccessModalProps {
  visible: boolean;
  examData: ExamData | null;
  onTakeExam: () => void;
  onViewAllExams: () => void;
  onClose: () => void;
}

export const ExamGenerationSuccessModal: React.FC<ExamGenerationSuccessModalProps> = ({
  visible,
  examData,
  onTakeExam,
  onViewAllExams,
  onClose,
}) => {
  const { tokens } = useEducationTheme();

  if (!examData) {
    return null;
  }


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return tokens.colors.primary;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'leaf-outline';
      case 'intermediate': return 'flash-outline';
      case 'advanced': return 'rocket-outline';
      case 'expert': return 'star-outline';
      default: return 'school-outline';
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContainer: {
      width: '100%',
      maxWidth: 380,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.xl,
      elevation: 20,
    },
    header: {
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 24,
      alignItems: 'center',
      position: 'relative',
    },
    celebrationIcon: {
      marginBottom: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 40,
      padding: 8,
    },
    successTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: 'white',
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    successSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '500',
    },
    content: {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
    },
    examCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: tokens.colors.primary + '20',
      ...tokens.shadows.md,
    },
    examTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: tokens.colors.onSurface,
      marginBottom: 12,
      lineHeight: 24,
    },
    examDetails: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    detailText: {
      fontSize: 14,
      color: tokens.colors.onSurfaceVariant,
      flex: 1,
    },
    difficultyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white',
      textTransform: 'capitalize',
    },
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 16,
      marginBottom: 24,
      gap: 10,
      minHeight: 56,
      ...tokens.shadows.md,
    },
    primaryButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: 'white',
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: 16,
      gap: 8,
      minHeight: 52,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.colors.onSurfaceVariant,
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Header Section - Simplified */}
          <View style={[styles.header, { backgroundColor: tokens.colors.primary }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
            
            <View style={styles.celebrationIcon}>
              <Ionicons name="checkmark-circle" size={64} color="white" />
            </View>
            
            <Text style={styles.successTitle}>Exam Generated! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Your custom exam is ready to challenge your knowledge
            </Text>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            
            {/* Primary Action - Take Exam Now */}
            <TouchableOpacity 
              style={[styles.primaryAction, { backgroundColor: tokens.colors.primary }]}
              onPress={onTakeExam}
            >
              <Ionicons name="play-circle" size={24} color="white" />
              <Text style={styles.primaryButtonText}>Take Exam Now</Text>
            </TouchableOpacity>
            
            {/* Exam Preview Card */}
            <View style={[styles.examCard, { backgroundColor: tokens.colors.surfaceVariant }]}>
              <Text style={styles.examTitle}>{examData.title}</Text>
              
              <View style={styles.examDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="book-outline" size={16} color={tokens.colors.primary} />
                  <Text style={styles.detailText}>{examData.subject}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="layers-outline" size={16} color={tokens.colors.primary} />
                  <Text style={styles.detailText}>
                    {(examData.units?.length || 0)} Unit{(examData.units?.length || 0) !== 1 ? 's' : ''} • {(examData.topics?.length || 0)} Topic{(examData.topics?.length || 0) !== 1 ? 's' : ''}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <View 
                    style={[
                      styles.difficultyBadge, 
                      { backgroundColor: getDifficultyColor(examData.difficulty) }
                    ]}
                  >
                    <Ionicons 
                      name={getDifficultyIcon(examData.difficulty)} 
                      size={12} 
                      color="white" 
                    />
                    <Text style={styles.difficultyText}>{examData.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Secondary Action */}
            <TouchableOpacity style={styles.secondaryButton} onPress={onViewAllExams}>
              <Ionicons name="list-outline" size={18} color={tokens.colors.onSurfaceVariant} />
              <Text style={styles.secondaryButtonText}>View All Exams</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};