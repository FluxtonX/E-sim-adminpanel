import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('esim_admin_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          set({ user: parsed, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          localStorage.removeItem('esim_admin_user');
        }
      }
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Admin login validation (static mock credentials)
    if (email === 'admin@esim.com' && password === 'admin123') {
      const mockUser: User = {
        id: 'usr-001',
        name: 'Khalid Al-Rashid',
        email: 'khalid.alrashid@union.com',
        role: 'Super Admin',
        avatarUrl: '/avatars/khalid.png', // Fallback avatar will render if missing
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('esim_admin_user', JSON.stringify(mockUser));
      }

      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return true;
    }

    set({ isLoading: false });
    return false;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('esim_admin_user');
    }
    set({ user: null, isAuthenticated: false });
  },
}));
