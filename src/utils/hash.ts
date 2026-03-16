import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  const saltKey = import.meta.env.VITE_BCRYPT_SALT;

  if (!saltKey) {
    throw new Error('Salt key not found in environment variables. Please set VITE_BCRYPT_SALT in your .env file.');
  }

  return bcrypt.hashSync(password, saltKey);
};
