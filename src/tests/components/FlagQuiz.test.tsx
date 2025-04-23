import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlagQuiz from '../../components/FlagQuiz';
import * as quizUtils from '../../utils/quizUtils';
import { QuizQuestion } from '../../types';

// Mock the quiz utility functions
vi.mock('../../utils/quizUtils', () => ({
  generateQuiz: vi.fn(),
  shuffleArray: vi.fn((arr) => arr),
  generateQuestion: vi.fn()
}));

// Create sample quiz data
const mockQuestions: QuizQuestion[] = [
  {
    correctCountry: { name: 'United States', code: 'US' },
    options: [
      { name: 'United States', code: 'US' },
      { name: 'Canada', code: 'CA' },
      { name: 'Mexico', code: 'MX' },
      { name: 'Australia', code: 'AU' }
    ]
  },
  {
    correctCountry: { name: 'Japan', code: 'JP' },
    options: [
      { name: 'Japan', code: 'JP' },
      { name: 'South Korea', code: 'KR' },
      { name: 'China', code: 'CN' },
      { name: 'Vietnam', code: 'VN' }
    ]
  }
];

// Mock for image loading
class MockImage {
  onload: () => void = () => {};
  set src(_: string) {
    setTimeout(() => this.onload(), 100);
  }
}

describe('FlagQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the generateQuiz method to return our test data
    vi.mocked(quizUtils.generateQuiz).mockReturnValue(mockQuestions);
    
    // Replace the global Image constructor with our mock
    window.Image = MockImage as any;
  });
  
  it('should render the intro screen initially', () => {
    render(<FlagQuiz />);
    
    // Look for the heading and start button on the intro screen
    expect(screen.getByText('Flag Quiz')).toBeInTheDocument();
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });
  
  it('should start the quiz when the start button is clicked', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Click the start button
    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);
    
    // Should show countdown
    expect(screen.getByText(/3/i)).toBeInTheDocument();
    
    // After countdown, should render the quiz
    await waitFor(() => {
      expect(screen.queryByText(/Welcome to Flag Quiz/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/3/i)).not.toBeInTheDocument();
    }, { timeout: 3500 });
  });
  
  it('should display the first question after intro', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Start the quiz
    await user.click(screen.getByRole('button', { name: /start/i }));
    
    // Wait for the countdown to finish
    await waitFor(() => {
      // Should show the country options
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
      expect(screen.getByText('Australia')).toBeInTheDocument();
    }, { timeout: 3500 });
  });
  
  it('should handle correct answer selection', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Start the quiz
    await user.click(screen.getByRole('button', { name: /start/i }));
    
    // Wait for the countdown and first question
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    }, { timeout: 3500 });
    
    // Select the correct answer
    const correctOption = screen.getByText('United States');
    await user.click(correctOption);
    
    // Should show feedback for correct answer
    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
  });
  
  it('should handle incorrect answer selection', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Start the quiz
    await user.click(screen.getByRole('button', { name: /start/i }));
    
    // Wait for the countdown and first question
    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
    }, { timeout: 3500 });
    
    // Select an incorrect answer
    const incorrectOption = screen.getByText('Canada');
    await user.click(incorrectOption);
    
    // Should show feedback for incorrect answer
    expect(screen.getByText(/Incorrect/i)).toBeInTheDocument();
    
    // Should highlight the correct answer
    expect(screen.getByText('United States').closest('.flag-option')).toHaveClass('correct');
  });
  
  it('should move to the next question after answering', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Start the quiz
    await user.click(screen.getByRole('button', { name: /start/i }));
    
    // Wait for the countdown and first question
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    }, { timeout: 3500 });
    
    // Answer the first question
    await user.click(screen.getByText('United States'));
    
    // Wait for the next question to appear
    await waitFor(() => {
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.getByText('South Korea')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
  
  it('should show quiz results after all questions are answered', async () => {
    const user = userEvent.setup();
    render(<FlagQuiz />);
    
    // Start the quiz
    await user.click(screen.getByRole('button', { name: /start/i }));
    
    // Wait for the countdown and first question
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    }, { timeout: 3500 });
    
    // Answer first question
    await user.click(screen.getByText('United States'));
    
    // Wait for the second question
    await waitFor(() => {
      expect(screen.getByText('Japan')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Answer second question
    await user.click(screen.getByText('Japan'));
    
    // Since there are only 2 mock questions, it should show results
    await waitFor(() => {
      expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
      // There may be multiple occurrences of the word "points" in the result screen (individual
      // score, average score description, etc.). We just need to ensure at least one is rendered.
      expect(screen.getAllByText(/points/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });
}); 