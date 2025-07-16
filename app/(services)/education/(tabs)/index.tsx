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
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { EducationHeader, EducationScreenHeader } from "@/src/education/components/headers";

const MOCK_COURSES = [
  // Primary Education (Grades 1-5)
  {
    id: "1",
    title: "Tamil Language & Literature - Grade 3",
    description: "Basic Tamil language skills, reading comprehension, and simple literature for primary students",
    instructor: "Priya Subramaniam",
    duration: "3 terms",
    level: "beginner",
    price: 0,
    rating: 4.8,
    studentsCount: 2340,
    category: "Primary Education",
    isEnrolled: true,
    progress: 65,
  },
  {
    id: "2",
    title: "Mathematics - Grade 5",
    description: "Basic arithmetic, geometry, and problem-solving skills for Grade 5 students",
    instructor: "Ravi Shankar",
    duration: "3 terms",
    level: "beginner",
    price: 0,
    rating: 4.7,
    studentsCount: 1890,
    category: "Primary Education",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "3",
    title: "Environmental Studies - Grade 4",
    description: "Introduction to science and social studies through environmental exploration",
    instructor: "Kamala Thanabalasingham",
    duration: "3 terms",
    level: "beginner",
    price: 0,
    rating: 4.6,
    studentsCount: 1560,
    category: "Primary Education",
    isEnrolled: true,
    progress: 45,
  },
  
  // Junior Secondary (Grades 6-9)
  {
    id: "4",
    title: "Science - Grade 8",
    description: "Integrated physics, chemistry, and biology concepts for junior secondary students",
    instructor: "Dr. Priya Rajendran",
    duration: "3 terms",
    level: "intermediate",
    price: 0,
    rating: 4.9,
    studentsCount: 1720,
    category: "Junior Secondary",
    isEnrolled: true,
    progress: 78,
  },
  {
    id: "5",
    title: "History - Grade 9",
    description: "Sri Lankan history and world civilizations for Grade 9 students",
    instructor: "Prof. Mythili Rajasingam",
    duration: "3 terms",
    level: "intermediate",
    price: 0,
    rating: 4.5,
    studentsCount: 1450,
    category: "Junior Secondary",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "6",
    title: "English Language - Grade 7",
    description: "Intermediate English skills including grammar, composition, and literature",
    instructor: "Geetha Mahendran",
    duration: "3 terms",
    level: "intermediate",
    price: 0,
    rating: 4.8,
    studentsCount: 2100,
    category: "Junior Secondary",
    isEnrolled: true,
    progress: 52,
  },
  
  // O/L Preparation (Grades 10-11)
  {
    id: "7",
    title: "O/L Mathematics",
    description: "Advanced mathematics preparation for GCE O/L examination",
    instructor: "Ravi Shankar",
    duration: "2 years",
    level: "advanced",
    price: 15000,
    rating: 4.9,
    studentsCount: 3200,
    category: "O/L Preparation",
    isEnrolled: true,
    progress: 85,
  },
  {
    id: "8",
    title: "O/L Science",
    description: "Integrated physics, chemistry, and biology for O/L examination",
    instructor: "Dr. Kamala Thanabalasingham",
    duration: "2 years",
    level: "advanced",
    price: 18000,
    rating: 4.8,
    studentsCount: 2890,
    category: "O/L Preparation",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "9",
    title: "O/L Tamil Language & Literature",
    description: "Advanced Tamil language skills and literature for O/L examination",
    instructor: "Suresh Kandasamy",
    duration: "2 years",
    level: "advanced",
    price: 12000,
    rating: 4.7,
    studentsCount: 2456,
    category: "O/L Preparation",
    isEnrolled: true,
    progress: 72,
  },
  {
    id: "10",
    title: "O/L Geography",
    description: "Physical and human geography for O/L optional subject",
    instructor: "Nithya Selvakumar",
    duration: "2 years",
    level: "advanced",
    price: 14000,
    rating: 4.6,
    studentsCount: 1680,
    category: "O/L Preparation",
    isEnrolled: false,
    progress: 0,
  },
  
  // A/L Preparation (Grades 12-13)
  {
    id: "11",
    title: "A/L Combined Mathematics",
    description: "Advanced calculus, statistics, and mechanics for A/L Mathematics stream",
    instructor: "Prof. Murugesan Sivasubramaniam",
    duration: "2 years",
    level: "expert",
    price: 25000,
    rating: 4.9,
    studentsCount: 1240,
    category: "A/L Preparation",
    isEnrolled: true,
    progress: 45,
  },
  {
    id: "12",
    title: "A/L Physics",
    description: "Mechanics, electricity, and modern physics for A/L Mathematics stream",
    instructor: "Dr. Krishnan Nadarajah",
    duration: "2 years",
    level: "expert",
    price: 22000,
    rating: 4.8,
    studentsCount: 1180,
    category: "A/L Preparation",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "13",
    title: "A/L Biology",
    description: "Botany, zoology, and human biology for A/L Biological Science stream",
    instructor: "Dr. Priya Rajendran",
    duration: "2 years",
    level: "expert",
    price: 24000,
    rating: 4.9,
    studentsCount: 1560,
    category: "A/L Preparation",
    isEnrolled: true,
    progress: 58,
  },
  {
    id: "14",
    title: "A/L Economics",
    description: "Micro and macroeconomics for A/L Commerce and Arts streams",
    instructor: "Prof. Selvam Ramanathan",
    duration: "2 years",
    level: "expert",
    price: 20000,
    rating: 4.7,
    studentsCount: 980,
    category: "A/L Preparation",
    isEnrolled: false,
    progress: 0,
  },
  {
    id: "15",
    title: "A/L Business Studies",
    description: "Management and entrepreneurship for A/L Commerce stream",
    instructor: "Arun Vijayakumar",
    duration: "2 years",
    level: "expert",
    price: 18000,
    rating: 4.6,
    studentsCount: 750,
    category: "A/L Preparation",
    isEnrolled: true,
    progress: 35,
  },
];

