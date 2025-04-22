import { MIN_SCORE, MAX_SCORE, MIN_TIME, MAX_TIME } from '../constants';

// Calculate score based on response time (ms)
export const calculateScore = (responseTimeMs: number): number => {
  if (responseTimeMs <= MIN_TIME) {
    return MAX_SCORE; // Fastest response gets max points
  }

  if (responseTimeMs >= MAX_TIME) {
    return MIN_SCORE; // Slowest response gets min points
  }

  // Linear interpolation between MIN_SCORE and MAX_SCORE based on time ratio
  const timeRatio = 1 - (responseTimeMs - MIN_TIME) / (MAX_TIME - MIN_TIME);
  return Math.round(MIN_SCORE + timeRatio * (MAX_SCORE - MIN_SCORE));
}; 