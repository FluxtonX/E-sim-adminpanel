'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_MERCHANTS } from '@/constants/mockData';
import { Store, UserCheck, ShieldAlert, Plus, Search } from 'lucide-react';

export default function MerchantListScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');

  const filteredMerchants = MOCK_MERCHANTS.filter((mer) => {
    const matchesSearch = mer.name.toLowerCase().includes(search.toLowerCase()) || 
                          mer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || mer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Merchants</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage reseller profiles, API integrations, and settlement invoices.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => alert('Onboarding new reseller...')}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Merchant
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Resellers</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{MOCK_MERCHANTS.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Accounts</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {MOCK_MERCHANTS.filter(m => m.status === 'Active').length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {MOCK_MERCHANTS.filter(m => m.status === 'Pending').length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-100/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="w-full sm:w-72 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-xl dark:bg-slate-900 w-full sm:w-auto overflow-x-auto">
            {(['All', 'Active', 'Pending', 'Inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-850 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Merchant Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-right">Sales Count</TableHead>
              <TableHead className="text-right">Total Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-semibold">
                  No merchants found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredMerchants.map((mer) => (
                <TableRow key={mer.id}>
                  <TableCell className="pl-6 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold dark:bg-blue-950/20 dark:text-blue-400">
                      {mer.name[0]}
                    </div>
                    {mer.name}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-500">{mer.email}</TableCell>
                  <TableCell className="text-right font-bold text-slate-700 dark:text-slate-300">
                    {mer.salesCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                    ${mer.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(mer.status)}>{mer.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-6 font-semibold text-slate-500">{mer.joinedDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
