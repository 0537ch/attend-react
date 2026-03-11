import { useState, useEffect } from 'react';
import { getAttendanceData } from '../services/attendanceApi';

interface AttendanceRecord {
  type: 'IN' | 'OUT';
  timestamp: string;
  [key: string]: unknown;
}

export function useAttendanceHistory(employeeId: string) {
  const [clockStatus, setClockStatus] = useState<'in' | 'out'>('out');
  const [lastClockTime, setLastClockTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
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
          // Get the last record
          const lastRecord = records[records.length - 1];
          setClockStatus(lastRecord.type.toLowerCase() as 'in' | 'out');
          setLastClockTime(new Date(lastRecord.timestamp));
        } else {
          // No records yet - employee hasn't clocked in before
          setClockStatus('out');
          setLastClockTime(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance history');
      // Don't change state on error, keep current values
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [employeeId]);

  return {
    clockStatus,
    lastClockTime,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
