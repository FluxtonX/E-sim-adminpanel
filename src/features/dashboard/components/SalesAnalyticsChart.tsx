'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import dynamic from 'next/dynamic';

// Dynamically load the chart with SSR disabled to prevent layout shifts and linter effect warnings
const SalesAnalyticsChartContent = dynamic(
  () => import('./SalesAnalyticsChartContent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-slate-50/50 animate-pulse rounded-xl dark:bg-slate-900/50" />
    ),
  }
);

export default function SalesAnalyticsChart() {
  const [range, setRange] = useState<'today' | '7days' | '30days' | '12months'>('7days');

  const { data, isLoading } = useQuery({
    queryKey: ['salesAnalytics', range],
    queryFn: () => dashboardService.getSalesAnalytics(range),
  });

  const ranges = [
    { label: 'Today', value: 'today' as const },
    { label: '7 Days', value: '7days' as const },
    { label: '30 Days', value: '30days' as const },
    { label: '12 Months', value: '12months' as const },
  ];

  return (
    <Card className="border-slate-100 h-full flex flex-col justify-between select-none">
      <CardHeader className="border-slate-100/50 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
            Sales Analytics
          </CardTitle>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Revenue</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">$3,493</span>
            </div>
            <div className="border-l border-slate-100 pl-4 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Orders</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">220</span>
            </div>
          </div>
        </div>

        {/* Range Selection Pills */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl dark:bg-slate-900 self-end sm:self-center">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                range === r.value
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-850 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-end min-h-[280px]">
        {isLoading ? (
          <div className="h-[250px] w-full bg-slate-50/50 animate-pulse rounded-xl dark:bg-slate-900/50" />
        ) : (
          <SalesAnalyticsChartContent data={data} />
        )}
      </CardContent>
    </Card>
  );
}
