import { useState, useCallback, useMemo } from 'react';
import { Question, QuestionCategory, QuizAnswer, FeedbackData, QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/questions';
import { toast } from 'sonner';

const CATEGORY_ORDER: QuestionCategory[] = ['primary', 'intermediate', 'secondary'];

// URL do Google Apps Script
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzudwHLoaq_LZmYH3vBzHpgq83SGfDjVfWsJJdu9n1LWJChR71ZxVId5xJ3nmV4iDef/exec';

export function useQuizLogic() {
  const [quizState, setQuizState] = useState<QuizState>('welcome');
  const [userName, setUserName] = useState('');
  const [userTeam, setUserTeam] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentCategory = CATEGORY_ORDER[currentCategoryIndex];

  // Get questions for current category
  const categoryQuestions = useMemo(() => {
    return quizQuestions.filter((q) => q.category === currentCategory);
  }, [currentCategory]);

  // Get unanswered questions in current category
  const unansweredQuestions = useMemo(() => {
    return categoryQuestions.filter((q) => !answeredQuestions.has(q.id));
  }, [categoryQuestions, answeredQuestions]);

  // Total questions count
  const totalQuestions = useMemo(() => {
    return quizQuestions.length;
  }, []);

  // Current question number (for display)
  const currentQuestionNumber = useMemo(() => {
    return answeredQuestions.size + 1;
  }, [answeredQuestions]);

  // Correct answers count
  const correctAnswersCount = useMemo(() => {
    return answers.filter((a) => a.isCorrect).length;
  }, [answers]);

  // Select a random question from unanswered
  const selectRandomQuestion = useCallback(() => {
    if (unansweredQuestions.length === 0) {
      // Move to next category
      if (currentCategoryIndex < CATEGORY_ORDER.length - 1) {
        setCurrentCategoryIndex((prev) => prev + 1);
        setAnsweredQuestions(new Set());
      } else {
        // Quiz completed, show feedback
        setQuizState('feedback');
        setIsTimerRunning(false);
      }
      return;
    }

    const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
    setCurrentQuestion(unansweredQuestions[randomIndex]);
  }, [unansweredQuestions, currentCategoryIndex]);

  // Start quiz
  const startQuiz = useCallback((name: string, team: string) => {
    setUserName(name);
    setUserTeam(team);
    setQuizState('quiz');
    setIsTimerRunning(true);
    setCurrentCategoryIndex(0);
    setAnsweredQuestions(new Set());
    setAnswers([]);
    
    // Select first question
    const primaryQuestions = quizQuestions.filter((q) => q.category === 'primary');
    const randomIndex = Math.floor(Math.random() * primaryQuestions.length);
    setCurrentQuestion(primaryQuestions[randomIndex]);
  }, []);

  // Handle answer
  const handleAnswer = useCallback(
    (questionId: string, optionId: string, isCorrect: boolean) => {
      if (!currentQuestion) return;

      const answer: QuizAnswer = {
        name: userName,
        team: userTeam,
        questionId,
        questionText: currentQuestion.text,
        selectedOption: optionId,
        isCorrect,
        category: currentCategory,
        timestamp: new Date().toISOString(),
      };

      // Save answer
      setAnswers((prev) => [...prev, answer]);

      // Send to Google Sheets
      sendAnswerToSheets(answer);

      if (isCorrect) {
        // Mark as answered and move to next
        setAnsweredQuestions((prev) => new Set([...prev, questionId]));
        
        // Check if category is complete
        const remainingInCategory = unansweredQuestions.filter((q) => q.id !== questionId);
        
        if (remainingInCategory.length === 0) {
          // Move to next category
          if (currentCategoryIndex < CATEGORY_ORDER.length - 1) {
            setTimeout(() => {
              setCurrentCategoryIndex((prev) => prev + 1);
              setAnsweredQuestions(new Set());
              const nextCategory = CATEGORY_ORDER[currentCategoryIndex + 1];
              const nextCategoryQuestions = quizQuestions.filter((q) => q.category === nextCategory);
              const randomIndex = Math.floor(Math.random() * nextCategoryQuestions.length);
              setCurrentQuestion(nextCategoryQuestions[randomIndex]);
            }, 100);
          } else {
            // Quiz completed
            setTimeout(() => {
              setQuizState('feedback');
              setIsTimerRunning(false);
            }, 100);
          }
        } else {
          // Select next random question in same category
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * remainingInCategory.length);
            setCurrentQuestion(remainingInCategory[randomIndex]);
          }, 100);
        }
      } else {
        // Wrong answer - select another random question from same category (excluding current)
        const otherQuestions = categoryQuestions.filter((q) => q.id !== questionId);
        if (otherQuestions.length > 0) {
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * otherQuestions.length);
            setCurrentQuestion(otherQuestions[randomIndex]);
          }, 100);
        }
      }
    },
    [currentQuestion, userName, userTeam, currentCategory, unansweredQuestions, currentCategoryIndex, categoryQuestions]
  );

  // Handle feedback submit
  const handleFeedbackSubmit = useCallback((feedback: FeedbackData) => {
    sendFeedbackToSheets(feedback);
    setQuizState('completed');
    toast.success('Feedback enviado com sucesso!');
  }, []);

  // Handle time up (5 min)
  const handleTimeUp = useCallback(() => {
    toast.warning('Tempo esgotado! Você tem 2 minutos extras.', {
      duration: 4000,
    });
  }, []);

  // Handle extra time up
  const handleExtraTimeUp = useCallback(() => {
    toast.error('Tempo esgotado! Quiz encerrado.');
    setQuizState('feedback');
    setIsTimerRunning(false);
  }, []);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    setQuizState('welcome');
    setUserName('');
    setUserTeam('');
    setCurrentCategoryIndex(0);
    setAnsweredQuestions(new Set());
    setCurrentQuestion(null);
    setAnswers([]);
    setIsTimerRunning(false);
  }, []);

  return {
    quizState,
    userName,
    userTeam,
    currentQuestion,
    currentCategory,
    currentQuestionNumber,
    totalQuestions,
    correctAnswersCount,
    isTimerRunning,
    categoryQuestions,
    startQuiz,
    handleAnswer,
    handleFeedbackSubmit,
    handleTimeUp,
    handleExtraTimeUp,
    restartQuiz,
  };
}

// Mock functions for Google Sheets integration
async function sendAnswerToSheets(answer: QuizAnswer) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'answer', data: answer }),
    });
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
  }
}

async function sendFeedbackToSheets(feedback: FeedbackData) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'feedback', data: feedback }),
    });
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
  }
}
