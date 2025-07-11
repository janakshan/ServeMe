import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

const MOCK_LEADERBOARD_DATA = [
  {
    id: "1",
    name: "Kavitha Perera",
    avatar: "KP",
    totalScore: 2845,
    examsPassed: 12,
    averageScore: 89.2,
    rank: 1,
    badges: ["🏆", "🎯", "⭐"],
    streak: 8,
    subject: "Mathematics",
    isCurrentUser: false,
  },
  {
    id: "2",
    name: "Ravindu Silva",
    avatar: "RS",
    totalScore: 2730,
    examsPassed: 11,
    averageScore: 87.8,
    rank: 2,
    badges: ["🥈", "🎯", "📚"],
    streak: 6,
    subject: "Science",
    isCurrentUser: false,
  },
  {
    id: "3",
    name: "Hansika Fernando",
    avatar: "HF",
    totalScore: 2650,
    examsPassed: 10,
    averageScore: 86.5,
    rank: 3,
    badges: ["🥉", "🔥", "💡"],
    streak: 5,
    subject: "Languages",
    isCurrentUser: false,
  },
  {
    id: "4",
    name: "Thilina Rajapaksha",
    avatar: "TR",
    totalScore: 2580,
    examsPassed: 9,
    averageScore: 85.3,
    rank: 4,
    badges: ["🎯", "📈"],
    streak: 4,
    subject: "Social Studies",
    isCurrentUser: false,
  },
  {
    id: "5",
    name: "Dilani Wickramasinghe",
    avatar: "DW",
    totalScore: 2520,
    examsPassed: 8,
    averageScore: 84.7,
    rank: 5,
    badges: ["🔥", "💎"],
    streak: 7,
    subject: "Science",
    isCurrentUser: false,
  },
  {
    id: "6",
    name: "Chamara Bandara",
    avatar: "CB",
    totalScore: 2460,
    examsPassed: 8,
    averageScore: 82.9,
    rank: 6,
    badges: ["🎨", "⭐"],
    streak: 3,
    subject: "Mathematics",
    isCurrentUser: false,
  },
  {
    id: "7",
    name: "Malka Jayawardena",
    avatar: "MJ",
    totalScore: 2390,
    examsPassed: 7,
    averageScore: 81.4,
    rank: 7,
    badges: ["📚", "💡"],
    streak: 2,
    subject: "Languages",
    isCurrentUser: false,
  },
  {
    id: "8",
    name: "You",
    avatar: "YU",
    totalScore: 2320,
    examsPassed: 6,
    averageScore: 79.8,
    rank: 8,
    badges: ["🚀", "🎯"],
    streak: 3,
    subject: "Mathematics",
    isCurrentUser: true,
  },
  {
    id: "9",
    name: "Saman Gunasekara",
    avatar: "SG",
    totalScore: 2280,
    examsPassed: 6,
    averageScore: 78.5,
    rank: 9,
    badges: ["📈"],
    streak: 2,
    subject: "Social Studies",
    isCurrentUser: false,
  },
  {
    id: "10",
    name: "Nimali Samaraweera",
    avatar: "NS",
    totalScore: 2210,
    examsPassed: 5,
    averageScore: 77.1,
    rank: 10,
    badges: ["💎"],
    streak: 1,
    subject: "Science",
    isCurrentUser: false,
  },
  {
    id: "11",
    name: "Kasun Rathnayake",
    avatar: "KR",
    totalScore: 2180,
    examsPassed: 5,
    averageScore: 76.8,
    rank: 11,
    badges: ["🔥"],
    streak: 4,
    subject: "Languages",
    isCurrentUser: false,
  },
  {
    id: "12",
    name: "Sanduni Jayasekara",
    avatar: "SJ",
    totalScore: 2150,
    examsPassed: 4,
    averageScore: 75.9,
    rank: 12,
    badges: ["⭐"],
    streak: 1,
    subject: "Mathematics",
    isCurrentUser: false,
  },
];

const LEADERBOARD_FILTERS = ["Overall", "Mathematics", "Science", "Languages", "Social Studies"];
const TIME_FILTERS = ["All Time", "This Month", "This Week"];

