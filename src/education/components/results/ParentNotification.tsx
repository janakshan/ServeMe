import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

interface ParentContact {
  id: string;
  name: string;
  relationship: 'mother' | 'father' | 'guardian';
  email: string;
  phone: string;
  preferredContact: 'email' | 'sms' | 'both';
}

interface ParentNotificationSettings {
  notifyOnCompletion: boolean;
  notifyOnAchievements: boolean;
  notifyOnImprovement: boolean;
  notifyOnStreak: boolean;
  includeDetailedReport: boolean;
  weeklyProgressSummary: boolean;
}

interface ParentNotificationProps {
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
    streak: number;
    previousBestScore?: number;
  };
  onSendToParents: (settings: ParentNotificationSettings, selectedParents: string[]) => void;
}

// Mock parent data
const MOCK_PARENTS: ParentContact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    relationship: 'mother',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    preferredContact: 'both'
  },
  {
    id: '2',
    name: 'David Johnson',
    relationship: 'father',
    email: 'david.johnson@email.com', 
    phone: '+1-555-0124',
    preferredContact: 'email'
  },
  {
    id: '3',
    name: 'Mary Chen',
    relationship: 'guardian',
    email: 'mary.chen@email.com',
    phone: '+1-555-0125',
    preferredContact: 'sms'
  }
];

