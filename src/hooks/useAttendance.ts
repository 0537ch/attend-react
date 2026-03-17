import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import type { OfficeLocation } from '@/types/attendance';

interface ToastState {
message: string;
type: 'success' | 'error' | 'warning';
key: number;
}

export function useAttendance(employeeId: string, _clockStatus: string | undefined, refetchHistory: () => Promise<void>) {
const [isClocking, setIsClocking] = useState(false);
const [toast, setToast] = useState<ToastState | null>(null);

const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
setToast({ message, type, key: Date.now() });
};

const handleClock = async (location: OfficeLocation | null, type: 'IN' | 'OUT', photo: File | null) => {
if (!location) {
    showToast('Silakan pilih lokasi kantor terlebih dahulu', 'error');
    return { success: false };
}

if (!photo) {
    showToast('Silakan ambil foto terlebih dahulu', 'error');
    return { success: false };
}

setIsClocking(true);
try {
    const formData = new FormData();
    formData.append('image', photo);
    formData.append('id_number', employeeId);
    formData.append('mock_apps', 'attend-react-app');
    formData.append('code', location.Code);
    formData.append('type', type);
    formData.append('mock_status', 'true');
    formData.append('mac_address', '00:00:00:00:00:00');

    await apiClient.post(import.meta.env.VITE_API_INSERT_ABSEN_ENDPOINT, formData);

    await refetchHistory();

    const actionLabel = type === 'IN' ? 'masuk' : 'keluar';
    showToast(`Berhasil absen ${actionLabel}!`, 'success');

    return { success: true };
} catch (err) {
    showToast(err instanceof Error ? err.message : 'Gagal melakukan absen', 'error');
    return { success: false };
} finally {
    setIsClocking(false);
}
};

return { handleClock, isClocking, toast, showToast };
}