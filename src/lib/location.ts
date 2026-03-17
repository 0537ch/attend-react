import type { Location } from '@/types/attendance';
import type { OfficeLocation } from '@/types/attendance';

export function calculateDistance(
  loc1: Location,
  loc2: Location
): number {
  const R = 6371e3; 
  const phi1 = (loc1.lat * Math.PI) / 180;
  const phi2 = (loc2.lat * Math.PI) / 180;
  const diffLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const diffLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(diffLng / 2) * Math.sin(diffLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if user location is within allowed radius of selected office
 */
export function isWithinAllowedRadius(
  userLocation: Location,
  officeLocation: OfficeLocation
): boolean {
  const distance = calculateDistance(userLocation, {
    lat: parseFloat(officeLocation.Latitude),
    lng: parseFloat(officeLocation.Longitude),
  });
  return distance <= officeLocation.Radius;
}

/**
 * Calculate distance from user to selected office location
 */
export function calculateDistanceToOffice(
  userLocation: Location,
  officeLocation: OfficeLocation
): number {
  return calculateDistance(userLocation, {
    lat: parseFloat(officeLocation.Latitude),
    lng: parseFloat(officeLocation.Longitude),
  });
}

export function officeLocationToLocation(officeLocation: OfficeLocation): Location {
  return {
    lat: parseFloat(officeLocation.Latitude),
    lng: parseFloat(officeLocation.Longitude),
  };
}

