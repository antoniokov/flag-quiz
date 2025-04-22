// Removed explicit React import as not required for JSX with modern React setups

interface VoiceFeedbackProps {
  voiceSupported: boolean;
  voiceSelectedOption: string | null;
  voiceText: string;
  matchedCountry: string | null;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  matchedAlias: string | null;
}

// We keep the props interface for type checking but don't use the parameters
function VoiceFeedback(_props: VoiceFeedbackProps) {
  // Return null in all cases - don't show any voice feedback
  return null;
}

export default VoiceFeedback; 