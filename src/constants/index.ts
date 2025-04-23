// The simplest check for test environment
const isTestEnvironment = typeof window !== 'undefined' && window.TEST_MODE === true;

export const TOTAL_QUESTIONS = 10;
export const DELAY_BEFORE_NEXT = isTestEnvironment ? 200 : 2000; // 2 seconds delay (200ms in tests)

// Scoring constants
export const MIN_SCORE = 1000; // Minimum score for a correct answer
export const MAX_SCORE = 2000; // Maximum score for a correct answer
export const MIN_TIME = isTestEnvironment ? 200 : 2000;  // Time in ms after which only minimum score is awarded
export const MAX_TIME = isTestEnvironment ? 1000 : 10000; // Time in ms after which only minimum score is awarded

// Countdown constants
export const COUNTDOWN_TIME = isTestEnvironment ? 300 : 3000; // Duration of countdown before the quiz starts (300ms in tests)

// Voice recognition timeout constants
export const VOICE_RESTART_DELAY = isTestEnvironment ? 30 : 300; // Delay before restarting voice recognition if no match found
export const VOICE_ERROR_RESTART_DELAY = isTestEnvironment ? 50 : 500; // Delay before restarting voice recognition after error
export const VOICE_LONG_ERROR_DELAY = isTestEnvironment ? 70 : 700; // Longer timeout for error recovery
export const VOICE_INIT_DELAY = isTestEnvironment ? 10 : 100; // Small delay to ensure any previous recognition has fully stopped 