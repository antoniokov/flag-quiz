export const TOTAL_QUESTIONS = 10;
export const DELAY_BEFORE_NEXT = 2000; // 2 seconds delay

// Scoring constants
export const MIN_SCORE = 1000; // Minimum score for a correct answer
export const MAX_SCORE = 2000; // Maximum score for a correct answer
export const MIN_TIME = 2000;  // Time in ms after which only minimum score is awarded (2 seconds)
export const MAX_TIME = 10000; // Time in ms after which only minimum score is awarded (10 seconds)

// Countdown constants
export const COUNTDOWN_TIME = 3000; // Duration of countdown before the quiz starts (3 seconds)

// Voice recognition timeout constants
export const VOICE_RESTART_DELAY = 300; // Delay before restarting voice recognition if no match found
export const VOICE_ERROR_RESTART_DELAY = 500; // Delay before restarting voice recognition after error
export const VOICE_LONG_ERROR_DELAY = 700; // Longer timeout for error recovery
export const VOICE_INIT_DELAY = 100; // Small delay to ensure any previous recognition has fully stopped 