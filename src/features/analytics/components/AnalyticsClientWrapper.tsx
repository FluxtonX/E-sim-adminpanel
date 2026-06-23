'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AnalyticsScreen = dynamic(
  () => import('./AnalyticsScreen'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading business analytics...</span>
        </div>
      </div>
    ),
  }
);

export default function AnalyticsClientWrapper() {
  return <AnalyticsScreen />;
}
