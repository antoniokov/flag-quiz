import { describe, test, expect } from 'vitest';
import {
  DELAY_BEFORE_NEXT,
  COUNTDOWN_TIME,
  VOICE_RESTART_DELAY,
  VOICE_ERROR_RESTART_DELAY,
  VOICE_LONG_ERROR_DELAY,
  VOICE_INIT_DELAY,
  MIN_SCORE,
  MAX_SCORE,
  MIN_TIME,
  MAX_TIME
} from '../../constants';

describe('Constants in test mode', () => {
  test('timing constants should be reduced by 10x in test mode', () => {
    // In test environment, these values should be 10x smaller than production
    expect(DELAY_BEFORE_NEXT).toBe(200);
    expect(COUNTDOWN_TIME).toBe(300);
    expect(VOICE_RESTART_DELAY).toBe(30);
    expect(VOICE_ERROR_RESTART_DELAY).toBe(50);
    expect(VOICE_LONG_ERROR_DELAY).toBe(70);
    expect(VOICE_INIT_DELAY).toBe(10);
    expect(MIN_TIME).toBe(200);
    expect(MAX_TIME).toBe(1000);
  });

  test('scoring constants should remain unchanged', () => {
    // These should not be affected by test mode
    expect(MIN_SCORE).toBe(1000);
    expect(MAX_SCORE).toBe(2000);
  });
}); 