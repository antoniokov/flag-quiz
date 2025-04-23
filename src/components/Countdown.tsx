// No React import needed with modern JSX transform

interface CountdownProps {
  countdown: number;
}

function Countdown({ countdown }: CountdownProps) {
  return (
    <div className="countdown container-consistent">
      Starting in {countdown}
    </div>
  );
}

export default Countdown; 