'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Customer, eSIMItem, Order } from '@/types';
import { MOCK_ESIM_INVENTORY_ITEMS, MOCK_ORDERS } from '@/constants/mockData';
import { useToastStore } from '@/store/useToastStore';
import {
  ArrowLeft,
  User,
  ShieldAlert,
  Key,
  DollarSign,
  Mail,
  Cpu,
  ShoppingBag
} from 'lucide-react';
import EmailComposerModal from './EmailComposerModal';

interface CustomerDetailViewProps {
  customer: Customer;
  onBack: () => void;
  getFlagComponent: (country: string) => React.ReactNode;
}

export default function CustomerDetailView({ customer, onBack, getFlagComponent }: CustomerDetailViewProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  // Dynamic filter for associated eSIMs
  const getCustomerESIMs = (): eSIMItem[] => {
    const matched = MOCK_ESIM_INVENTORY_ITEMS.filter(
      (item) => item.allocatedTo?.toLowerCase() === customer.name.toLowerCase()
    );

    // If matches count is less than customer.esimsCount, generate fallback profiles for high-fidelity representation
    if (matched.length < customer.esimsCount) {
      const generated: eSIMItem[] = [...matched];
      const diff = customer.esimsCount - matched.length;
      const customerNum = parseInt(customer.id.replace('cust-', ''), 10) || 1;

      for (let i = 1; i <= diff; i++) {
        const key = (customerNum * 1000 + i).toString().padStart(5, '0');
        generated.push({
          iccid: `89882340000000${key}`,
          status: i === 1 && customer.status === 'Active' ? 'Active' : 'Available',
          provider: i % 2 === 0 ? 'Orange' : 'Vodafone',
          allocatedTo: customer.name,
          dataLimitGb: i % 2 === 0 ? 10 : 20,
          dataUsedGb: i % 2 === 0 ? 3.4 : 0,
          packageName: i % 2 === 0 ? 'Europe Regional 10GB' : 'Global Premium 20GB',
          country: customer.country,
          network: i % 2 === 0 ? 'Orange LTE' : 'Vodafone 5G',
          activationDate: i === 1 && customer.status === 'Active' ? 'Jun 12' : undefined
        });
      }
      return generated;
    }
    return matched;
  };

  // Dynamic filter for associated orders
  const getCustomerOrders = (): Order[] => {
    const matched = MOCK_ORDERS.filter(
      (ord) =>
        ord.customerName.toLowerCase() === customer.name.toLowerCase() ||
        ord.customerEmail.toLowerCase() === customer.email.toLowerCase()
    );

    if (matched.length === 0) {
      const customerNum = parseInt(customer.id.replace('cust-', ''), 10) || 1;
      // Return a mock order matching their spends
      return [
        {
          id: `ORD-2024-09${customerNum}`,
          customerName: customer.name,
          customerEmail: customer.email,
          packageName: 'Regional eSIM Package',
          region: customer.country,
          amount: customer.totalSpend,
          status: 'Completed',
          date: customer.joined
        }
      ];
    }
    return matched;
  };

  const customerESIMs = getCustomerESIMs();
  const customerOrders = getCustomerOrders();

  const handleAction = (action: string) => {
    addToast(`Action "${action}" triggered for customer ${customer.name}`, 'success');
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
          Back to Customers
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg dark:bg-blue-950/20 dark:text-blue-400">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{customer.name}</h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={customer.status === 'Active' ? 'success' : 'neutral'}>
            {customer.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Mail className="h-3.5 w-3.5" />
            Email Notification
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer profile detail card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-600" />
                Customer Account Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-semibold">
                
                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Account ID</span>
                  <span className="font-mono text-slate-800 dark:text-white">{customer.id}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Country of Origin</span>
                  <span className="text-slate-800 dark:text-white flex items-center gap-1.5">
                    {getFlagComponent(customer.country)}
                    {customer.country}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Date Registered</span>
                  <span className="text-slate-800 dark:text-white">{customer.joined}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">res_balance Spend</span>
                  <span className="text-slate-800 dark:text-white">${customer.totalSpend.toFixed(2)}</span>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Associated eSIM profiles card */}
          <Card className="border-slate-100/90 shadow-sm overflow-hidden">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-blue-600" />
                Associated eSIM Profiles ({customerESIMs.length})
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">ICCID</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Data Usage</TableHead>
                  <TableHead>Activation</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerESIMs.map((item) => {
                  const dataUsed = item.dataUsedGb ?? 0;
                  const dataLimit = item.dataLimitGb;
                  const usagePercentage = Math.min(100, Math.round((dataUsed / dataLimit) * 100));

                  return (
                    <TableRow key={item.iccid}>
                      <TableCell className="pl-6 font-mono font-bold text-xs text-slate-800 dark:text-white">
                        {item.iccid}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                        {item.packageName}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-450">
                            <span>{dataUsed}GB used</span>
                            <span>{dataLimit}GB</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${usagePercentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-500">
                        {item.activationDate || <span className="text-slate-300 dark:text-slate-650">—</span>}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Reseller purchase orders card */}
          <Card className="border-slate-100/90 shadow-sm overflow-hidden">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
                Reseller Orders History ({customerOrders.length})
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order ID</TableHead>
                  <TableHead>Package Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((ord) => (
                  <TableRow key={ord.id}>
                    <TableCell className="pl-6 font-bold text-xs text-slate-850 dark:text-white">
                      {ord.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                      {ord.packageName}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-800 dark:text-white">
                      ${ord.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(ord.status)}>{ord.status}</Badge>
                    </TableCell>
                    <TableCell className="pr-6 font-semibold text-slate-500">
                      {ord.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

        </div>

        {/* Right Column (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Account Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Suspend Account')}
                className="w-full flex items-center justify-start gap-2 border-slate-200 text-rose-600 hover:bg-rose-50/30 hover:border-rose-200 bg-white"
              >
                <ShieldAlert className="h-4 w-4" />
                Suspend Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Reset Password')}
                className="w-full flex items-center justify-start gap-2 border-slate-200 text-slate-700 bg-white"
              >
                <Key className="h-4 w-4" />
                Reset Security Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Add Spend Credit')}
                className="w-full flex items-center justify-start gap-2 border-slate-200 text-slate-700 bg-white"
              >
                <DollarSign className="h-4 w-4" />
                Deposit Spend Credit
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Summary Card */}
          <Card className="border-slate-100/90 bg-slate-50/40 dark:bg-slate-900/10 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase dark:text-slate-350">
                Reseller Activity Summary
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">eSIM Count Limit:</span>
                  <span className="font-bold text-slate-700 dark:text-white">10 profiles</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Total eSIMs Active:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-450">
                    {customerESIMs.filter(e => e.status === 'Active').length} Profiles
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">API Access State:</span>
                  <span className="font-bold text-slate-700 dark:text-white">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Integrated Email Composer Modal */}
      {emailModalOpen && (
        <EmailComposerModal
          customer={customer}
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
        />
      )}

    </div>
  );
}
