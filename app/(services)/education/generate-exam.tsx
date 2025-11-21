import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { EducationScreenHeader } from '@/src/education/components/headers';
import { GenerateExamForm } from '@/components/forms/GenerateExamForm';
import { ExamGenerationSuccessModal } from '@/components/modals/ExamGenerationSuccessModal';

export default function GenerateExamScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<any>(null);
  const themeContext = useEducationTheme();
  const styles = useScopedThemedStyles(createStyles, themeContext);
  const { tokens, getGradient } = themeContext;

  const handleSubmit = async (examData: any) => {
    try {
      setIsLoading(true);
      
      // Simulate exam generation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store generated exam data and show success modal
      setGeneratedExam(examData);
      setShowSuccessModal(true);
      
    } catch (error) {
      // For errors, we can still use Alert or create an error modal later
      console.error('Exam generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeExam = () => {
    if (generatedExam) {
      setShowSuccessModal(false);
      // Navigate directly to the exam taking interface
      router.push(`/(services)/education/exam/${generatedExam.id}/take`);
    }
  };

  const handleViewAllExams = () => {
    setShowSuccessModal(false);
    // Navigate to the exam list
    router.navigate('/(services)/education/(tabs)/exams');
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setGeneratedExam(null);
  };

  const handleCancel = () => {
    if (isLoading) return;
    
    // Simple back navigation for better UX
    router.back();
  };

  // Create a gradient background that matches the education theme
  const backgroundGradient = getGradient('background');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.primary} />
      
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <EducationScreenHeader
          title="Generate Exam"
          rightAction={{
            icon: "settings-outline",
            onPress: () => {
              // Future: Add settings or help
            },
          }}
        />
        
        <View style={styles.contentContainer}>
          <GenerateExamForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </View>
      </LinearGradient>

      {/* Success Modal */}
      <ExamGenerationSuccessModal
        visible={showSuccessModal}
        examData={generatedExam}
        onTakeExam={handleTakeExam}
        onViewAllExams={handleViewAllExams}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      // Purple theme - soft purple tints
      return {
        softBackground: "#FDFAFF", // Very light purple tint
        softSurface: "#F9F2FF", // Light purple tint
      };
    } else {
      // Default soft tints
      return {
        softBackground: "#F8FAFE",
        softSurface: "#F0F6FF",
      };
    }
  };

  const backgroundColors = getSoftTintedColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    gradientBackground: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: backgroundColors.softSurface,
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
  });
};