import { useState, useEffect } from 'react';
import { Question, QuestionCategory } from '@/types/quiz';
import { getCategoryLabel } from '@/data/questions';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  category: QuestionCategory;
  onAnswer: (questionId: string, optionId: string, isCorrect: boolean) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  category,
  onAnswer,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setFlashClass('');
  }, [question.id]);

  const handleOptionClick = (optionId: string) => {
    if (showFeedback) return;

    const option = question.options.find((o) => o.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);
    setIsCorrect(option.isCorrect);
    setShowFeedback(true);
    setFlashClass(option.isCorrect ? 'flash-success' : 'flash-error');

    // Wait for animation then proceed
    setTimeout(() => {
      setFlashClass('');
      onAnswer(question.id, optionId, option.isCorrect);
    }, 600);
  };

  const categoryColors: Record<QuestionCategory, string> = {
    primary: 'bg-primary/10 text-primary',
    intermediate: 'bg-accent/10 text-accent',
    secondary: 'bg-amber-500/10 text-amber-600',
  };

  return (
    <div className={cn('card-weg p-6 md:p-8 animate-fade-in transition-all', flashClass)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            categoryColors[category]
          )}
        >
          {getCategoryLabel(category)}
        </span>
        <span className="text-sm text-muted-foreground">
          Pergunta {questionNumber} de {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6 leading-relaxed">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = showFeedback && option.isCorrect;
          const showIncorrect = showFeedback && isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={showFeedback}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
                'flex items-start gap-3 group',
                !showFeedback && 'hover:border-primary hover:bg-primary/5 cursor-pointer',
                !showFeedback && !isSelected && 'border-border bg-card',
                showCorrect && 'border-success bg-success/5',
                showIncorrect && 'border-destructive bg-destructive/5',
                isSelected && !showFeedback && 'border-primary bg-primary/5',
                showFeedback && !showCorrect && !showIncorrect && 'opacity-50'
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  !showFeedback && 'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground',
                  showCorrect && 'bg-success text-success-foreground',
                  showIncorrect && 'bg-destructive text-destructive-foreground',
                  isSelected && !showFeedback && 'bg-primary text-primary-foreground'
                )}
              >
                {showCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : showIncorrect ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="text-foreground pt-1">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Progresso da seção</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
