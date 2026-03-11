import type { GetUserLocationRequest, GetUserLocationResponse } from '@/types/attendance';
import apiClient from '@/api/axiosConfig';

const GET_USER_LOCATION_ENDPOINT = import.meta.env.VITE_API_GET_USER_LOCATION_ENDPOINT;
const GET_ATTENDANCE_DATA_ENDPOINT = import.meta.env.VITE_API_GET_ATTENDANCE_DATA_ENDPOINT;

if (!GET_USER_LOCATION_ENDPOINT || !GET_ATTENDANCE_DATA_ENDPOINT) {
  throw new Error('Missing required API environment variables');
}

export async function getUserLocation(data: GetUserLocationRequest): Promise<GetUserLocationResponse> {
  const response = await apiClient.post(GET_USER_LOCATION_ENDPOINT, data);
  return response.data;
}

export async function getAttendanceData(nipp: string) {
  const response = await apiClient.get(`${GET_ATTENDANCE_DATA_ENDPOINT}?nipp=${nipp}`);
  return response.data;
}
