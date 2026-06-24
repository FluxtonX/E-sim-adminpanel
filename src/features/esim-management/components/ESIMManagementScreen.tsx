'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_ESIM_INVENTORY_ITEMS } from '@/constants/mockData';
import {
  Plus,
  Search,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Loader2,
  Eye
} from 'lucide-react';
import ESIMDetailView from '@/features/inventory/components/eSIMDetailView';

export default function ESIMManagementScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Assigned' | 'Active' | 'Expired' | 'Suspended'>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewingIccid, setViewingIccid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter items based on search and status
  const filteredItems = MOCK_ESIM_INVENTORY_ITEMS.filter((item) => {
    const matchesSearch =
      item.iccid.includes(search) ||
      (item.packageName && item.packageName.toLowerCase().includes(search.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(search.toLowerCase())) ||
      (item.allocatedTo && item.allocatedTo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Find the currently selected eSIM item for detail page
  const selectedItem = MOCK_ESIM_INVENTORY_ITEMS.find((item) => item.iccid === viewingIccid);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading eSIM management...</span>
        </div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <ESIMDetailView
        item={selectedItem}
        onBack={() => setViewingIccid(null)}
        backLabel="Back to eSIM Management"
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">eSIM Management</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            View and manage all eSIM profiles, activations, and assignments.
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Assigning new eSIM...')}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            Assign eSIM
          </Button>
        </div>
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
              placeholder="Search ICCID or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Right Filters Container */}
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
                    {(['All', 'Available', 'Assigned', 'Active', 'Expired', 'Suspended'] as const).map((status) => (
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
              onClick={() => alert('Filter customization coming soon...')}
              className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              Filters
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* eSIM Table */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">ICCID</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Country / Network</TableHead>
              <TableHead>Data Usage</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Activation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-semibold">
                  No eSIM profiles found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                // Calculate data usage percentage
                const dataUsed = item.dataUsedGb ?? 0;
                const dataLimit = item.dataLimitGb;
                const usagePercentage = Math.min(100, Math.round((dataUsed / dataLimit) * 100));

                return (
                  <TableRow key={item.iccid}>
                    
                    {/* ICCID */}
                    <TableCell className="pl-6 font-mono font-bold text-xs">
                      <button
                        onClick={() => setViewingIccid(item.iccid)}
                        className="text-blue-600 hover:underline dark:text-blue-400 text-left outline-none"
                      >
                        {item.iccid}
                      </button>
                    </TableCell>

                    {/* Package Name */}
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                      {item.packageName || <span className="text-slate-300 dark:text-slate-650">—</span>}
                    </TableCell>

                    {/* Country & Provider */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.country || '—'}</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.network || '—'}</span>
                      </div>
                    </TableCell>

                    {/* Data Usage progress bar */}
                    <TableCell className="min-w-[140px]">
                      <div className="space-y-1.5 w-36">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-700 dark:text-slate-300">{dataUsed}GB used</span>
                          <span className="text-slate-450">{dataLimit}GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.status === 'Expired' ? 'bg-rose-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Assigned To */}
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                      {item.allocatedTo || <span className="text-slate-300 dark:text-slate-650">—</span>}
                    </TableCell>

                    {/* Activation Date */}
                    <TableCell className="font-semibold text-slate-500 dark:text-slate-400">
                      {item.activationDate || <span className="text-slate-300 dark:text-slate-650">—</span>}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Action Eye icon */}
                    <TableCell className="pr-6 text-right">
                      <button
                        onClick={() => setViewingIccid(item.iccid)}
                        className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1"
                        title="View eSIM Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}
