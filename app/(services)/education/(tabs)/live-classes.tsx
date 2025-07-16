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
import { EducationHeader, EducationScreenHeader } from "../components/headers";

const MOCK_LIVE_CLASSES = [
  {
    id: "1",
    title: "O/L Mathematics - Algebra Problem Solving",
    instructor: "Ravi Shankar",
    subject: "Mathematics",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 85,
    maxStudents: 100,
    description: "Interactive session on solving complex algebra problems for O/L examination.",
    isRegistered: true,
  },
  {
    id: "2",
    title: "A/L Biology - Human Physiology",
    instructor: "Dr. Priya Rajendran",
    subject: "Science",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: "1.5 hours",
    status: "live",
    studentsCount: 68,
    maxStudents: 75,
    description: "Live demonstration of human circulatory and respiratory systems.",
    isRegistered: true,
  },
  {
    id: "3",
    title: "Tamil Literature - Modern Poetry Analysis",
    instructor: "Suresh Kandasamy",
    subject: "Languages",
    date: "2024-01-16",
    time: "11:00 AM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 45,
    maxStudents: 50,
    description: "Analysis of modern Tamil poetry for O/L and A/L students.",
    isRegistered: false,
  },
  {
    id: "4",
    title: "Sri Lankan History - Colonial Period",
    instructor: "Prof. Mythili Rajasingam",
    subject: "Social Studies",
    date: "2024-01-16",
    time: "4:00 PM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 92,
    maxStudents: 120,
    description: "Comprehensive review of Sri Lankan colonial history for O/L students.",
    isRegistered: true,
  },
  {
    id: "5",
    title: "A/L Physics - Mechanics and Motion",
    instructor: "Dr. Krishnan Nadarajah",
    subject: "Science",
    date: "2024-01-17",
    time: "9:00 AM",
    duration: "2.5 hours",
    status: "upcoming",
    studentsCount: 55,
    maxStudents: 60,
    description: "Advanced mechanics concepts with practical problem-solving for A/L Physics.",
    isRegistered: false,
  },
  {
    id: "6",
    title: "O/L Science - Chemistry Practicals",
    instructor: "Dr. Kamala Thanabalasingham",
    subject: "Science",
    date: "2024-01-14",
    time: "3:00 PM",
    duration: "1.5 hours",
    status: "completed",
    studentsCount: 72,
    maxStudents: 80,
    description: "Virtual chemistry laboratory session for O/L Science students.",
    isRegistered: true,
  },
  {
    id: "7",
    title: "English Language - Essay Writing Techniques",
    instructor: "Geetha Mahendran",
    subject: "Languages",
    date: "2024-01-13",
    time: "1:00 PM",
    duration: "2 hours",
    status: "completed",
    studentsCount: 110,
    maxStudents: 120,
    description: "Advanced essay writing techniques for O/L and A/L English examinations.",
    isRegistered: false,
  },
  {
    id: "8",
    title: "A/L Combined Mathematics - Calculus",
    instructor: "Prof. Murugesan Sivasubramaniam",
    subject: "Mathematics",
    date: "2024-01-18",
    time: "10:00 AM",
    duration: "3 hours",
    status: "upcoming",
    studentsCount: 48,
    maxStudents: 50,
    description: "Advanced calculus concepts and applications for A/L Mathematics stream.",
    isRegistered: true,
  },
];

const STATUS_FILTERS = ["All", "Live", "Upcoming", "Completed"];

interface LiveClassCardProps {
  liveClass: any;
  onPress: (classId: string) => void;
}

