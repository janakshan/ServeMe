import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";
import { EducationHeader, EducationScreenHeader } from "@/src/education/components/headers";

const MOCK_TEACHERS = [
  {
    id: "1",
    name: "Prof. Murugesan Sivasubramaniam",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "A/L Combined Mathematics",
    bio: "Senior mathematics educator with 15+ years of experience in A/L mathematics teaching. Former lecturer at University of Jaffna.",
    rating: 4.9,
    studentsCount: 3200,
    activeStudents: 2850,
    coursesCount: 8,
    subjects: ["Combined Mathematics", "Pure Mathematics", "Applied Mathematics"],
    experience: "15 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: true,
    currentInstitution: "University of Jaffna",
    institutionType: "University",
    teachingHistory: [
      {
        institution: "University of Jaffna",
        position: "Professor of Mathematics",
        years: "2018-Present",
        department: "Mathematics Department"
      },
      {
        institution: "University of Jaffna",
        position: "Senior Lecturer",
        years: "2012-2018",
        department: "Mathematics Department"
      },
      {
        institution: "Royal College Jaffna",
        position: "Mathematics Teacher",
        years: "2009-2012",
        department: "Science Faculty"
      }
    ],
    qualifications: [
      {
        degree: "Ph.D. in Pure Mathematics",
        institution: "University of Jaffna",
        year: "2015"
      },
      {
        degree: "M.Sc. in Mathematics",
        institution: "University of Colombo",
        year: "2008"
      }
    ],
    courses: [
      {
        id: "c1",
        title: "A/L Combined Mathematics - Advanced",
        description: "Comprehensive course covering calculus, statistics, and mechanics for A/L Mathematics stream students.",
        level: "expert",
        duration: "2 years",
        price: 25000,
        studentsEnrolled: 450,
        activeStudents: 420,
        completionRate: 85,
        rating: 4.9,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2025-01-15",
        progress: 65
      },
      {
        id: "c2",
        title: "Pure Mathematics Fundamentals",
        description: "Building strong foundations in pure mathematics concepts for advanced learners.",
        level: "advanced",
        duration: "1.5 years",
        price: 20000,
        studentsEnrolled: 380,
        activeStudents: 350,
        completionRate: 78,
        rating: 4.8,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2025-02-01",
        progress: 45
      },
      {
        id: "c3",
        title: "Applied Mathematics for Engineering",
        description: "Practical mathematics applications for students preparing for engineering entrance exams.",
        level: "expert",
        duration: "1 year",
        price: 18000,
        studentsEnrolled: 320,
        activeStudents: 295,
        completionRate: 90,
        rating: 4.9,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2024-11-01",
        progress: 80
      },
      {
        id: "c3a",
        title: "Statistics for Data Analysis",
        description: "Advanced statistical methods and data interpretation for research and analysis.",
        level: "expert",
        duration: "1 year",
        price: 15000,
        studentsEnrolled: 280,
        activeStudents: 260,
        completionRate: 88,
        rating: 4.7,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2025-03-01",
        progress: 25
      },
      {
        id: "c3b",
        title: "Differential Equations Masterclass",
        description: "Master complex differential equations for advanced mathematics students.",
        level: "expert",
        duration: "8 months",
        price: 12000,
        studentsEnrolled: 195,
        activeStudents: 180,
        completionRate: 82,
        rating: 4.8,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2024-09-15",
        progress: 90
      }
    ],
    liveClasses: [
      {
        id: "lc1",
        title: "A/L Combined Mathematics - Calculus Problem Solving",
        subject: "Mathematics",
        date: "2025-07-25",
        time: "10:00 AM",
        duration: "3 hours",
        status: "upcoming",
        studentsCount: 48,
        maxStudents: 50,
        description: "Advanced calculus problem-solving session for A/L Mathematics stream students.",
        isRegistered: true
      },
      {
        id: "lc2",
        title: "Statistics and Probability Workshop",
        subject: "Mathematics",
        date: "2025-07-30",
        time: "2:00 PM",
        duration: "2.5 hours",
        status: "upcoming",
        studentsCount: 35,
        maxStudents: 40,
        description: "Interactive workshop on statistical analysis and probability distributions.",
        isRegistered: false
      },
      {
        id: "lc3",
        title: "Mechanics and Motion - Advanced Concepts",
        subject: "Mathematics",
        date: "2025-07-18",
        time: "10:00 AM",
        duration: "2 hours",
        status: "completed",
        studentsCount: 50,
        maxStudents: 50,
        description: "Advanced mechanics concepts with real-world applications.",
        isRegistered: true
      },
      {
        id: "lc4",
        title: "Advanced Statistics Workshop",
        subject: "Mathematics",
        date: "2025-08-10",
        time: "3:00 PM",
        duration: "2 hours",
        status: "upcoming",
        studentsCount: 42,
        maxStudents: 45,
        description: "Deep dive into advanced statistical concepts and applications.",
        isRegistered: false
      },
      {
        id: "lc5",
        title: "Differential Equations Live Session",
        subject: "Mathematics",
        date: "2025-08-15",
        time: "10:00 AM",
        duration: "2.5 hours",
        status: "upcoming",
        studentsCount: 38,
        maxStudents: 40,
        description: "Solving complex differential equations with real examples.",
        isRegistered: true
      }
    ],
    studentRecommendations: [
      {
        id: "1",
        studentName: "Aravind Kumar",
        studentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        comment: "Prof. Sivasubramaniam's teaching methods are exceptional. His clear explanations of complex mathematical concepts helped me achieve A+ in A/L Combined Mathematics. Highly recommended!",
        rating: 5,
        date: "2024-12-15"
      },
      {
        id: "2",
        studentName: "Priya Rajaratnam",
        studentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b90c?w=100&h=100&fit=crop&crop=face",
        comment: "Amazing teacher! His problem-solving techniques and practical approach made A/L mathematics much easier to understand. Thanks to him, I got selected for Engineering at University of Moratuwa.",
        rating: 5,
        date: "2024-11-28"
      },
      {
        id: "3",
        studentName: "Dinesh Selvam",
        studentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        comment: "Excellent teacher with great patience. He always made sure every student understood the concepts before moving forward. His classes were always engaging and productive.",
        rating: 5,
        date: "2024-11-10"
      }
    ]
  },
  {
    id: "2",
    name: "Dr. Priya Rajendran",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "A/L Biology",
    bio: "Experienced biology teacher with Ph.D. in Botany from University of Jaffna. Specialized in A/L Biological Science stream preparation.",
    rating: 4.9,
    studentsCount: 2890,
    activeStudents: 2650,
    coursesCount: 6,
    subjects: ["Biology", "Botany", "Zoology", "Human Biology"],
    experience: "12 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: true,
    currentInstitution: "University of Jaffna",
    institutionType: "University",
    teachingHistory: [
      {
        institution: "University of Jaffna",
        position: "Senior Lecturer in Botany",
        years: "2016-Present",
        department: "Department of Botany"
      },
      {
        institution: "Jaffna College",
        position: "Biology Teacher",
        years: "2012-2016",
        department: "Science Department"
      }
    ],
    qualifications: [
      {
        degree: "Ph.D. in Botany",
        institution: "University of Jaffna",
        year: "2014"
      },
      {
        degree: "M.Sc. in Botany",
        institution: "University of Peradeniya",
        year: "2010"
      }
    ],
    courses: [
      {
        id: "c4",
        title: "A/L Biology - Complete Course",
        description: "Comprehensive A/L Biology covering botany, zoology, and human biology with practical sessions.",
        level: "expert",
        duration: "2 years",
        price: 24000,
        studentsEnrolled: 520,
        activeStudents: 480,
        completionRate: 88,
        rating: 4.9,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2025-01-10",
        progress: 55
      },
      {
        id: "c5",
        title: "Advanced Botany Studies",
        description: "Specialized botany course focusing on plant physiology, taxonomy, and ecology.",
        level: "expert",
        duration: "1.5 years",
        price: 20000,
        studentsEnrolled: 285,
        activeStudents: 270,
        completionRate: 92,
        rating: 4.8,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2024-08-15",
        progress: 75
      },
      {
        id: "c6",
        title: "Human Biology & Physiology",
        description: "Detailed study of human body systems for biological science students.",
        level: "advanced",
        duration: "1 year",
        price: 18000,
        studentsEnrolled: 360,
        activeStudents: 340,
        completionRate: 85,
        rating: 4.7,
        category: "A/L Preparation",
        isActive: true,
        startDate: "2025-03-01",
        progress: 30
      }
    ],
    liveClasses: [
      {
        id: "lc4",
        title: "A/L Biology - Human Physiology Deep Dive",
        subject: "Science",
        date: "2025-07-28",
        time: "2:00 PM",
        duration: "2.5 hours",
        status: "upcoming",
        studentsCount: 68,
        maxStudents: 75,
        description: "Comprehensive session on human circulatory and respiratory systems with virtual lab demonstrations.",
        isRegistered: true
      },
      {
        id: "lc5",
        title: "Plant Biology Lab Session",
        subject: "Science",
        date: "2025-08-05",
        time: "10:00 AM",
        duration: "3 hours",
        status: "upcoming",
        studentsCount: 45,
        maxStudents: 50,
        description: "Virtual laboratory session on plant anatomy and photosynthesis experiments.",
        isRegistered: false
      },
      {
        id: "lc6",
        title: "Ecology and Environmental Biology",
        subject: "Science",
        date: "2025-07-15",
        time: "3:00 PM",
        duration: "2 hours",
        status: "completed",
        studentsCount: 72,
        maxStudents: 75,
        description: "Interactive session on ecosystem dynamics and environmental conservation.",
        isRegistered: true
      }
    ],
    studentRecommendations: [
      {
        id: "1",
        studentName: "Meera Thangarajah",
        studentImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        comment: "Dr. Priya's biology classes were incredibly informative and well-structured. Her practical approach to teaching botany helped me understand plant biology thoroughly. Got A+ in A/L Biology!",
        rating: 5,
        date: "2024-12-10"
      },
      {
        id: "2",
        studentName: "Karthik Mohan",
        studentImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        comment: "Best biology teacher ever! Her field work sessions and lab demonstrations made learning so much more interesting. Highly recommend her classes.",
        rating: 5,
        date: "2024-11-25"
      }
    ]
  },
  {
    id: "3",
    name: "Ravi Shankar",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "O/L Mathematics",
    bio: "Dedicated mathematics teacher with B.Ed. from University of Jaffna. Expert in O/L mathematics preparation with bilingual teaching skills.",
    rating: 4.8,
    studentsCount: 4500,
    activeStudents: 4100,
    coursesCount: 10,
    subjects: ["O/L Mathematics", "Algebra", "Geometry", "Statistics"],
    experience: "18 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: false,
    currentInstitution: "St. John's College Jaffna",
    institutionType: "College",
    teachingHistory: [
      {
        institution: "St. John's College Jaffna",
        position: "Senior Mathematics Teacher",
        years: "2010-Present",
        department: "Mathematics Department"
      },
      {
        institution: "Jaffna Hindu College",
        position: "Mathematics Teacher",
        years: "2006-2010",
        department: "Mathematics Department"
      }
    ],
    qualifications: [
      {
        degree: "B.Ed. in Mathematics",
        institution: "University of Jaffna",
        year: "2005"
      },
      {
        degree: "B.Sc. in Mathematics",
        institution: "University of Jaffna",
        year: "2003"
      }
    ],
    studentRecommendations: [
      {
        id: "1",
        studentName: "Vishnu Pradeep",
        studentImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        comment: "Sir Ravi's teaching style is perfect for O/L students. He makes difficult mathematics topics very easy to understand. My son improved from C to A grade thanks to his classes.",
        rating: 5,
        date: "2024-12-05"
      },
      {
        id: "2",
        studentName: "Sangeetha Rajesh",
        studentImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        comment: "Excellent teacher with great patience. He explains each step clearly and provides plenty of practice problems. Highly recommend for O/L mathematics preparation.",
        rating: 5,
        date: "2024-11-18"
      }
    ]
  },
  {
    id: "4",
    name: "Dr. Kamala Thanabalasingham",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "O/L Science",
    bio: "Science educator with M.Sc. in Chemistry from University of Jaffna. Specializes in integrated science teaching for O/L students.",
    rating: 4.8,
    studentsCount: 3680,
    activeStudents: 3400,
    coursesCount: 7,
    subjects: ["O/L Science", "Chemistry", "Physics", "Biology"],
    experience: "14 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: true,
    currentInstitution: "Vembadi Girls' High School",
    institutionType: "School",
    teachingHistory: [
      {
        institution: "Vembadi Girls' High School",
        position: "Head of Science Department",
        years: "2015-Present",
        department: "Science Department"
      },
      {
        institution: "Chundikuli Girls' College",
        position: "Science Teacher",
        years: "2010-2015",
        department: "Science Department"
      }
    ],
    qualifications: [
      {
        degree: "M.Sc. in Chemistry",
        institution: "University of Jaffna",
        year: "2012"
      },
      {
        degree: "B.Sc. in Chemistry",
        institution: "University of Jaffna",
        year: "2008"
      }
    ]
  },
  {
    id: "5",
    name: "Suresh Kandasamy",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "Tamil Language & Literature",
    bio: "Tamil language expert with M.A. in Tamil Literature from University of Jaffna. Teaching both O/L and A/L Tamil literature.",
    rating: 4.7,
    studentsCount: 2150,
    activeStudents: 1980,
    coursesCount: 5,
    subjects: ["Tamil Literature", "Tamil Language", "Poetry", "Classical Literature"],
    experience: "20 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: false,
    currentInstitution: "Jaffna Hindu College",
    institutionType: "College",
    teachingHistory: [
      {
        institution: "Jaffna Hindu College",
        position: "Head of Tamil Department",
        years: "2008-Present",
        department: "Tamil Department"
      },
      {
        institution: "Hartley College Point Pedro",
        position: "Tamil Teacher",
        years: "2004-2008",
        department: "Languages Department"
      }
    ],
    qualifications: [
      {
        degree: "M.A. in Tamil Literature",
        institution: "University of Jaffna",
        year: "2006"
      },
      {
        degree: "B.A. in Tamil",
        institution: "University of Jaffna",
        year: "2002"
      }
    ]
  },
  {
    id: "6",
    name: "Prof. Mythili Rajasingam",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "History",
    bio: "History professor with expertise in Sri Lankan Tamil history and world civilizations. Former head of History department at University of Jaffna.",
    rating: 4.6,
    studentsCount: 1890,
    activeStudents: 1650,
    coursesCount: 9,
    subjects: ["Sri Lankan History", "World History", "Ancient Civilizations", "Modern History"],
    experience: "22 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: true,
    currentInstitution: "University of Jaffna",
    institutionType: "University",
    teachingHistory: [
      {
        institution: "University of Jaffna",
        position: "Professor of History",
        years: "2015-Present",
        department: "Department of History"
      },
      {
        institution: "University of Jaffna",
        position: "Head of History Department",
        years: "2010-2015",
        department: "Department of History"
      },
      {
        institution: "University of Jaffna",
        position: "Senior Lecturer",
        years: "2005-2010",
        department: "Department of History"
      }
    ],
    qualifications: [
      {
        degree: "Ph.D. in History",
        institution: "University of Cambridge",
        year: "2008"
      },
      {
        degree: "M.A. in History",
        institution: "University of Jaffna",
        year: "2000"
      }
    ]
  },
  {
    id: "7",
    name: "Dr. Krishnan Nadarajah",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "A/L Physics",
    bio: "Physics educator with Ph.D. in Applied Physics from University of Jaffna. Specialized in A/L Physics for Mathematics stream students.",
    rating: 4.8,
    studentsCount: 2340,
    activeStudents: 2180,
    coursesCount: 6,
    subjects: ["A/L Physics", "Mechanics", "Electricity", "Modern Physics"],
    experience: "13 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: false,
    currentInstitution: "University of Jaffna",
    institutionType: "University",
    teachingHistory: [
      {
        institution: "University of Jaffna",
        position: "Senior Lecturer in Physics",
        years: "2016-Present",
        department: "Department of Physics"
      },
      {
        institution: "St. Patrick's College Jaffna",
        position: "Physics Teacher",
        years: "2011-2016",
        department: "Science Department"
      }
    ],
    qualifications: [
      {
        degree: "Ph.D. in Applied Physics",
        institution: "University of Jaffna",
        year: "2015"
      },
      {
        degree: "M.Sc. in Physics",
        institution: "University of Colombo",
        year: "2009"
      }
    ]
  },
  {
    id: "8",
    name: "Geetha Mahendran",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&fm=jpg&q=80",
    specialization: "English Language",
    bio: "English language teacher with B.A. in English Literature from University of Jaffna. Expert in English language development for all levels.",
    rating: 4.7,
    studentsCount: 5200,
    activeStudents: 4850,
    coursesCount: 12,
    subjects: ["English Grammar", "English Literature", "Composition", "Speaking Skills"],
    experience: "16 years",
    location: "Jaffna, Sri Lanka",
    isFollowed: true,
    currentInstitution: "Holy Family Convent Jaffna",
    institutionType: "School",
    teachingHistory: [
      {
        institution: "Holy Family Convent Jaffna",
        position: "Head of English Department",
        years: "2012-Present",
        department: "English Department"
      },
      {
        institution: "Jaffna Central College",
        position: "English Teacher",
        years: "2008-2012",
        department: "Languages Department"
      }
    ],
    qualifications: [
      {
        degree: "B.A. in English Literature",
        institution: "University of Jaffna",
        year: "2006"
      },
      {
        degree: "Diploma in TESOL",
        institution: "British Council Sri Lanka",
        year: "2007"
      }
    ]
  },
];

