'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
        <span className="text-sm font-medium text-slate-500">Loading eSIM Platform...</span>
      </div>
    </div>
  );
}
