export interface RecordItem {
  id: string;
  category: string;
  value: string;
  holder: string;
  detail: string | null;
}

export interface TriviaQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

export interface DailyFactItem {
  id: string;
  content: string;
  tags: string[];
}