const SUBJECT_FILTERS = ["All", "Mathematics", "Science", "Languages", "Arts & Humanities", "Social Studies"];

interface TeacherCourseCardProps {
  course: any;
  onPress?: (courseId: string) => void;
}

const TeacherCourseCard: React.FC<TeacherCourseCardProps> = ({ course, onPress }) => {
  const styles = useThemedStyles(createTeacherCourseCardStyles);
  const { tokens } = useServiceTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return tokens.colors.success;
      case "intermediate":
        return tokens.colors.warning;
      case "advanced":
        return tokens.colors.error;
      case "expert":
        return tokens.colors.info;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(course.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.courseHeader}>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
        <Text style={styles.coursePrice}>${course.price}</Text>
      </View>

      <Text style={styles.courseTitle} numberOfLines={2}>
        {course.title}
      </Text>
      
      <Text style={styles.courseDescription} numberOfLines={3}>
        {course.description}
      </Text>

      <View style={styles.courseStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.statText}>{course.studentsEnrolled}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={14} color={tokens.colors.warning} />
          <Text style={styles.statText}>{course.rating}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.statText}>{course.duration}</Text>
        </View>
      </View>

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
        <Text style={styles.progressText}>{course.progress}% Progress</Text>
      </View>
    </TouchableOpacity>
  );
};

