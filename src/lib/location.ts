import type { Location } from '@/types/attendance';
import type { OfficeLocation } from '@/types/attendance';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  loc1: Location,
  loc2: Location
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (loc1.lat * Math.PI) / 180;
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
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

/**
 * Convert OfficeLocation API format to Location format
 */
export function officeLocationToLocation(officeLocation: OfficeLocation): Location {
  return {
    lat: parseFloat(officeLocation.Latitude),
    lng: parseFloat(officeLocation.Longitude),
  };
}

