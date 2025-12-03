export type QuestionCategory = 'primary' | 'intermediate' | 'secondary';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options: QuestionOption[];
}

export interface QuizAnswer {
  name: string;
  team: string;
  questionId: string;
  questionText: string;
  selectedOption: string;
  isCorrect: boolean;
  category: QuestionCategory;
  timestamp: string;
}

export interface FeedbackData {
  name: string;
  team: string;
  difficulty: string;
  clarity: string;
  organization: string;
  suggestions: string;
  timestamp: string;
}

export type QuizState = 'welcome' | 'quiz' | 'feedback' | 'completed';