interface TeacherLiveClassCardProps {
  liveClass: any;
  onPress?: (classId: string) => void;
}

const TeacherLiveClassCard: React.FC<TeacherLiveClassCardProps> = ({ liveClass, onPress }) => {
  const styles = useThemedStyles(createTeacherLiveClassCardStyles);
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

  const handlePress = () => {
    if (onPress) {
      onPress(liveClass.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.classCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.classHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(liveClass.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(liveClass.status) }]}>
            {getStatusText(liveClass.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.classTitle} numberOfLines={2}>
        {liveClass.title}
      </Text>

      <View style={styles.classInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{liveClass.date}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{liveClass.time}</Text>
        </View>
      </View>

      <View style={styles.studentsInfo}>
        <Ionicons name="people" size={14} color={tokens.colors.onSurfaceVariant} />
        <Text style={styles.studentsText}>
          {liveClass.studentsCount}/{liveClass.maxStudents} students
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface TeacherCardProps {
  teacher: any;
  onPress: (teacher: any) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onPress }) => {
  const styles = useThemedStyles(createTeacherCardStyles);
  const { tokens } = useServiceTheme();

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case "University":
        return "school";
      case "College":
        return "library";
      case "School":
        return "home";
      default:
        return "business";
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(teacher)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {teacher.profileImage ? (
            <Image
              source={{ uri: teacher.profileImage }}
              style={styles.profileImage}
              onError={() => {
                // Fallback to text avatar if image fails
              }}
            />
          ) : (
            <Text style={styles.avatarText}>
              {teacher.name.split(" ").map((n: string) => n[0]).join("")}
            </Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.specialization}>{teacher.specialization}</Text>
          <View style={styles.institutionRow}>
            <View style={[styles.institutionBadge, { backgroundColor: tokens.colors.secondaryContainer }]}>
              <Ionicons 
                name={getInstitutionIcon(teacher.institutionType)} 
                size={12} 
                color={tokens.colors.onSecondaryContainer} 
              />
              <Text style={[styles.institutionBadgeText, { color: tokens.colors.onSecondaryContainer }]}>
                {teacher.institutionType}
              </Text>
            </View>
            <Text style={styles.institutionText}>{teacher.currentInstitution}</Text>
          </View>
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
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);

  if (!teacher) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[tokens.colors.primary, tokens.colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.title}>Teacher Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <LinearGradient
            colors={[tokens.colors.primary + '15', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.teacherHeaderGradient}
          >
            <View style={styles.teacherHeader}>
            <View style={styles.avatarLarge}>
              {teacher.profileImage ? (
                <Image
                  source={{ uri: teacher.profileImage }}
                  style={styles.profileImageLarge}
                  onError={() => {
                    // Fallback to text avatar if image fails
                  }}
                />
              ) : (
                <Text style={styles.avatarLargeText}>
                  {teacher.name.split(" ").map((n: string) => n[0]).join("")}
                </Text>
              )}
            </View>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.teacherSpecialization}>{teacher.specialization}</Text>
            
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={20} color={tokens.colors.warning} />
              <Text style={styles.ratingLarge}>{teacher.rating}</Text>
              <Text style={styles.ratingCountLarge}>({teacher.studentsCount} students)</Text>
            </View>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGridResponsive}>
              <View style={[styles.statCard, { backgroundColor: tokens.colors.primary + '15' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: tokens.colors.primary }]}>
                  <Ionicons name="book" size={20} color={tokens.colors.onPrimary} />
                </View>
                <Text style={styles.statNumber}>{teacher.coursesCount}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: tokens.colors.warning + '15' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: tokens.colors.warning }]}>
                  <Ionicons name="calendar" size={20} color={tokens.colors.onPrimary} />
                </View>
                <Text style={styles.statNumber}>{teacher.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: tokens.colors.info + '15' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: tokens.colors.info }]}>
                  <Ionicons name="school" size={20} color={tokens.colors.onPrimary} />
                </View>
                <Text style={styles.statNumber}>{teacher.studentsCount}</Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: tokens.colors.success + '15' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: tokens.colors.success }]}>
                  <Ionicons name="people" size={20} color={tokens.colors.onPrimary} />
                </View>
                <Text style={styles.statNumber}>{teacher.activeStudents}</Text>
                <Text style={styles.statLabel}>Active Students</Text>
              </View>
            </View>
            <View style={styles.activeStudentsProgress}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Student Active Rate</Text>
                <Text style={styles.progressValue}>
                  {Math.round((teacher.activeStudents / teacher.studentsCount) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(teacher.activeStudents / teacher.studentsCount) * 100}%`,
                      backgroundColor: tokens.colors.success,
                    },
                  ]}
                />
              </View>
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

          {/* Courses Section */}
          {teacher.courses && teacher.courses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Courses by {teacher.name.split(' ')[0]}</Text>
                <View style={styles.sectionHeaderRight}>
                  <Text style={styles.sectionSubtitle}>{teacher.courses.length} courses</Text>
                  {teacher.courses.length > 3 && (
                    <TouchableOpacity 
                      onPress={() => setShowAllCourses(!showAllCourses)}
                      style={styles.viewToggleButton}
                    >
                      <Text style={styles.viewToggleText}>
                        {showAllCourses ? 'Show Less' : 'View All'}
                      </Text>
                      <Ionicons 
                        name={showAllCourses ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color={tokens.colors.primary} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {teacher.courses.length <= 3 || !showAllCourses ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {(showAllCourses ? teacher.courses : teacher.courses.slice(0, 3)).map((course: any) => (
                    <TeacherCourseCard
                      key={course.id}
                      course={course}
                      onPress={(courseId: string) => {
                        // Handle course press
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.verticalList}>
                  {teacher.courses.map((course: any, index: number) => (
                    <View key={course.id} style={styles.verticalCourseItem}>
                      <View style={styles.courseItemHeader}>
                        <Text style={styles.courseItemTitle}>{course.title}</Text>
                        <Text style={styles.courseItemPrice}>${course.price}</Text>
                      </View>
                      <Text style={styles.courseItemDescription} numberOfLines={2}>
                        {course.description}
                      </Text>
                      <View style={styles.courseItemStats}>
                        <View style={styles.courseItemStat}>
                          <Ionicons name="people" size={14} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.courseItemStatText}>{course.studentsEnrolled}</Text>
                        </View>
                        <View style={styles.courseItemStat}>
                          <Ionicons name="star" size={14} color={tokens.colors.warning} />
                          <Text style={styles.courseItemStatText}>{course.rating}</Text>
                        </View>
                        <View style={styles.courseItemStat}>
                          <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.courseItemStatText}>{course.duration}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Live Classes Section */}
          {teacher.liveClasses && teacher.liveClasses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Live Classes</Text>
                <View style={styles.sectionHeaderRight}>
                  <Text style={styles.sectionSubtitle}>{teacher.liveClasses.length} classes</Text>
                  {teacher.liveClasses.length > 3 && (
                    <TouchableOpacity 
                      onPress={() => setShowAllClasses(!showAllClasses)}
                      style={styles.viewToggleButton}
                    >
                      <Text style={styles.viewToggleText}>
                        {showAllClasses ? 'Show Less' : 'View All'}
                      </Text>
                      <Ionicons 
                        name={showAllClasses ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color={tokens.colors.primary} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {teacher.liveClasses.length <= 3 || !showAllClasses ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {(showAllClasses ? teacher.liveClasses : teacher.liveClasses.slice(0, 3)).map((liveClass: any) => (
                    <TeacherLiveClassCard
                      key={liveClass.id}
                      liveClass={liveClass}
                      onPress={(classId: string) => {
                        // Handle class press
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.verticalList}>
                  {teacher.liveClasses.map((liveClass: any) => (
                    <View key={liveClass.id} style={styles.verticalClassItem}>
                      <View style={styles.classItemHeader}>
                        <Text style={styles.classItemTitle}>{liveClass.title}</Text>
                        <View style={styles.statusBadgeSmall}>
                          <Text style={[styles.statusTextSmall, { color: tokens.colors.primary }]}>
                            {liveClass.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.classItemInfo}>
                        <View style={styles.classItemStat}>
                          <Ionicons name="calendar" size={14} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.classItemStatText}>{liveClass.date}</Text>
                        </View>
                        <View style={styles.classItemStat}>
                          <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.classItemStatText}>{liveClass.time}</Text>
                        </View>
                        <View style={styles.classItemStat}>
                          <Ionicons name="people" size={14} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.classItemStatText}>{liveClass.studentsCount}/{liveClass.maxStudents}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teaching History</Text>
            <View style={styles.historyContainer}>
              {teacher.teachingHistory.map((history: any, index: number) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Ionicons 
                      name={history.institution.includes("University") ? "school" : 
                            history.institution.includes("College") ? "library" : "home"} 
                      size={16} 
                      color={tokens.colors.primary} 
                    />
                    <Text style={styles.historyInstitution}>{history.institution}</Text>
                  </View>
                  <Text style={styles.historyPosition}>{history.position}</Text>
                  <Text style={styles.historyDepartment}>{history.department}</Text>
                  <Text style={styles.historyYears}>{history.years}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <View style={styles.qualificationsContainer}>
              {teacher.qualifications.map((qualification: any, index: number) => (
                <View key={index} style={styles.qualificationItem}>
                  <View style={styles.qualificationHeader}>
                    <Ionicons name="school" size={16} color={tokens.colors.primary} />
                    <Text style={styles.qualificationDegree}>{qualification.degree}</Text>
                  </View>
                  <Text style={styles.qualificationInstitution}>{qualification.institution}</Text>
                  <Text style={styles.qualificationYear}>{qualification.year}</Text>
                </View>
              ))}
            </View>
          </View>

          {teacher.studentRecommendations && teacher.studentRecommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Recommendations</Text>
              <View style={styles.recommendationsContainer}>
                {teacher.studentRecommendations.map((recommendation: any) => (
                  <View key={recommendation.id} style={styles.recommendationCard}>
                    <View style={styles.recommendationHeader}>
                      <Image
                        source={{ uri: recommendation.studentImage }}
                        style={styles.studentImage}
                      />
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{recommendation.studentName}</Text>
                        <View style={styles.recommendationRating}>
                          {[...Array(5)].map((_, index) => (
                            <Ionicons
                              key={index}
                              name="star"
                              size={12}
                              color={index < recommendation.rating ? tokens.colors.warning : tokens.colors.border}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.recommendationDate}>
                        {new Date(recommendation.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <Text style={styles.recommendationComment}>{recommendation.comment}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { tokens, getGradient } = useServiceTheme();

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

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Create a subtle gradient background that transitions from header
  const backgroundGradient = getGradient('background');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <EducationScreenHeader
          title="Find Teachers"
          // subtitle="Connect with qualified educators"
          rightAction={{
            icon: "options-outline",
            onPress: handleFilterToggle,
          }}
        />
        
        <View style={styles.contentWrapper}>
          {isFilterVisible && (
            <EducationHeader
              variant="teachers"
              search={{
                value: searchQuery,
                onChangeText: setSearchQuery,
                placeholder: "Search teachers...",
              }}
              filters={{
                options: SUBJECT_FILTERS.map((filter) => ({
                  id: filter,
                  label: filter,
                  value: filter,
                })),
                selectedValue: selectedFilter,
                onSelect: setSelectedFilter,
              }}
              section={{
                title: selectedFilter === "All" ? "All Teachers" : `${selectedFilter} Teachers`,
                count: filteredTeachers.length,
                countLabel: "teachers",
              }}
            />
          )}
          
          {!isFilterVisible && (
            <View style={styles.simpleHeader}>
              <Text style={styles.simpleHeaderTitle}>
                {selectedFilter === "All" ? "All Teachers" : `${selectedFilter} Teachers`}
              </Text>
              <Text style={styles.simpleHeaderCount}>
                {filteredTeachers.length} teachers
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.teachersContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onPress={handleTeacherPress}
              />
            ))}
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </LinearGradient>

      <TeacherModal
        teacher={selectedTeacher}
        visible={modalVisible}
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
    } else if (primaryColor === "#0D47A1") {
      // Professional blue theme - soft blue tints
      return {
        softBackground: "#F8FAFE", // Very light blue tint
        softSurface: "#F0F6FF", // Light blue tint for cards/surfaces
      };
    } else if (primaryColor === "#2E7D32") {
      // Green theme - soft green tints
      return {
        softBackground: "#F9FDF9", // Very light green tint
        softSurface: "#F2F8F2", // Light green tint
      };
    } else if (primaryColor === "#E91E63") {
      // Pink theme - soft pink tints
      return {
        softBackground: "#FFFAFC", // Very light pink tint
        softSurface: "#FFF2F7", // Light pink tint
      };
    } else {
      // Default soft blue tints
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
    contentWrapper: {
      flex: 1,
      backgroundColor: backgroundColors.softSurface,
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    teachersContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.xs,
      backgroundColor: 'transparent',
    },
    bottomSpacing: {
      height: 100, // Space for tab bar
    },
    simpleHeader: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border + '20',
    },
    simpleHeaderTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    simpleHeaderCount: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
  });
};

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
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      resizeMode: 'cover',
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
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: 2,
    },
    specialization: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    institutionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.xs,
    },
    institutionBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: 2,
      borderRadius: tokens.borderRadius.sm,
      marginRight: tokens.spacing.xs,
    },
    institutionBadgeText: {
      fontSize: tokens.typography.caption - 1,
      fontWeight: "600",
      marginLeft: 2,
    },
    institutionText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: "500",
      flex: 1,
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

const createTeacherCourseCardStyles = (tokens: any) =>
  StyleSheet.create({
    courseCard: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginRight: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      width: 280,
      ...tokens.shadows.sm,
    },
    courseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
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
      textTransform: "capitalize",
    },
    coursePrice: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
    },
    courseTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
      minHeight: 40,
    },
    courseDescription: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
      minHeight: 45,
      lineHeight: 16,
    },
    courseStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
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
      fontWeight: "500",
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
      fontWeight: "500",
    },
  });

const createTeacherLiveClassCardStyles = (tokens: any) =>
  StyleSheet.create({
    classCard: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginRight: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      width: 260,
      ...tokens.shadows.sm,
    },
    classHeader: {
      marginBottom: tokens.spacing.sm,
    },
    statusBadge: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      alignSelf: "flex-start",
    },
    statusText: {
      fontSize: tokens.typography.caption,
      fontWeight: "600",
    },
    classTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.md,
      minHeight: 40,
    },
    classInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.sm,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    infoText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
      fontWeight: "500",
    },
    studentsInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: tokens.spacing.xs,
    },
    studentsText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
      fontWeight: "500",
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
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border + '30',
      ...tokens.shadows.sm,
    },
    title: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: '#FFFFFF',
    },
    closeButton: {
      padding: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: tokens.spacing.md,
    },
    teacherHeaderGradient: {
      paddingTop: tokens.spacing.lg, // Proper spacing from modal header
      paddingBottom: tokens.spacing.lg,
      marginHorizontal: -tokens.spacing.md,
      paddingHorizontal: tokens.spacing.md,
      marginTop: -tokens.spacing.lg, // Moderate negative margin to remove white space
      marginBottom: tokens.spacing.sm,
    },
    teacherHeader: {
      alignItems: "center",
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
    profileImageLarge: {
      width: 100,
      height: 100,
      borderRadius: 50,
      resizeMode: 'cover',
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
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.lg,
      letterSpacing: -0.5,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.lg,
    },
    sectionHeaderRight: {
      alignItems: 'flex-end',
    },
    sectionSubtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
      marginBottom: tokens.spacing.xs,
    },
    viewToggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.primaryContainer,
    },
    viewToggleText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.primary,
      fontWeight: '600',
      marginRight: tokens.spacing.xs,
    },
    horizontalScroll: {
      marginHorizontal: -tokens.spacing.md,
    },
    horizontalScrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingRight: tokens.spacing.lg,
    },
    activeStudentsProgress: {
      marginTop: tokens.spacing.md,
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.md,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm,
    },
    progressLabel: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: '600',
    },
    progressValue: {
      fontSize: tokens.typography.body,
      color: tokens.colors.success,
      fontWeight: tokens.typography.bold,
    },
    progressBar: {
      height: 8,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.sm,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: tokens.borderRadius.sm,
    },
    // Vertical List Styles
    verticalList: {
      paddingHorizontal: tokens.spacing.xs,
    },
    verticalCourseItem: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    courseItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing.sm,
    },
    courseItemTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      flex: 1,
      marginRight: tokens.spacing.sm,
    },
    courseItemPrice: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.primary,
    },
    courseItemDescription: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.sm,
      lineHeight: 16,
    },
    courseItemStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    courseItemStat: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    courseItemStatText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
      fontWeight: '500',
    },
    // Live Class Vertical List Styles
    verticalClassItem: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    classItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: tokens.spacing.sm,
    },
    classItemTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      flex: 1,
      marginRight: tokens.spacing.sm,
    },
    statusBadgeSmall: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.primaryContainer,
    },
    statusTextSmall: {
      fontSize: tokens.typography.caption,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    classItemInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    classItemStat: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    classItemStatText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
      fontWeight: '500',
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
    statsGridResponsive: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    statsGridThreeColumn: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    statCard: {
      alignItems: "center",
      width: '48%', // 2 cards per row with some margin
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      marginBottom: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border + '30',
      ...tokens.shadows.sm,
    },
    statCardLarge: {
      alignItems: "center",
      flex: 1.5,
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      marginHorizontal: tokens.spacing.xs,
      borderWidth: 1,
      borderColor: tokens.colors.border + '30',
      ...tokens.shadows.sm,
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
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
    studentsInfo: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
    },
    statSecondaryNumber: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: 2,
    },
    footer: {
      flexDirection: "row",
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border,
      gap: tokens.spacing.md,
    },
    followButtonLarge: {
      flex: 1,
      backgroundColor: tokens.colors.primary,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    followButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    messageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
      backgroundColor: "transparent",
    },
    messageButtonText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.primary,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
    // Teaching History Styles
    historyContainer: {
      gap: tokens.spacing.md,
    },
    historyItem: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    historyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.xs,
    },
    historyInstitution: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.xs,
    },
    historyPosition: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.primary,
      marginBottom: tokens.spacing.xs,
    },
    historyDepartment: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    historyYears: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    // Qualifications Styles
    qualificationsContainer: {
      gap: tokens.spacing.md,
    },
    qualificationItem: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    qualificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.xs,
    },
    qualificationDegree: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.xs,
    },
    qualificationInstitution: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    qualificationYear: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    // Student Recommendations Styles
    recommendationsContainer: {
      gap: tokens.spacing.md,
    },
    recommendationCard: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    recommendationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.md,
    },
    studentImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: tokens.spacing.sm,
    },
    studentInfo: {
      flex: 1,
    },
    studentName: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    recommendationRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    recommendationDate: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    recommendationComment: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      lineHeight: 20,
      fontStyle: 'italic',
    },
  });