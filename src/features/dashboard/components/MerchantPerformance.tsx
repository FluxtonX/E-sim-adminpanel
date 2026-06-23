'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MOCK_MERCHANTS } from '@/constants/mockData';
import { ArrowUpRight } from 'lucide-react';

export default function MerchantPerformance() {
  // Take first 6 merchants for the dashboard widget
  const merchants = MOCK_MERCHANTS.slice(0, 6);

  // Helper to format currency
  const formatRevenue = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  // Render a detailed SVG logo representing the circular globoids from the figma mockup
  const getMerchantLogo = (name: string) => {
    const colors: Record<string, { bg: string, stroke: string }> = {
      'TravelTech Solutions': { bg: 'from-slate-700 to-slate-900', stroke: '#3b82f6' },
      'GlobalConnect Ltd': { bg: 'from-indigo-600 to-purple-800', stroke: '#a78bfa' },
      'NomadSIM': { bg: 'from-emerald-500 to-teal-800', stroke: '#6ee7b7' },
      'RoamEasy Inc': { bg: 'from-amber-500 to-orange-700', stroke: '#fbd5c0' },
      'AsiaTel Partners': { bg: 'from-cyan-600 to-blue-800', stroke: '#67e8f9' },
      'EuroTravel Mobile': { bg: 'from-rose-600 to-red-800', stroke: '#fca5a5' },
    };

    const theme = colors[name] || { bg: 'from-slate-700 to-slate-800', stroke: '#cbd5e1' };

    return (
      <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${theme.bg} p-1 flex items-center justify-center shadow-inner shrink-0 overflow-hidden`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="w-full h-full opacity-85">
          <circle cx="12" cy="12" r="9" stroke={theme.stroke} strokeWidth="1" />
          <path d="M12 3a9 9 0 0 0 0 18" stroke={theme.stroke} />
          <path d="M12 3c-3 0-5.5 4-5.5 9s2.5 9 5.5 9" stroke={theme.stroke} />
          <path d="M12 3c3 0 5.5 4 5.5 9s-2.5 9-5.5 9" stroke={theme.stroke} />
          <path d="M3 12h18" stroke={theme.stroke} />
          <path d="M4.5 7.5h15" stroke={theme.stroke} />
          <path d="M4.5 16.5h15" stroke={theme.stroke} />
        </svg>
      </div>
    );
  };

  return (
    <Card className="border-slate-100 h-full flex flex-col justify-between select-none">
      <div>
        <CardHeader className="border-slate-100/50 pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">Merchant Performance</CardTitle>
          <Link href="/dashboard/merchants" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
            View all →
          </Link>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-900">
            {/* Table Header mock for alignment */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900/50">
              <span className="w-1/2">Merchant</span>
              <span className="w-1/6 text-right">Sales</span>
              <span className="w-1/6 text-right font-bold">Revenue</span>
              <span className="w-1/6 text-right">CC</span>
            </div>

            {merchants.map((mer) => (
              <div key={mer.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                {/* Name & Logo */}
                <div className="flex items-center gap-2.5 w-1/2">
                  {getMerchantLogo(mer.name)}
                  <span className="text-xs font-bold text-slate-800 truncate dark:text-slate-200" title={mer.name}>
                    {mer.name}
                  </span>
                </div>

                {/* Sales Count */}
                <div className="w-1/6 text-right flex items-center justify-end gap-1 font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  <span>{mer.salesCount.toLocaleString()}</span>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 shrink-0" />
                </div>

                {/* Revenue */}
                <div className="w-1/6 text-right text-xs font-bold text-slate-800 dark:text-white">
                  {formatRevenue(mer.revenue)}
                </div>

                {/* Country Code Flag placeholder */}
                <div className="w-1/6 text-right text-[10px] font-bold text-slate-400">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-900 dark:text-slate-500">
                    {mer.countryCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
