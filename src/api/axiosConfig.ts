import axios from 'axios';
import { authManager } from '../context/AuthManager';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove Content-Type header for FormData to let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }

    const { status, data } = error.response;
    let errorMessage = data?.message || `HTTP ${status}`;

    if (status === 401 && !originalRequest._retry) {
      authManager.clearAuth();
      errorMessage = 'Session expired. Please login again.';
      window.location.href = '/login';
    }

    throw new Error(errorMessage);
  }
);

export default apiClient;
