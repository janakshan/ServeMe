import {
  useServiceTheme,
  useThemedStyles,
} from "@/contexts/ServiceThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MOCK_COURSES = [
  {
    id: "1",
    title: "React Native Development",
    description: "Learn to build mobile apps with React Native",
    instructor: "John Smith",
    duration: "10 hours",
    level: "intermediate",
    price: 99.99,
    rating: 4.8,
    studentsCount: 1250,
    category: "Programming",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    description: "Master the basics of user interface design",
    instructor: "Sarah Johnson",
    duration: "8 hours",
    level: "beginner",
    price: 79.99,
    rating: 4.6,
    studentsCount: 890,
    category: "Design",
    isEnrolled: true,
    progress: 65,
  },
  {
    id: "3",
    title: "JavaScript Advanced Concepts",
    description: "Deep dive into advanced JavaScript programming",
    instructor: "Mike Chen",
    duration: "12 hours",
    level: "advanced",
    price: 129.99,
    rating: 4.9,
    studentsCount: 756,
    category: "Programming",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "4",
    title: "Digital Marketing Strategy",
    description: "Complete guide to digital marketing",
    instructor: "Emily Davis",
    duration: "6 hours",
    level: "beginner",
    price: 59.99,
    rating: 4.4,
    studentsCount: 1180,
    category: "Business",
    isEnrolled: true,
    progress: 30,
  },
  {
    id: "5",
    title: "Python Data Science",
    description: "Data analysis and visualization with Python",
    instructor: "David Wilson",
    duration: "15 hours",
    level: "intermediate",
    price: 149.99,
    rating: 4.7,
    studentsCount: 923,
    category: "Programming",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "6",
    title: "Graphic Design Mastery",
    description: "Professional graphic design techniques",
    instructor: "Lisa Thompson",
    duration: "9 hours",
    level: "intermediate",
    price: 89.99,
    rating: 4.5,
    studentsCount: 672,
    category: "Design",
    isEnrolled: false,
    progress: 0,
  },
];

const CATEGORIES = ["All", "Programming", "Design", "Business"];

interface CourseCardProps {
  course: any;
  onPress: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const styles = useThemedStyles(createCourseCardStyles);
  const { tokens } = useServiceTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return tokens.colors.success;
      case "intermediate":
        return tokens.colors.warning;
      case "advanced":
        return tokens.colors.error;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{course.category}</Text>
        </View>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelColor(course.level) },
          ]}
        >
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
      </View>

      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>

      <View style={styles.instructorRow}>
        <Ionicons
          name="person"
          size={16}
          color={tokens.colors.onSurfaceVariant}
        />
        <Text style={styles.instructor}>{course.instructor}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="time"
            size={16}
            color={tokens.colors.onSurfaceVariant}
          />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={16} color={tokens.colors.warning} />
          <Text style={styles.metaText}>{course.rating}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons
            name="people"
            size={16}
            color={tokens.colors.onSurfaceVariant}
          />
          <Text style={styles.metaText}>{course.studentsCount}</Text>
        </View>
      </View>

      {course.isEnrolled ? (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${course.progress}%`,
                  backgroundColor: tokens.colors.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{course.progress}% Complete</Text>
        </View>
      ) : (
        <View style={styles.priceSection}>
          <Text style={styles.price}>${course.price}</Text>
          <TouchableOpacity style={styles.enrollButton}>
            <Text style={styles.enrollText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function CoursesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const styles = useThemedStyles(createStyles);
  const { tokens } = useServiceTheme();

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCoursePress = (courseId: string) => {
    Alert.alert(
      "Course Details",
      "Course detail view will be implemented soon!",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={tokens.colors.onSurfaceVariant}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
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
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "All Courses"
              : `${selectedCategory} Courses`}
          </Text>
          <Text style={styles.courseCount}>
            {filteredCourses.length} courses
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.coursesContainer}
        showsVerticalScrollIndicator={false}
      >

        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={handleCoursePress}
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
    categoriesContainer: {
      backgroundColor: tokens.colors.surface,
    },
    categoriesContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
    },
    categoryButton: {
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
    categoryButtonActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    categoryButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: "500",
    },
    categoryButtonTextActive: {
      color: tokens.colors.onPrimary,
    },
    coursesContainer: {
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
    courseCount: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
  });

const createCourseCardStyles = (tokens: any) =>
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
    categoryBadge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    categoryText: {
      fontSize: tokens.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    levelBadge: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    levelText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
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
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    progressSection: {
      marginTop: tokens.spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
      marginBottom: tokens.spacing.xs,
    },
    progressFill: {
      height: "100%",
      borderRadius: tokens.borderRadius.sm,
    },
    progressText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      textAlign: "center",
    },
    priceSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: tokens.spacing.sm,
    },
    price: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
    },
    enrollButton: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
    },
    enrollText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
  });
