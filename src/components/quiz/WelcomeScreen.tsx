import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Users, ArrowRight } from 'lucide-react';
import { BsClock } from "react-icons/bs";


interface WelcomeScreenProps {
  onStart: (name: string, team: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [errors, setErrors] = useState<{ name?: string; team?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; team?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Por favor, insira seu nome';
    }
    if (!team.trim()) {
      newErrors.team = 'Por favor, insira sua equipe';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStart(name.trim(), team.trim());
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 overflow-hidden">
            <img 
              src="/favicon.ico" 
              alt="Logo WEG"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Quiz de Comunicação
          </h1>
          <p className="text-muted-foreground">
            Teste seus conhecimentos sobre comunicação empresarial
          </p>
        </div>

        {/* Form Card */}
        <div className="card-weg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nome ou Apelido
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Equipe
              </Label>
              <Input
                id="team"
                type="number"
                min="0"
                step="1"
                value={team}
                onChange={(e) => {
                  setTeam(e.target.value);
                  setErrors((prev) => ({ ...prev, team: undefined }));
                }}
              />
              {errors.team && (
                <p className="text-sm text-destructive">{errors.team}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Iniciar Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <BsClock className="text-accent text-xl" />

              </div>
              <p>
                Você terá <strong className="text-foreground">5 minutos</strong> para responder todas as perguntas. 
                Se o tempo acabar, você receberá <strong className="text-foreground">2 minutos extras</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
