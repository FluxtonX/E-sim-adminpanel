'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { MOCK_ESIM_INVENTORY } from '@/constants/mockData';

export default function eSIMInventoryBreakdown() {
  const { total, available, reserved, assigned, expired } = MOCK_ESIM_INVENTORY;

  // Calculate percentages
  const pctAvailable = Math.round((available / total) * 100);
  const pctReserved = Math.round((reserved / total) * 100);
  const pctAssigned = Math.round((assigned / total) * 100);
  const pctExpired = Math.round((expired / total) * 100);

  return (
    <Card className="border-slate-100 select-none">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">eSIM Inventory</h3>
          <span className="text-xs font-bold text-slate-500">{(total).toLocaleString()} total</span>
        </div>

        {/* Legend / Status grids with progress lines */}
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-4">
          
          {/* Available */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Available
              </span>
              <span>{pctAvailable}%</span>
            </div>
            {/* Legend Progress Line */}
            <div className="h-1 w-full bg-blue-500 rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {available.toLocaleString()}
              </span>
              <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[9px] font-extrabold text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                Available
              </span>
            </div>
          </div>

          {/* Reserved */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Reserved
              </span>
              <span>{pctReserved}%</span>
            </div>
            {/* Legend Progress Line */}
            <div className="h-1 w-full bg-amber-500 rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {reserved.toLocaleString()}
              </span>
              <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                Reserved
              </span>
            </div>
          </div>

          {/* Assigned */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Assigned
              </span>
              <span>{pctAssigned}%</span>
            </div>
            {/* Legend Progress Line */}
            <div className="h-1 w-full bg-emerald-500 rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {assigned.toLocaleString()}
              </span>
              <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                Assigned
              </span>
            </div>
          </div>

          {/* Expired */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Expired
              </span>
              <span>{pctExpired}%</span>
            </div>
            {/* Legend Progress Line */}
            <div className="h-1 w-full bg-red-500 rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {expired.toLocaleString()}
              </span>
              <span className="rounded-lg bg-red-50 px-2 py-0.5 text-[9px] font-extrabold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                Expired
              </span>
            </div>
          </div>

        </div>

        {/* Continuous Stacked Progress Bar */}
        <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
          <div style={{ width: `${pctAvailable}%` }} className="h-full bg-blue-500 hover:opacity-90 transition-opacity" title={`Available: ${pctAvailable}%`} />
          <div style={{ width: `${pctReserved}%` }} className="h-full bg-amber-500 hover:opacity-90 transition-opacity" title={`Reserved: ${pctReserved}%`} />
          <div style={{ width: `${pctAssigned}%` }} className="h-full bg-emerald-500 hover:opacity-90 transition-opacity" title={`Assigned: ${pctAssigned}%`} />
          <div style={{ width: `${pctExpired}%` }} className="h-full bg-red-500 hover:opacity-90 transition-opacity" title={`Expired: ${pctExpired}%`} />
        </div>

        {/* Footer info text */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Inventory breakdown</span>
          <span>{total.toLocaleString()} eSIMs</span>
        </div>
      </CardContent>
    </Card>
  );
}
