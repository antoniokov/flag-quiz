import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shuffleArray, generateQuestion, generateQuiz } from '../../utils/quizUtils';
import { countries } from '../../data/countries';
import { QuizQuestion } from '../../types';

// Mock the global Math.random
const mockMathRandom = vi.spyOn(Math, 'random');

describe('quizUtils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('shuffleArray', () => {
    it('should return a new array with the same elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(array);
      
      // Should be a new array reference
      expect(shuffled).not.toBe(array);
      
      // Should contain the same elements
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should shuffle elements based on Math.random', () => {
      // Mock Math.random to return predictable values
      mockMathRandom
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.1);
      
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(array);
      
      // Shuffled array should be different from original if random values allow
      expect(shuffled).not.toEqual(array);
    });
  });

  describe('generateQuestion', () => {
    it('should generate a question with 4 options', () => {
      const question = generateQuestion();
      
      expect(question).toHaveProperty('correctCountry');
      expect(question).toHaveProperty('options');
      expect(question.options).toHaveLength(4);
      
      // correctCountry should be one of the options
      const correctCountryInOptions = question.options.some(
        country => country.code === question.correctCountry.code
      );
      expect(correctCountryInOptions).toBe(true);
    });

    it('should exclude specified countries as correct answers', () => {
      const excludeCountries = ['US', 'CA', 'MX'];
      const question = generateQuestion(excludeCountries);
      
      expect(excludeCountries).not.toContain(question.correctCountry.code);
    });

    it('should generate a new set of options if all countries have been excluded', () => {
      // Mock all country codes
      const allCountryCodes = countries.map(country => country.code);
      
      // This should still work and not throw an error
      const question = generateQuestion(allCountryCodes);
      
      expect(question).toHaveProperty('correctCountry');
      expect(question.options).toHaveLength(4);
    });
  });

  describe('generateQuiz', () => {
    it('should generate the requested number of questions', () => {
      const totalQuestions = 5;
      const quiz = generateQuiz(totalQuestions);
      
      expect(quiz).toHaveLength(totalQuestions);
      expect(quiz[0]).toHaveProperty('correctCountry');
      expect(quiz[0]).toHaveProperty('options');
    });

    it('should not repeat countries as correct answers', () => {
      const totalQuestions = 10;
      const quiz = generateQuiz(totalQuestions);
      
      // Extract all correct country codes
      const correctCountryCodes = quiz.map(q => q.correctCountry.code);
      
      // Create a Set to check for duplicates
      const uniqueCodes = new Set(correctCountryCodes);
      
      // The Set should have the same length as the original array if all values are unique
      expect(uniqueCodes.size).toBe(correctCountryCodes.length);
    });
  });
}); 