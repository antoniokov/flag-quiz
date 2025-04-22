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

function VoiceFeedback({ voiceSupported, voiceSelectedOption, voiceText, matchedCountry, isCorrect, selectedAnswer, matchedAlias }: VoiceFeedbackProps) {
  if (!voiceSupported) return null;
  return (
    <>
      {voiceSelectedOption === null && voiceText && !selectedAnswer && (
        <div className="voice-text">
          You said: "{voiceText}"
          <div className="voice-no-match">No matching country found</div>
        </div>
      )}

      {voiceSelectedOption !== null && matchedCountry && !isCorrect && (
        <div className="voice-text">
          <div>You said: "{voiceText}"</div>
          <div className="voice-match">
            Matched to: {matchedCountry}
            {matchedAlias && ` (recognized as "${matchedAlias}")`}
          </div>
        </div>
      )}
    </>
  );
}

export default VoiceFeedback; 