import { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { generateQuiz } from '../utils/quizUtils';
import FlagOption from './FlagOption';
import QuizResult from './QuizResult';
import '../styles/FlagQuiz.css';

const TOTAL_QUESTIONS = 10;
const DELAY_BEFORE_NEXT = 2000; // 2 seconds delay
const MIN_SCORE = 1000; // Minimum score for a correct answer
const MAX_SCORE = 2000; // Maximum score for a correct answer in 1 second or less
const MAX_TIME = 5000; // Time in ms after which only minimum score is awarded (5 seconds)

function FlagQuiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    score: 0,
    totalQuestions: TOTAL_QUESTIONS,
    questionIndex: 0,
    selectedAnswer: null,
    isCorrect: null,
    gameOver: false,
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastPoints, setLastPoints] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [voiceText, setVoiceText] = useState<string>('');
  const [voiceSelectedOption, setVoiceSelectedOption] = useState<string | null>(null);
  const [showAvailableOptions, setShowAvailableOptions] = useState<boolean>(false);
  const [voiceMode, setVoiceMode] = useState<boolean>(false);
  
  // Ref to store the question start time
  const questionStartTime = useRef<number>(0);
  // Reference for the SpeechRecognition API
  const recognitionRef = useRef<any>(null);
  // Ref to always access the latest quizState in event handlers
  const quizStateRef = useRef(quizState);
  useEffect(() => {
    quizStateRef.current = quizState;
  }, [quizState]);

  // Initialize quiz
  useEffect(() => {
    startQuiz();
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      setVoiceSupported(false);
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    
    // Handle recognition results
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setVoiceText(transcript);
 
      // Use the latest quizState via ref to avoid stale closure
      if (quizStateRef.current.currentQuestion) {
        findAndSelectMatchingOption(transcript);
      }
      
      setIsListening(false);
    };

    
    // Handle errors
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    // Handle end of recognition
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Simple direct matching function
  const normalize = (str: string) => str.toLowerCase().trim().replace(/["']/g, '');
  const findAndSelectMatchingOption = (transcript: string) => {
    console.log('Transcript:', transcript);
    if (!quizStateRef.current.currentQuestion || !transcript) return;

    const cleanTranscript = normalize(transcript);
    console.log('CT:', cleanTranscript);

    let matchedOption = null;
    for (const option of quizStateRef.current.currentQuestion.options) {
      console.log('Comparing:', JSON.stringify(cleanTranscript), JSON.stringify(normalize(option.name)));
      if (cleanTranscript === normalize(option.name)) {
        matchedOption = option;
        break;
      }
    }

    if (matchedOption) {
      const countryCode = matchedOption.code;
      // Simulate the same logic as if the user clicked the option
      setVoiceSelectedOption(countryCode);
      checkAnswer(countryCode); // Let checkAnswer handle all quizState updates
    } else {
      setVoiceSelectedOption(null);
      setShowAvailableOptions(true);
    }
  };

  // Set the start time when a new question is shown
  useEffect(() => {
    if (!loading && !quizState.selectedAnswer && !quizState.gameOver) {
      questionStartTime.current = Date.now();
      setVoiceText('');
      setVoiceSelectedOption(null);
      setShowAvailableOptions(false);
    }
  }, [quizState.questionIndex, loading, quizState.selectedAnswer, quizState.gameOver]);

  // Auto-advance to next question after delay
  useEffect(() => {
    let timer: number | undefined;
    
    if (quizState.selectedAnswer) {
      timer = window.setTimeout(() => {
        nextQuestion();
      }, DELAY_BEFORE_NEXT);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [quizState.selectedAnswer]);

  // Start voice recognition
  const startVoiceRecognition = () => {
    if (!voiceSupported || isListening || quizState.selectedAnswer) return;
    try {
      setVoiceText('');
      setVoiceSelectedOption(null);
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition error on start:', error);
      setIsListening(false);
    }
  };

  // Stop voice recognition
  const stopVoiceRecognition = () => {
    if (!isListening) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Speech recognition error on stop:', error);
    }
  };

  // Toggle voice mode for the entire quiz
  const toggleVoiceMode = () => {
    setVoiceMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        startVoiceRecognition();
      } else {
        stopVoiceRecognition();
      }
      return newMode;
    });
  };

  // Automatically start listening on new questions if voiceMode is enabled
  useEffect(() => {
    if (
      voiceMode &&
      !quizState.gameOver &&
      !loading &&
      !quizState.selectedAnswer &&
      voiceSupported
    ) {
      startVoiceRecognition();
    }
    // Stop listening if quiz is over or voiceMode is off
    if ((!voiceMode || quizState.gameOver) && isListening) {
      stopVoiceRecognition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState.questionIndex, voiceMode, quizState.gameOver, loading]);

  // Directly select a country by clicking on the speech options overlay
  const selectCountryFromOverlay = (countryCode: string) => {
    setShowAvailableOptions(false);
    checkAnswer(countryCode);
  };

  const startQuiz = () => {
    setLoading(true);
    const newQuestions = generateQuiz(TOTAL_QUESTIONS);
    
    setQuestions(newQuestions);
    setQuizState({
      currentQuestion: newQuestions[0],
      score: 0,
      totalQuestions: TOTAL_QUESTIONS,
      questionIndex: 0,
      selectedAnswer: null,
      isCorrect: null,
      gameOver: false,
    });
    setLastPoints(0);
    setVoiceText('');
    setVoiceSelectedOption(null);
    setShowAvailableOptions(false);
    setLoading(false);
  };

  const calculateScore = (responseTimeMs: number): number => {
    if (responseTimeMs <= 1000) {
      return MAX_SCORE; // Full points for 1 second or less
    }
    
    if (responseTimeMs >= MAX_TIME) {
      return MIN_SCORE; // Minimum points for 5 seconds or more
    }
    
    // Linear interpolation between MIN_SCORE and MAX_SCORE based on time
    const timeRatio = 1 - ((responseTimeMs - 1000) / (MAX_TIME - 1000));
    return Math.round(MIN_SCORE + timeRatio * (MAX_SCORE - MIN_SCORE));
  };

  const checkAnswer = (countryCode: string) => {
    setQuizState(prev => {
      if (prev.selectedAnswer || !prev.currentQuestion) return prev;

      // Stop voice recognition if it's active
      if (isListening) {
        stopVoiceRecognition();
      }

      const isCorrect = countryCode === prev.currentQuestion.correctCountry.code;
      const responseTime = Date.now() - questionStartTime.current;

      // Calculate points based on response time if answer is correct
      let points = 0;
      if (isCorrect) {
        points = calculateScore(responseTime);
        setLastPoints(points);
      }

      // Update score if answer is correct
      const newScore = isCorrect ? prev.score + points : prev.score;

      return {
        ...prev,
        selectedAnswer: countryCode,
        isCorrect,
        score: newScore,
      };
    });
  };

  const nextQuestion = () => {
    const nextIndex = quizState.questionIndex + 1;
    
    if (nextIndex >= quizState.totalQuestions) {
      setQuizState({
        ...quizState,
        gameOver: true,
      });
      return;
    }
    
    setQuizState({
      ...quizState,
      questionIndex: nextIndex,
      currentQuestion: questions[nextIndex],
      selectedAnswer: null,
      isCorrect: null,
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (quizState.gameOver) {
    return (
      <QuizResult 
        score={quizState.score} 
        totalQuestions={quizState.totalQuestions} 
        onRestart={startQuiz} 
      />
    );
  }

  // Safe to access currentQuestion as we've checked loading state
  const currentQuestion = quizState.currentQuestion!;

  return (
    <div className="flag-quiz">
      <div className="quiz-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #eee',
        marginBottom: '1.5rem',
        gap: '1.5rem',
      }}>
        <div className="quiz-progress" style={{ fontWeight: 500 }}>
          Question {quizState.questionIndex + 1} of {quizState.totalQuestions}
        </div>
        <div className="quiz-score" style={{ fontWeight: 500 }}>
          Score: {quizState.score}
        </div>
        <button
          className={`voice-mode-icon-button${voiceMode ? ' enabled' : ' disabled'}`}
          onClick={toggleVoiceMode}
          disabled={quizState.gameOver}
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
            cursor: quizState.gameOver ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          <span aria-hidden="true" style={{ pointerEvents: 'none', filter: voiceMode ? 'none' : 'grayscale(0.8)' }}>
            🎤
          </span>
        </button>
      </div>
      
      <div className="quiz-content">
        <div className="quiz-question">
          <h2>Which country does this flag belong to?</h2>
          <div className="flag-container">
            <img 
              src={`https://flagcdn.com/w320/${currentQuestion.correctCountry.code.toLowerCase()}.png`} 
              alt="Flag" 
              className="flag-image" 
            />
          </div>
        </div>
        
        {voiceSupported && voiceSelectedOption === null && voiceText && !quizState.selectedAnswer && (
          <div className="voice-text">
            You said: "{voiceText}"
            <div className="voice-no-match">No matching country found</div>
          </div>
        )}
        
        <div className="options-container">
          {currentQuestion.options.map((country) => (
            <FlagOption
              key={country.code}
              country={country}
              selectedAnswer={quizState.selectedAnswer}
              correctAnswer={currentQuestion.correctCountry.code}
              voiceSelected={voiceSelectedOption === country.code}
              onClick={() => checkAnswer(country.code)}
            />
          ))}
        </div>
        
        <div className={`feedback-container ${!quizState.selectedAnswer || voiceSelectedOption === null ? 'hidden' : ''}`}>
          {quizState.selectedAnswer && voiceSelectedOption !== null && (
            <div className={`feedback ${quizState.isCorrect ? 'correct' : 'incorrect'}`}>
              {quizState.isCorrect 
                ? `Correct! +${lastPoints} points` 
                : `Incorrect! The correct answer is ${currentQuestion.correctCountry.name}.`
              }
            </div>
          )}
        </div>
      </div>
      
      {/* Speech options overlay - shows when voice recognition fails to match */}
      {showAvailableOptions && (
        <div className="speech-options-overlay">
          <div className="speech-options-content">
            <div className="speech-options-header">
              Did you mean one of these countries?
            </div>
            <div className="speech-options-list">
              {currentQuestion.options.map(country => (
                <button 
                  key={country.code} 
                  className="speech-option-button"
                  onClick={() => selectCountryFromOverlay(country.code)}
                >
                  {country.name}
                </button>
              ))}
            </div>
            <div className="speech-options-footer">
              <button 
                className="speech-options-close"
                onClick={() => setShowAvailableOptions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add TypeScript interfaces for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default FlagQuiz; 