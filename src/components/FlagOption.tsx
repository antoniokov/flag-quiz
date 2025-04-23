import { Country } from '../types';

interface FlagOptionProps {
  country: Country;
  selectedAnswer: string | null;
  correctAnswer: string;
  voiceSelected: boolean;
  onClick: () => void;
}

function FlagOption({ 
  country, 
  selectedAnswer, 
  correctAnswer, 
  voiceSelected,
  onClick 
}: FlagOptionProps) {
  const isSelected = selectedAnswer === country.code;
  const isCorrect = country.code === correctAnswer;
  
  // Determine CSS classes based on selection state
  let optionClass = "flag-option";
  
  if (selectedAnswer) {
    // Always highlight the correct answer when any option is selected
    if (isCorrect) {
      optionClass += " correct";
    } else if (isSelected) {
      // Only highlight the selected option as incorrect if it's wrong
      optionClass += " incorrect";
    }
  }
  
  // Add voice-selected class when this option is selected by voice
  if (voiceSelected && !selectedAnswer) {
    optionClass += " voice-selected";
  }
  
  return (
    <button 
      className={optionClass} 
      onClick={onClick}
      disabled={selectedAnswer !== null}
      style={{ color: "#333" }}
    >
      {country.name}
    </button>
  );
}

export default FlagOption; 