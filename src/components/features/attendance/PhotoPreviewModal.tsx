import { X, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PhotoPreviewModalProps {
  isOpen: boolean;
  photoPreview: string | null;
  pendingAction: 'IN' | 'OUT' | null;
  officeName: string;
  distance: number;
  isInRange: boolean;
  radius: number;
  isLoading: boolean;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
}

export function PhotoPreviewModal({
  isOpen,
  photoPreview,
  pendingAction,
  officeName,
  distance,
  isInRange,
  radius,
  isLoading,
  onConfirm,
  onRetake,
  onCancel,
}: PhotoPreviewModalProps) {
  if (!isOpen) return null;

  const actionText = pendingAction === 'IN' ? 'Absen Masuk' : 'Absen Keluar';

  return (
    <div className="fixed inset-0 z-50 sm:z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal Content */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-lg sm:mx-4 sm:rounded-2xl bg-background sm:shadow-2xl flex flex-col">
        {/* Mobile: Full screen, Desktop: Centered modal */}

        {/* Header - Desktop only */}
        <div className="hidden sm:flex sm:items-center sm:justify-between sm:p-4 sm:border-b">
          <h2 className="text-lg font-semibold">Preview Foto</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Close button - Mobile only */}
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 z-10 sm:hidden p-2 bg-black/50 backdrop-blur-md rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Photo Preview - 70% height on mobile */}
        <div className="flex-1 sm:flex-none flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full h-full sm:h-[400px] flex items-center justify-center">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
              />
            )}
          </div>
        </div>

        {/* Location Info Card - Bottom 30% */}
        <div className="p-4 sm:p-6 space-y-4 bg-background">
          <Card className={`${isInRange ? 'bg-green-500/15 border-green-500/70' : 'bg-red-500/20 border-red-500/50'}`}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Kantor:</span>
                  <span className="text-muted-foreground">{officeName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Jarak:</span>
                  <span className="text-muted-foreground">{Math.round(distance)}m</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Status:</span>
                  <span className={isInRange ? 'text-green-600' : 'text-red-600'}>
                    {isInRange ? `DALAM JANGKAUAN (${radius}m)` : `DI LUAR JANGKAUAN (${radius}m)`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onConfirm}
              disabled={!isInRange || isLoading}
              className="w-full min-h-14 text-base font-semibold"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                `Konfirmasi ${actionText}`
              )}
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={onRetake}
                variant="outline"
                className="flex-1 min-h-12"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Ganti Foto
              </Button>
              <Button
                onClick={onCancel}
                variant="ghost"
                className="flex-1 min-h-12"
                disabled={isLoading}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
