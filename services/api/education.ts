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
  '2': {
    id: '2',
    title: 'Mathematics - Grade 5',
    description: 'Basic arithmetic, geometry, and problem-solving skills for Grade 5 students. This comprehensive course covers fundamental mathematical concepts with interactive exercises and practical applications.',
    instructor: 'Ravi Shankar',
    instructorAvatar: 'RS',
    instructorBio: 'Bachelor of Mathematics from University of Peradeniya. 10+ years of experience in primary mathematics education with focus on building strong numerical foundations.',
    instructorRating: 4.7,
    duration: '3 terms',
    level: 'beginner',
    price: 0,
    thumbnail: '🔢',
    rating: 4.7,
    studentsCount: 1890,
    category: 'Primary Education',
    isEnrolled: false,
    progress: 0,
    totalLessons: 48,
    completedLessons: 0,
    requirements: [
      'Basic counting and addition skills',
      'Age appropriate (10-11 years)',
      'Calculator for advanced exercises',
      'Dedicated study time: 2 hours per week'
    ],
    learningOutcomes: [
      'Master arithmetic operations and mental math',
      'Understand geometric shapes and measurements',
      'Solve word problems systematically',
      'Develop logical thinking and reasoning',
      'Build confidence in mathematical concepts'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Number Operations and Place Value', duration: '35 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '2', title: 'Fractions and Decimals', duration: '40 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '3', title: 'Basic Geometry', duration: '30 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '4', title: 'Problem Solving Practice', duration: '25 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Saman Wijesinghe',
        rating: 4.8,
        comment: 'Great introduction to mathematics. My son improved significantly in his school exams.',
        date: '2024-01-18'
      },
      {
        id: '2',
        studentName: 'Nisha Patel',
        rating: 4.6,
        comment: 'Well-structured lessons that make math fun and easy to understand.',
        date: '2024-01-12'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Science - Grade 8',
    description: 'Integrated physics, chemistry, and biology concepts for junior secondary students. Explore the natural world through experiments, observations, and scientific inquiry.',
    instructor: 'Dr. Priya Rajendran',
    instructorAvatar: 'PR',
    instructorBio: 'PhD in Biological Sciences from University of Colombo. 15+ years of teaching experience with expertise in making complex scientific concepts accessible to young minds.',
    instructorRating: 4.9,
    duration: '3 terms',
    level: 'intermediate',
    price: 0,
    thumbnail: '🔬',
    rating: 4.9,
    studentsCount: 1720,
    category: 'Junior Secondary',
    isEnrolled: true,
    progress: 78,
    totalLessons: 60,
    completedLessons: 47,
    requirements: [
      'Basic understanding of natural phenomena',
      'Age appropriate (13-14 years)',
      'Science notebook for observations',
      'Dedicated study time: 3 hours per week'
    ],
    learningOutcomes: [
      'Understand fundamental physics principles',
      'Learn basic chemistry concepts and reactions',
      'Explore biological systems and life processes',
      'Develop scientific thinking and methodology',
      'Conduct simple experiments safely'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'States of Matter', duration: '45 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Cell Structure and Function', duration: '50 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Chemical Reactions', duration: '40 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '4', title: 'Force and Motion', duration: '35 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '5', title: 'Scientific Method Quiz', duration: '30 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Ashan Fernando',
        rating: 5.0,
        comment: 'Amazing teacher! Dr. Priya makes science experiments so exciting and easy to understand.',
        date: '2024-01-16'
      },
      {
        id: '2',
        studentName: 'Kavindi Silva',
        rating: 4.8,
        comment: 'Love the hands-on approach to learning. This course sparked my interest in becoming a scientist.',
        date: '2024-01-11'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'English Language - Grade 7',
    description: 'Intermediate English skills including grammar, composition, and literature. Develop strong communication skills in reading, writing, speaking, and listening.',
    instructor: 'Geetha Mahendran',
    instructorAvatar: 'GM',
    instructorBio: 'Masters in English Literature from University of Kelaniya. 12+ years of experience in English language teaching with specialization in creative writing and literature appreciation.',
    instructorRating: 4.8,
    duration: '3 terms',
    level: 'intermediate',
    price: 0,
    thumbnail: '📖',
    rating: 4.8,
    studentsCount: 2100,
    category: 'Junior Secondary',
    isEnrolled: false,
    progress: 0,
    totalLessons: 54,
    completedLessons: 0,
    requirements: [
      'Basic English reading and writing skills',
      'Age appropriate (12-13 years)',
      'English dictionary and notebook',
      'Dedicated study time: 2.5 hours per week'
    ],
    learningOutcomes: [
      'Master intermediate grammar and sentence structure',
      'Improve reading comprehension and vocabulary',
      'Develop creative writing and essay skills',
      'Appreciate English literature and poetry',
      'Build confidence in spoken English'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Grammar Fundamentals', duration: '40 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '2', title: 'Reading Comprehension Strategies', duration: '35 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '3', title: 'Creative Writing Workshop', duration: '45 min', type: 'text', isCompleted: false, isLocked: true },
      { id: '4', title: 'Vocabulary Building', duration: '30 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Dinuka Rathnayake',
        rating: 4.9,
        comment: 'Mrs. Geetha is an excellent teacher. My English writing has improved tremendously.',
        date: '2024-01-17'
      },
      {
        id: '2',
        studentName: 'Sanduni Perera',
        rating: 4.7,
        comment: 'Great course for building confidence in English. The literature sections are particularly enjoyable.',
        date: '2024-01-13'
      }
    ]
  },
  '5': {
    id: '5',
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
  },
  '6': {
    id: '6',
    title: 'O/L Science',
    description: 'Integrated physics, chemistry, and biology for O/L examination. Comprehensive coverage of all three science subjects with laboratory experiments and practical applications.',
    instructor: 'Dr. Kamala Thanabalasingham',
    instructorAvatar: 'KT',
    instructorBio: 'PhD in Chemistry from University of Peradeniya. 18+ years of experience in science education with excellent track record in O/L Science results.',
    instructorRating: 4.8,
    duration: '2 years',
    level: 'advanced',
    price: 18000,
    thumbnail: '🧪',
    rating: 4.8,
    studentsCount: 2890,
    category: 'O/L Preparation',
    isEnrolled: false,
    progress: 0,
    totalLessons: 135,
    completedLessons: 0,
    requirements: [
      'Grade 9 Science foundation',
      'Basic laboratory safety knowledge',
      'Scientific calculator and lab notebook',
      'Dedicated study time: 4-5 hours per week'
    ],
    learningOutcomes: [
      'Master physics concepts and problem solving',
      'Understand chemical reactions and equations',
      'Learn biological systems and processes',
      'Develop laboratory and experimental skills',
      'Excel in O/L Science examination',
      'Prepare for A/L Science subjects'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Atomic Structure and Periodic Table', duration: '55 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '2', title: 'Newton\'s Laws of Motion', duration: '50 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '3', title: 'Cell Biology and Genetics', duration: '60 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '4', title: 'Chemical Bonding', duration: '45 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '5', title: 'Integrated Science Quiz', duration: '40 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Harsha Wickramasinghe',
        rating: 4.9,
        comment: 'Dr. Kamala is amazing! Her explanations make even the most difficult concepts crystal clear.',
        date: '2024-01-14'
      },
      {
        id: '2',
        studentName: 'Ishani Gunasekara',
        rating: 4.7,
        comment: 'Excellent course structure. The practical experiments really help understand the theory.',
        date: '2024-01-09'
      }
    ]
  },
  '7': {
    id: '7',
    title: 'O/L Tamil Language & Literature',
    description: 'Advanced Tamil language skills and literature for O/L examination. Comprehensive study of Tamil grammar, poetry, prose, and essay writing techniques.',
    instructor: 'Suresh Kandasamy',
    instructorAvatar: 'SK',
    instructorBio: 'Masters in Tamil Literature from University of Jaffna. 16+ years of experience in Tamil language education with specialization in classical and modern literature.',
    instructorRating: 4.7,
    duration: '2 years',
    level: 'advanced',
    price: 12000,
    thumbnail: '📜',
    rating: 4.7,
    studentsCount: 2456,
    category: 'O/L Preparation',
    isEnrolled: true,
    progress: 72,
    totalLessons: 95,
    completedLessons: 68,
    requirements: [
      'Strong foundation in Tamil language',
      'Previous study of Tamil literature',
      'Tamil keyboard for typing practice',
      'Dedicated study time: 3-4 hours per week'
    ],
    learningOutcomes: [
      'Master advanced Tamil grammar and syntax',
      'Analyze classical and modern Tamil literature',
      'Develop excellent essay writing skills',
      'Understand poetic devices and literary techniques',
      'Excel in O/L Tamil examination',
      'Appreciate Tamil cultural heritage'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Advanced Grammar Concepts', duration: '50 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Classical Tamil Poetry Analysis', duration: '55 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Modern Prose Studies', duration: '45 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '4', title: 'Essay Writing Techniques', duration: '40 min', type: 'text', isCompleted: false, isLocked: false },
      { id: '5', title: 'Literature Appreciation Quiz', duration: '35 min', type: 'quiz', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Priya Nadarajah',
        rating: 4.8,
        comment: 'Sir Suresh brings Tamil literature to life. His passion for the language is truly inspiring.',
        date: '2024-01-16'
      },
      {
        id: '2',
        studentName: 'Karthik Selvam',
        rating: 4.6,
        comment: 'Excellent course for O/L Tamil preparation. The essay writing section was particularly helpful.',
        date: '2024-01-12'
      }
    ]
  },
  '8': {
    id: '8',
    title: 'A/L Combined Mathematics',
    description: 'Advanced calculus, statistics, and mechanics for A/L Mathematics stream. Comprehensive preparation for the most challenging mathematics examination in Sri Lanka.',
    instructor: 'Prof. Murugesan Sivasubramaniam',
    instructorAvatar: 'MS',
    instructorBio: 'Professor of Mathematics at University of Colombo. 25+ years of experience with numerous publications in mathematical journals. Expert in A/L Mathematics with exceptional student results.',
    instructorRating: 4.9,
    duration: '2 years',
    level: 'expert',
    price: 25000,
    thumbnail: '∫',
    rating: 4.9,
    studentsCount: 1240,
    category: 'A/L Preparation',
    isEnrolled: true,
    progress: 45,
    totalLessons: 150,
    completedLessons: 68,
    requirements: [
      'Excellent O/L Mathematics results (A or B)',
      'Strong algebraic and geometric foundation',
      'Advanced scientific calculator',
      'Dedicated study time: 6+ hours per week'
    ],
    learningOutcomes: [
      'Master differential and integral calculus',
      'Understand complex numbers and functions',
      'Solve advanced statistical problems',
      'Apply mechanics principles to real problems',
      'Excel in A/L Combined Mathematics exam',
      'Prepare for university-level mathematics'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Limits and Continuity', duration: '65 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Differential Calculus', duration: '70 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Integration Techniques', duration: '75 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '4', title: 'Complex Numbers', duration: '60 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '5', title: 'Statistical Distributions', duration: '55 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '6', title: 'Mechanics Applications', duration: '65 min', type: 'video', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Nethmi Rajapaksa',
        rating: 5.0,
        comment: 'Professor Murugesan is brilliant! His teaching methods make even the most complex topics understandable.',
        date: '2024-01-13'
      },
      {
        id: '2',
        studentName: 'Chaminda Perera',
        rating: 4.8,
        comment: 'Outstanding course quality. The problem-solving techniques are invaluable for A/L success.',
        date: '2024-01-07'
      }
    ]
  },
  '9': {
    id: '9',
    title: 'A/L Physics',
    description: 'Mechanics, electricity, and modern physics for A/L Mathematics stream. Comprehensive coverage of theoretical concepts with practical applications and problem-solving techniques.',
    instructor: 'Dr. Krishnan Nadarajah',
    instructorAvatar: 'KN',
    instructorBio: 'PhD in Theoretical Physics from University of Sri Jayewardenepura. 20+ years of experience in physics education with research background in quantum mechanics.',
    instructorRating: 4.8,
    duration: '2 years',
    level: 'expert',
    price: 22000,
    thumbnail: '⚛️',
    rating: 4.8,
    studentsCount: 1180,
    category: 'A/L Preparation',
    isEnrolled: false,
    progress: 0,
    totalLessons: 140,
    completedLessons: 0,
    requirements: [
      'Strong O/L Mathematics and Science results',
      'Understanding of basic physics concepts',
      'Advanced calculator and lab access',
      'Dedicated study time: 5-6 hours per week'
    ],
    learningOutcomes: [
      'Master classical mechanics and dynamics',
      'Understand electromagnetic theory',
      'Learn quantum physics fundamentals',
      'Develop advanced problem-solving skills',
      'Excel in A/L Physics examination',
      'Prepare for engineering and physics careers'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Kinematics and Dynamics', duration: '60 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '2', title: 'Energy and Momentum', duration: '55 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '3', title: 'Electromagnetic Fields', duration: '65 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '4', title: 'Wave Properties', duration: '50 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '5', title: 'Modern Physics Concepts', duration: '70 min', type: 'video', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Rukmal Silva',
        rating: 4.9,
        comment: 'Dr. Krishnan explains physics concepts with amazing clarity. His real-world examples are excellent.',
        date: '2024-01-11'
      },
      {
        id: '2',
        studentName: 'Anuki Fernando',
        rating: 4.7,
        comment: 'Challenging but rewarding course. The mathematical approach to physics is well-explained.',
        date: '2024-01-06'
      }
    ]
  },
  '10': {
    id: '10',
    title: 'A/L Biology',
    description: 'Botany, zoology, and human biology for A/L Biological Science stream. Comprehensive study of life sciences with laboratory work and research methodology.',
    instructor: 'Dr. Priya Rajendran',
    instructorAvatar: 'PR',
    instructorBio: 'PhD in Biological Sciences from University of Colombo. 18+ years of experience in biology education with research expertise in cellular biology and genetics.',
    instructorRating: 4.9,
    duration: '2 years',
    level: 'expert',
    price: 24000,
    thumbnail: '🧬',
    rating: 4.9,
    studentsCount: 1560,
    category: 'A/L Preparation',
    isEnrolled: true,
    progress: 58,
    totalLessons: 125,
    completedLessons: 73,
    requirements: [
      'Strong O/L Science foundation',
      'Interest in biological sciences',
      'Laboratory notebook and equipment access',
      'Dedicated study time: 5-6 hours per week'
    ],
    learningOutcomes: [
      'Understand cellular and molecular biology',
      'Master plant and animal physiology',
      'Learn genetics and evolution principles',
      'Develop scientific research skills',
      'Excel in A/L Biology examination',
      'Prepare for medical and biological science careers'
    ],
    lessons: [],
    detailedLessons: [
      { id: '1', title: 'Cell Structure and Function', duration: '55 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '2', title: 'Plant Physiology', duration: '60 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '3', title: 'Animal Systems', duration: '65 min', type: 'video', isCompleted: true, isLocked: false },
      { id: '4', title: 'Genetics and Heredity', duration: '70 min', type: 'video', isCompleted: false, isLocked: false },
      { id: '5', title: 'Evolution and Ecology', duration: '50 min', type: 'video', isCompleted: false, isLocked: true },
      { id: '6', title: 'Laboratory Techniques', duration: '45 min', type: 'text', isCompleted: false, isLocked: true },
    ],
    reviews: [
      {
        id: '1',
        studentName: 'Sachini Wickramasinghe',
        rating: 5.0,
        comment: 'Dr. Priya is an exceptional teacher. Her passion for biology is contagious and inspiring.',
        date: '2024-01-12'
      },
      {
        id: '2',
        studentName: 'Lakshan Perera',
        rating: 4.8,
        comment: 'Excellent course with great laboratory components. Perfect preparation for medical school.',
        date: '2024-01-08'
      },
      {
        id: '3',
        studentName: 'Hiruni Silva',
        rating: 4.9,
        comment: 'The genetics section was particularly well-explained. Great course for A/L Bio preparation.',
        date: '2024-01-05'
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
