import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";

const MOCK_TEACHERS = [
  {
    id: "1",
    name: "John Smith",
    specialization: "React Native Development",
    bio: "Senior mobile developer with 8+ years of experience in React Native and cross-platform development.",
    rating: 4.8,
    studentsCount: 2450,
    coursesCount: 5,
    subjects: ["React Native", "JavaScript", "Mobile Development"],
    experience: "8 years",
    location: "San Francisco, CA",
    isFollowed: false,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    specialization: "UI/UX Design",
    bio: "Creative designer passionate about creating intuitive and beautiful user experiences.",
    rating: 4.9,
    studentsCount: 1890,
    coursesCount: 3,
    subjects: ["UI Design", "UX Design", "Figma"],
    experience: "6 years",
    location: "New York, NY",
    isFollowed: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    specialization: "Full Stack Development",
    bio: "Full-stack developer with expertise in modern web technologies and cloud architecture.",
    rating: 4.7,
    studentsCount: 1650,
    coursesCount: 4,
    subjects: ["JavaScript", "Node.js", "React", "AWS"],
    experience: "10 years",
    location: "Seattle, WA",
    isFollowed: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    specialization: "Digital Marketing",
    bio: "Marketing strategist helping businesses grow through digital channels and data-driven insights.",
    rating: 4.6,
    studentsCount: 2180,
    coursesCount: 6,
    subjects: ["SEO", "Social Media", "Analytics", "PPC"],
    experience: "7 years",
    location: "Austin, TX",
    isFollowed: false,
  },
  {
    id: "5",
    name: "David Wilson",
    specialization: "Data Science",
    bio: "Data scientist with expertise in machine learning, statistics, and data visualization.",
    rating: 4.8,
    studentsCount: 1420,
    coursesCount: 3,
    subjects: ["Python", "Machine Learning", "Data Analysis"],
    experience: "9 years",
    location: "Boston, MA",
    isFollowed: true,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    specialization: "Graphic Design",
    bio: "Creative professional specializing in branding, logo design, and visual communication.",
    rating: 4.5,
    studentsCount: 980,
    coursesCount: 4,
    subjects: ["Photoshop", "Illustrator", "Branding", "Typography"],
    experience: "5 years",
    location: "Los Angeles, CA",
    isFollowed: false,
  },
];

const SUBJECT_FILTERS = ["All", "Programming", "Design", "Business", "Data Science"];

