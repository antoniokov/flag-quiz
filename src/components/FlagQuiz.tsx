import { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { generateQuiz } from '../utils/quizUtils';
import FlagOption from './FlagOption';
import QuizResult from './QuizResult';
import '../styles/FlagQuiz.css';
import IntroScreen from './IntroScreen';
import Countdown from './Countdown';
import Header from './Header';
import VoiceFeedback from './VoiceFeedback';

// Add TypeScript interfaces for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const TOTAL_QUESTIONS = 10;
const DELAY_BEFORE_NEXT = 2000; // 2 seconds delay
const MIN_SCORE = 1000; // Minimum score for a correct answer
const MAX_SCORE = 2000; // Maximum score for a correct answer
const MIN_TIME = 2000; // Time in ms after which only minimum score is awarded (2 seconds)
const MAX_TIME = 10000; // Time in ms after which only minimum score is awarded (10 seconds)

function FlagQuiz() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(3);
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
  const [voiceMode, setVoiceMode] = useState<boolean>(true);
  const [matchedCountry, setMatchedCountry] = useState<string | null>(null);
  const [matchedAlias, setMatchedAlias] = useState<string | null>(null);
  
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
      setVoiceText(transcript);
 
      // Use the latest quizState via ref to avoid stale closure
      if (quizStateRef.current.currentQuestion) {
        // Optimize for country name recognition
        // Clean up the transcript - remove common prefixes that might appear in voice recognition
        let cleanedTranscript = transcript
          .replace(/^(the|this is|that's|i think it's|it's|it is|maybe|probably|possibly|i guess|sounds like|looks like)/i, '')
          .trim();
          
        findAndSelectMatchingOption(cleanedTranscript);
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

  // Calculate string similarity using Levenshtein distance
  const calculateSimilarity = (str1: string, str2: string): number => {
    const a = normalize(str1);
    const b = normalize(str2);
    
    // Perfect match
    if (a === b) return 1;
    
    // Simple check for one being a substring of the other
    if (a.includes(b) || b.includes(a)) {
      const ratio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
      // Return a high score if one is a near-complete substring of the other
      return ratio > 0.7 ? 0.9 : 0.7 * ratio;
    }
    
    // Levenshtein distance calculation
    const matrix: number[][] = [];
    
    // Initialize matrix
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    // Calculate similarity score between 0 and 1
    const distance = matrix[a.length][b.length];
    const maxLength = Math.max(a.length, b.length);
    
    // Return similarity score (1 - normalized distance)
    return 1 - distance / maxLength;
  };
  
  const findAndSelectMatchingOption = (transcript: string) => {
    console.log('Transcript:', transcript);
    if (!quizStateRef.current.currentQuestion || !transcript) return;

    const cleanTranscript = normalize(transcript);

    // Object to store similarity scores for each option
    const similarities: { [code: string]: number } = {};
    let bestMatch: { code: string, score: number, matchedAlias: string | null } = { 
      code: '', 
      score: 0,
      matchedAlias: null
    };
    
    // Calculate similarity score for each option
    for (const option of quizStateRef.current.currentQuestion.options) {
      // First check against the country name
      let similarity = calculateSimilarity(cleanTranscript, option.name);
      let matchedAlias = null;
      
      // Then check against each alias if they exist
      if (option.aliases && option.aliases.length > 0) {
        for (const alias of option.aliases) {
          const aliasSimilarity = calculateSimilarity(cleanTranscript, alias);
          // Use the highest similarity score found (either from name or any alias)
          if (aliasSimilarity > similarity) {
            similarity = aliasSimilarity;
            matchedAlias = alias;
          }
        }
      }
      
      similarities[option.code] = similarity;
      
      // Track the best match
      if (similarity > bestMatch.score) {
        bestMatch = { 
          code: option.code, 
          score: similarity,
          matchedAlias: matchedAlias
        };
      }
    }
    
    console.log('Similarity scores:', similarities);
    
    // Consider it a match if similarity is above threshold
    const SIMILARITY_THRESHOLD = 0.6;
    
    if (bestMatch.score >= SIMILARITY_THRESHOLD) {
      const countryCode = bestMatch.code;
      const matchedOption = quizStateRef.current.currentQuestion.options.find(
        option => option.code === countryCode
      );
      // Store the matched country name for display
      setMatchedCountry(matchedOption?.name || null);
      setMatchedAlias(bestMatch.matchedAlias);
      // Simulate the same logic as if the user clicked the option
      setVoiceSelectedOption(countryCode);
      checkAnswer(countryCode); // Let checkAnswer handle all quizState updates
    } else {
      setVoiceSelectedOption(null);
      setMatchedCountry(null);
      setMatchedAlias(null);
      setShowAvailableOptions(true);
    }
  };

  // Start the quiz after intro
  const handleStartQuiz = () => {
    setShowIntro(false);
    setCountdown(3);
  };
  
  // Countdown before first question
  useEffect(() => {
    // Only run countdown if intro is done, quiz is at the first question and not answered/game over/loading
    if (!showIntro && !loading && quizState.questionIndex === 0 && !quizState.selectedAnswer && !quizState.gameOver) {
      setCountdown(3);
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
      setVoiceText('');
      setVoiceSelectedOption(null);
      setShowAvailableOptions(false);
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
    if (!voiceSupported || quizState.selectedAnswer) return;
    
    try {
      // First ensure recognition is stopped before starting
      if (isListening) {
        try {
          recognitionRef.current.stop();
        } catch (stopError) {
          console.error('Error stopping speech recognition:', stopError);
        }
        // Small delay to ensure recognition has properly stopped
        setTimeout(() => {
          try {
            setVoiceText('');
            setVoiceSelectedOption(null);
            recognitionRef.current.start();
            setIsListening(true);
          } catch (startError) {
            console.error('Speech recognition error on delayed start:', startError);
            setIsListening(false);
          }
        }, 100);
      } else {
        setVoiceText('');
        setVoiceSelectedOption(null);
        recognitionRef.current.start();
        setIsListening(true);
      }
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
      voiceSupported &&
      !isListening  // Only start if not already listening
    ) {
      // Add a small delay to ensure any previous recognition has fully stopped
      setTimeout(() => {
        startVoiceRecognition();
      }, 100);
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
    setShowAvailableOptions(false);
    setLoading(false);
  };

  const calculateScore = (responseTimeMs: number): number => {
    if (responseTimeMs <= MIN_TIME) {
      return MAX_SCORE; // Full points for 1 second or less
    }
    
    if (responseTimeMs >= MAX_TIME) {
      return MIN_SCORE; // Minimum points for 5 seconds or more
    }
    
    // Linear interpolation between MIN_SCORE and MAX_SCORE based on time
    const timeRatio = 1 - ((responseTimeMs - MIN_TIME) / (MAX_TIME - MIN_TIME));
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
          matchedCountry={matchedCountry}
          isCorrect={quizState.isCorrect}
          selectedAnswer={quizState.selectedAnswer}
          matchedAlias={matchedAlias}
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

export default FlagQuiz; 