const LiveClassCard: React.FC<LiveClassCardProps> = ({ liveClass, onPress }) => {
  const styles = useThemedStyles(createClassCardStyles);
  const { tokens } = useServiceTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return tokens.colors.error;
      case "upcoming":
        return tokens.colors.primary;
      case "completed":
        return tokens.colors.success;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "🔴 Live Now";
      case "upcoming":
        return "📅 Upcoming";
      case "completed":
        return "✅ Completed";
      default:
        return status;
    }
  };

  const getActionButton = () => {
    if (liveClass.status === "live") {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.joinButton]}>
          <Text style={styles.joinButtonText}>Join Now</Text>
        </TouchableOpacity>
      );
    }
    
    if (liveClass.status === "upcoming") {
      return liveClass.isRegistered ? (
        <TouchableOpacity style={[styles.actionButton, styles.registeredButton]}>
          <Ionicons name="checkmark" size={16} color={tokens.colors.success} />
          <Text style={styles.registeredButtonText}>Registered</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.actionButton, styles.registerButton]}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      );
    }
    
    if (liveClass.status === "completed") {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.watchButton]}>
          <Ionicons name="play" size={16} color={tokens.colors.primary} />
          <Text style={styles.watchButtonText}>Watch Recording</Text>
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(liveClass.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(liveClass.status) }]}>
            {getStatusText(liveClass.status)}
          </Text>
        </View>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{liveClass.subject}</Text>
        </View>
      </View>

      <Text style={styles.title}>{liveClass.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {liveClass.description}
      </Text>

      <View style={styles.instructorRow}>
        <Ionicons name="person" size={16} color={tokens.colors.onSurfaceVariant} />
        <Text style={styles.instructor}>{liveClass.instructor}</Text>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Ionicons name="calendar" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.date}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="time" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.time}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="hourglass" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.duration}</Text>
        </View>
      </View>

      <View style={styles.studentsRow}>
        <View style={styles.studentsInfo}>
          <Ionicons name="people" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.studentsText}>
            {liveClass.studentsCount}/{liveClass.maxStudents} students
          </Text>
        </View>
        <View style={styles.studentsProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(liveClass.studentsCount / liveClass.maxStudents) * 100}%`,
                  backgroundColor: tokens.colors.primary,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {getActionButton()}
      </View>
    </TouchableOpacity>
  );
};

export default function LiveClassesScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const filteredClasses = MOCK_LIVE_CLASSES.filter(liveClass => {
    if (selectedFilter === "All") return true;
    return liveClass.status === selectedFilter.toLowerCase();
  });

  const handleClassPress = (classId: string) => {
    Alert.alert(
      "Live Class",
      "Class details and interaction features will be implemented soon!",
      [{ text: "OK" }]
    );
  };

  const liveClassesCount = MOCK_LIVE_CLASSES.filter(c => c.status === "live").length;
  const upcomingClassesCount = MOCK_LIVE_CLASSES.filter(c => c.status === "upcoming").length;

  return (
    <View style={styles.container}>
      <EducationScreenHeader
        title="Live Classes"
        subtitle="Join live sessions with expert teachers"
        rightAction={{
          icon: "calendar",
          onPress: () => {
            // TODO: Implement schedule action
          },
        }}
      />
      
      <EducationHeader
        variant="live-classes"
        stats={{
          items: [
            {
              id: "live",
              label: "Live Now",
              value: liveClassesCount,
              color: tokens.colors.error,
            },
            {
              id: "upcoming",
              label: "Upcoming",
              value: upcomingClassesCount,
              color: tokens.colors.primary,
            },
            {
              id: "week",
              label: "This Week",
              value: 12,
              color: tokens.colors.success,
            },
          ],
          variant: "cards",
        }}
        filters={{
          options: STATUS_FILTERS.map((filter) => ({
            id: filter,
            label: filter,
            value: filter,
          })),
          selectedValue: selectedFilter,
          onSelect: setSelectedFilter,
        }}
        section={{
          title: selectedFilter === "All" ? "All Classes" : `${selectedFilter} Classes`,
          count: filteredClasses.length,
          countLabel: "classes",
        }}
      />

      <ScrollView
        style={styles.classesContainer}
        showsVerticalScrollIndicator={false}
      >

        {filteredClasses.map((liveClass) => (
          <LiveClassCard
            key={liveClass.id}
            liveClass={liveClass}
            onPress={handleClassPress}
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
    classesContainer: {
      flex: 1,
      paddingHorizontal: tokens.spacing.md,
    },
  });

const createClassCardStyles = (tokens: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.sm,
    },
    statusBadge: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    statusText: {
      fontSize: tokens.typography.caption,
      fontWeight: "600",
    },
    subjectBadge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    subjectText: {
      fontSize: tokens.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    title: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    description: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
    },
    instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
    },
    instructor: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    timeItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    timeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    studentsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    studentsInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    studentsText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    studentsProgress: {
      flex: 1,
    },
    progressBar: {
      height: 4,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
    },
    progressFill: {
      height: "100%",
      borderRadius: tokens.borderRadius.sm,
    },
    actionRow: {
      alignItems: "flex-end",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
    },
    joinButton: {
      backgroundColor: tokens.colors.error,
    },
    joinButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    registerButton: {
      backgroundColor: tokens.colors.primary,
    },
    registerButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    registeredButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: tokens.colors.success,
    },
    registeredButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.success,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
    watchButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
    },
    watchButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
  });