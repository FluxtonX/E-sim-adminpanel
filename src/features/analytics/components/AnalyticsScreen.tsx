'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { analyticsService } from '../services/analytics.service';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadCSV } from '@/services/mockDownloadService';

import {
  TrendingUp,
  Wifi,
  Users,
  Globe,
  FileDown,
  Plus,
  Loader2
} from 'lucide-react';

// Pixel-perfect vector flag components matching the figma list
const UKFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#012169]">
    <svg viewBox="0 0 60 30" className="w-full h-full">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
    </svg>
  </div>
);

const GermanyFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 5 3" className="w-full h-full">
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#D00" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  </div>
);

const JapanFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-200">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
    </svg>
  </div>
);

const USFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 24 14" className="w-full h-full">
      <rect width="24" height="14" fill="#fff" />
      <rect y="0" width="24" height="1" fill="#B22234" />
      <rect y="2" width="24" height="1" fill="#B22234" />
      <rect y="4" width="24" height="1" fill="#B22234" />
      <rect y="6" width="24" height="1" fill="#B22234" />
      <rect y="8" width="24" height="1" fill="#B22234" />
      <rect y="10" width="24" height="1" fill="#B22234" />
      <rect y="12" width="24" height="1" fill="#B22234" />
      <rect width="11" height="8" fill="#3C3B6E" />
      <g fill="#fff" transform="scale(0.7) translate(1, 0.5)">
        <circle cx="2" cy="2" r="0.4" />
        <circle cx="5" cy="2" r="0.4" />
        <circle cx="8" cy="2" r="0.4" />
        <circle cx="3.5" cy="4" r="0.4" />
        <circle cx="6.5" cy="4" r="0.4" />
        <circle cx="2" cy="6" r="0.4" />
        <circle cx="6" cy="6" r="0.4" />
        <circle cx="10" cy="6" r="0.4" />
      </g>
    </svg>
  </div>
);

const SingaporeFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="1" fill="#EF3340" />
      <rect y="1" width="3" height="1" fill="#FFF" />
      <circle cx="0.6" cy="0.5" r="0.25" fill="#FFF" />
      <circle cx="0.7" cy="0.5" r="0.25" fill="#EF3340" />
      <g fill="#FFF" transform="translate(0.5, 0.45) scale(0.035)">
        <circle cx="0" cy="-3" r="1.2" />
        <circle cx="2.8" cy="-1" r="1.2" />
        <circle cx="1.7" cy="2.3" r="1.2" />
        <circle cx="-1.7" cy="2.3" r="1.2" />
        <circle cx="-2.8" cy="-1" r="1.2" />
      </g>
    </svg>
  </div>
);

const AustraliaFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 2 1" className="w-full h-full">
      <rect width="2" height="1" fill="#012169" />
      <g transform="scale(0.4)">
        <rect width="2" height="1" fill="#012169" />
        <path d="M0,0 L2,1 M2,0 L0,1" stroke="#fff" strokeWidth="0.2" />
        <path d="M0,0 L2,1 M2,0 L0,1" stroke="#C8102E" strokeWidth="0.12" />
        <path d="M1,0 L1,1 M0,0.5 L2,0.5" stroke="#fff" strokeWidth="0.3" />
        <path d="M1,0 L1,1 M0,0.5 L2,0.5" stroke="#C8102E" strokeWidth="0.18" />
      </g>
    </svg>
  </div>
);

