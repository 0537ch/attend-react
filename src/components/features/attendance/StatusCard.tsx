import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StatusCardProps {
  distance: number;
  isInRange: boolean;
  isLoading: boolean;
  radius: number;
  officeName: string;
}

export function StatusCard({ distance, isInRange, isLoading, radius, officeName }: StatusCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm sm:text-base">Mendapatkan lokasi Anda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-lg p-4 space-y-3
      transition-all duration-300
      ${isInRange
        ? 'bg-green-500/15 border border-green-500/70'
        : 'bg-red-500/20 border border-red-500/50'
      }
    `}>
      {/* Distance */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm sm:text-base text-foreground">
          Jarak: <span className="font-semibold">{Math.round(distance)}m</span> dari {officeName}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        {isInRange ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-sm sm:text-base text-green-600 dark:text-green-400">
              DALAM JANGKAUAN (Radius: {radius}m)
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-sm sm:text-base text-red-600 dark:text-red-400">
              DI LUAR JANGKAUAN (Radius: {radius}m)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
