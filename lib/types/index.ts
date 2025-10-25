// User Profile Types
export interface UserProfile {
  age: number;
  sex: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  city: string;
  zipCode: string;
  school?: string;
  hasConsented: boolean;
  consentDate: string;
  hasPIN: boolean;
}

// PIN Types
export interface PINData {
  pin: string;
  createdAt: string;
}

// Questionnaire Types
export interface Question {
  id: string;
  question: string;
  type: 'scale' | 'multiple-choice' | 'yes-no';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: string | number;
  answeredAt: string;
}

export interface Assessment {
  id: string;
  responses: QuestionnaireResponse[];
  completedAt: string;
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'needs-attention';
}

// Mood Tracking Types
export interface MoodEntry {
  id: string;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | 'anxious' | 'stressed';
  intensity: number; // 1-10
  note?: string;
  createdAt: string;
}

// Daily Check-in Types
export interface DailyCheckIn {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

// App State Types
export interface AppState {
  hasCompletedOnboarding: boolean;
  hasSeenWelcome: boolean;
  lastAssessmentDate?: string;
  lastCheckInDate?: string;
  assessmentHistory: Assessment[];
  moodHistory: MoodEntry[];
  dailyCheckIns: DailyCheckIn[];
}

// Resources Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'hotline' | 'website' | 'article' | 'app';
  url?: string;
  phone?: string;
  category: 'crisis' | 'general' | 'therapy' | 'self-help';
}
