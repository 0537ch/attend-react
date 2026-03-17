import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/features/attendance/MapView';
import { StatusCard } from '@/components/features/attendance/StatusCard';
import { ClockButton } from '@/components/features/attendance/ClockButton';
import { LastClockInfo } from '@/components/features/attendance/LastClockInfo';
import { LocationSelector } from '@/components/features/attendance/LocationSelector';
import { Toast } from '@/components/common/Toast';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { GreetingCard } from '@/components/features/attendance/GreetingCard';
import { Card, CardContent } from '@/components/ui/card';
import { useLocationManager } from '../hooks/useLocationManager';
import { useOfficeLocations } from '../hooks/useOfficeLocations';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { useAttendance } from '../hooks/useAttendance';
import { useAuth } from '../context/AuthProvider';
import { PhotoPreviewModal } from '@/components/features/attendance/PhotoPreviewModal';
import { useAttendanceActions } from '../hooks/useAttendanceActions';

function AttendancePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const employeeId = (user?.id as string) || '';

  const { locations, selectedLocation, setSelectedLocation, isLoading: isLoadingLocations } = useOfficeLocations(employeeId);
  const { userLocation, distance, isInRange, isLoading: isLoadingLocation } = useLocationManager(selectedLocation);
  const { clockStatus, lastClockTime, isLoading: isLoadingHistory, refetch } = useAttendanceHistory(employeeId);

  // Logic Hook
  const { isClocking } = useAttendance(employeeId, clockStatus, refetch);

  // Local toast state for attendance actions
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; key: number } | null>(null);

  // Attendance Actions Hook (includes modal flow)
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, key: Date.now() });
  };

  const { capturedPhoto, photoPreview, isModalOpen, pendingAction, isLoading: isSubmitting, handleClockClick, handlePhotoSelect, handleConfirm, handleRetake, handleCancel, fileInputRef } = useAttendanceActions(selectedLocation, employeeId, refetch, showToast);

  const fullname = !isLoadingLocations && locations.length > 0 ? (locations[0]?.fullname?.trim() ?? '') : '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative" style={{ backgroundImage: "url('/TPS2.jpg')" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-2xl mx-auto space-y-4 pb-24">
        {fullname && <GreetingCard fullname={fullname} onLogout={onLogout} themeToggle={<ThemeToggle />} />}

        <Card className="bg-background/60! backdrop-blur-sm! border-2 border-white/20 border-t-blue-500 transition-all duration-200">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <LocationSelector
                locations={locations}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                isLoading={isLoadingLocations}
            />
            {selectedLocation && (
              <StatusCard
                distance={distance}
                isInRange={isInRange}
                isLoading={isLoadingLocation || isLoadingHistory}
                radius={selectedLocation.Radius}
                officeName={selectedLocation.Name}
              />
            )}
          </CardContent>
        </Card>

        <ClockButton
            clockStatus={clockStatus}
            isInRange={isInRange}
            isLoading={isClocking || isLoadingHistory}
            onClock={handleClockClick}
            disabled={!selectedLocation}
        />

        <Card className="bg-background/60! backdrop-blur-sm! border-2 border-white/20">
          <CardContent className="p-4 sm:p-6">
            <MapView userLocation={userLocation} selectedOffice={selectedLocation} />
          </CardContent>
        </Card>

        <Card className="bg-background/60! backdrop-blur-sm! border-2 border-white/20 border-l-purple-500">
          <CardContent className="p-4 sm:p-6">
            <LastClockInfo lastClockTime={lastClockTime} isLoading={isLoadingHistory} />
          </CardContent>
        </Card>

        {toast && <Toast key={toast.key} message={toast.message} type={toast.type} />}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Photo Preview Modal */}
      <PhotoPreviewModal
        isOpen={isModalOpen}
        photoPreview={photoPreview}
        pendingAction={pendingAction}
        officeName={selectedLocation?.Name || ''}
        distance={distance}
        isInRange={isInRange}
        radius={selectedLocation?.Radius || 100}
        isLoading={isSubmitting}
        onConfirm={handleConfirm}
        onRetake={handleRetake}
        onCancel={handleCancel}
      />
    </div>
  );
}

export { AttendancePage };