const CATEGORIES = ["All", "Primary Education", "Junior Secondary", "O/L Preparation", "A/L Preparation"];

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
  const { tokens, getGradient } = useServiceTheme();

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

  // Create a subtle gradient background that transitions from header
  const backgroundGradient = getGradient('background');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundGradient.colors}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <EducationScreenHeader
          title="Browse Courses"
          subtitle="Discover quality education for all levels"
          rightAction={{
            icon: "search",
            onPress: () => {
              // TODO: Implement search action
            },
          }}
        />
        
        <View style={styles.contentWrapper}>
          <EducationHeader
            variant="courses"
            search={{
              value: searchQuery,
              onChangeText: setSearchQuery,
              placeholder: "Search courses...",
            }}
            filters={{
              options: CATEGORIES.map((category) => ({
                id: category,
                label: category,
                value: category,
              })),
              selectedValue: selectedCategory,
              onSelect: setSelectedCategory,
            }}
            section={{
              title: selectedCategory === "All" ? "All Courses" : `${selectedCategory} Courses`,
              count: filteredCourses.length,
              countLabel: "courses",
            }}
          />

          <ScrollView
            style={styles.coursesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={handleCoursePress}
              />
            ))}
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSmoothBackgroundColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      return {
        contentBackground: "#F9F2FF", // Light purple tint for content area
      };
    } else if (primaryColor === "#0D47A1") {
      return {
        contentBackground: "#F0F6FF", // Light blue tint for content area
      };
    } else if (primaryColor === "#2E7D32") {
      return {
        contentBackground: "#F2F8F2", // Light green tint for content area
      };
    } else if (primaryColor === "#E91E63") {
      return {
        contentBackground: "#FFF2F7", // Light pink tint for content area
      };
    } else {
      return {
        contentBackground: "#F0F6FF", // Default content background
      };
    }
  };

  const backgroundColors = getSmoothBackgroundColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    gradientBackground: {
      flex: 1,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: backgroundColors.contentBackground,
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    coursesContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      backgroundColor: 'transparent',
    },
    bottomSpacing: {
      height: 100, // Space for tab bar
    },
  });
};

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
