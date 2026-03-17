import { useState } from 'react';
import type { PhotoState } from '@/types/attendance';

interface ValidationError {
  valid: boolean;
  error?: string;
}

function validatePhoto(file: File): ValidationError {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  return { valid: true };
}

export function usePhotoCapture() {
  const [photoState, setPhotoState] = useState<PhotoState>({
    capturedPhoto: null,
    photoPreview: null,
    isPhotoTaken: false,
  });

  const handlePhotoSelect = (file: File | null) => {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file
    const validation = validatePhoto(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoState({
        capturedPhoto: file,
        photoPreview: e.target?.result as string,
        isPhotoTaken: true,
      });
    };
    reader.onerror = () => {
      return { success: false, error: 'Failed to read image file' };
    };
    reader.readAsDataURL(file);

    return { success: true };
  };

  const clearPhoto = () => {
    setPhotoState({
      capturedPhoto: null,
      photoPreview: null,
      isPhotoTaken: false,
    });
  };

  return {
    photoState,
    handlePhotoSelect,
    clearPhoto,
  };
}
