import { WelcomeScreen } from '@/components/quiz/WelcomeScreen';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { FeedbackForm } from '@/components/quiz/FeedbackForm';
import { CompletedScreen } from '@/components/quiz/CompletedScreen';
import { Timer } from '@/components/quiz/Timer';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { BsPersonFill } from "react-icons/bs";

const Index = () => {
  const {
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
  } = useQuizLogic();

  if (quizState === 'welcome') {
    return <WelcomeScreen onStart={startQuiz} />;
  }

  if (quizState === 'quiz' && currentQuestion) {
    // Lógica para calcular erros:
    // Pega o número da pergunta atual e subtrai 1 para saber quantas já passaram.
    // Depois subtrai os acertos para sobrar os erros.
    const answeredCount = currentQuestionNumber - 1;
    const wrongAnswersCount = answeredCount - correctAnswersCount;

    return (
      <div className="min-h-screen bg-secondary">
        {/* Timer */}
        <Timer
          isRunning={isTimerRunning}
          onTimeUp={handleTimeUp}
          onExtraTimeUp={handleExtraTimeUp}
        />

        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="container max-w-3xl py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <BsPersonFill className="text-primary-foreground text-2xl" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Nome: {userName}</p>
                  <p className="text-sm text-muted-foreground">Equipe: {userTeam}</p>
                </div>
              </div>
              
              {/* Placar de Acertos e Erros */}
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                  {correctAnswersCount} Acertos
                </p>
                <p className="text-sm font-bold text-rose-500 flex items-center justify-end gap-1">
                  {wrongAnswersCount} Erros
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Quiz Content */}
        <main className="container max-w-3xl py-8 px-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionNumber}
            totalQuestions={totalQuestions}
            category={currentCategory}
            onAnswer={handleAnswer}
          />
        </main>
      </div>
    );
  }

  if (quizState === 'feedback') {
    return (
      <FeedbackForm
        name={userName}
        team={userTeam}
        onSubmit={handleFeedbackSubmit}
      />
    );
  }

  if (quizState === 'completed') {
    return (
      <CompletedScreen
        name={userName}
        team={userTeam}
        correctAnswers={correctAnswersCount}
        totalQuestions={totalQuestions}
        onRestart={restartQuiz}
      />
    );
  }

  return null;
};

export default Index;