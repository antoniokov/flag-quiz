interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

function QuizResult({ score, totalQuestions, onRestart }: QuizResultProps) {
  // Calculate the maximum possible score (2000 points per question)
  const maxPossibleScore = totalQuestions * 2000;
  const percentage = Math.round((score / maxPossibleScore) * 100);
  
  let resultMessage = '';
  if (percentage >= 90) {
    resultMessage = 'Outstanding! You\'re a flag expert with lightning-fast reflexes!';
  } else if (percentage >= 70) {
    resultMessage = 'Great job! You really know your flags and you\'re quick!';
  } else if (percentage >= 50) {
    resultMessage = 'Good effort! Your knowledge and speed are improving!';
  } else {
    resultMessage = 'Keep practicing! You\'ll get faster and more accurate with time.';
  }
  
  // Calculate average points per question
  const averagePoints = Math.round(score / totalQuestions);
  
  return (
    <div className="quiz-result container-consistent">
      <h2>Quiz Completed!</h2>
      
      <div className="score-display">
        <div className="score">
          {score.toLocaleString()} points
        </div>
        <div className="percentage">
          {percentage}% of maximum possible score
        </div>
        <div className="average-points">
          Average {averagePoints.toLocaleString()} points per question
        </div>
      </div>
      
      <p className="result-message">{resultMessage}</p>
      
      <div className="score-explanation">
        <p>Scoring system:</p>
        <ul>
          <li>2000 points: Answer correctly in 1 second or less</li>
          <li>1000-2000 points: Based on how quickly you answer correctly</li>
          <li>1000 points: Answer correctly in 5 seconds or more</li>
          <li>0 points: Incorrect answer</li>
        </ul>
      </div>
      
      <button className="restart-button" onClick={onRestart}>
        Try Again
      </button>
    </div>
  );
}

export default QuizResult; 