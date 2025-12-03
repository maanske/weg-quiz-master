import { useEffect, useState, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  isRunning: boolean;
  onTimeUp: () => void;
  onExtraTimeUp: () => void;
}

const INITIAL_TIME = 5 * 60; // 5 minutes in seconds
const EXTRA_TIME = 2 * 60; // 2 minutes in seconds

export function Timer({ isRunning, onTimeUp, onExtraTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [hasExtraTimeStarted, setHasExtraTimeStarted] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!hasExtraTimeStarted) {
            setIsExtraTime(true);
            setHasExtraTimeStarted(true);
            onTimeUp();
            return EXTRA_TIME;
          } else {
            clearInterval(interval);
            onExtraTimeUp();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, hasExtraTimeStarted, onTimeUp, onExtraTimeUp]);

  const isLowTime = timeLeft <= 60;
  const progress = isExtraTime 
    ? (timeLeft / EXTRA_TIME) * 100 
    : (timeLeft / INITIAL_TIME) * 100;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div
        className={cn(
          'card-weg p-4 flex flex-col items-center gap-3 transition-all duration-300',
          isExtraTime && 'border-destructive/50',
          isLowTime && 'timer-pulse'
        )}
      >
        <div className="flex items-center gap-2">
          {isExtraTime ? (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          ) : (
            <Clock className="w-4 h-4 text-primary" />
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {isExtraTime ? 'Tempo Extra' : 'Tempo'}
          </span>
        </div>

        <div
          className={cn(
            'text-2xl font-bold tabular-nums transition-colors',
            isExtraTime ? 'text-destructive' : 'text-foreground',
            isLowTime && !isExtraTime && 'text-amber-500'
          )}
        >
          {formatTime(timeLeft)}
        </div>

        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-linear',
              isExtraTime ? 'bg-destructive' : 'bg-primary',
              isLowTime && !isExtraTime && 'bg-amber-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