export const ParentNotification: React.FC<ParentNotificationProps> = ({
  visible,
  onClose,
  examResult,
  onSendToParents,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const [settings, setSettings] = useState<ParentNotificationSettings>({
    notifyOnCompletion: true,
    notifyOnAchievements: true,
    notifyOnImprovement: true,
    notifyOnStreak: true,
    includeDetailedReport: false,
    weeklyProgressSummary: true,
  });

  const [selectedParents, setSelectedParents] = useState<string[]>(['1']); // Default to first parent
  const [isSending, setIsSending] = useState(false);

  const handleParentToggle = (parentId: string) => {
    setSelectedParents(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
  };

  const handleSendNotification = async () => {
    if (selectedParents.length === 0) {
      Alert.alert('Select Parents', 'Please select at least one parent to notify.');
      return;
    }

    setIsSending(true);
    try {
      await onSendToParents(settings, selectedParents);
      
      const parentNames = MOCK_PARENTS
        .filter(p => selectedParents.includes(p.id))
        .map(p => p.name)
        .join(', ');
      
      Alert.alert(
        'Sent Successfully! 📱',
        `Achievement notification sent to ${parentNames}.`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Send Failed',
        'Could not send parent notification. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSending(false);
    }
  };

  const getPerformanceMessage = () => {
    const { percentage, previousBestScore, achievements, streak } = examResult;
    
    if (achievements.length > 0) {
      return `🏆 Amazing! New achievements unlocked: ${achievements.join(', ')}`;
    }
    
    if (previousBestScore && percentage > previousBestScore) {
      const improvement = percentage - previousBestScore;
      return `📈 Great improvement! ${improvement.toFixed(1)}% better than previous best`;
    }
    
    if (percentage >= 90) {
      return `🎯 Outstanding performance! ${percentage}% score achieved`;
    }
    
    if (percentage >= 75) {
      return `⭐ Great job! Strong ${percentage}% performance`;
    }
    
    if (streak >= 5) {
      return `🔥 Consistent learning! ${streak}-day study streak maintained`;
    }
    
    return `📚 Exam completed with ${percentage}% score`;
  };

  const getRelationshipEmoji = (relationship: string) => {
    switch (relationship) {
      case 'mother': return '👩‍👧‍👦';
      case 'father': return '👨‍👧‍👦';
      case 'guardian': return '👤';
      default: return '👤';
    }
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return 'mail';
      case 'sms': return 'chatbubble';
      case 'both': return 'notifications';
      default: return 'notifications';
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: tokens.colors.outline }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={tokens.colors.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: tokens.colors.onSurface }]}>
              Share with Parents
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Achievement Summary */}
          <View style={styles.achievementSummary}>
            <LinearGradient
              colors={[tokens.colors.successContainer, tokens.colors.successContainer + '80']}
              style={styles.summaryCard}
            >
              <Text style={[styles.performanceMessage, { color: tokens.colors.onSuccessContainer }]}>
                {getPerformanceMessage()}
              </Text>
              
              <View style={styles.examDetails}>
                <Text style={[styles.examTitle, { color: tokens.colors.onSuccessContainer }]}>
                  {examResult.examTitle}
                </Text>
                <View style={styles.examStats}>
                  <View style={styles.examStat}>
                    <Text style={[styles.examStatValue, { color: tokens.colors.onSuccessContainer }]}>
                      {examResult.percentage}%
                    </Text>
                    <Text style={[styles.examStatLabel, { color: tokens.colors.onSuccessContainer + 'CC' }]}>
                      Score
                    </Text>
                  </View>
                  <View style={styles.examStat}>
                    <Text style={[styles.examStatValue, { color: tokens.colors.onSuccessContainer }]}>
                      {examResult.correctAnswers}/{examResult.totalQuestions}
                    </Text>
                    <Text style={[styles.examStatLabel, { color: tokens.colors.onSuccessContainer + 'CC' }]}>
                      Correct
                    </Text>
                  </View>
                  <View style={styles.examStat}>
                    <Text style={[styles.examStatValue, { color: tokens.colors.onSuccessContainer }]}>
                      {examResult.streak}
                    </Text>
                    <Text style={[styles.examStatLabel, { color: tokens.colors.onSuccessContainer + 'CC' }]}>
                      Day Streak
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Parent Selection */}
          <View style={styles.parentSelection}>
            <Text style={[styles.sectionTitle, { color: tokens.colors.onSurface }]}>
              Select Parents to Notify
            </Text>
            {MOCK_PARENTS.map((parent) => (
              <TouchableOpacity
                key={parent.id}
                style={[
                  styles.parentCard,
                  selectedParents.includes(parent.id) && styles.selectedParentCard,
                  { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.outline }
                ]}
                onPress={() => handleParentToggle(parent.id)}
              >
                <View style={styles.parentInfo}>
                  <View style={styles.parentHeader}>
                    <Text style={styles.parentEmoji}>{getRelationshipEmoji(parent.relationship)}</Text>
                    <View style={styles.parentDetails}>
                      <Text style={[styles.parentName, { color: tokens.colors.onSurface }]}>
                        {parent.name}
                      </Text>
                      <Text style={[styles.parentRelationship, { color: tokens.colors.onSurfaceVariant }]}>
                        {parent.relationship.charAt(0).toUpperCase() + parent.relationship.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactMethod}>
                      <Ionicons 
                        name={getContactMethodIcon(parent.preferredContact) as any} 
                        size={14} 
                        color={tokens.colors.primary} 
                      />
                      <Text style={[styles.contactText, { color: tokens.colors.onSurfaceVariant }]}>
                        {parent.preferredContact}
                      </Text>
                    </View>
                    <Text style={[styles.contactDetail, { color: tokens.colors.onSurfaceVariant }]}>
                      {parent.email}
                    </Text>
                  </View>
                </View>
                {selectedParents.includes(parent.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={tokens.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Notification Settings */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: tokens.colors.onSurface }]}>
              Notification Preferences
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                  Achievement Alerts
                </Text>
                <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                  Notify when new badges or achievements are unlocked
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
                  Performance Improvements
                </Text>
                <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                  Alert when scores improve from previous attempts
                </Text>
              </View>
              <Switch
                value={settings.notifyOnImprovement}
                onValueChange={(value) => setSettings(prev => ({ ...prev, notifyOnImprovement: value }))}
                trackColor={{ false: tokens.colors.outline, true: tokens.colors.success + '50' }}
                thumbColor={settings.notifyOnImprovement ? tokens.colors.success : tokens.colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                  Study Streak Milestones
                </Text>
                <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                  Celebrate consistent daily learning habits
                </Text>
              </View>
              <Switch
                value={settings.notifyOnStreak}
                onValueChange={(value) => setSettings(prev => ({ ...prev, notifyOnStreak: value }))}
                trackColor={{ false: tokens.colors.outline, true: tokens.colors.warning + '50' }}
                thumbColor={settings.notifyOnStreak ? tokens.colors.warning : tokens.colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                  Detailed Progress Report
                </Text>
                <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                  Include question-by-question analysis and learning insights
                </Text>
              </View>
              <Switch
                value={settings.includeDetailedReport}
                onValueChange={(value) => setSettings(prev => ({ ...prev, includeDetailedReport: value }))}
                trackColor={{ false: tokens.colors.outline, true: tokens.colors.primary + '50' }}
                thumbColor={settings.includeDetailedReport ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: tokens.colors.onSurface }]}>
                  Weekly Progress Summary
                </Text>
                <Text style={[styles.settingDescription, { color: tokens.colors.onSurfaceVariant }]}>
                  Send comprehensive weekly learning progress reports
                </Text>
              </View>
              <Switch
                value={settings.weeklyProgressSummary}
                onValueChange={(value) => setSettings(prev => ({ ...prev, weeklyProgressSummary: value }))}
                trackColor={{ false: tokens.colors.outline, true: tokens.colors.primary + '50' }}
                thumbColor={settings.weeklyProgressSummary ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
              />
            </View>
          </View>
        </ScrollView>

        {/* Send Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendNotification}
            disabled={selectedParents.length === 0 || isSending}
          >
            <LinearGradient
              colors={
                selectedParents.length === 0 || isSending
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
                  <Text style={styles.sendButtonText}>
                    Send to {selectedParents.length} Parent{selectedParents.length !== 1 ? 's' : ''}
                  </Text>
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
  achievementSummary: {
    padding: 20,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
  },
  performanceMessage: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  examDetails: {
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  examStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  examStat: {
    alignItems: 'center',
  },
  examStatValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  examStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  parentSelection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  parentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedParentCard: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '10',
  },
  parentInfo: {
    flex: 1,
  },
  parentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parentEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  parentDetails: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  parentRelationship: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  contactInfo: {
    marginLeft: 36,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contactDetail: {
    fontSize: 12,
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