import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw, Trophy } from 'lucide-react';

interface CompletedScreenProps {
  name: string;
  team: string;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function CompletedScreen({
  name,
  team,
  correctAnswers,
  totalQuestions,
  onRestart,
}: CompletedScreenProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage >= 90) return 'Excelente! Você domina o assunto!';
    if (percentage >= 70) return 'Muito bem! Continue assim!';
    if (percentage >= 50) return 'Bom trabalho! Há espaço para melhorar.';
    return 'Continue estudando, você consegue!';
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
          <Trophy className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Quiz Concluído!
        </h1>
        <p className="text-muted-foreground mb-8">
          Obrigado por participar, {name}!
        </p>

        {/* Results Card */}
        <div className="card-weg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-muted-foreground">Resultados</span>
          </div>

          <div className="text-5xl font-bold text-primary mb-2">
            {percentage}%
          </div>

          <p className="text-lg text-foreground mb-4">
            {correctAnswers} de {totalQuestions} corretas
          </p>

          <p className="text-muted-foreground">{getMessage()}</p>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Equipe: <span className="font-medium text-foreground">{team}</span>
            </p>
          </div>
        </div>

        {/* Restart Button */}
        <Button onClick={onRestart} variant="outline" size="lg" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Fazer Novamente
        </Button>

        {/* WEG Footer */}
        {/* Alteração aqui: Adicionado 'mt-8' para afastar do botão */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 overflow-hidden">
            <img 
              src="/favicon.ico" 
              alt="Logo WEG"
              className="w-12 h-12 object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Quiz de Comunicação WEG
          </p>
        </div>
      </div>
    </div>
  );
}