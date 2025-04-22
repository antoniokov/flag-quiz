// Removed explicit React import as not required for JSX with modern React setups

interface CountdownProps {
  countdown: number;
}

function Countdown({ countdown }: CountdownProps) {
  return (
    <div
      className="countdown"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        fontSize: '3rem',
        fontWeight: 700,
        color: '#2563eb',
        letterSpacing: '0.1em',
      }}
    >
      Starting in {countdown}
    </div>
  );
}

export default Countdown; 