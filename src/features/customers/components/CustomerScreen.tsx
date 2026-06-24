'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_CUSTOMERS } from '@/constants/mockData';
import { Customer } from '@/types';
import {
  Search,
  Loader2,
  Mail,
  Eye,
  Plus,
  Globe
} from 'lucide-react';
import CustomerDetailView from './CustomerDetailView';
import EmailComposerModal from './EmailComposerModal';

// Vector Flags components matching standard rectangular ratio
const UKFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#012169]">
    <svg viewBox="0 0 60 30" className="w-full h-full">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
    </svg>
  </div>
);

const SingaporeFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#C8102E]">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="1" fill="#DF151A" />
      <rect y="1" width="3" height="1" fill="#FFFFFF" />
      <path d="M 0.5 0.5 A 0.25 0.25 0 0 0 0.5 0.15 A 0.25 0.25 0 0 1 0.5 0.5 Z" fill="#FFFFFF" />
    </svg>
  </div>
);

const ItalyFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#F1F2F1" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  </div>
);

const IndiaFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-white">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="0.67" fill="#FF9933" />
      <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
      <rect y="1.34" width="3" height="0.67" fill="#138808" />
      <circle cx="1.5" cy="1" r="0.15" fill="#000080" />
    </svg>
  </div>
);

const GermanyFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 5 3" className="w-full h-full">
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#D00" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  </div>
);

const AustraliaFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#00008b]">
    <svg viewBox="0 0 2 1" className="w-full h-full">
      <rect width="2" height="1" fill="#00008b" />
      {/* Small Union Jack mock representation */}
      <rect width="0.8" height="0.4" fill="#012169" />
      <path d="M0,0 L0.8,0.4 M0.8,0 L0,0.4" stroke="#fff" strokeWidth="0.08" />
      <path d="M0.4,0 L0.4,0.4 M0,0.2 L0.8,0.2" stroke="#fff" strokeWidth="0.12" />
    </svg>
  </div>
);

const MexicoFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="1" height="2" fill="#006847" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#C8102E" />
      <circle cx="1.5" cy="1" r="0.15" fill="#8B5A2B" />
    </svg>
  </div>
);

const JapanFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-200">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
    </svg>
  </div>
);

const UAEFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 4 2" className="w-full h-full">
      <rect x="1" width="3" height="0.67" fill="#00732F" />
      <rect x="1" y="0.67" width="3" height="0.67" fill="#FFFFFF" />
      <rect x="1" y="1.34" width="3" height="0.67" fill="#000000" />
      <rect width="1" height="2" fill="#FF0000" />
    </svg>
  </div>
);

const OmanFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#db161b" />
      <rect width="3" height="0.67" fill="#ffffff" />
      <rect y="1.33" width="3" height="0.67" fill="#008000" />
      <rect width="0.75" height="2" fill="#db161b" />
    </svg>
  </div>
);

const FranceFlag = () => (
  <div className="h-3.5 w-5.5 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  </div>
);

export default function CustomerScreen() {
  const [search, setSearch] = useState('');
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);
  const [composeCustomer, setComposeCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getFlagComponent = (countryName: string) => {
    switch (countryName.toLowerCase()) {
      case 'united kingdom': return <UKFlag />;
      case 'singapore': return <SingaporeFlag />;
      case 'italy': return <ItalyFlag />;
      case 'india': return <IndiaFlag />;
      case 'germany': return <GermanyFlag />;
      case 'australia': return <AustraliaFlag />;
      case 'mexico': return <MexicoFlag />;
      case 'japan': return <JapanFlag />;
      case 'uae': return <UAEFlag />;
      case 'oman': return <OmanFlag />;
      case 'france': return <FranceFlag />;
      default: return <Globe className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const term = search.toLowerCase();
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.country.toLowerCase().includes(term)
    );
  });

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === viewingCustomerId);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading customer database...</span>
        </div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        onBack={() => setViewingCustomerId(null)}
        getFlagComponent={getFlagComponent}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage individual eSIM customers, their usage, and purchase history.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Creating new customer profile...')}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* KPI Cards Row matching the figma mockup */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Customers</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">12</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">10</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">$1570</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Spend</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">$130.80</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-100/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="w-full relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Customer</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Esims</TableHead>
              <TableHead>Total Spend</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 w-20 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                  No customers found matching the search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => {
                const initials = customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <TableRow key={customer.id}>
                    
                    {/* CUSTOMER */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 dark:bg-blue-950/20 dark:text-blue-400">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <button
                            onClick={() => setViewingCustomerId(customer.id)}
                            className="font-bold text-slate-800 hover:underline dark:text-slate-200 text-left outline-none text-xs"
                          >
                            {customer.name}
                          </button>
                          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* COUNTRY */}
                    <TableCell>
                      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-350">
                        {getFlagComponent(customer.country)}
                        <span>{customer.country}</span>
                      </div>
                    </TableCell>

                    {/* ESIMS */}
                    <TableCell className="font-bold text-slate-800 dark:text-white">
                      {customer.esimsCount}
                    </TableCell>

                    {/* TOTAL SPEND */}
                    <TableCell className="font-bold text-slate-800 dark:text-white">
                      ${customer.totalSpend.toFixed(2)}
                    </TableCell>

                    {/* JOINED */}
                    <TableCell className="font-semibold text-slate-500">
                      {customer.joined}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge variant={customer.status === 'Active' ? 'success' : 'neutral'}>
                        {customer.status}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <button
                          onClick={() => setComposeCustomer(customer)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewingCustomerId(customer.id)}
                          className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Integrated Email Composer Modal */}
      {composeCustomer && (
        <EmailComposerModal
          customer={composeCustomer}
          isOpen={!!composeCustomer}
          onClose={() => setComposeCustomer(null)}
        />
      )}

    </div>
  );
}
