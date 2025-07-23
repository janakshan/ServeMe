// services/api/education.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  price: number;
  thumbnail: string;
  rating: number;
  studentsCount: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  instructorAvatar?: string;
  instructorBio?: string;
  instructorRating?: number;
  category: string;
  isEnrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  requirements: string[];
  learningOutcomes: string[];
  detailedLessons: DetailedLesson[];
  reviews: Review[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  isCompleted: boolean;
}

export interface DetailedLesson extends Lesson {
  isLocked: boolean;
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'React Native Development',
    description: 'Learn to build mobile apps with React Native',
    instructor: 'John Smith',
    duration: '10 hours',
    level: 'intermediate',
    price: 99.99,
    thumbnail: '📱',
    rating: 4.8,
    studentsCount: 1250,
    lessons: [
      {
        id: '1',
        title: 'Introduction to React Native',
        duration: '15 min',
        type: 'video',
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Setting up Development Environment',
        duration: '20 min',
        type: 'video',
        isCompleted: false,
      },
    ],
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the basics of user interface design',
    instructor: 'Sarah Johnson',
    duration: '8 hours',
    level: 'beginner',
    price: 79.99,
    thumbnail: '🎨',
    rating: 4.6,
    studentsCount: 890,
    lessons: [
      {
        id: '1',
        title: 'Design Principles',
        duration: '25 min',
        type: 'video',
        isCompleted: false,
      },
    ],
  },
];

// Enhanced course details mock data
const MOCK_COURSE_DETAILS: { [key: string]: CourseDetail } = {
  '1': {
    id: '1',
    title: 'Tamil Language & Literature - Grade 3',
    description: 'Basic Tamil language skills, reading comprehension, and simple literature for primary students. This course focuses on building strong foundations in Tamil grammar, vocabulary, and reading skills through interactive lessons and engaging activities.',
    instructor: 'Priya Subramaniam',
    instructorAvatar: 'PS',
    instructorBio: 'Masters in Tamil Literature from University of Jaffna. 12+ years of teaching experience in primary education with specialized focus on Tamil language development.',
    instructorRating: 4.8,
    duration: '3 terms',
    level: 'beginner',
    price: 0,
    thumbnail: '📚',
    rating: 4.8,
    studentsCount: 2340,
    category: 'Primary Education',
    isEnrolled: true,
    progress: 65,
    totalLessons: 45,
    completedLessons: 29,
    requirements: [
      'Basic Tamil alphabet knowledge',
      'Age appropriate (8-9 years)',
      'Dedicated study time: 1 hour per week',
      'Tamil writing materials'
    ],
    learningOutcomes: [
      'Read and write Tamil letters fluently',
      'Understand basic Tamil grammar concepts',
      'Develop vocabulary for everyday conversations',
      'Appreciate simple Tamil literature',
      'Build confidence in Tamil language usage'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Tamil Alphabets - Vowels', duration: '30 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Tamil Alphabets - Consonants', duration: '35 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Simple Words Formation', duration: '25 min', type: 'text', isCompleted: true, isLocked: false },
      { id: '4', title: 'Basic Grammar Rules', duration: '40 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '5', title: 'Reading Practice', duration: '20 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Rani Perera',
        rating: 5.0,
        comment: 'My daughter loves this course! Teacher Priya makes learning Tamil so enjoyable and easy to understand.',
        date: '2024-01-20'
      },
      {
        id: '2',
        studentName: 'Kumar Rajesh',
        rating: 4.5,
        comment: 'Excellent foundation course for Tamil. The interactive lessons keep children engaged.',
        date: '2024-01-15'
      }
    ]
  },
  '7': {
    id: '7',
    title: 'O/L Mathematics',
    description: 'Advanced mathematics preparation for GCE O/L examination. This comprehensive course covers all essential topics including algebra, geometry, trigonometry, and statistics. Designed specifically for Sri Lankan students preparing for their O/L exams.',
    instructor: 'Ravi Shankar',
    instructorAvatar: 'RS',
    instructorBio: 'Master\'s in Mathematics from University of Colombo. 15+ years of teaching experience with 95% student pass rate in O/L Mathematics.',
    instructorRating: 4.9,
    duration: '2 years',
    level: 'advanced',
    price: 15000,
    thumbnail: '🔢',
    rating: 4.9,
    studentsCount: 3200,
    category: 'O/L Preparation',
    isEnrolled: true,
    progress: 85,
    totalLessons: 120,
    completedLessons: 102,
    requirements: [
      'Grade 9 Mathematics completion',
      'Basic algebraic knowledge',
      'Scientific calculator',
      'Dedicated study time: 3-4 hours per week'
    ],
    learningOutcomes: [
      'Master algebraic expressions and equations',
      'Solve complex geometry problems confidently',
      'Understand trigonometric concepts and applications',
      'Analyze statistical data and probability',
      'Develop problem-solving strategies for O/L exam',
      'Build confidence for advanced mathematics'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Number Systems and Basic Operations', duration: '45 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Algebraic Expressions', duration: '50 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Linear Equations Practice', duration: '30 min', type: 'quiz', isCompleted: true, isLocked: false },
      { id: '4', title: 'Geometry Fundamentals', duration: '55 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '5', title: 'Trigonometry Introduction', duration: '60 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '6', title: 'Statistics and Probability', duration: '45 min', type: 'video', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Amara Perera',
        rating: 5,
        comment: 'Excellent teaching methods! Mr. Ravi explains complex concepts in a very simple way. Highly recommended for O/L preparation.',
        date: '2024-01-15'
      },
      {
        id: '2',
        studentName: 'Kasun Silva',
        rating: 4.8,
        comment: 'Great course content and structure. The practice quizzes are particularly helpful for exam preparation.',
        date: '2024-01-10'
      },
      {
        id: '3',
        studentName: 'Thilini Fernando',
        rating: 4.9,
        comment: 'This course helped me improve my math grades significantly. The step-by-step explanations are very clear.',
        date: '2024-01-08'
      }
    ]
  }
};

export const educationApi = {
  async getCourses(): Promise<Course[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_COURSES;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async getCourseDetails(courseId: string): Promise<CourseDetail> {
    try {
      const courseDetail = MOCK_COURSE_DETAILS[courseId];
      if (!courseDetail) {
        // Fallback: create basic course detail from regular course data
        const basicCourse = MOCK_COURSES.find(c => c.id === courseId);
        if (!basicCourse) {
          throw new Error('Course not found');
        }
        
        // Create minimal course detail for courses without full data
        const fallbackDetail: CourseDetail = {
          ...basicCourse,
          instructorAvatar: basicCourse.instructor.split(' ').map(n => n[0]).join(''),
          instructorBio: `Experienced instructor specializing in ${basicCourse.title}`,
          instructorRating: basicCourse.rating,
          category: 'General',
          isEnrolled: false,
          progress: 0,
          totalLessons: basicCourse.lessons.length,
          completedLessons: 0,
          requirements: ['Basic knowledge required'],
          learningOutcomes: [`Master ${basicCourse.title} concepts`],
          detailedLessons: basicCourse.lessons.map(lesson => ({ ...lesson, isLocked: false })),
          reviews: []
        };
        
        await new Promise(resolve => setTimeout(resolve, 500));
        return fallbackDetail;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return courseDetail;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  },

  async enrollInCourse(courseId: string): Promise<void> {
    try {
      console.log(`Enrolled in course: ${courseId}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },

  async markLessonComplete(courseId: string, lessonId: string): Promise<void> {
    try {
      console.log(`Lesson ${lessonId} in course ${courseId} marked as complete`);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  },
};
