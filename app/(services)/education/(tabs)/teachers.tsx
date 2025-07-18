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
    specialization: "A/L Combined Mathematics",
    bio: "Senior mathematics educator with 15+ years of experience in A/L mathematics teaching. Former lecturer at University of Jaffna.",
    rating: 4.9,
    studentsCount: 3200,
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
    specialization: "A/L Biology",
    bio: "Experienced biology teacher with Ph.D. in Botany from University of Jaffna. Specialized in A/L Biological Science stream preparation.",
    rating: 4.9,
    studentsCount: 2890,
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
    specialization: "O/L Mathematics",
    bio: "Dedicated mathematics teacher with B.Ed. from University of Jaffna. Expert in O/L mathematics preparation with bilingual teaching skills.",
    rating: 4.8,
    studentsCount: 4500,
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
    specialization: "O/L Science",
    bio: "Science educator with M.Sc. in Chemistry from University of Jaffna. Specializes in integrated science teaching for O/L students.",
    rating: 4.8,
    studentsCount: 3680,
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
    specialization: "Tamil Language & Literature",
    bio: "Tamil language expert with M.A. in Tamil Literature from University of Jaffna. Teaching both O/L and A/L Tamil literature.",
    rating: 4.7,
    studentsCount: 2150,
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
    specialization: "History",
    bio: "History professor with expertise in Sri Lankan Tamil history and world civilizations. Former head of History department at University of Jaffna.",
    rating: 4.6,
    studentsCount: 1890,
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
    specialization: "A/L Physics",
    bio: "Physics educator with Ph.D. in Applied Physics from University of Jaffna. Specialized in A/L Physics for Mathematics stream students.",
    rating: 4.8,
    studentsCount: 2340,
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
    specialization: "English Language",
    bio: "English language teacher with B.A. in English Literature from University of Jaffna. Expert in English language development for all levels.",
    rating: 4.7,
    studentsCount: 5200,
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
          <Text style={styles.avatarText}>
            {teacher.name.split(" ").map((n: string) => n[0]).join("")}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.specialization}>{teacher.specialization}</Text>
          <View style={styles.institutionRow}>
            <Ionicons 
              name={getInstitutionIcon(teacher.institutionType)} 
              size={14} 
              color={tokens.colors.onSurfaceVariant} 
            />
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
            {/* <Text style={styles.sectionTitle}>Statistics</Text> */}
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
          subtitle="Connect with qualified educators"
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
    institutionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.xs,
    },
    institutionText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
      fontWeight: "500",
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
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.lg,
      letterSpacing: -0.5,
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
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.xs,
    },
    historyPosition: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
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
      fontWeight: tokens.typography.semiBold,
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
      fontWeight: tokens.typography.semiBold,
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