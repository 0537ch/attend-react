import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from './MapView';
import { StatusCard } from './StatusCard';
import { ClockButton } from './ClockButton';
import { LastClockInfo } from './LastClockInfo';
import { LocationSelector } from './LocationSelector';
import { Toast } from './Toast';
import { ThemeToggle } from './ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { useLocationManager } from '../hooks/useLocationManager';
import { useOfficeLocations } from '../hooks/useOfficeLocations';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { useAuth } from '../context/AuthProvider';
import apiClient from '../api/axiosConfig';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning';
  key: number;
}

function AttendancePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use user ID from login as employee ID
  const employeeId = (user?.id as string) || '';

  const { locations, selectedLocation, setSelectedLocation, isLoading: isLoadingLocations } =
    useOfficeLocations(employeeId);

  const { userLocation, distance, isInRange, error, isLoading: isLoadingLocation, gpsAccuracy } =
    useLocationManager(selectedLocation);

  const { clockStatus, lastClockTime, isLoading: isLoadingHistory, refetch } =
    useAttendanceHistory(employeeId);

  const [isClocking, setIsClocking] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, key: Date.now() });
  };

  const handleClock = async () => {
    if (!selectedLocation) {
      showToast('Silakan pilih lokasi kantor terlebih dahulu', 'error');
      return;
    }

    setIsClocking(true);

    try {
      await apiClient.post(import.meta.env.VITE_API_INSERT_ABSEN_ENDPOINT, {
        id_number: employeeId,
        mock_apps: 'attend-react-app',
        code: selectedLocation.Code,
        type: clockStatus === 'out' ? 'IN' : 'OUT',
        mock_status: 'false',
        mac_address: '00:00:00:00:00:00',
      });

      // Refresh attendance history after successful clock
      await refetch();

      showToast(`Berhasil absen ${clockStatus === 'out' ? 'masuk' : 'keluar'}!`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal melakukan absen', 'error');
    } finally {
      setIsClocking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted px-4 py-6 sm:px-6 sm:py-8 lg:px-8 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">TPS Attendance</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto min-h-11 px-4 py-3 sm:py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:bg-red-100"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Location Selector Card */}
        <Card className="mb-3 sm:mb-4">
          <CardContent className="p-4 sm:p-6">
            <LocationSelector
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              isLoading={isLoadingLocations}
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm sm:text-base text-red-800">{error}</p>
          </div>
        )}

        {/* Status Card - MOVED ABOVE */}
        {selectedLocation && (
          <div className="mb-3 sm:mb-4">
            <StatusCard
              distance={distance}
              isInRange={isInRange}
              isLoading={isLoadingLocation || isLoadingHistory}
              radius={selectedLocation.Radius}
              officeName={selectedLocation.Name}
              gpsAccuracy={gpsAccuracy}
            />
          </div>
        )}

        {/* Clock Button - PROMINENT POSITION */}
        <div className="mb-6 sm:mb-8">
            <ClockButton
              clockStatus={clockStatus}
              isInRange={isInRange}
              isLoading={isClocking || isLoadingHistory}
              onClock={handleClock}
              disabled={!selectedLocation}
            />
        </div>

        {/* Map Card - MOVED BELOW */}
        <Card className="mb-3 sm:mb-4">
          <CardContent className="p-4 sm:p-6">
            <MapView userLocation={userLocation} selectedOffice={selectedLocation} />
          </CardContent>
        </Card>

        {/* Last Clock Info */}
        <Card className="mb-3 sm:mb-4">
          <CardContent className="p-4 sm:p-6">
            <LastClockInfo lastClockTime={lastClockTime} isLoading={isLoadingHistory} />
          </CardContent>
        </Card>

        {/* Toast */}
        {toast && <Toast key={toast.key} message={toast.message} type={toast.type} />}
      </div>
    </div>
  );
}

export { AttendancePage };
