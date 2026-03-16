import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/types/attendance';
import type { OfficeLocation } from '@/types/attendance';
import { calculateDistanceToOffice, isWithinAllowedRadius } from '@/lib/location';

export function useLocationManager(selectedOffice: OfficeLocation | null) {
  // Check geolocation support during initial render
  const hasGeolocation = typeof navigator !== 'undefined' && navigator.geolocation;
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [isInRange, setIsInRange] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    hasGeolocation ? null : 'Geolocation is not supported by your browser'
  );
  const [isLoading, setIsLoading] = useState<boolean>(!!hasGeolocation);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  function getLocationErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location permission denied. Please enable location access in your browser settings.';
      case 2:
        return 'Unable to determine your location. Please check your GPS signal.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while getting your location.';
    }
  }

  const updateLocationState = useCallback((location: Location, accuracy?: number) => {
    if (!selectedOffice) {
      // No office selected yet
      setUserLocation(location);
      if (accuracy !== undefined) {
        setGpsAccuracy(accuracy);
      }
      setIsLoading(false);
      return;
    }

    const dist = calculateDistanceToOffice(location, selectedOffice);
    const inRange = isWithinAllowedRadius(location, selectedOffice);

    setUserLocation(location);
    setDistance(dist);
    setIsInRange(inRange);
    if (accuracy !== undefined) {
      setGpsAccuracy(accuracy);
    }
    setIsLoading(false);
    setError(null);
  }, [selectedOffice]);

  useEffect(() => {
    if (!hasGeolocation) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        updateLocationState(location, position.coords.accuracy);
      },
      (err) => {
        setError(getLocationErrorMessage(err.code));
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        updateLocationState(location, position.coords.accuracy);
      },
      (err) => {
        setError(getLocationErrorMessage(err.code));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [hasGeolocation, selectedOffice, updateLocationState]);

  return {
    userLocation,
    distance,
    isInRange,
    error,
    isLoading,
    gpsAccuracy,
  };
}
