// No React import needed with modern JSX transform

interface IntroScreenProps {
  voiceSupported: boolean;
  voiceMode: boolean;
  toggleVoiceMode: () => void;
  onStart: () => void;
}

function IntroScreen({ voiceSupported, voiceMode, toggleVoiceMode, onStart }: IntroScreenProps) {
  return (
    <div className="intro-screen container-consistent">
      <h1>Flag Quiz</h1>
      <p>
        Test your knowledge of flags from around the world! Identify each flag correctly to earn points. The faster you answer, the more points you'll get.
      </p>

      {voiceSupported && (
        <div className="voice-mode-option">
          <button
            onClick={toggleVoiceMode}
            className={`voice-mode-button ${voiceMode ? 'enabled' : 'disabled'}`}
            aria-label={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
            title={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
          >
            <span
              aria-hidden="true"
              style={{ pointerEvents: 'none', filter: voiceMode ? 'none' : 'grayscale(0.8)' }}
            >
              🎤
            </span>
          </button>
          <span style={{ fontWeight: 500 }}>Voice Mode: {voiceMode ? 'On' : 'Off'}</span>
        </div>
      )}

      <button
        onClick={onStart}
        className="start-quiz-button"
      >
        Start Quiz
      </button>
    </div>
  );
}

export default IntroScreen; 