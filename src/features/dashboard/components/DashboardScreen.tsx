'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import {
  Cpu,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Users,
  HardDrive,
  FileDown,
  Plus,
  Loader2
} from 'lucide-react';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import GlobalActivityMap from './GlobalActivityMap';
import SalesAnalyticsChart from './SalesAnalyticsChart';
import eSIMInventoryBreakdown from './eSIMInventoryBreakdown';
import RecentOrders from './RecentOrders';
import MerchantPerformance from './MerchantPerformance';
import PopularPackages from './PopularPackages';
import { MOCK_DASHBOARD_METRICS } from '@/constants/mockData';
import { Button } from '@/components/ui/Button';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const metrics = MOCK_DASHBOARD_METRICS;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    alert('Exporting dashboard report...');
  };

  const handleNewOrder = () => {
    alert('Initiating new eSIM order...');
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading dashboard overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Header section with buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Welcome back, {user?.name.split(' ')[0] || 'Khalid'}. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-1.5 border-slate-200">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button variant="primary" size="sm" onClick={handleNewOrder} className="flex items-center gap-1.5 shadow-md shadow-blue-500/10">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Row 1 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          title="Total eSIM Inventory"
          value={metrics.totalInventory.value.toLocaleString()}
          subtext={metrics.totalInventory.subtext}
          change={metrics.totalInventory.change}
          icon={Cpu}
          themeColor="blue"
        />
        <StatsCard
          title="Active eSIMs"
          value={metrics.activeESIMs.value.toLocaleString()}
          subtext={metrics.activeESIMs.subtext}
          change={metrics.activeESIMs.change}
          icon={CheckCircle}
          themeColor="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.value.toLocaleString()}`}
          subtext={metrics.totalRevenue.subtext}
          change={metrics.totalRevenue.change}
          icon={DollarSign}
          themeColor="purple"
        />
      </div>

      {/* Row 2 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Orders"
          value={metrics.totalOrders.value.toLocaleString()}
          subtext={metrics.totalOrders.subtext}
          change={metrics.totalOrders.change}
          icon={ShoppingCart}
          themeColor="orange"
        />
        <StatsCard
          title="Merchant Accounts"
          value={metrics.merchantAccounts.value.toLocaleString()}
          subtext={metrics.merchantAccounts.subtext}
          change={metrics.merchantAccounts.change}
          icon={Users}
          themeColor="cyan"
        />
        <StatsCard
          title="Data Usage"
          value={`${metrics.dataUsage.value} TB`}
          subtext={metrics.dataUsage.subtext}
          change={metrics.dataUsage.change}
          icon={HardDrive}
          themeColor="indigo"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* SVG Map + Recharts Analytics grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 h-full">
          <GlobalActivityMap />
        </div>
        <div className="lg:col-span-7 h-full">
          <SalesAnalyticsChart />
        </div>
      </div>

      {/* eSIM stacked breakdown progress bar */}
      {eSIMInventoryBreakdown()}

      {/* Lower grids: recent orders table + merchant performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RecentOrders />
        </div>
        <div className="lg:col-span-4">
          <MerchantPerformance />
        </div>
      </div>

      {/* Bottom Popular Packages grid */}
      <PopularPackages />
    </div>
  );
}
