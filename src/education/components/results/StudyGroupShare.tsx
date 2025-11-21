import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

interface StudyGroupMember {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  members: StudyGroupMember[];
  description: string;
}

interface StudyGroupShareProps {
  visible: boolean;
  onClose: () => void;
  examResult: {
    examTitle: string;
    percentage: number;
    score: number;
    timeSpent: number;
    achievements: string[];
  };
  onShareWithGroup: (groupId: string, message?: string) => void;
}

// Mock study groups data
const MOCK_STUDY_GROUPS: StudyGroup[] = [
  {
    id: '1',
    name: 'Math Champions',
    description: 'Advanced Mathematics Study Group',
    members: [
      { id: '1', name: 'Alex Chen', isOnline: true },
      { id: '2', name: 'Sarah Kim', isOnline: false },
      { id: '3', name: 'Mike Johnson', isOnline: true },
    ]
  },
  {
    id: '2',
    name: 'Science Squad',
    description: 'Physics & Chemistry Focus',
    members: [
      { id: '4', name: 'Emma Davis', isOnline: true },
      { id: '5', name: 'Ryan Park', isOnline: true },
    ]
  },
  {
    id: '3',
    name: 'Study Buddies',
    description: 'General Study Support',
    members: [
      { id: '6', name: 'Lisa Zhang', isOnline: false },
      { id: '7', name: 'Tom Wilson', isOnline: true },
      { id: '8', name: 'Amy Lopez', isOnline: true },
    ]
  }
];

export const StudyGroupShare: React.FC<StudyGroupShareProps> = ({
  visible,
  onClose,
  examResult,
  onShareWithGroup,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (groupId: string) => {
    setIsSharing(true);
    try {
      const defaultMessage = `Just completed "${examResult.examTitle}" with ${examResult.percentage}% score! ${examResult.achievements.length > 0 ? `Unlocked: ${examResult.achievements.join(', ')}` : ''}`;
      
      const finalMessage = customMessage.trim() || defaultMessage;
      
      await onShareWithGroup(groupId, finalMessage);
      
      Alert.alert(
        'Shared Successfully! 🎉',
        'Your results have been shared with the study group.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Sharing Failed',
        'Could not share with study group. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const renderStudyGroup = ({ item }: { item: StudyGroup }) => (
    <TouchableOpacity
      style={[
        styles.groupCard,
        selectedGroup === item.id && styles.selectedGroupCard
      ]}
      onPress={() => setSelectedGroup(selectedGroup === item.id ? null : item.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          selectedGroup === item.id
            ? [tokens.colors.primary + '20', tokens.colors.primary + '10']
            : [tokens.colors.surface, tokens.colors.surfaceVariant + '50']
        }
        style={styles.groupCardGradient}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupInfo}>
            <Text style={[styles.groupName, { color: tokens.colors.onSurface }]}>
              {item.name}
            </Text>
            <Text style={[styles.groupDescription, { color: tokens.colors.onSurfaceVariant }]}>
              {item.description}
            </Text>
          </View>
          <View style={styles.groupStats}>
            <View style={styles.memberCount}>
              <Ionicons name="people" size={16} color={tokens.colors.primary} />
              <Text style={[styles.memberCountText, { color: tokens.colors.primary }]}>
                {item.members.length}
              </Text>
            </View>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={[styles.onlineText, { color: tokens.colors.success }]}>
                {item.members.filter(m => m.isOnline).length} online
              </Text>
            </View>
          </View>
        </View>

        {selectedGroup === item.id && (
          <View style={styles.groupActions}>
            <TextInput
              style={[styles.messageInput, { 
                backgroundColor: tokens.colors.background,
                borderColor: tokens.colors.outline,
                color: tokens.colors.onBackground
              }]}
              placeholder={`Share your ${examResult.percentage}% achievement with ${item.name}...`}
              placeholderTextColor={tokens.colors.onSurfaceVariant}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              maxLength={200}
            />
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare(item.id)}
              disabled={isSharing}
            >
              <LinearGradient
                colors={[tokens.colors.primary, tokens.colors.primaryLight]}
                style={styles.shareButtonGradient}
              >
                {isSharing ? (
                  <Text style={styles.shareButtonText}>Sharing...</Text>
                ) : (
                  <>
                    <Ionicons name="share" size={16} color={tokens.colors.onPrimary} />
                    <Text style={styles.shareButtonText}>Share Result</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

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
            Share with Study Group
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Result Summary */}
        <View style={styles.resultSummary}>
          <LinearGradient
            colors={[tokens.colors.primaryContainer, tokens.colors.primaryContainer + '80']}
            style={styles.resultCard}
          >
            <Text style={[styles.resultTitle, { color: tokens.colors.onPrimaryContainer }]}>
              {examResult.examTitle}
            </Text>
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
                  {Math.floor(examResult.timeSpent / 60)}m
                </Text>
                <Text style={[styles.resultStatLabel, { color: tokens.colors.onPrimaryContainer + 'CC' }]}>
                  Time
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Study Groups List */}
        <View style={styles.groupsList}>
          <Text style={[styles.groupsListTitle, { color: tokens.colors.onSurface }]}>
            Choose a Study Group
          </Text>
          <FlatList
            data={MOCK_STUDY_GROUPS}
            renderItem={renderStudyGroup}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.groupsListContent}
          />
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
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  groupsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  groupsListContent: {
    paddingBottom: 20,
  },
  groupCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedGroupCard: {
    transform: [{ scale: 1.02 }],
  },
  groupCardGradient: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  groupDescription: {
    fontSize: 14,
  },
  groupStats: {
    alignItems: 'flex-end',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  memberCountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '500',
  },
  groupActions: {
    marginTop: 16,
    gap: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});