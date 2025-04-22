export interface Country {
  name: string;
  code: string;
  region: Region;
  similarTo?: string[]; // Array of country codes that have similar flags
}

export type Region = 
  | 'Europe' 
  | 'Asia' 
  | 'Africa' 
  | 'North America' 
  | 'South America' 
  | 'Oceania' 
  | 'Middle East';

export interface QuizQuestion {
  correctCountry: Country;
  options: Country[];
}

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  score: number;
  totalQuestions: number;
  questionIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  gameOver: boolean;
} 