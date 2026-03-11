import { hashPassword } from '../utils/hash';
import { authManager } from '../context/AuthManager';
import type { LoginResponse } from '../types/auth';

const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;

if (!TOKEN_ENDPOINT) {
  throw new Error('Missing required API environment variables');
}

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const hashedPassword = hashPassword(password);

  const requestBody = {
    username,
    password: hashedPassword,
  };

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return await response.json();
};

export const logoutApi = async () => {
  authManager.clearAuth();
  return { message: 'Logout successful' };
};
