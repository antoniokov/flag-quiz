import { describe, it, expect } from 'vitest';
import { calculateScore } from '../../utils/scoreUtils';
import { MIN_SCORE, MAX_SCORE, MIN_TIME, MAX_TIME } from '../../constants';

describe('scoreUtils', () => {
  describe('calculateScore', () => {
    it('should return MAX_SCORE for response times faster than MIN_TIME', () => {
      const responseTime = MIN_TIME - 100; // Faster than minimum time
      const score = calculateScore(responseTime);
      
      expect(score).toBe(MAX_SCORE);
    });
    
    it('should return MIN_SCORE for response times slower than MAX_TIME', () => {
      const responseTime = MAX_TIME + 100; // Slower than maximum time
      const score = calculateScore(responseTime);
      
      expect(score).toBe(MIN_SCORE);
    });
    
    it('should return a score between MIN_SCORE and MAX_SCORE for times in between', () => {
      // Middle time
      const responseTime = (MIN_TIME + MAX_TIME) / 2;
      const score = calculateScore(responseTime);
      
      expect(score).toBeGreaterThanOrEqual(MIN_SCORE);
      expect(score).toBeLessThanOrEqual(MAX_SCORE);
      
      // Should be approximately the middle score
      const expectedMiddleScore = Math.round((MIN_SCORE + MAX_SCORE) / 2);
      expect(score).toBeCloseTo(expectedMiddleScore, -2); // Allow some rounding difference
    });
    
    it('should calculate scores proportionally based on response time', () => {
      // Test several points along the scale
      const quarterTime = MIN_TIME + (MAX_TIME - MIN_TIME) * 0.25;
      const threeQuarterTime = MIN_TIME + (MAX_TIME - MIN_TIME) * 0.75;
      
      const quarterScore = calculateScore(quarterTime);
      const threeQuarterScore = calculateScore(threeQuarterTime);
      
      // Check that the score at 25% time is higher than at 75% time
      expect(quarterScore).toBeGreaterThan(threeQuarterScore);
      
      // The quarter score should be closer to MAX_SCORE (75% of the way there)
      const expectedQuarterScore = MIN_SCORE + (MAX_SCORE - MIN_SCORE) * 0.75;
      expect(quarterScore).toBeCloseTo(Math.round(expectedQuarterScore), -1);
      
      // The three quarter score should be closer to MIN_SCORE (25% of the way there)
      const expectedThreeQuarterScore = MIN_SCORE + (MAX_SCORE - MIN_SCORE) * 0.25;
      expect(threeQuarterScore).toBeCloseTo(Math.round(expectedThreeQuarterScore), -1);
    });
  });
}); 