import { hashPassword } from '../utils/hash';
import type { LoginResponse } from '../types/auth';

const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;
const SYSTEM_USERNAME = import.meta.env.VITE_USER_TOKEN;
const SYSTEM_PASSWORD = import.meta.env.VITE_PASSWORD_TOKEN;

if (!TOKEN_ENDPOINT || !SYSTEM_USERNAME || !SYSTEM_PASSWORD) {
  throw new Error('Missing system authentication environment variables');
}

export async function getSystemToken(): Promise<string> {
  const hashedPassword = hashPassword(SYSTEM_PASSWORD);

  const requestBody = {
    username: SYSTEM_USERNAME,
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
    throw new Error(`System authentication failed: ${response.status}`);
  }

  const data: LoginResponse = await response.json();

  if (!data.token) {
    throw new Error('System authentication failed: No token received');
  }

  return data.token;
}
