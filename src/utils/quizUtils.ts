import { QuizQuestion } from '../types';
import { countries, getSimilarCountries } from '../data/countries';

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Generate a quiz question with similar flag options
export const generateQuestion = (excludeCountries: string[] = []): QuizQuestion => {
  // Filter out countries that have already been used as correct answers
  const availableCountries = countries.filter(
    country => !excludeCountries.includes(country.code)
  );
  
  if (availableCountries.length === 0) {
    // If we've used all countries, reset and use all countries
    return generateQuestion([]);
  }
  
  // Randomly select a country as the correct answer
  const correctCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
  
  // Get similar countries for options
  let similarOptions = getSimilarCountries(correctCountry.code, 3);
  
  // If we don't have enough similar countries, add some random ones
  if (similarOptions.length < 3) {
    const randomCountries = shuffleArray(
      countries.filter(c => 
        c.code !== correctCountry.code && 
        !similarOptions.some(s => s.code === c.code)
      )
    ).slice(0, 3 - similarOptions.length);
    
    similarOptions = [...similarOptions, ...randomCountries];
  }
  
  // Combine and shuffle the options
  const allOptions = shuffleArray([correctCountry, ...similarOptions]);
  
  return {
    correctCountry,
    options: allOptions
  };
};

// Generate a set of quiz questions for a complete quiz
export const generateQuiz = (totalQuestions: number): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const usedCountryCodes: string[] = [];
  
  for (let i = 0; i < totalQuestions; i++) {
    const question = generateQuestion(usedCountryCodes);
    questions.push(question);
    usedCountryCodes.push(question.correctCountry.code);
  }
  
  return questions;
}; 