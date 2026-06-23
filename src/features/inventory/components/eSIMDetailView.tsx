'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { eSIMItem } from '@/types';
import {
  ArrowLeft,
  Power,
  Pause,
  RefreshCw,
  RotateCcw,
  Wifi,
  Globe,
  Clock,
  Copy,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface eSIMDetailViewProps {
  item: eSIMItem;
  onBack: () => void;
}

export default function ESIMDetailView({ item, onBack }: eSIMDetailViewProps) {
  // 7-day usage mock data matching the screenshot wavy points
  const dailyUsageData = [
    { day: 'Day 1', usage: 0.55 },
    { day: 'Day 2', usage: 1.20 },
    { day: 'Day 3', usage: 0.90 },
    { day: 'Day 4', usage: 2.20 },
    { day: 'Day 5', usage: 1.80 },
    { day: 'Day 6', usage: 1.20 },
    { day: 'Day 7', usage: 1.30 },
  ];

  // Calculate percentage used
  const used = item.dataUsedGb ?? 0;
  const limit = item.dataLimitGb;
  const remaining = Math.max(0, limit - used);
  const percentage = Math.round((used / limit) * 100);

  const handleAction = (actionName: string) => {
    alert(`eSIM Action "${actionName}" triggered for ICCID ${item.iccid}`);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Back button and breadcrumbs row */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-max"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Inventory
        </button>
      </div>

      {/* Main title and actions row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">eSIM Detail</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">{item.iccid}</p>
        </div>

        {/* Top actions grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active status indicator badge */}
          <Badge variant={getStatusVariant(item.status)}>
            {item.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Activate')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
            disabled={item.status === 'Active'}
          >
            <Power className="h-3.5 w-3.5" />
            Activate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Suspend')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
            disabled={item.status === 'Suspended' || item.status === 'Expired'}
          >
            <Pause className="h-3.5 w-3.5" />
            Suspend
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Transfer')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Transfer
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Refund')}
            className="flex items-center gap-1.5 border-rose-200 text-rose-600 bg-rose-50/20 hover:bg-rose-50 hover:border-rose-300 dark:bg-rose-950/10 dark:border-rose-900/50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refund
          </Button>
        </div>
      </div>

      {/* Main Columns layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SIM Information Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                SIM Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-semibold">
                
                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">ICCID</span>
                  <span className="font-mono text-slate-800 dark:text-white">{item.iccid}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Package</span>
                  <span className="text-slate-800 dark:text-white">{item.packageName || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Country</span>
                  <span className="text-slate-800 dark:text-white">{item.country || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Network</span>
                  <span className="text-slate-800 dark:text-white">{item.network || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Assigned To</span>
                  <span className="text-slate-800 dark:text-white">{item.allocatedTo || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Activation Date</span>
                  <span className="text-slate-800 dark:text-white">{item.activationDate || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 md:border-none border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Expiry Date</span>
                  <span className="text-slate-800 dark:text-white">{item.expiryDate || '—'}</span>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Daily Usage (Last 7 Days) line chart */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Daily Usage (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[240px] w-full text-[10px] font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      dy={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(val) => `${val}GB`}
                      ticks={[0, 0.55, 1.10, 1.65, 2.20]}
                      dx={-10}
                    />
                    <Tooltip
                      formatter={(val) => [`${val} GB`, 'Usage']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 650,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Data Usage Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Data Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              {/* Giant display */}
              <div className="space-y-1.5">
                <span className="text-3xl font-black text-slate-800 dark:text-white">
                  {used}GB
                </span>
                <span className="text-xs text-slate-400 font-semibold block">
                  of {limit}GB used
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-blue-600">{percentage}% used</span>
                  <span className="text-slate-400">{remaining.toFixed(1)}GB remaining</span>
                </div>
              </div>

              {/* Row of 3 mini details cards */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-4 dark:border-slate-900/50">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-900/20">
                  <Wifi className="h-4 w-4 text-blue-600 mx-auto" />
                  <span className="text-[10px] font-black text-slate-800 block mt-1.5 dark:text-white truncate">
                    {used}GB
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">
                    Used
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-center dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-900/20">
                  <Globe className="h-4 w-4 text-blue-600 mx-auto" />
                  <span className="text-[10px] font-black text-slate-800 block mt-1.5 dark:text-white truncate" title={item.country}>
                    {item.country || 'Global'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">
                    Country
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-center dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-900/20">
                  <Clock className="h-4 w-4 text-blue-600 mx-auto" />
                  <span className="text-[10px] font-black text-slate-800 block mt-1.5 dark:text-white truncate">
                    {item.status === 'Active' ? '9 Days' : '—'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">
                    Left
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Activation QR Code Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Activation QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col items-center gap-5 text-center">
              
              {/* SVG QR Code representation */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-28 w-28 text-slate-800 shrink-0">
                  {/* QR Code corner anchors */}
                  <rect x="10" y="10" width="20" height="20" fill="currentColor" rx="2" />
                  <rect x="13" y="13" width="14" height="14" fill="#ffffff" rx="1" />
                  <rect x="16" y="16" width="8" height="8" fill="currentColor" rx="0.5" />

                  <rect x="70" y="10" width="20" height="20" fill="currentColor" rx="2" />
                  <rect x="73" y="13" width="14" height="14" fill="#ffffff" rx="1" />
                  <rect x="76" y="16" width="8" height="8" fill="currentColor" rx="0.5" />

                  <rect x="10" y="70" width="20" height="20" fill="currentColor" rx="2" />
                  <rect x="13" y="73" width="14" height="14" fill="#ffffff" rx="1" />
                  <rect x="16" y="76" width="8" height="8" fill="currentColor" rx="0.5" />

                  {/* Simulated QR Code dots matrix */}
                  <rect x="35" y="10" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="45" y="10" width="10" height="6" fill="currentColor" rx="1" />
                  <rect x="60" y="10" width="6" height="6" fill="currentColor" rx="1" />

                  <rect x="35" y="20" width="15" height="6" fill="currentColor" rx="1" />
                  <rect x="55" y="20" width="6" height="12" fill="currentColor" rx="1" />

                  <rect x="10" y="35" width="6" height="10" fill="currentColor" rx="1" />
                  <rect x="20" y="35" width="10" height="6" fill="currentColor" rx="1" />
                  <rect x="35" y="35" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="45" y="35" width="12" height="6" fill="currentColor" rx="1" />
                  <rect x="65" y="35" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="80" y="35" width="10" height="10" fill="currentColor" rx="1" />

                  <rect x="10" y="50" width="12" height="6" fill="currentColor" rx="1" />
                  <rect x="25" y="50" width="6" height="12" fill="currentColor" rx="1" />
                  <rect x="35" y="50" width="15" height="6" fill="currentColor" rx="1" />
                  <rect x="55" y="50" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="65" y="50" width="6" height="15" fill="currentColor" rx="1" />
                  <rect x="75" y="50" width="15" height="6" fill="currentColor" rx="1" />

                  <rect x="35" y="65" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="45" y="65" width="10" height="6" fill="currentColor" rx="1" />
                  <rect x="58" y="65" width="4" height="4" fill="currentColor" rx="0.5" />

                  <rect x="70" y="70" width="6" height="6" fill="currentColor" rx="1" />
                  <rect x="80" y="70" width="10" height="6" fill="currentColor" rx="1" />
                  <rect x="35" y="80" width="12" height="6" fill="currentColor" rx="1" />
                  <rect x="50" y="80" width="6" height="10" fill="currentColor" rx="1" />
                  <rect x="60" y="80" width="15" height="6" fill="currentColor" rx="1" />
                  <rect x="80" y="80" width="10" height="10" fill="currentColor" rx="1" />
                </svg>
              </div>

              <p className="text-[10px] text-slate-400 font-bold max-w-[200px] leading-relaxed">
                Scan with your device camera to install this eSIM profile
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full border-t border-slate-50 pt-4 dark:border-slate-900/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`LPA code copied for ICCID ${item.iccid}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border-slate-200 bg-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Downloading QR code image...`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs shadow-md shadow-blue-500/10"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
