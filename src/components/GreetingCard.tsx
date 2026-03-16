import { Sun, CloudSun, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TextGenerateEffect } from './ui/text-generate-effect';

type GreetingIcon = typeof Sun;

interface GreetingData {
  text: string;
  icon: GreetingIcon;
}

const getGreeting = (): GreetingData => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) {
    return { text: 'Selamat pagi,', icon: Sun };
  } else if (hour >= 11 && hour < 15) {
    return { text: 'Selamat siang,', icon: Sun };
  } else if (hour >= 15 && hour < 18) {
    return { text: 'Selamat sore,', icon: CloudSun };
  } else {
    return { text: 'Selamat malam,', icon: Moon };
  }
};

interface GreetingCardProps {
  fullname: string;
  onLogout?: () => void;
  themeToggle?: React.ReactNode;
}

export function GreetingCard({ fullname, onLogout, themeToggle }: GreetingCardProps) {
  const { text } = getGreeting();

  return (
    <Card className="
      mb-4 sm:mb-6
      bg-background/60!
      backdrop-blur-sm!
      border-2 border-white/20 dark:border-white/10
      shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
      hover:-translate-y-0.5 hover:shadow-lg
      transition-all duration-200
      animate-in fade-in slide-in-from-top-2
    ">
      <CardContent className="sm: relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex justify-between items-start gap-4">
          <div className="flex flex-col -space-y-3">
            <TextGenerateEffect
              words={text}
              className="text-foreground/70"
              size="text-xl sm:text-2xl"
            />
            <TextGenerateEffect
              words={fullname}
              className="text-foreground"
              size="text-3xl sm:text-4xl"
            />
          </div>

          {/* Right side: Controls */}
          {(onLogout || themeToggle) && (
            <div className="flex items-center gap-2">
              {themeToggle}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="min-h-11 px-4 py-3 sm:py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:bg-red-100"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
