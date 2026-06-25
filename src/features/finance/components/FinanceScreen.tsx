'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import StatsCard from '@/features/dashboard/components/StatsCard';
import {
  DollarSign,
  TrendingUp,
  Percent,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Download
} from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadCSV } from '@/services/mockDownloadService';
import {
  AreaChart,

  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// 30-day mock revenue data averaging ~9.5k/day to sum to ~$284,920
const MOCK_REVENUE_TREND = [
  { date: 'Dec 1', revenue: 7200 },
  { date: 'Dec 2', revenue: 7500 },
  { date: 'Dec 3', revenue: 8100 },
  { date: 'Dec 4', revenue: 7800 },
  { date: 'Dec 5', revenue: 8500 },
  { date: 'Dec 6', revenue: 9000 },
  { date: 'Dec 7', revenue: 8800 },
  { date: 'Dec 8', revenue: 9200 },
  { date: 'Dec 9', revenue: 9500 },
  { date: 'Dec 10', revenue: 8900 },
  { date: 'Dec 11', revenue: 9400 },
  { date: 'Dec 12', revenue: 9900 },
  { date: 'Dec 13', revenue: 9600 },
  { date: 'Dec 14', revenue: 10100 },
  { date: 'Dec 15', revenue: 10500 },
  { date: 'Dec 16', revenue: 9800 },
  { date: 'Dec 17', revenue: 10200 },
  { date: 'Dec 18', revenue: 10800 },
  { date: 'Dec 19', revenue: 10400 },
  { date: 'Dec 20', revenue: 11100 },
  { date: 'Dec 21', revenue: 11500 },
  { date: 'Dec 22', revenue: 10900 },
  { date: 'Dec 23', revenue: 11400 },
  { date: 'Dec 24', revenue: 11900 },
  { date: 'Dec 25', revenue: 11600 },
  { date: 'Dec 26', revenue: 12200 },
  { date: 'Dec 27', revenue: 12500 },
  { date: 'Dec 28', revenue: 11800 },
  { date: 'Dec 29', revenue: 12300 },
  { date: 'Dec 30', revenue: 12920 }
];

// 6-month performance data for grouped column chart
const MOCK_MONTHLY_PERFORMANCE = [
  { month: 'Jul', Revenue: 35000, Profit: 11200 },
  { month: 'Aug', Revenue: 42000, Profit: 13400 },
  { month: 'Sep', Revenue: 38000, Profit: 12100 },
  { month: 'Oct', Revenue: 48000, Profit: 15300 },
  { month: 'Nov', Revenue: 55000, Profit: 17600 },
  { month: 'Dec', Revenue: 66920, Profit: 21574 }
];

// 6 transactions matching the Figma screenshot exactly
const MOCK_TRANSACTIONS = [
  {
    id: 'tx-001',
    type: 'Monthly payout',
    entity: 'TravelTech Solutions',
    status: 'Completed',
    amount: 84200,
    icon: ArrowUpRight
  },
  {
    id: 'tx-002',
    type: 'Inventory purchase',
    entity: 'Europe packages',
    status: 'Completed',
    amount: -12000,
    icon: ArrowDownLeft
  },
  {
    id: 'tx-003',
    type: 'Monthly payout',
    entity: 'GlobalConnect Ltd',
    status: 'Completed',
    amount: 62400,
    icon: ArrowUpRight
  },
  {
    id: 'tx-004',
    type: 'Inventory purchase',
    entity: 'Asia packages',
    status: 'Pending',
    amount: -8500,
    icon: ArrowDownLeft
  },
  {
    id: 'tx-005',
    type: 'Monthly payout',
    entity: 'NomadSIM',
    status: 'Completed',
    amount: 48900,
    icon: ArrowUpRight
  },
  {
    id: 'tx-006',
    type: 'Direct sale',
    entity: 'customer order batch',
    status: 'Completed',
    amount: 1240,
    icon: ArrowUpRight
  }
];

export default function FinanceScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading financial overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Finance</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Track revenue, profit margins, operational expenses, and payments.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                'Exporting Financial Performance Ledger',
                ['Accessing revenue accounts...', 'Structuring cashflow data...', 'Packaging CSV matrix...'],
                () => {
                  const headers = ['Report Metric', 'Value', 'Status'];
                  const rows = [
                    ['Total Revenue', '$284,920', 'Healthy'],
                    ['Active Users Margin', '14.2%', 'Growing'],
                    ['eSIM Provision Expense', '$42,500', 'Optimized'],
                    ['Net Margin Revenue', '$242,420', 'Target Achieved']
                  ];
                  downloadCSV('Financial_Report_Export', headers, rows);
                  addToast('Financial performance report exported successfully!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white dark:bg-slate-950 dark:text-slate-350 dark:border-slate-800"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$284,920"
          subtext="This Month"
          change="+23.1% vs last month"
          icon={DollarSign}
          themeColor="blue"
        />
        <StatsCard
          title="Net Profit"
          value="$91,174"
          subtext="This Month"
          change="+18.4% vs last month"
          icon={TrendingUp}
          themeColor="green"
        />
        <StatsCard
          title="Profit Margin"
          value="32.0%"
          subtext="This Month"
          change="+2.1% vs last month"
          icon={Percent}
          themeColor="purple"
        />
        <StatsCard
          title="Total Expenses"
          value="$193,746"
          subtext="This Month"
          change="+11.2% vs last month"
          icon={CreditCard}
          themeColor="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend Area Chart */}
        <Card className="border-slate-100/90 shadow-sm">
          <CardHeader className="border-slate-100/50 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
              Revenue Trend (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    dy={10}
                    ticks={['Dec 1', 'Dec 8', 'Dec 15', 'Dec 22', 'Dec 29']}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    tickFormatter={(val) => val !== undefined && val !== null ? `$${Number(val).toLocaleString()}` : ''}
                    dx={-10}
                  />
                  <Tooltip
                    formatter={(val) => val !== undefined && val !== null ? [`$${Number(val).toLocaleString()}`, 'Revenue'] : ['']}
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
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue vs Profit Bar Chart */}
        <Card className="border-slate-100/90 shadow-sm">
          <CardHeader className="border-slate-100/50 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
              Monthly Revenue vs Profit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_MONTHLY_PERFORMANCE}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    tickFormatter={(val) => val !== undefined && val !== null ? `$${Number(val) / 1000}k` : ''}
                    dx={-10}
                  />
                  <Tooltip
                    formatter={(val) => val !== undefined && val !== null ? [`$${Number(val).toLocaleString()}`] : ['']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 650,
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#64748b'
                    }}
                  />
                  <Bar
                    dataKey="Revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="Profit"
                    fill="#bad7fb"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="border-slate-100/90 shadow-sm overflow-hidden">
        <CardHeader className="border-slate-100/50 pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-900 dark:bg-slate-950/20">
                  <th className="px-6 py-3.5">Transaction</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {MOCK_TRANSACTIONS.map((tx) => {
                  const Icon = tx.icon;
                  const isPositive = tx.amount > 0;
                  const formattedAmount = `${isPositive ? '+' : '-'}$${Math.abs(tx.amount).toLocaleString()}`;
                  
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                      {/* Left: Transaction Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
                          }`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-850 dark:text-white block leading-tight">
                              {tx.type}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 mt-0.5 block leading-none">
                              {tx.entity}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Middle: Status Badge */}
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(tx.status)}>
                          {tx.status}
                        </Badge>
                      </td>

                      {/* Right: Amount */}
                      <td className="px-6 py-4 text-right font-semibold">
                        <span className={`text-xs font-bold ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-700 dark:text-slate-350'
                        }`}>
                          {formattedAmount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