interface TeacherCardProps {
  teacher: any;
  onPress: (teacher: any) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onPress }) => {
  const styles = useThemedStyles(createTeacherCardStyles);
  const { tokens } = useServiceTheme();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(teacher)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {teacher.name.split(" ").map((n: string) => n[0]).join("")}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.specialization}>{teacher.specialization}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={tokens.colors.warning} />
            <Text style={styles.rating}>{teacher.rating}</Text>
            <Text style={styles.ratingCount}>({teacher.studentsCount} students)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Ionicons 
            name={teacher.isFollowed ? "heart" : "heart-outline"} 
            size={20} 
            color={teacher.isFollowed ? tokens.colors.error : tokens.colors.onSurfaceVariant} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.bio} numberOfLines={2}>
        {teacher.bio}
      </Text>

      <View style={styles.subjectsContainer}>
        {teacher.subjects.slice(0, 3).map((subject: string, index: number) => (
          <View key={index} style={styles.subjectTag}>
            <Text style={styles.subjectText}>{subject}</Text>
          </View>
        ))}
        {teacher.subjects.length > 3 && (
          <Text style={styles.moreSubjects}>+{teacher.subjects.length - 3} more</Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="book" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.statText}>{teacher.coursesCount} Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.statText}>{teacher.experience}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.statText}>{teacher.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface TeacherModalProps {
  teacher: any;
  visible: boolean;
  onClose: () => void;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ teacher, visible, onClose }) => {
  const styles = useThemedStyles(createModalStyles);
  const { tokens } = useServiceTheme();

  if (!teacher) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Teacher Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.teacherHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {teacher.name.split(" ").map((n: string) => n[0]).join("")}
              </Text>
            </View>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.teacherSpecialization}>{teacher.specialization}</Text>
            
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={20} color={tokens.colors.warning} />
              <Text style={styles.ratingLarge}>{teacher.rating}</Text>
              <Text style={styles.ratingCountLarge}>({teacher.studentsCount} students)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{teacher.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <View style={styles.subjectsGrid}>
              {teacher.subjects.map((subject: string, index: number) => (
                <View key={index} style={styles.subjectTagLarge}>
                  <Text style={styles.subjectTextLarge}>{subject}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="book" size={24} color={tokens.colors.primary} />
                <Text style={styles.statNumber}>{teacher.coursesCount}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color={tokens.colors.primary} />
                <Text style={styles.statNumber}>{teacher.studentsCount}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="time" size={24} color={tokens.colors.primary} />
                <Text style={styles.statNumber}>{teacher.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.followButtonLarge}>
            <Text style={styles.followButtonText}>
              {teacher.isFollowed ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="chatbubble" size={20} color={tokens.colors.primary} />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function TeachersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const filteredTeachers = MOCK_TEACHERS.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "All" || teacher.subjects.some(subject => 
      subject.toLowerCase().includes(selectedFilter.toLowerCase())
    );
    return matchesSearch && matchesFilter;
  });

  const handleTeacherPress = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={tokens.colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teachers..."
            placeholderTextColor={tokens.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {SUBJECT_FILTERS.map((filter) => (
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
            {selectedFilter === "All" ? "All Teachers" : `${selectedFilter} Teachers`}
          </Text>
          <Text style={styles.teacherCount}>
            {filteredTeachers.length} teachers
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.teachersContainer}
        showsVerticalScrollIndicator={false}
      >

        {filteredTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onPress={handleTeacherPress}
          />
        ))}
      </ScrollView>

      <TeacherModal
        teacher={selectedTeacher}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const createStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    searchSection: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.lg,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    searchInput: {
      flex: 1,
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
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
    teachersContainer: {
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
    teacherCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
  });

const createTeacherCardStyles = (tokens: any) =>
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
    header: {
      flexDirection: "row",
      marginBottom: tokens.spacing.md,
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: tokens.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    avatarText: {
      fontSize: 20,
      fontWeight: "bold",
      color: tokens.colors.onPrimary,
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: 2,
    },
    specialization: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    rating: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.xs,
      fontWeight: "600",
    },
    ratingCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    followButton: {
      padding: tokens.spacing.sm,
    },
    bio: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
      lineHeight: 20,
    },
    subjectsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: tokens.spacing.md,
    },
    subjectTag: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      marginRight: tokens.spacing.xs,
      marginBottom: tokens.spacing.xs,
    },
    subjectText: {
      fontSize: tokens.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    moreSubjects: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      alignSelf: "center",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    statText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
  });

const createModalStyles = (tokens: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    title: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    closeButton: {
      padding: tokens.spacing.sm,
    },
    content: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    teacherHeader: {
      alignItems: "center",
      marginBottom: tokens.spacing.xl,
    },
    avatarLarge: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: tokens.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    avatarLargeText: {
      fontSize: 32,
      fontWeight: "bold",
      color: tokens.colors.onPrimary,
    },
    teacherName: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    teacherSpecialization: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
    },
    ratingSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingLarge: {
      fontSize: tokens.typography.subtitle,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.xs,
      fontWeight: "600",
    },
    ratingCountLarge: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    section: {
      marginBottom: tokens.spacing.xl,
    },
    sectionTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.md,
    },
    bio: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 22,
    },
    subjectsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    subjectTagLarge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      marginRight: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
    },
    subjectTextLarge: {
      fontSize: tokens.typography.body,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statCard: {
      alignItems: "center",
      flex: 1,
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      marginHorizontal: tokens.spacing.xs,
    },
    statNumber: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginVertical: tokens.spacing.xs,
    },
    statLabel: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    footer: {
      flexDirection: "row",
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border,
    },
    followButtonLarge: {
      flex: 1,
      backgroundColor: tokens.colors.primary,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      alignItems: "center",
      marginRight: tokens.spacing.sm,
    },
    followButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    messageButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
    },
    messageButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
  });