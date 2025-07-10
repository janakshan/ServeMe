/ services/api/education.ts
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail: string;
  rating: number;
  studentsCount: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  isCompleted: boolean;
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

  async getCourseDetails(courseId: string): Promise<Course> {
    try {
      const course = MOCK_COURSES.find(c => c.id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return course;
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
