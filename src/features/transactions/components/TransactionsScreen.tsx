'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TransactionRecord } from '@/types';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Loader2,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';

// Figma mockup transactions list (10 rows)
const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-001',
    type: 'Credit',
    description: 'Monthly payout — TravelTech Solutions',
    merchant: 'TravelTech Solutions',
    amount: 84200,
    date: 'Dec 15, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-002',
    type: 'Debit',
    description: 'Inventory purchase — Europe packages',
    merchant: 'Provider EU',
    amount: -12000,
    date: 'Dec 14, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-003',
    type: 'Credit',
    description: 'Monthly payout — GlobalConnect Ltd',
    merchant: 'GlobalConnect Ltd',
    amount: 62400,
    date: 'Dec 14, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-004',
    type: 'Debit',
    description: 'Inventory purchase — Asia packages',
    merchant: 'Provider APAC',
    amount: -8500,
    date: 'Dec 13, 24',
    status: 'Pending'
  },
  {
    id: 'TXN-005',
    type: 'Credit',
    description: 'Monthly payout — NomadSIM',
    merchant: 'NomadSIM',
    amount: 48900,
    date: 'Dec 13, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-006',
    type: 'Credit',
    description: 'Direct sale — customer order batch',
    merchant: 'Direct',
    amount: 1240,
    date: 'Dec 12, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-007',
    type: 'Debit',
    description: 'Failed inventory purchase — Global packages',
    merchant: 'Provider Global',
    amount: -4200,
    date: 'Dec 12, 24',
    status: 'Failed'
  },
  {
    id: 'TXN-008',
    type: 'Credit',
    description: 'Monthly payout — RoamEasy Inc',
    merchant: 'RoamEasy Inc',
    amount: 41200,
    date: 'Dec 11, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-009',
    type: 'Debit',
    description: 'Commission payment — NomadSIM',
    merchant: 'NomadSIM',
    amount: -6800,
    date: 'Dec 10, 24',
    status: 'Completed'
  },
  {
    id: 'TXN-010',
    type: 'Credit',
    description: 'Monthly payout — AsiaTel Partners',
    merchant: 'AsiaTel Partners',
    amount: 33800,
    date: 'Dec 9, 24',
    status: 'Completed'
  }
];

export default function TransactionsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions] = useState<TransactionRecord[]>(MOCK_TRANSACTIONS);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic aggregates calculations matching mockup values
  const totalCredits = transactions
    .filter((t) => t.type === 'Credit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalDebits = transactions
    .filter((t) => t.type === 'Debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalCredits - totalDebits;

  // Format numbers to match k-format representation in mockup (e.g. $271.7k)
  const formatK = (val: number) => {
    return `$${(val / 1000).toFixed(1)}k`;
  };

  // Filtered rows calculation
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'All' || tx.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading transaction registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Full transaction log for all platform activity.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting platform transactions log...')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white dark:bg-slate-950 dark:text-slate-350 dark:border-slate-800"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Credits */}
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Credits
              </span>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-450 mt-1.5">
                {formatK(totalCredits)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-450">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Debits */}
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Debits
              </span>
              <h3 className="text-2xl font-black text-rose-650 dark:text-rose-400 mt-1.5">
                {formatK(totalDebits)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center dark:bg-rose-950/20 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Net Balance
              </span>
              <h3 className="text-2xl font-black text-blue-600 dark:text-blue-450 mt-1.5">
                {formatK(netBalance)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Type select and Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Custom Select dropdown */}
          <div className="relative">
            <button
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
            >
              <span>{selectedType === 'All' ? 'All Types' : selectedType}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            
            {typeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTypeDropdownOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl shadow-lg py-1.5 z-20 animate-scaleIn text-xs font-bold">
                  {(['All', 'Credit', 'Debit'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedType(t);
                        setTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 ${
                        selectedType === t ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t === 'All' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Additional status filters coming soon!')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'Credit';
              
              return (
                <TableRow key={tx.id}>
                  {/* Clickable Transaction ID Link */}
                  <TableCell className="pl-6 font-bold text-xs">
                    <button
                      onClick={() => setViewingTransaction(tx)}
                      className="text-blue-650 hover:underline dark:text-blue-450 outline-none text-left"
                    >
                      {tx.id}
                    </button>
                  </TableCell>

                  {/* Type Badge with Icon */}
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                        : 'bg-slate-150 text-slate-700 dark:bg-slate-900 dark:text-slate-400'
                    }`}>
                      {isCredit ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <ArrowDownLeft className="h-3 w-3 text-slate-500" />
                      )}
                      {tx.type}
                    </span>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-700 dark:text-slate-350">
                    {tx.description}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-550">
                    {tx.merchant}
                  </TableCell>

                  {/* Amount with directional coloring */}
                  <TableCell className={`text-right font-bold ${
                    isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-850 dark:text-slate-200'
                  }`}>
                    {isCredit ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-500">
                    {tx.date}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="pr-6">
                    <Badge variant={getStatusVariant(tx.status)}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Transaction Details Modal overlay */}
      <TransactionDetailModal
        isOpen={!!viewingTransaction}
        transaction={viewingTransaction}
        onClose={() => setViewingTransaction(null)}
      />
    </div>
  );
}
