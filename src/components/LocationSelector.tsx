import { MapPin, Loader2, ChevronDown } from 'lucide-react';
import type { OfficeLocation } from '@/types/attendance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

export interface LocationSelectorProps {
  locations: OfficeLocation[];
  selectedLocation: OfficeLocation | null;
  onLocationChange: (location: OfficeLocation) => void;
  isLoading: boolean;
}

export function LocationSelector({
  locations,
  selectedLocation,
  onLocationChange,
  isLoading,
}: LocationSelectorProps) {
  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-3 sm:p-4 border border-border">
        <div className="flex items-center gap-2 text-foreground/70">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm sm:text-base">Memuat lokasi kantor...</span>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
        <p className="text-sm sm:text-base text-destructive">Tidak ada lokasi kantor yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 sm:p-5 border border-border space-y-3 sm:space-y-4">
      <label className="flex items-center gap-2 text-foreground font-medium text-base sm:text-base">
        <MapPin className="w-5 h-5" />
        <span>Pilih Lokasi Kantor:</span>
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background/40 text-foreground min-h-[48px] sm:min-h-[44px] flex items-center justify-between"
          >
            <span className="flex-1 text-left">
              {selectedLocation
                ? `${selectedLocation.Name} (Radius: ${selectedLocation.Radius}m)`
                : '-- Pilih Lokasi --'}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full !min-w-0">
          <DropdownMenuRadioGroup value={selectedLocation?.Id?.toString() || ''}>
            {!selectedLocation && (
              <div className="px-3 py-2 text-sm text-foreground/70">
                -- Pilih Lokasi --
              </div>
            )}
            {locations.map((location) => (
              <DropdownMenuRadioItem
                key={location.Id}
                value={location.Id.toString()}
                onSelect={() => {
                  onLocationChange(location);
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{location.Name}</div>
                    <div className="text-xs text-foreground/70">Radius: {location.Radius}m</div>
                  </div>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
