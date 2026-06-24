'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_INVOICES } from '@/constants/mockData';
import { Invoice } from '@/types';
import {
  FileText,
  Loader2,
  Eye,
  SendHorizontal,
  Download,
  Plus
} from 'lucide-react';
import InvoiceDetailView from './InvoiceDetailView';
import EmailComposerModal from '@/features/customers/components/EmailComposerModal';

export default function BillingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const [shareInvoice, setShareInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const selectedInvoice = MOCK_INVOICES.find(inv => inv.id === viewingInvoiceId);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading billing invoices...</span>
        </div>
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetailView
        invoice={selectedInvoice}
        onBack={() => setViewingInvoiceId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Billing</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage invoices, billing cycles, and payment records.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting billing invoices...')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Generating new invoice...')}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Summary KPI aggregates row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Invoiced</span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">$295,600</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-450 mt-1">$246,900</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">$103,600</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-100/90 shadow-sm">
          <CardContent className="p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-450 mt-1">$25,100</h3>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white pl-1">Invoices</h3>
        <Card className="border-slate-100 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 w-28 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  
                  {/* Invoice Link with Icon */}
                  <TableCell className="pl-6 font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                      <button
                        onClick={() => setViewingInvoiceId(inv.id)}
                        className="text-blue-600 hover:underline dark:text-blue-400 text-left outline-none"
                      >
                        {inv.id}
                      </button>
                    </div>
                  </TableCell>

                  {/* Merchant Name */}
                  <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                    {inv.merchantName}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right font-bold text-slate-850 dark:text-white">
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </TableCell>

                  {/* Issued Date */}
                  <TableCell className="font-semibold text-slate-500">{inv.issueDate}</TableCell>

                  {/* Due Date */}
                  <TableCell className="font-semibold text-slate-500">{inv.dueDate}</TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge variant={getStatusVariant(inv.status)}>{inv.status}</Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <button
                        onClick={() => setViewingInvoiceId(inv.id)}
                        className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors p-1"
                        title="View Detailed Receipt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShareInvoice(inv)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                        title="Email Invoice to Reseller"
                      >
                        <SendHorizontal className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading statement PDF for invoice ${inv.id}...`)}
                        className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors p-1"
                        title="Download Invoice PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Share Invoice Email Composer Popup */}
      {shareInvoice && (
        <EmailComposerModal
          customer={{
            name: shareInvoice.merchantName,
            email: `${shareInvoice.merchantName.toLowerCase().replace(/\s+/g, '')}@reseller.com`
          }}
          isOpen={!!shareInvoice}
          onClose={() => setShareInvoice(null)}
          initialTemplate="receipt"
        />
      )}

    </div>
  );
}