interface LeaderboardRowProps {
  user: any;
  onPress: (user: any) => void;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, onPress }) => {
  const styles = useThemedStyles(createLeaderboardRowStyles);
  const { tokens } = useServiceTheme();

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}`;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.row,
        user.isCurrentUser && styles.currentUserRow,
        user.rank <= 3 && styles.topThreeRow,
      ]}
      onPress={() => onPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, { color: getRankColor(user.rank) }]}>
          {getRankIcon(user.rank)}
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{user.avatar}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.userName, user.isCurrentUser && styles.currentUserName]}>
          {user.name}
        </Text>
        <View style={styles.userStats}>
          <Text style={styles.statText}>
            {user.examsPassed} exams • {user.averageScore}% avg
          </Text>
          {user.streak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={12} color={tokens.colors.warning} />
              <Text style={styles.streakText}>{user.streak}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.badgesContainer}>
        {user.badges.slice(0, 3).map((badge: string, index: number) => (
          <Text key={index} style={styles.badge}>
            {badge}
          </Text>
        ))}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{user.totalScore}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Overall");
  const [selectedTime, setSelectedTime] = useState("All Time");
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const filteredData = MOCK_LEADERBOARD_DATA.filter(user => {
    if (selectedFilter === "Overall") return true;
    return user.subject === selectedFilter;
  });

  const currentUser = MOCK_LEADERBOARD_DATA.find(user => user.isCurrentUser);

  const handleUserPress = (user: any) => {
    Alert.alert(
      "User Profile",
      `View detailed stats for ${user.name}`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Compete with other learners</Text>
      </View>

      {currentUser && (
        <View style={styles.currentUserCard}>
          <View style={styles.currentUserHeader}>
            <Text style={styles.currentUserTitle}>Your Position</Text>
            <View style={styles.currentUserRank}>
              <Text style={styles.currentUserRankText}>#{currentUser.rank}</Text>
            </View>
          </View>
          <View style={styles.currentUserStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.totalScore}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.examsPassed}</Text>
              <Text style={styles.statLabel}>Exams Passed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.averageScore}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Category:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {LEADERBOARD_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Time Period:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {TIME_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedTime === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedTime(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedTime === filter && styles.filterButtonTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.podiumSection}>
        <View style={styles.podium}>
          {filteredData.slice(0, 3).map((user, index) => (
            <View key={user.id} style={styles.podiumPosition}>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>{user.avatar}</Text>
              </View>
              <Text style={styles.podiumName}>{user.name}</Text>
              <Text style={styles.podiumScore}>{user.totalScore}</Text>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>
                  {user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : "🥉"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.leaderboardContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter} Rankings
          </Text>
          <Text style={styles.participantCount}>
            {filteredData.length} participants
          </Text>
        </View>

        {filteredData.map((user) => (
          <LeaderboardRow
            key={user.id}
            user={user}
            onPress={handleUserPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    headerSection: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    headerSubtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
    },
    currentUserCard: {
      backgroundColor: tokens.colors.primaryContainer,
      margin: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
    },
    currentUserHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    currentUserTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onPrimaryContainer,
    },
    currentUserRank: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.full,
    },
    currentUserRankText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
    },
    currentUserStats: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onPrimaryContainer,
    },
    statLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimaryContainer,
      marginTop: tokens.spacing.xs,
    },
    filtersSection: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    filterLabel: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    filterContainer: {
      marginBottom: tokens.spacing.sm,
    },
    filterButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.full,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
    },
    filterButtonActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    filterButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: "500",
    },
    filterButtonTextActive: {
      color: tokens.colors.onPrimary,
    },
    podiumSection: {
      backgroundColor: tokens.colors.surface,
      paddingVertical: tokens.spacing.md,
    },
    podium: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
      paddingHorizontal: tokens.spacing.md,
    },
    podiumPosition: {
      alignItems: "center",
      flex: 1,
    },
    podiumAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: tokens.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
    },
    podiumAvatarText: {
      fontSize: 20,
      fontWeight: "bold",
      color: tokens.colors.onPrimary,
    },
    podiumName: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: tokens.typography.semiBold,
      marginBottom: tokens.spacing.xs,
      textAlign: "center",
    },
    podiumScore: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    podiumRank: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: tokens.colors.warning,
      justifyContent: "center",
      alignItems: "center",
    },
    podiumRankText: {
      fontSize: 16,
    },
    leaderboardContainer: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    sectionTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    participantCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
  });

const createLeaderboardRowStyles = (tokens: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    currentUserRow: {
      backgroundColor: tokens.colors.primaryContainer,
      borderColor: tokens.colors.primary,
      borderWidth: 2,
    },
    topThreeRow: {
      backgroundColor: tokens.colors.surfaceVariant,
    },
    rankContainer: {
      width: 40,
      alignItems: "center",
      marginRight: tokens.spacing.sm,
    },
    rankText: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: tokens.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    avatarText: {
      fontSize: 14,
      fontWeight: "bold",
      color: tokens.colors.onPrimary,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    currentUserName: {
      color: tokens.colors.onPrimaryContainer,
    },
    userStats: {
      flexDirection: "row",
      alignItems: "center",
    },
    statText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginRight: tokens.spacing.sm,
    },
    streakBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.colors.warningContainer,
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: 2,
      borderRadius: tokens.borderRadius.sm,
    },
    streakText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onWarningContainer,
      marginLeft: 2,
      fontWeight: "600",
    },
    badgesContainer: {
      flexDirection: "row",
      marginRight: tokens.spacing.md,
    },
    badge: {
      fontSize: 16,
      marginRight: tokens.spacing.xs,
    },
    scoreContainer: {
      alignItems: "flex-end",
    },
    scoreText: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
    },
    scoreLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
  });