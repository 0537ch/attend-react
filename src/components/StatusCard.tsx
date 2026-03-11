import { MapPin, CheckCircle, XCircle, Loader2, Crosshair } from 'lucide-react';

interface StatusCardProps {
  distance: number;
  isInRange: boolean;
  isLoading: boolean;
  radius: number;
  officeName: string;
  gpsAccuracy?: number | null;
}

export function StatusCard({ distance, isInRange, isLoading, radius, officeName, gpsAccuracy }: StatusCardProps) {
  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm sm:text-base">Mendapatkan lokasi Anda...</span>
        </div>
      </div>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy < 10) return 'text-green-600 dark:text-green-400';
    if (accuracy < 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy < 10) return 'Sangat Akurat';
    if (accuracy < 30) return 'Cukup Akurat';
    return 'Kurang Akurat';
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 border border-border space-y-3">
      {/* Distance */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm sm:text-base text-foreground">
          Jarak: <span className="font-semibold">{Math.round(distance)}m</span> dari {officeName}
        </span>
      </div>

      {/* GPS Accuracy */}
      {gpsAccuracy !== undefined && gpsAccuracy !== null && (
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm sm:text-base text-foreground">
            Akurasi GPS: <span className={`font-semibold ${getAccuracyColor(gpsAccuracy)}`}>
              ±{Math.round(gpsAccuracy)}m ({getAccuracyLabel(gpsAccuracy)})
            </span>
          </span>
        </div>
      )}

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
