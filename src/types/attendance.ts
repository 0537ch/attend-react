export interface Location {
  lat: number;
  lng: number;
  accuracy?: number; 
}

export interface AppState {
  userLocation: Location | null;
  distance: number; // meters
  isInRange: boolean;
  clockStatus: 'in' | 'out';
  lastClockTime: Date | null;
  isLoading: boolean;
  error: string | null;
}

export interface InsertAbsenRequest {
  id_number: string;
  mock_apps: string;
  code: string;
  type: 'IN' | 'OUT';
  mock_status: string;
  mac_address: string;
}

export interface GetUserLocationRequest {
  EmployeeID: string;
}

export interface OfficeLocation {
  Id: number;
  Name: string;
  Latitude: string;
  Longitude: string;
  Radius: number;
  Code: string;
  Status: boolean;
  fullname?: string;
}

export interface GetUserLocationResponse {
  successCode: number;
  message: string;
  data: OfficeLocation[];
}

export interface AttendanceRecord {
  type: 'IN' | 'OUT';
  created_at: string;
  [key: string]: unknown; // Allow other fields without exposing them
}

export interface GetAttendanceDataResponse {
  successCode: number;
  message: string;
  data: AttendanceRecord[];
}


export interface OfficeLocation {
  Code: string;
  Name: string;
  Radius: number;
  Latitude: string;
  Longitude: string;
  fullname?: string;
}

export interface PhotoState {
  capturedPhoto: File | null;
  photoPreview: string | null;
  isPhotoTaken: boolean;
}