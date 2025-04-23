import { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { generateQuiz } from '../utils/quizUtils';
import FlagOption from './FlagOption';
import QuizResult from './QuizResult';
import '../styles/index.css';
import IntroScreen from './IntroScreen';
import Countdown from './Countdown';
import Header from './Header';
import VoiceFeedback from './VoiceFeedback';
import { TOTAL_QUESTIONS, DELAY_BEFORE_NEXT, COUNTDOWN_TIME, VOICE_RESTART_DELAY, VOICE_ERROR_RESTART_DELAY, VOICE_LONG_ERROR_DELAY, VOICE_INIT_DELAY } from '../constants';
import { findBestMatch } from '../utils/speechUtils';
import { calculateScore } from '../utils/scoreUtils';

function FlagQuiz() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_TIME / 1000);
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
  const [voiceMode, setVoiceMode] = useState<boolean>(true);

  // Ref to store the question start time
  const questionStartTime = useRef<number>(0);
  // Reference for the SpeechRecognition API
  const recognitionRef = useRef<any>(null);
  // Ref to track if recognition is actually running (regardless of React state)
  const recognitionActive = useRef<boolean>(false);
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
      setVoiceMode(false); // Disable voice mode if not supported
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    
    // Voice mode is enabled by default, so we'll start listening once the quiz is ready
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    
    // Handle recognition results
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      // Don't update voiceText to avoid displaying any feedback
      // setVoiceText(transcript);
 
      // Use the latest quizState via ref to avoid stale closure
      if (quizStateRef.current.currentQuestion) {
        // Optimize for country name recognition
        // Clean up the transcript - remove common prefixes that might appear in voice recognition
        let cleanedTranscript = transcript
          .replace(/^(the|this is|that's|i think it's|it's|it is|maybe|probably|possibly|i guess|sounds like|looks like)/i, '')
          .trim();
          
        // Try to find a matching option
        const matchFound = findAndSelectMatchingOption(cleanedTranscript);
        
        // If no match is found and we're still in the current question,
        // restart listening immediately
        if (!matchFound && 
            !quizStateRef.current.selectedAnswer && 
            !quizStateRef.current.gameOver) {
          // Short timeout to allow the recognition service to reset
          setTimeout(() => {
            if (!quizStateRef.current.selectedAnswer && 
                !quizStateRef.current.gameOver && 
                voiceMode) {
              startVoiceRecognition();
            }
          }, VOICE_RESTART_DELAY);
        }
      }
      
      recognitionActive.current = false;
      setIsListening(false);
    };

    
    // Handle errors
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      recognitionActive.current = false;
      setIsListening(false);
      
      // Restart listening after error if still in active question
      // Don't restart immediately on InvalidState errors
      if (!quizStateRef.current.selectedAnswer && 
          !quizStateRef.current.gameOver && 
          voiceMode &&
          event.error !== 'not-allowed' && // Don't retry if user denied permission
          event.error !== 'aborted') {     // Don't retry if deliberately aborted
        setTimeout(() => startVoiceRecognition(), VOICE_ERROR_RESTART_DELAY);
      }
    };
    
    // Handle end of recognition
    recognitionRef.current.onend = () => {
      recognitionActive.current = false;
      setIsListening(false);
      
      // Restart listening if no match was found and we're still in active question
      if (!quizStateRef.current.selectedAnswer && 
          !quizStateRef.current.gameOver && 
          voiceMode) {
        setTimeout(() => {
          if (!quizStateRef.current.selectedAnswer && voiceMode) {
            startVoiceRecognition();
          }
        }, VOICE_ERROR_RESTART_DELAY);
      }
    };
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition during cleanup:', error);
        }
        recognitionActive.current = false;
      }
    };
  }, []);
  
  const findAndSelectMatchingOption = (transcript: string) => {
    if (!quizStateRef.current.currentQuestion || !transcript) return false;

    const bestMatch = findBestMatch(transcript, quizStateRef.current.currentQuestion.options);

    if (bestMatch) {
      const countryCode = bestMatch.code;
      // Don't set these state variables to avoid any UI feedback
      // setMatchedCountry(matchedOption?.name || null);
      // setMatchedAlias(bestMatch.matchedAlias);
      // setVoiceSelectedOption(countryCode);
      checkAnswer(countryCode);
      return true;
    } else {
      // Don't set these state variables to avoid any UI feedback
      // setVoiceSelectedOption(null);
      // setMatchedCountry(null);
      // setMatchedAlias(null);
      // Remove overlay display - just keep listening
      return false;
    }
  };

  // Start the quiz after intro
  const handleStartQuiz = () => {
    setShowIntro(false);
    setCountdown(COUNTDOWN_TIME / 1000);
  };
  
  // Countdown before first question
  useEffect(() => {
    // Only run countdown if intro is done, quiz is at the first question and not answered/game over/loading
    if (!showIntro && !loading && quizState.questionIndex === 0 && !quizState.selectedAnswer && !quizState.gameOver) {
      setCountdown(COUNTDOWN_TIME / 1000);
      let interval: ReturnType<typeof setInterval>;
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showIntro, loading, quizState.questionIndex, quizState.selectedAnswer, quizState.gameOver]);

  useEffect(() => {
    // Only allow question to start if not loading, not answered, not game over, and either not first question or countdown is done
    if (!loading && !quizState.selectedAnswer && !quizState.gameOver && (quizState.questionIndex !== 0 || countdown === 0)) {
      questionStartTime.current = Date.now();
      // Don't reset voice text state to avoid UI updates
      // setVoiceText('');
      // setVoiceSelectedOption(null);
    }
  }, [quizState.questionIndex, loading, quizState.selectedAnswer, quizState.gameOver, countdown]);

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
    // Don't attempt to start if:
    // 1. Voice is not supported
    // 2. We've already answered
    // 3. Game is over
    // 4. Recognition is already active (using the ref, not just React state)
    if (!voiceSupported || 
        quizState.selectedAnswer || 
        quizState.gameOver || 
        recognitionActive.current) {
      return;
    }
    
    try {
      // Use our ref to determine if recognition is truly active
      if (!recognitionActive.current) {
        recognitionRef.current.start();
        recognitionActive.current = true;
        setIsListening(true);
      }
    } catch (error) {
      console.error('Speech recognition error on start:', error);
      recognitionActive.current = false;
      setIsListening(false);
      
      // Try to restart after an error - but only for errors that aren't due to already running
      if (!String(error).includes('already started')) {
        setTimeout(() => {
          if (!quizState.selectedAnswer && !quizState.gameOver && voiceMode) {
            startVoiceRecognition();
          }
        }, VOICE_LONG_ERROR_DELAY);
      }
    }
  };

  // Stop voice recognition
  const stopVoiceRecognition = () => {
    // Only attempt to stop if we believe it's running
    if (!recognitionActive.current) return;
    
    try {
      recognitionRef.current.stop();
      recognitionActive.current = false;
      setIsListening(false);
    } catch (error) {
      console.error('Speech recognition error on stop:', error);
      // Reset our tracking state even if there was an error
      recognitionActive.current = false;
      setIsListening(false);
    }
  };

  // Toggle voice mode for the entire quiz
  const toggleVoiceMode = () => {
    setVoiceMode((prev) => {
      const newMode = !prev;
      
      if (newMode) {
        // We'll start recognition in the useEffect that depends on voiceMode
        // No need to call startVoiceRecognition() directly here
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
      // Add a small delay to ensure any previous recognition has fully stopped
      setTimeout(() => {
        startVoiceRecognition();
      }, VOICE_INIT_DELAY);
    }
    // Stop listening if quiz is over or voiceMode is off
    if ((!voiceMode || quizState.gameOver) && isListening) {
      stopVoiceRecognition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState.questionIndex, voiceMode, quizState.gameOver, loading]);

  const startQuiz = () => {
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
    setShowIntro(true); // Show the intro screen first
    setLastPoints(0);
    setVoiceText('');
    setVoiceSelectedOption(null);
    setLoading(false);
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

  // Show intro screen
  if (showIntro) {
    return (
      <IntroScreen
        onStart={handleStartQuiz}
        voiceSupported={voiceSupported}
        toggleVoiceMode={toggleVoiceMode}
        voiceMode={voiceMode}
      />
    );
  }

  // Show countdown before first question
  if (quizState.questionIndex === 0 && countdown > 0 && !quizState.selectedAnswer && !quizState.gameOver) {
    return (
      <Countdown countdown={countdown} />
    );
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
      <Header
        questionNumber={quizState.questionIndex + 1}
        totalQuestions={quizState.totalQuestions}
        score={quizState.score}
        voiceMode={voiceMode}
        toggleVoiceMode={toggleVoiceMode}
        gameOver={quizState.gameOver}
      />
      
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
        
        <VoiceFeedback
          voiceSupported={voiceSupported}
          voiceSelectedOption={voiceSelectedOption}
          voiceText={voiceText}
          matchedCountry={null}
          isCorrect={quizState.isCorrect}
          selectedAnswer={quizState.selectedAnswer}
          matchedAlias={null}
        />
        
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
        
        <div className={`feedback-container ${!quizState.selectedAnswer ? 'hidden' : ''}`}>
          {quizState.selectedAnswer && (
            <div className={`feedback ${quizState.isCorrect ? 'correct' : 'incorrect'}`}>
              {quizState.isCorrect 
                ? `Correct! +${lastPoints} points` 
                : `Incorrect! The correct answer is ${currentQuestion.correctCountry.name}.`
              }
            </div>
          )}
        </div>
      </div>
      
      {/* Remove overlay - we want to keep listening without showing any UI */}
    </div>
  );
}

export default FlagQuiz; 