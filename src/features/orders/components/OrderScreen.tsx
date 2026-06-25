'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_ORDERS } from '@/constants/mockData';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadCSV } from '@/services/mockDownloadService';
import { Order } from '@/types';
import {
  Search,
  Loader2,
  Eye,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import OrderDetailView from './OrderDetailView';

export default function OrderScreen() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Active' | 'Pending' | 'Failed' | 'Expired'>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = ord.id.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
                          ord.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrder = orders.find((ord) => ord.id === viewingOrderId);


  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading order registry...</span>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => setViewingOrderId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Track and manage all eSIM orders across your platform.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                'Exporting Orders Ledger Log',
                ['Scanning active transactions...', 'Structuring records metadata...', 'Streaming CSV file output...'],
                () => {
                  const headers = ['Order ID', 'Customer', 'Package', 'Amount', 'Status', 'Date'];
                  const rows = orders.map(ord => [ord.id, ord.customerName, ord.packageName, ord.amount, ord.status, ord.date]);
                  downloadCSV('Orders_Ledger_Export', headers, rows);
                  addToast('Orders ledger exported successfully!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI metrics row matching the second screenshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">3,241</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">2,840</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">284</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Failed</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-450 mt-1">117</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-100/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="w-full sm:w-80 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Right Filters Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 outline-none transition-all dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-450 transition-transform ${dropdownOpen ? 'rotate-185' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 z-20 w-44 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-950 animate-fadeIn scale-95 origin-top-right">
                    {(['All', 'Completed', 'Active', 'Pending', 'Failed', 'Expired'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                          statusFilter === status
                            ? 'bg-slate-50 text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span>{status === 'All' ? 'All Status' : status}</span>
                        {statusFilter === status && (
                          <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToast('Filter customization coming soon!', 'info')}
              className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              Filters
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-semibold">
                  No orders found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord) => (
                <TableRow key={ord.id}>
                  
                  {/* Order ID */}
                  <TableCell className="pl-6 font-bold text-xs">
                    <button
                      onClick={() => setViewingOrderId(ord.id)}
                      className="text-blue-600 hover:underline dark:text-blue-400 text-left outline-none"
                    >
                      {ord.id}
                    </button>
                  </TableCell>

                  {/* Customer Info */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.customerName}</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{ord.customerEmail}</span>
                    </div>
                  </TableCell>

                  {/* Package Name */}
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                    {ord.packageName}
                  </TableCell>

                  {/* Region */}
                  <TableCell className="text-slate-500 font-semibold">{ord.region}</TableCell>

                  {/* Amount */}
                  <TableCell className="text-right font-bold text-slate-800 dark:text-white">
                    ${ord.amount.toFixed(2)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={getStatusVariant(ord.status)}>{ord.status}</Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="font-semibold text-slate-500">{ord.date}</TableCell>

                  {/* Action Eye Icon */}
                  <TableCell className="pr-6 text-right">
                    <button
                      onClick={() => setViewingOrderId(ord.id)}
                      className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1"
                      title="View Order Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
