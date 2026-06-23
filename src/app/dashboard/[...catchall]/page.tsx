'use client';

import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Terminal, AlertCircle } from 'lucide-react';

export default function CatchAllDashboardPage() {
  const pathname = usePathname();
  
  // Resolve module name from pathname
  const moduleName = pathname
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Module';

  return (
    <div className="flex h-[80vh] items-center justify-center select-none">
      <Card className="max-w-md border-slate-100/90 text-center shadow-lg">
        <CardContent className="p-8 flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <Terminal className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {moduleName} Module
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Ready for NestJS APIs Integration
            </p>
            <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto leading-relaxed">
              The front-end state architecture (Zustand store & Axios endpoints) is prepared for this module. Mock data will bind once NestJS API endpoints are deployed.
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-500 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400">
            <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Path: {pathname}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
