import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import type { OfficeLocation } from '@/types/attendance';

interface ToastState {
message: string;
type: 'success' | 'error' | 'warning';
key: number;
}

export function useAttendance(employeeId: string, clockStatus: string | undefined, refetchHistory: () => Promise<void>) {
const [isClocking, setIsClocking] = useState(false);
const [toast, setToast] = useState<ToastState | null>(null);

const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
setToast({ message, type, key: Date.now() });
};

const handleClock = async (location: OfficeLocation | null, type: 'IN' | 'OUT') => {
if (!location) {
    showToast('Silakan pilih lokasi kantor terlebih dahulu', 'error');
    return;
}

setIsClocking(true);
try {
    await apiClient.post(import.meta.env.VITE_API_INSERT_ABSEN_ENDPOINT, {
    id_number: employeeId,
    mock_apps: 'attend-react-app',
    code: location.Code, 
    type: type,          
    mock_status: 'true',
    mac_address: '00:00:00:00:00:00',
    });

    await refetchHistory();
    
    const actionLabel = type === 'IN' ? 'masuk' : 'keluar';
    showToast(`Berhasil absen ${actionLabel}!`, 'success');
    
} catch (err) {
    showToast(err instanceof Error ? err.message : 'Gagal melakukan absen', 'error');
} finally {
    setIsClocking(false);
}
};

return { handleClock, isClocking, toast, showToast };
}