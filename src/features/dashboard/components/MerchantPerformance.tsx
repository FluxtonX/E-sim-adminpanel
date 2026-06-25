'use client';

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

  // Render a profile photo of the merchant
  const getMerchantLogo = (name: string) => {
    const photos: Record<string, string> = {
      'TravelTech Solutions': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
      'GlobalConnect Ltd': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
      'NomadSIM': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
      'RoamEasy Inc': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
      'AsiaTel Partners': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
      'EuroTravel Mobile': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80',
    };

    const photoUrl = photos[name] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80';

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="h-7 w-7 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-800 shrink-0"
      />
    );
  };

  return (
    <Card className="border-slate-100 h-full flex flex-col justify-between select-none opacity-40 cursor-not-allowed">
      <div>
        <CardHeader className="border-slate-100/50 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">Merchant Performance</CardTitle>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-800">
              Inactive
            </span>
          </div>
          <div className="text-xs font-bold text-slate-400 cursor-not-allowed select-none">
            View all →
          </div>
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
