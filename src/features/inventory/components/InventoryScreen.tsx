'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_ESIM_INVENTORY_ITEMS } from '@/constants/mockData';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadCSV } from '@/services/mockDownloadService';
import { eSIMItem } from '@/types';
import {
  Upload,
  Download,
  Plus,
  Search,
  ChevronDown,
  Check,
  SlidersHorizontal,
  RotateCw,
  Loader2
} from 'lucide-react';
import ESIMDetailView from './eSIMDetailView';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<eSIMItem[]>(MOCK_ESIM_INVENTORY_ITEMS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Assigned' | 'Active' | 'Expired' | 'Suspended'>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewingIccid, setViewingIccid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter items based on search and status
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.iccid.includes(search) ||
      (item.packageName && item.packageName.toLowerCase().includes(search.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(search.toLowerCase())) ||
      (item.allocatedTo && item.allocatedTo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Find the currently selected eSIM item for detail page
  const selectedItem = inventory.find((item) => item.iccid === viewingIccid);


  // If viewing detail view, render eSIMDetailView component
  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading eSIM stock...</span>
        </div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <ESIMDetailView
        item={selectedItem}
        onBack={() => setViewingIccid(null)}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage your eSIM stock, track activation status, and import new inventory.
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                'Importing eSIM Bulk Stock',
                ['Reading CSV stock sheet...', 'Validating profile ICCIDs...', 'Updating platform cache...', 'Completing ledger record...'],
                () => {
                  addToast('Bulk stock file parsed and imported successfully!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                'Exporting eSIM Inventory Data',
                ['Scanning stock catalog...', 'Filtering record criteria...', 'Streaming CSV content...'],
                () => {
                  const headers = ['ICCID', 'Status', 'Provider', 'Package', 'Country'];
                  const rows = inventory.map(item => [item.iccid, item.status, item.provider, item.packageName || '', item.country || '']);
                  downloadCSV('eSIM_Inventory_Export', headers, rows);
                  addToast('eSIM inventory exported successfully!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              startSimulation(
                'Onboarding New eSIM Inventory Stock',
                ['Generating ICCID batches...', 'Querying Truphone SM-DP+ provider APIs...', 'Storing secure credentials...', 'Completing stock placement...'],
                () => {
                  const mockNewItem: eSIMItem = {
                    iccid: `890490320000${Math.floor(10000000 + Math.random() * 90000000)}`,
                    status: 'Available',
                    provider: 'Deutsche Telekom',
                    dataLimitGb: 10,
                    dataUsedGb: 0,
                    packageName: 'Europe Basic Pass',
                    country: 'Germany',
                    network: 'LTE/5G'
                  };
                  setInventory((prev) => [mockNewItem, ...prev]);
                  addToast('Successfully added 1 new eSIM profile to inventory stock!', 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards with thin colored bottom borders */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        
        {/* Available Card */}
        <Card className="border-slate-100/90 relative overflow-hidden shadow-sm flex flex-col justify-between h-[96px]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-950/20 dark:text-blue-400">
                63%
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">
              28,450
            </h3>
          </CardContent>
          {/* Blue bottom indicator line */}
          <div className="h-1 bg-blue-500 w-1/3 rounded-tr-full" />
        </Card>

        {/* Reserved Card */}
        <Card className="border-slate-100/90 relative overflow-hidden shadow-sm flex flex-col justify-between h-[96px]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reserved</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-950/20 dark:text-amber-400">
                18%
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">
              8,230
            </h3>
          </CardContent>
          {/* Yellow bottom indicator line */}
          <div className="h-1 bg-amber-500 w-1/3 rounded-tr-full" />
        </Card>

        {/* Assigned Card */}
        <Card className="border-slate-100/90 relative overflow-hidden shadow-sm flex flex-col justify-between h-[96px]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/20 dark:text-emerald-400">
                15%
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">
              6,890
            </h3>
          </CardContent>
          {/* Green bottom indicator line */}
          <div className="h-1 bg-emerald-500 w-1/3 rounded-tr-full" />
        </Card>

        {/* Expired Card */}
        <Card className="border-slate-100/90 relative overflow-hidden shadow-sm flex flex-col justify-between h-[96px]">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full dark:bg-rose-950/20 dark:text-rose-400">
                4%
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">
              1,660
            </h3>
          </CardContent>
          {/* Red bottom indicator line */}
          <div className="h-1 bg-rose-500 w-1/3 rounded-tr-full" />
        </Card>

      </div>

      {/* Filter and Search Toolbar */}
      <Card className="border-slate-100/85 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search ICCID, country, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Buttons and dropdown filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Custom status filter dropdown popped open */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white min-w-[125px] transition-colors"
              >
                <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Dropdown overlay panel */}
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
              onClick={() => addToast('Additional filters panel coming soon!', 'info')}
              className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              Filters
            </Button>

            {/* Refresh Button */}
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="p-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 shrink-0"
              title="Reset Filters"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>

            {/* Results count label */}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              {filteredItems.length} results
            </span>

          </div>

        </CardContent>
      </Card>

      {/* Main eSIM Grid Table */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">ICCID</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Country / Network</TableHead>
              <TableHead>Data Usage</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Activation Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-semibold">
                  No eSIM profiles found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const used = item.dataUsedGb ?? 0;
                const limit = item.dataLimitGb;
                const progressPct = Math.min(100, (used / limit) * 100);

                return (
                  <TableRow key={item.iccid}>
                    {/* Clickable blue link ICCID */}
                    <TableCell className="pl-6">
                      <button
                        onClick={() => setViewingIccid(item.iccid)}
                        className="font-normal text-blue-600 hover:underline dark:text-blue-400 text-left outline-none"
                      >
                        {item.iccid}
                      </button>
                    </TableCell>

                    {/* Package */}
                    <TableCell className="font-normal text-slate-800 dark:text-slate-200">
                      {item.packageName || '—'}
                    </TableCell>

                    {/* Country / Network Stack */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-normal text-slate-800 dark:text-slate-200">
                          {item.country || 'Global'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {item.network || 'Multiple'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Data Usage progress bar */}
                    <TableCell>
                      <div className="flex flex-col gap-1 w-28 font-semibold">
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>{used}GB</span>
                          <span>{limit}GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Assigned To */}
                    <TableCell className="font-normal text-slate-700 dark:text-slate-350">
                      {item.allocatedTo || <span className="text-slate-300 dark:text-slate-650">—</span>}
                    </TableCell>

                    {/* Activation Date */}
                    <TableCell className="font-normal text-slate-500 dark:text-slate-400">
                      {item.activationDate || <span className="text-slate-300 dark:text-slate-650">—</span>}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Action Link button */}
                    <TableCell className="pr-6 text-right">
                      <button
                        onClick={() => setViewingIccid(item.iccid)}
                        className="font-bold text-blue-600 hover:underline dark:text-blue-400 outline-none text-xs"
                      >
                        View
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
