import { useState, useEffect, useCallback } from 'react';
import { getAttendanceData } from '../services/attendanceApi';
import type { AttendanceRecord } from '@/types/attendance';

export function useAttendanceHistory(employeeId: string) {
  const [clockStatus, setClockStatus] = useState<'in' | 'out'>('out');
  const [lastClockTime, setLastClockTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAttendanceData(employeeId);

      if (response.successCode === 200 && response.data) {
        const records = response.data as AttendanceRecord[];

        if (records.length > 0) {
          const lastRecord = records[records.length - 1];
          setClockStatus(lastRecord.type.toLowerCase() as 'in' | 'out');
          const parsedDate = new Date(lastRecord.created_at);
          if (!isNaN(parsedDate.getTime())) {
            setLastClockTime(parsedDate);
          } else {
            setLastClockTime(null);
          }
        } else {
          setClockStatus('out');
          setLastClockTime(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance history');
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchHistory();
  }, [employeeId, fetchHistory]);

  return {
    clockStatus,
    lastClockTime,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
