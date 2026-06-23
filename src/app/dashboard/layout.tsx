'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import AppShell from '@/components/layout/AppShell';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-slate-500">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent layout flashes before client-side redirect completes
  }

  return <AppShell>{children}</AppShell>;
}
