import { Clock, Loader2 } from 'lucide-react';

interface LastClockInfoProps {
  lastClockTime: Date | null;
  isLoading?: boolean;
}

export function LastClockInfo({ lastClockTime, isLoading = false }: LastClockInfoProps) {
  const formatTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Memuat data presensi...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Clock className="w-4 h-4" />
      <span>
        Presensi Terakhir: {lastClockTime && !isNaN(lastClockTime.getTime()) ? formatTime(lastClockTime) : 'Belum ada'}
      </span>
    </div>
  );
}
