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

const MOCK_LIVE_CLASSES = [
  {
    id: "1",
    title: "React Native Fundamentals",
    instructor: "John Smith",
    subject: "Programming",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 45,
    maxStudents: 50,
    description: "Learn the basics of React Native development with hands-on examples.",
    isRegistered: true,
  },
  {
    id: "2",
    title: "Advanced JavaScript Patterns",
    instructor: "Mike Chen",
    subject: "Programming",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: "1.5 hours",
    status: "live",
    studentsCount: 38,
    maxStudents: 40,
    description: "Deep dive into advanced JavaScript concepts and design patterns.",
    isRegistered: true,
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    instructor: "Sarah Johnson",
    subject: "Design",
    date: "2024-01-16",
    time: "11:00 AM",
    duration: "3 hours",
    status: "upcoming",
    studentsCount: 28,
    maxStudents: 30,
    description: "Interactive workshop on modern UI/UX design principles.",
    isRegistered: false,
  },
  {
    id: "4",
    title: "Digital Marketing Strategies",
    instructor: "Emily Davis",
    subject: "Business",
    date: "2024-01-16",
    time: "4:00 PM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 62,
    maxStudents: 80,
    description: "Learn effective digital marketing strategies for modern businesses.",
    isRegistered: true,
  },
  {
    id: "5",
    title: "Data Analysis with Python",
    instructor: "David Wilson",
    subject: "Data Science",
    date: "2024-01-17",
    time: "9:00 AM",
    duration: "2.5 hours",
    status: "upcoming",
    studentsCount: 35,
    maxStudents: 40,
    description: "Hands-on data analysis using Python and popular libraries.",
    isRegistered: false,
  },
  {
    id: "6",
    title: "Mobile App Testing",
    instructor: "John Smith",
    subject: "Programming",
    date: "2024-01-14",
    time: "3:00 PM",
    duration: "1.5 hours",
    status: "completed",
    studentsCount: 32,
    maxStudents: 35,
    description: "Testing strategies for mobile applications.",
    isRegistered: true,
  },
  {
    id: "7",
    title: "Brand Identity Design",
    instructor: "Lisa Thompson",
    subject: "Design",
    date: "2024-01-13",
    time: "1:00 PM",
    duration: "2 hours",
    status: "completed",
    studentsCount: 25,
    maxStudents: 30,
    description: "Creating memorable brand identities and visual systems.",
    isRegistered: false,
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
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{liveClassesCount}</Text>
          <Text style={styles.statLabel}>Live Now</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{upcomingClassesCount}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {STATUS_FILTERS.map((filter) => (
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === "All" ? "All Classes" : `${selectedFilter} Classes`}
          </Text>
          <Text style={styles.classCount}>
            {filteredClasses.length} classes
          </Text>
        </View>
      </View>

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
    statsSection: {
      flexDirection: "row",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      padding: tokens.spacing.md,
      marginHorizontal: tokens.spacing.xs,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.md,
    },
    statNumber: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.xs,
    },
    statLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
    },
    filtersSection: {
      backgroundColor: tokens.colors.surface,
    },
    filtersContainer: {
      backgroundColor: tokens.colors.surface,
    },
    filtersContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
    },
    filterButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
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
    classesContainer: {
      flex: 1,
      paddingHorizontal: tokens.spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
      backgroundColor: tokens.colors.surface,
      marginTop: tokens.spacing.sm,
    },
    sectionTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    classCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
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