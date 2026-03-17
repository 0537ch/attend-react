import { useState, useRef, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import type { OfficeLocation } from '@/types/attendance';

interface ValidationError {
  valid: boolean;
  error?: string;
}

function validatePhoto(file: File): ValidationError {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Pilih file gambar yang valid' };
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Ukuran file maksimal 5MB' };
  }

  return { valid: true };
}

export function useAttendanceActions(
  selectedLocation: OfficeLocation | null,
  employeeId: string,
  onSuccess: () => void,
  showToast: (message: string, type: 'success' | 'error') => void
) {
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'IN' | 'OUT' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClockClick = useCallback((type: 'IN' | 'OUT') => {
    if (!selectedLocation) {
      showToast('Silakan pilih lokasi kantor terlebih dahulu', 'error');
      return;
    }
    setPendingAction(type);
    fileInputRef.current?.click();
  }, [selectedLocation, showToast]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const clearPhoto = useCallback(() => {
    setCapturedPhoto(null);
    setPhotoPreview(null);
    setPendingAction(null);
  }, []);

  const handlePhotoSelect = useCallback((file: File | null) => {
    if (!file) {
      showToast('Tidak ada file yang dipilih', 'error');
      return;
    }

    const validation = validatePhoto(file);
    if (!validation.valid) {
      showToast(validation.error || 'File tidak valid', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setCapturedPhoto(file);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleConfirm = useCallback(async () => {
    if (!capturedPhoto || !pendingAction || !selectedLocation) {
      showToast('Data tidak lengkap', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Send as JSON (backend doesn't support FormData yet)
      await apiClient.post(
        import.meta.env.VITE_API_INSERT_ABSEN_ENDPOINT,
        {
          id_number: employeeId,
          mock_apps: 'attend-react-app',
          code: selectedLocation.Code,
          type: pendingAction,
          mock_status: 'true',
          mac_address: '00:00:00:00:00:00',
        },
        { timeout: 120000 }
      );

      // TODO: Use FormData when backend supports it
      // const formData = new FormData();
      // formData.append('image', capturedPhoto);
      // formData.append('id_number', employeeId);
      // formData.append('mock_apps', 'attend-react-app');
      // formData.append('code', selectedLocation.Code);
      // formData.append('type', pendingAction);
      // formData.append('mock_status', 'true');
      // formData.append('mac_address', '00:00:00:00:00:00');
      // await apiClient.post(import.meta.env.VITE_API_INSERT_ABSEN_ENDPOINT, formData, { timeout: 120000 });

      showToast(`Berhasil absen ${pendingAction === 'IN' ? 'masuk' : 'keluar'}!`, 'success');
      closeModal();
      clearPhoto();
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal mengirim absen', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [capturedPhoto, pendingAction, selectedLocation, employeeId, onSuccess, showToast, closeModal, clearPhoto]);

  const handleRetake = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCancel = useCallback(() => {
    closeModal();
    clearPhoto();
  }, [closeModal, clearPhoto]);

  return {
    capturedPhoto,
    photoPreview,
    isModalOpen,
    pendingAction,
    isLoading,
    handleClockClick,
    handlePhotoSelect,
    handleConfirm,
    handleRetake,
    handleCancel,
    closeModal,
    fileInputRef,
  };
}
