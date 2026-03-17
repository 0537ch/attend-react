import { Loader2 } from 'lucide-react';

interface ClockButtonProps {
  clockStatus: 'in' | 'out';
  isInRange: boolean;
  isLoading: boolean;
  onClock: (type: 'IN' | 'OUT') => void;
  disabled?: boolean;
}

export function ClockButton({ clockStatus, isInRange, isLoading, onClock, disabled = false }: ClockButtonProps) {
  const isDisabled = (!isInRange && clockStatus === 'out') || disabled;

  return (
  <div className='flex gap-4 animate-in fade-in duration-300'>
    <button
      disabled={isDisabled || isLoading}
      onClick={() => onClock('IN')}
      className={`
        animate-in fade-in slide-in-from-bottom-2 duration-300
        relative w-full min-h-13 sm:min-h-12
        text-base sm:text-lg font-bold
        py-4 sm:py-5 px-6 sm:px-7 rounded-2xl
        transition-all duration-150 ease-in-out
        ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 text-white
        shadow-[0_8px_0_0,0_12px_0_0,0_16px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_12px_0_0,0_16px_0_0,0_20px_0_rgba(0,0,0,0.15)]
        active:shadow-[0_2px_0_0,0_4px_0_0,0_6px_0_rgba(0,0,0,0.1)]
        active:translate-y-1.5
        border-t-2 border-blue-400
        dark:from-blue-600 dark:via-blue-700 dark:to-blue-800
        `}
        style={{
          boxShadow: '0 8px 0 0 #1d4ed8, 0 12px 0 0 #1e40af, 0 16px 8px rgba(0,0,0,0.2)',
        }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Absen Masuk</span>
        )}
      </span>
    </button>


    <button
      disabled={isDisabled || isLoading}
      onClick={() => onClock('OUT')}
      className={`
        animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100
        relative w-full min-h-13 sm:min-h-12
        text-base sm:text-lg font-bold
        py-4 sm:py-5 px-6 sm:px-7 rounded-2xl
        transition-all duration-150 ease-in-out
        ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 text-white
        shadow-[0_8px_0_0,0_12px_0_0,0_16px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_12px_0_0,0_16px_0_0,0_20px_0_rgba(0,0,0,0.15)]
        active:shadow-[0_2px_0_0,0_4px_0_0,0_6px_0_rgba(0,0,0,0.1)]
        active:translate-y-1.5
        border-t-2 border-blue-400
        dark:from-blue-600 dark:via-blue-700 dark:to-blue-800
      `}
      style={{
        boxShadow: '0 8px 0 0 #1d4ed8, 0 12px 0 0 #1e40af, 0 16px 8px rgba(0,0,0,0.2)',
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Absen Keluar</span>
        )}
      </span>
    </button>
    </div>
  );
}
