import { useState, useEffect } from 'react';
import type { OfficeLocation } from '@/types/attendance';
import { getUserLocation } from '@/services/attendanceApi';

const LAST_LOCATION_KEY = 'lastOfficeLocation';

export function useOfficeLocations(employeeId: string) {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<OfficeLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setIsLoading(true);
        const response = await getUserLocation({ EmployeeID: employeeId });

        if (response.successCode === 200 && response.data) {
          setLocations(response.data);

          const lastLocationId = localStorage.getItem(LAST_LOCATION_KEY);
          let locationToSelect: OfficeLocation | null = null;

          if (lastLocationId) {
            locationToSelect = response.data.find((loc) => loc.Id === Number(lastLocationId)) || null;
          }
          if (!locationToSelect) {
            locationToSelect = response.data.find((loc) => loc.Status) || null;
          }

          if (locationToSelect) {
            setSelectedLocation(locationToSelect);
          }
        } else {
          setError(response.message || 'Failed to fetch office locations');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch office locations');
      } finally {
        setIsLoading(false);
      }
    }

    if (employeeId) {
      fetchLocations();
    }
  }, [employeeId]);

  const handleSetSelectedLocation = (location: OfficeLocation | null) => {
    setSelectedLocation(location);
    if (location) {
      localStorage.setItem(LAST_LOCATION_KEY, location.Id.toString());
    } else {
      localStorage.removeItem(LAST_LOCATION_KEY);
    }
  };

  return {
    locations,
    selectedLocation,
    setSelectedLocation: handleSetSelectedLocation,
    isLoading,
    error,
  };
}
