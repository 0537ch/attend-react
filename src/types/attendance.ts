export interface Location {
  lat: number;
  lng: number;
  accuracy?: number; // GPS accuracy in meters
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
}

export interface GetUserLocationResponse {
  successCode: number;
  message: string;
  data: OfficeLocation[];
}
