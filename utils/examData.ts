// Subject-Unit-Topic data structure for exam generation
export interface Topic {
  id: string;
  name: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Unit {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  units: Unit[];
}

export const EXAM_SUBJECTS: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    units: [
      {
        id: 'algebra',
        name: 'Algebra',
        topics: [
          { id: 'linear-equations', name: 'Linear Equations', difficulty: 'intermediate' },
          { id: 'quadratic-equations', name: 'Quadratic Equations', difficulty: 'advanced' },
          { id: 'polynomials', name: 'Polynomials', difficulty: 'intermediate' },
          { id: 'factoring', name: 'Factoring', difficulty: 'beginner' },
          { id: 'systems-equations', name: 'Systems of Equations', difficulty: 'advanced' },
        ],
      },
      {
        id: 'geometry',
        name: 'Geometry',
        topics: [
          { id: 'triangles', name: 'Triangles', difficulty: 'beginner' },
          { id: 'circles', name: 'Circles', difficulty: 'intermediate' },
          { id: 'coordinate-geometry', name: 'Coordinate Geometry', difficulty: 'advanced' },
          { id: 'solid-geometry', name: 'Solid Geometry', difficulty: 'expert' },
          { id: 'trigonometry', name: 'Trigonometry', difficulty: 'advanced' },
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        topics: [
          { id: 'limits', name: 'Limits', difficulty: 'advanced' },
          { id: 'derivatives', name: 'Derivatives', difficulty: 'expert' },
          { id: 'integrals', name: 'Integrals', difficulty: 'expert' },
          { id: 'applications', name: 'Applications of Calculus', difficulty: 'expert' },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    units: [
      {
        id: 'physics',
        name: 'Physics',
        topics: [
          { id: 'mechanics', name: 'Mechanics', difficulty: 'intermediate' },
          { id: 'thermodynamics', name: 'Thermodynamics', difficulty: 'advanced' },
          { id: 'electricity', name: 'Electricity & Magnetism', difficulty: 'advanced' },
          { id: 'optics', name: 'Optics', difficulty: 'intermediate' },
          { id: 'modern-physics', name: 'Modern Physics', difficulty: 'expert' },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        topics: [
          { id: 'atomic-structure', name: 'Atomic Structure', difficulty: 'intermediate' },
          { id: 'chemical-bonding', name: 'Chemical Bonding', difficulty: 'intermediate' },
          { id: 'organic-chemistry', name: 'Organic Chemistry', difficulty: 'advanced' },
          { id: 'inorganic-chemistry', name: 'Inorganic Chemistry', difficulty: 'advanced' },
          { id: 'physical-chemistry', name: 'Physical Chemistry', difficulty: 'expert' },
        ],
      },
      {
        id: 'biology',
        name: 'Biology',
        topics: [
          { id: 'cell-biology', name: 'Cell Biology', difficulty: 'beginner' },
          { id: 'genetics', name: 'Genetics', difficulty: 'intermediate' },
          { id: 'evolution', name: 'Evolution', difficulty: 'intermediate' },
          { id: 'ecology', name: 'Ecology', difficulty: 'advanced' },
          { id: 'human-biology', name: 'Human Biology', difficulty: 'advanced' },
        ],
      },
    ],
  },
  {
    id: 'languages',
    name: 'Languages',
    units: [
      {
        id: 'english',
        name: 'English',
        topics: [
          { id: 'grammar', name: 'Grammar', difficulty: 'beginner' },
          { id: 'vocabulary', name: 'Vocabulary', difficulty: 'intermediate' },
          { id: 'literature', name: 'Literature', difficulty: 'advanced' },
          { id: 'composition', name: 'Composition', difficulty: 'intermediate' },
          { id: 'comprehension', name: 'Reading Comprehension', difficulty: 'intermediate' },
        ],
      },
      {
        id: 'sinhala',
        name: 'Sinhala',
        topics: [
          { id: 'sinhala-grammar', name: 'Grammar', difficulty: 'beginner' },
          { id: 'sinhala-literature', name: 'Literature', difficulty: 'advanced' },
          { id: 'classical-texts', name: 'Classical Texts', difficulty: 'expert' },
          { id: 'poetry', name: 'Poetry', difficulty: 'advanced' },
        ],
      },
      {
        id: 'tamil',
        name: 'Tamil',
        topics: [
          { id: 'tamil-grammar', name: 'Grammar', difficulty: 'beginner' },
          { id: 'tamil-literature', name: 'Literature', difficulty: 'advanced' },
          { id: 'classical-tamil', name: 'Classical Tamil', difficulty: 'expert' },
          { id: 'modern-tamil', name: 'Modern Tamil', difficulty: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    units: [
      {
        id: 'history',
        name: 'History',
        topics: [
          { id: 'sri-lankan-history', name: 'Sri Lankan History', difficulty: 'intermediate' },
          { id: 'world-history', name: 'World History', difficulty: 'intermediate' },
          { id: 'ancient-civilizations', name: 'Ancient Civilizations', difficulty: 'advanced' },
          { id: 'modern-history', name: 'Modern History', difficulty: 'advanced' },
        ],
      },
      {
        id: 'geography',
        name: 'Geography',
        topics: [
          { id: 'physical-geography', name: 'Physical Geography', difficulty: 'intermediate' },
          { id: 'human-geography', name: 'Human Geography', difficulty: 'intermediate' },
          { id: 'economic-geography', name: 'Economic Geography', difficulty: 'advanced' },
          { id: 'climate-weather', name: 'Climate & Weather', difficulty: 'intermediate' },
        ],
      },
      {
        id: 'civics',
        name: 'Civics',
        topics: [
          { id: 'government', name: 'Government & Politics', difficulty: 'intermediate' },
          { id: 'constitution', name: 'Constitution', difficulty: 'advanced' },
          { id: 'citizenship', name: 'Citizenship', difficulty: 'beginner' },
          { id: 'law', name: 'Basic Law', difficulty: 'intermediate' },
        ],
      },
    ],
  },
];

// Difficulty level options
export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', description: 'Basic level questions' },
  { id: 'intermediate', name: 'Intermediate', description: 'Moderate difficulty' },
  { id: 'advanced', name: 'Advanced', description: 'Challenging questions' },
  { id: 'expert', name: 'Expert', description: 'Very difficult questions' },
];

// Helper functions
export const getSubjectOptions = () => {
  return EXAM_SUBJECTS.map(subject => ({
    label: subject.name,
    value: subject.id,
  }));
};

export const getUnitsBySubject = (subjectId: string) => {
  const subject = EXAM_SUBJECTS.find(s => s.id === subjectId);
  if (!subject) return [];
  
  return subject.units.map(unit => ({
    label: unit.name,
    value: unit.id,
  }));
};

export const getTopicsByUnit = (subjectId: string, unitId: string) => {
  const subject = EXAM_SUBJECTS.find(s => s.id === subjectId);
  if (!subject) return [];
  
  const unit = subject.units.find(u => u.id === unitId);
  if (!unit) return [];
  
  return unit.topics.map(topic => ({
    label: topic.name,
    value: topic.id,
  }));
};

export const getDifficultyOptions = () => {
  return DIFFICULTY_LEVELS.map(level => ({
    label: level.name,
    value: level.id,
  }));
};

// Mock exam generation interface
export interface GenerateExamParams {
  subject: string;
  unit: string;
  topic: string;
  difficulty: string;
  includePreviousHistory: boolean;
}

export const generateMockExam = (params: GenerateExamParams) => {
  // Mock exam generation logic
  const examId = `generated-${Date.now()}`;
  const subject = EXAM_SUBJECTS.find(s => s.id === params.subject);
  
  // Parse comma-separated units and topics
  const unitIds = params.unit.split(',').filter(id => id.trim());
  const topicIds = params.topic.split(',').filter(id => id.trim());
  
  // Get unit and topic names
  const units = unitIds.map(unitId => {
    const unit = subject?.units.find(u => u.id === unitId.trim());
    return unit?.name || unitId;
  });
  
  const topics = topicIds.map(topicId => {
    const allTopics = subject?.units.flatMap(u => u.topics) || [];
    const topic = allTopics.find(t => t.id === topicId.trim());
    return topic?.name || topicId;
  });
  
  // Create title based on selected items
  const titleParts = [subject?.name];
  if (units.length === 1) {
    titleParts.push(units[0]);
  } else if (units.length > 1) {
    titleParts.push(`${units.length} Units`);
  }
  if (topics.length === 1) {
    titleParts.push(topics[0]);
  } else if (topics.length > 1) {
    titleParts.push(`${topics.length} Topics`);
  }
  
  return {
    id: examId,
    title: titleParts.join(' - '),
    subject: subject?.name || '',
    difficulty: params.difficulty,
    units: units,
    topics: topics,
    questionsCount: Math.floor(Math.random() * 20) + 10, // 10-30 questions
    timeLimit: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
    passingScore: 60,
    maxScore: 100,
    attempts: 0,
    maxAttempts: 3,
    bestScore: 0,
    description: `Custom generated exam covering ${units.join(', ')} units with focus on ${topics.join(', ')} topics at ${params.difficulty} difficulty level.`,
    isCompleted: false,
    isGenerated: true,
    generationParams: params,
  };
};