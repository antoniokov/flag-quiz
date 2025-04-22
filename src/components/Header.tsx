// Removed explicit React import as not required for JSX with modern React setups

interface HeaderProps {
  questionNumber: number;
  totalQuestions: number;
  score: number;
  voiceMode: boolean;
  toggleVoiceMode: () => void;
  gameOver: boolean;
}

function Header({ questionNumber, totalQuestions, score, voiceMode, toggleVoiceMode, gameOver }: HeaderProps) {
  return (
    <div
      className="quiz-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #eee',
        marginBottom: '1.5rem',
        gap: '1.5rem',
      }}
    >
      <div className="quiz-progress" style={{ fontWeight: 500 }}>
        Question {questionNumber} of {totalQuestions}
      </div>
      <div className="quiz-score" style={{ fontWeight: 500 }}>
        Score: {score}
      </div>
      <button
        className={`voice-mode-icon-button${voiceMode ? ' enabled' : ' disabled'}`}
        onClick={toggleVoiceMode}
        disabled={gameOver}
        aria-label={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
        title={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
        style={{
          background: voiceMode ? '#2563eb' : '#f3f4f6',
          border: voiceMode ? '2px solid #2563eb' : '2px solid #ccc',
          color: voiceMode ? '#fff' : '#888',
          borderRadius: '50%',
          width: '2.8rem',
          height: '2.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: voiceMode ? '0 0 0 2px #bcd6fa' : 'none',
          cursor: gameOver ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          outline: 'none',
        }}
      >
        <span aria-hidden="true" style={{ pointerEvents: 'none', filter: voiceMode ? 'none' : 'grayscale(0.8)' }}>
          🎤
        </span>
      </button>
    </div>
  );
}

export default Header; 