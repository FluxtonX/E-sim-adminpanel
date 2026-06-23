'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { MOCK_ORDERS } from '@/constants/mockData';
import { Search } from 'lucide-react';

export default function OrderScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Active' | 'Pending' | 'Failed' | 'Expired'>('All');

  const filteredOrders = MOCK_ORDERS.filter((ord) => {
    const matchesSearch = ord.id.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
                          ord.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Review, trace, and refund reseller transactions and individual consumer activations.
        </p>
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
              placeholder="Search order ID, customer, package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-xl dark:bg-slate-900 w-full sm:w-auto overflow-x-auto">
            {(['All', 'Completed', 'Active', 'Pending', 'Failed', 'Expired'] as const).map((status) => (
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
              <TableHead className="pl-6">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Transaction Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                  No orders found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell className="pl-6 font-bold text-blue-600 dark:text-blue-400">
                    {ord.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.customerName}</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{ord.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                    {ord.packageName}
                  </TableCell>
                  <TableCell className="text-slate-500 font-semibold">{ord.region}</TableCell>
                  <TableCell className="text-right font-bold text-slate-800 dark:text-white">
                    ${ord.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ord.status)}>{ord.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-6 font-semibold text-slate-500">{ord.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
