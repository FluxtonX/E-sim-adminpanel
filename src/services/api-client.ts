import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.esim-platform.com/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('esim_admin_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Assuming token is on user object or simulated token
          config.headers.Authorization = `Bearer mock-token-${user.id}`;
        } catch {
          // Ignore parse errors
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Token expired or invalid: logout user
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    // Standardize error message for frontend consumption
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);
