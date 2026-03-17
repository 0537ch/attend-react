import { useNavigate } from 'react-router-dom';
import { MapView } from './MapView';
import { StatusCard } from './StatusCard';
import { ClockButton } from './ClockButton';
import { LastClockInfo } from './LastClockInfo';
import { LocationSelector } from './LocationSelector';
import { Toast } from './Toast';
import { ThemeToggle } from './ThemeToggle';
import { GreetingCard } from './GreetingCard';
import { Card, CardContent } from '@/components/ui/card';
import { useLocationManager } from '../hooks/useLocationManager';
import { useOfficeLocations } from '../hooks/useOfficeLocations';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { useAttendance } from '../hooks/useAttendance';
import { useAuth } from '../context/AuthProvider';

function AttendancePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const employeeId = (user?.id as string) || '';

  const { locations, selectedLocation, setSelectedLocation, isLoading: isLoadingLocations } = useOfficeLocations(employeeId);
  const { userLocation, distance, isInRange, isLoading: isLoadingLocation, gpsAccuracy } = useLocationManager(selectedLocation);
  const { clockStatus, lastClockTime, isLoading: isLoadingHistory, refetch } = useAttendanceHistory(employeeId);

  // Logic Hook
  const { handleClock, isClocking, toast } = useAttendance(employeeId, clockStatus, refetch);

  const fullname = !isLoadingLocations && locations.length > 0 ? (locations[0]?.fullname?.trim() ?? '') : '';

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative" style={{ backgroundImage: "url('/TPS2.jpg')" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-2xl mx-auto space-y-4">
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
                gpsAccuracy={gpsAccuracy} 
              />
            )}
          </CardContent>
        </Card>

        <ClockButton 
            clockStatus={clockStatus} 
            isInRange={isInRange} 
            isLoading={isClocking || isLoadingHistory} 
            onClock={(type) => handleClock(selectedLocation, type)} 
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
      </div>
    </div>
  );
}

export { AttendancePage };