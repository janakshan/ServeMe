import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
}

interface TeacherNotificationSettings {
  autoShare: boolean;
  includeDetailedAnalysis: boolean;
  notifyOnAchievements: boolean;
  notifyOnImprovement: boolean;
  notifyOnDecline: boolean;
}

interface TeacherDashboardNotificationProps {
  visible: boolean;
  onClose: () => void;
  examResult: {
    examId: string;
    examTitle: string;
    subject: string;
    percentage: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    achievements: string[];
    previousAttemptScore?: number;
  };
  onSendToTeacher: (teacherId: string, settings: TeacherNotificationSettings) => void;
}

// Mock teacher data
const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    subject: 'Mathematics',
    email: 'sarah.chen@school.edu'
  },
  {
    id: '2', 
    name: 'Prof. Mike Johnson',
    subject: 'Physics',
    email: 'mike.johnson@school.edu'
  },
  {
    id: '3',
    name: 'Ms. Emma Davis',
    subject: 'General Studies',
    email: 'emma.davis@school.edu'
  }
];

export const TeacherDashboardNotification: React.FC<TeacherDashboardNotificationProps> = ({
  visible,
  onClose,
  examResult,
  onSendToTeacher,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const [settings, setSettings] = useState<TeacherNotificationSettings>({
    autoShare: true,
    includeDetailedAnalysis: true,
    notifyOnAchievements: true,
    notifyOnImprovement: true,
    notifyOnDecline: false,
  });

  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Find relevant teachers based on subject
  const relevantTeachers = MOCK_TEACHERS.filter(teacher => 
    teacher.subject.toLowerCase().includes(examResult.subject.toLowerCase()) ||
    teacher.subject === 'General Studies'
  );

  const handleSendToTeacher = async () => {
    if (!selectedTeacher) {
      Alert.alert('Select Teacher', 'Please select a teacher to send the results to.');
      return;
    }

    setIsSending(true);
    try {
      await onSendToTeacher(selectedTeacher, settings);
      
      const teacher = relevantTeachers.find(t => t.id === selectedTeacher);
      Alert.alert(
        'Sent Successfully! 📊',
        `Your exam results have been sent to ${teacher?.name}'s dashboard.`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Send Failed',
        'Could not send results to teacher dashboard. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSending(false);
    }
  };

  const getPerformanceStatus = () => {
    const currentScore = examResult.percentage;
    const previousScore = examResult.previousAttemptScore;
    
    if (!previousScore) return { status: 'first-attempt', color: tokens.colors.primary };
    
    const improvement = currentScore - previousScore;
    if (improvement > 10) return { status: 'significant-improvement', color: tokens.colors.success };
    if (improvement > 0) return { status: 'improvement', color: tokens.colors.success };
    if (improvement < -10) return { status: 'significant-decline', color: tokens.colors.error };
    if (improvement < 0) return { status: 'decline', color: tokens.colors.warning };
    return { status: 'stable', color: tokens.colors.primary };
  };

  const performanceStatus = getPerformanceStatus();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: tokens.colors.outline }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tokens.colors.onSurface }]}>
            Send to Teacher Dashboard
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Result Summary */}
        <View style={styles.resultSummary}>
          <LinearGradient
            colors={[tokens.colors.primaryContainer, tokens.colors.primaryContainer + '80']}
            style={styles.resultCard}
          >
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, { color: tokens.colors.onPrimaryContainer }]}>
                {examResult.examTitle}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: performanceStatus.color + '20' }]}>
                <Text style={[styles.statusText, { color: performanceStatus.color }]}>
                  {performanceStatus.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            </View>
            
            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={[styles.resultStatValue, { color: tokens.colors.onPrimaryContainer }]}>
                  {examResult.percentage}%
                </Text>
                <Text style={[styles.resultStatLabel, { color: tokens.colors.onPrimaryContainer + 'CC' }]}>
                  Score
                </Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={[styles.resultStatValue, { color: tokens.colors.onPrimaryContainer }]}>
                  {examResult.correctAnswers}/{examResult.totalQuestions}
                </Text>
                <Text style={[styles.resultStatLabel, { color: tokens.colors.onPrimaryContainer + 'CC' }]}>
                  Correct
                </Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={[styles.resultStatValue, { color: tokens.colors.onPrimaryContainer }]}>
                  {Math.floor(examResult.timeSpent / 60)}m
                </Text>
                <Text style={[styles.resultStatLabel, { color: tokens.colors.onPrimaryContainer + 'CC' }]}>
                  Time
                </Text>
              </View>
            </View>

            {examResult.achievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={[styles.achievementsTitle, { color: tokens.colors.onPrimaryContainer }]}>
                  🏆 Achievements Unlocked
                </Text>
                <Text style={[styles.achievementsText, { color: tokens.colors.onPrimaryContainer + 'CC' }]}>
                  {examResult.achievements.join(', ')}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Teacher Selection */}
        <View style={styles.teacherSelection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.onSurface }]}>
            Select Teacher
          </Text>
          {relevantTeachers.map((teacher) => (
            <TouchableOpacity
              key={teacher.id}
              style={[
                styles.teacherCard,
                selectedTeacher === teacher.id && styles.selectedTeacherCard,
                { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.outline }
              ]}
              onPress={() => setSelectedTeacher(teacher.id)}
            >
              <View style={styles.teacherInfo}>
                <Text style={[styles.teacherName, { color: tokens.colors.onSurface }]}>
                  {teacher.name}
                </Text>
                <Text style={[styles.teacherSubject, { color: tokens.colors.onSurfaceVariant }]}>
                  {teacher.subject} • {teacher.email}
                </Text>
              </View>
              {selectedTeacher === teacher.id && (
                <Ionicons name="checkmark-circle" size={20} color={tokens.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.onSurface }]}>
            Sharing Options
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                Include Detailed Analysis
              </Text>
              <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                Question-by-question breakdown and performance insights
              </Text>
            </View>
            <Switch
              value={settings.includeDetailedAnalysis}
              onValueChange={(value) => setSettings(prev => ({ ...prev, includeDetailedAnalysis: value }))}
              trackColor={{ false: tokens.colors.outline, true: tokens.colors.primary + '50' }}
              thumbColor={settings.includeDetailedAnalysis ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                Achievement Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                Alert teacher when new achievements are unlocked
              </Text>
            </View>
            <Switch
              value={settings.notifyOnAchievements}
              onValueChange={(value) => setSettings(prev => ({ ...prev, notifyOnAchievements: value }))}
              trackColor={{ false: tokens.colors.outline, true: tokens.colors.primary + '50' }}
              thumbColor={settings.notifyOnAchievements ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                Performance Improvement Alerts
              </Text>
              <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                Notify when scores improve significantly
              </Text>
            </View>
            <Switch
              value={settings.notifyOnImprovement}
              onValueChange={(value) => setSettings(prev => ({ ...prev, notifyOnImprovement: value }))}
              trackColor={{ false: tokens.colors.outline, true: tokens.colors.success + '50' }}
              thumbColor={settings.notifyOnImprovement ? tokens.colors.success : tokens.colors.onSurfaceVariant}
            />
          </View>
        </View>

        {/* Send Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendToTeacher}
            disabled={!selectedTeacher || isSending}
          >
            <LinearGradient
              colors={
                !selectedTeacher || isSending
                  ? [tokens.colors.outline, tokens.colors.outline]
                  : [tokens.colors.primary, tokens.colors.primaryLight]
              }
              style={styles.sendButtonGradient}
            >
              {isSending ? (
                <Text style={styles.sendButtonText}>Sending...</Text>
              ) : (
                <>
                  <Ionicons name="send" size={16} color="white" />
                  <Text style={styles.sendButtonText}>Send to Dashboard</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  resultSummary: {
    padding: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  resultStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  achievementsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementsText: {
    fontSize: 12,
    lineHeight: 16,
  },
  teacherSelection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedTeacherCard: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '10',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  teacherSubject: {
    fontSize: 14,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.outline + '30',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  actionSection: {
    padding: 20,
    paddingTop: 0,
  },
  sendButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});