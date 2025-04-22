import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock the SpeechRecognition API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  start = vi.fn();
  stop = vi.fn();
  onresult = null;
  onerror = null;
  onend = null;
}

// Add to global window object
window.SpeechRecognition = MockSpeechRecognition;
window.webkitSpeechRecognition = MockSpeechRecognition;

// Run cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 