export default function AnalyticsScreen() {
  const [trendRange, setTrendRange] = useState<'7days' | '30days' | '12months'>('7days');
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);


  // Fetch data using TanStack Query
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['analyticsMetrics'],
    queryFn: analyticsService.getMetrics
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ['revenueTrend', trendRange],
    queryFn: analyticsService.getRevenueTrend
  });

  const { data: regionActivations, isLoading: isActivationsLoading } = useQuery({
    queryKey: ['regionActivations'],
    queryFn: analyticsService.getRegionActivations
  });

  const { data: regionRevenue, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['regionRevenue'],
    queryFn: analyticsService.getRegionRevenue
  });

  const { data: countrySales, isLoading: isCountrySalesLoading } = useQuery({
    queryKey: ['countrySales'],
    queryFn: analyticsService.getCountrySales
  });

  const getCountryFlagSvg = (country: string) => {
    switch (country) {
      case 'United Kingdom': return <UKFlag />;
      case 'Germany': return <GermanyFlag />;
      case 'Japan': return <JapanFlag />;
      case 'United States': return <USFlag />;
      case 'Singapore': return <SingaporeFlag />;
      case 'Australia': return <AustraliaFlag />;
      default: return <Globe className="h-4 w-4 text-slate-400" />;
    }
  };

  const isAnyLoading =
    isMetricsLoading ||
    isTrendLoading ||
    isActivationsLoading ||
    isRevenueLoading ||
    isCountrySalesLoading;

  if (isAnyLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading business analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Business performance insights and data trends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                'Exporting Analytics Insights',
                ['Aggregating revenue channels...', 'Compiling country sales ratios...', 'Writing CSV payload...'],
                () => {
                  const headers = ['Country', 'Sales Volume', 'Active Connections'];
                  const rows = [
                    ['United Kingdom', '1,420', '1,280'],
                    ['Germany', '850', '800'],
                    ['Japan', '620', '600'],
                    ['Singapore', '430', '410']
                  ];
                  downloadCSV('Analytics_Insights_Export', headers, rows);
                  addToast('Analytics insights exported to CSV successfully!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              startSimulation(
                'Onboarding New eSIM Network Route',
                ['Registering LPA metadata...', 'Broadcasting carrier updates...', 'Synchronizing core profiles...'],
                () => {
                  addToast('New eSIM connection route onboarded and active!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Growth */}
        <Card className="border-slate-100/90 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex justify-between items-start h-full">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Revenue Growth
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.revenueGrowth.value}
              </h3>
              <span className="text-xs text-slate-400 font-semibold block">
                {metrics?.revenueGrowth.subtext}
              </span>
            </div>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Activations */}
        <Card className="border-slate-100/90 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex justify-between items-start h-full">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Activations
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.totalActivations.value}
              </h3>
              <span className="text-xs text-slate-400 font-semibold block">
                {metrics?.totalActivations.subtext}
              </span>
            </div>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <Wifi className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* New Customers */}
        <Card className="border-slate-100/90 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex justify-between items-start h-full">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                New Customers
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.newCustomers.value}
              </h3>
              <span className="text-xs text-slate-400 font-semibold block">
                {metrics?.newCustomers.subtext}
              </span>
            </div>
            <div className="rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Countries Active */}
        <Card className="border-slate-100/90 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex justify-between items-start h-full">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Countries Active
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.countriesActive.value}
              </h3>
              <span className="text-xs text-slate-400 font-semibold block">
                {metrics?.countriesActive.subtext}
              </span>
            </div>
            <div className="rounded-full bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Card (Wavy Curve Chart) */}
      <Card className="border-slate-100/90 select-none">
        <CardHeader className="border-slate-100/50 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
            Revenue Trend
          </CardTitle>
          
          {/* Ranges Pills */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl dark:bg-slate-900">
            {(['7days', '30days', '12months'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTrendRange(r)}
                className={`rounded-lg px-3 py-1 text-[10px] font-bold transition-all ${
                  trendRange === r
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-850 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {r === '7days' ? '7 Days' : r === '30days' ? '30 Days' : '12 Months'}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[280px] w-full text-[10px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                  tickFormatter={(val) => `$${val}`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(val) => [`$${val}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 650,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#analyticsRevenueGrad)"
                  dot={false}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Activations by Region & Revenue by Region */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Activations by Region (Horizontal Bar Chart) */}
        <Card className="border-slate-100/90">
          <CardHeader className="border-slate-100/50 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
              Activations by Region
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionActivations}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickLine={false} axisLine={false} stroke="#94a3b8" dy={10} />
                  <YAxis
                    dataKey="region"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    width={110}
                    dx={-4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 650,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#2563eb"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Region (Donut Chart with Legend) */}
        <Card className="border-slate-100/90">
          <CardHeader className="border-slate-100/50 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
              Revenue by Region
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Donut Pie */}
            <div className="h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionRevenue}
                    dataKey="revenue"
                    nameKey="region"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {regionRevenue?.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Aligned Legend */}
            <div className="flex-1 w-full space-y-3">
              {regionRevenue?.map((reg) => (
                <div key={reg.region} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: reg.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{reg.region}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white">{reg.revenueFormatted}</span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Row 3: Top Countries by Sales Progress List */}
      <Card className="border-slate-100/90">
        <CardHeader className="border-slate-100/50 pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
            Top Countries by Sales
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {countrySales?.map((c) => (
            <div key={c.country} className="flex items-center justify-between gap-4 text-xs font-bold select-none">
              
              {/* Flag Image + Country name */}
              <div className="w-44 shrink-0 flex items-center gap-3">
                {getCountryFlagSvg(c.country)}
                <span className="text-slate-750 dark:text-slate-350 truncate" title={c.country}>
                  {c.country}
                </span>
              </div>

              {/* Progress Line */}
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${c.percentage * 4.5}%` }} // Multiply to fill container proportionally
                />
              </div>

              {/* Counts & Percentage */}
              <div className="w-24 shrink-0 flex justify-end gap-3 text-right">
                <span className="text-slate-800 dark:text-white">{c.sales.toLocaleString()}</span>
                <span className="text-slate-400 font-semibold">{c.percentage}%</span>
              </div>

            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
