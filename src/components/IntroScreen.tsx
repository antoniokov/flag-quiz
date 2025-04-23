// Removed explicit React import as not required for JSX with modern React setups

interface IntroScreenProps {
  voiceSupported: boolean;
  voiceMode: boolean;
  toggleVoiceMode: () => void;
  onStart: () => void;
}

function IntroScreen({ voiceSupported, voiceMode, toggleVoiceMode, onStart }: IntroScreenProps) {
  return (
    <div
      className="intro-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: '#2563eb',
          marginBottom: '2rem',
        }}
      >
        Flag Quiz
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          marginBottom: '1.5rem',
          maxWidth: '600px',
          lineHeight: 1.6,
        }}
      >
        Test your knowledge of flags from around the world! Identify each flag correctly to earn points. The faster you answer, the more points you'll get.
      </p>

      {voiceSupported && (
        <div className="voice-mode-option">
          <button
            onClick={toggleVoiceMode}
            style={{
              background: voiceMode ? '#2563eb' : '#f3f4f6',
              border: voiceMode ? '2px solid #2563eb' : '2px solid #ccc',
              color: voiceMode ? '#fff' : '#888',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              boxShadow: voiceMode ? '0 0 0 2px #bcd6fa' : 'none',
            }}
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
        style={{
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '1rem 3rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(37, 99, 235, 0.25)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 10px rgba(37, 99, 235, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.25)';
        }}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default IntroScreen; 