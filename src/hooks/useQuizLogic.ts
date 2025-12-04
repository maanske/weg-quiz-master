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

  // Handle answer (LÓGICA CORRIGIDA)
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

      // 1. Salva a resposta (Independente se acertou ou errou)
      setAnswers((prev) => [...prev, answer]);

      // 2. Envia para o Google Sheets
      sendAnswerToSheets(answer);

      // 3. Marca a pergunta como respondida para não repetir
      setAnsweredQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        return newSet;
      });

      // 4. Lógica de Navegação: Próxima pergunta ou próxima fase
      // Remove a pergunta atual da lista de "restantes"
      const remainingInCategory = unansweredQuestions.filter((q) => q.id !== questionId);

      if (remainingInCategory.length === 0) {
        // --- ACABOU A CATEGORIA ATUAL ---
        
        if (currentCategoryIndex < CATEGORY_ORDER.length - 1) {
          // Tem próxima categoria? Avança.
          setTimeout(() => {
            setCurrentCategoryIndex((prev) => prev + 1);
            setAnsweredQuestions(new Set()); // Reseta respondidas para a nova fase
            
            // Pega a primeira pergunta da nova categoria
            const nextCategory = CATEGORY_ORDER[currentCategoryIndex + 1];
            const nextCategoryQuestions = quizQuestions.filter((q) => q.category === nextCategory);
            
            if (nextCategoryQuestions.length > 0) {
              const randomIndex = Math.floor(Math.random() * nextCategoryQuestions.length);
              setCurrentQuestion(nextCategoryQuestions[randomIndex]);
            }
          }, 600); // Delay visual
        } else {
          // Não tem mais categorias? Quiz Finalizado.
          setTimeout(() => {
            setQuizState('feedback');
            setIsTimerRunning(false);
          }, 600);
        }

      } else {
        // --- AINDA TEM PERGUNTAS NA MESMA CATEGORIA ---
        
        // Seleciona a próxima aleatória
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * remainingInCategory.length);
          setCurrentQuestion(remainingInCategory[randomIndex]);
        }, 600);
      }
    },
    [currentQuestion, userName, userTeam, currentCategory, unansweredQuestions, currentCategoryIndex]
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