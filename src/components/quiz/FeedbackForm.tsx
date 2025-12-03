import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FeedbackData } from '@/types/quiz';
import { Send, Star, MessageSquare, Layout, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
  name: string;
  team: string;
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackOption {
  value: string;
  label: string;
}

const difficultyOptions: FeedbackOption[] = [
  { value: 'muito_facil', label: 'Muito fácil' },
  { value: 'facil', label: 'Fácil' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'dificil', label: 'Difícil' },
  { value: 'muito_dificil', label: 'Muito difícil' },
];

const clarityOptions: FeedbackOption[] = [
  { value: 'sim_totalmente', label: 'Sim, totalmente' },
  { value: 'sim_algumas_partes', label: 'Sim, mas algumas partes confundiram' },
  { value: 'mais_ou_menos', label: 'Mais ou menos' },
  { value: 'nao_muito_claro', label: 'Não muito claro' },
  { value: 'nao_entendi', label: 'Não entendi bem' },
];

const organizationOptions: FeedbackOption[] = [
  { value: 'muito_ruim', label: 'Muito ruim' },
  { value: 'ruim', label: 'Ruim' },
  { value: 'neutra', label: 'Neutra' },
  { value: 'bom', label: 'Bom' },
  { value: 'muito_bom', label: 'Muito bom' },
];

export function FeedbackForm({ name, team, onSubmit }: FeedbackFormProps) {
  const [difficulty, setDifficulty] = useState('');
  const [clarity, setClarity] = useState('');
  const [organization, setOrganization] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!difficulty) newErrors.difficulty = 'Selecione uma opção';
    if (!clarity) newErrors.clarity = 'Selecione uma opção';
    if (!organization) newErrors.organization = 'Selecione uma opção';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name,
      team,
      difficulty,
      clarity,
      organization,
      suggestions,
      timestamp: new Date().toISOString(),
    });
  };

  const renderRadioGroup = (
    label: string,
    icon: React.ReactNode,
    value: string,
    onChange: (value: string) => void,
    options: FeedbackOption[],
    error?: string,
    fieldName?: string
  ) => (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-base font-medium">
        {icon}
        {label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => {
          onChange(v);
          if (fieldName) {
            setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
          }
        }}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
              value === option.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            )}
          >
            <RadioGroupItem value={option.value} className="sr-only" />
            <span className="text-sm">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success mb-4">
            <Star className="w-8 h-8 text-success-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Parabéns, {name}!
          </h1>
          <p className="text-muted-foreground">
            Você completou o quiz. Por favor, deixe seu feedback.
          </p>
        </div>

        {/* Form Card */}
        <div className="card-weg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderRadioGroup(
              'Como você avaliaria a dificuldade geral das perguntas?',
              <Star className="w-5 h-5 text-primary" />,
              difficulty,
              setDifficulty,
              difficultyOptions,
              errors.difficulty,
              'difficulty'
            )}

            {renderRadioGroup(
              'O conteúdo das perguntas estava claro e compreensível?',
              <MessageSquare className="w-5 h-5 text-primary" />,
              clarity,
              setClarity,
              clarityOptions,
              errors.clarity,
              'clarity'
            )}

            {renderRadioGroup(
              'Como você avalia a organização do formulário?',
              <Layout className="w-5 h-5 text-primary" />,
              organization,
              setOrganization,
              organizationOptions,
              errors.organization,
              'organization'
            )}

            <div className="space-y-3">
              <Label htmlFor="suggestions" className="flex items-center gap-2 text-base font-medium">
                <Lightbulb className="w-5 h-5 text-primary" />
                O que podemos melhorar nas próximas atividades ou formulários?
              </Label>
              <Textarea
                id="suggestions"
                placeholder="Deixe suas sugestões aqui (opcional)"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Enviar Feedback
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
