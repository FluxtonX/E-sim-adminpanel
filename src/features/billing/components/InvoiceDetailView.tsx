'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Invoice } from '@/types';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  Building
} from 'lucide-react';

import { useSimulationStore } from '@/store/useSimulationStore';
import { useToastStore } from '@/store/useToastStore';
import { downloadPDF } from '@/services/mockDownloadService';

interface InvoiceDetailViewProps {
  invoice: Invoice;
  onBack: () => void;
}


export default function InvoiceDetailView({ invoice, onBack }: InvoiceDetailViewProps) {
  
  // Calculate mock line items based on invoice amount
  const getLineItems = () => {
    
    // Deterministic split based on invoice amount
    const esimBatchQty = Math.round(invoice.amount / 50);
    const esimBatchPrice = 35.00;
    const esimBatchTotal = esimBatchQty * esimBatchPrice;
    
    const serviceFee = +(invoice.amount - esimBatchTotal).toFixed(2);
    
    return [
      {
        desc: 'Europe & Asia eSIM Profiles Batch Allocation',
        qty: esimBatchQty,
        unitPrice: esimBatchPrice,
        total: esimBatchTotal
      },
      {
        desc: 'SM-DP+ Provisioning API & Platform Surcharge',
        qty: 1,
        unitPrice: serviceFee,
        total: serviceFee
      }
    ];
  };

  const lineItems = getLineItems();
  const subtotal = invoice.amount;
  const tax = +(subtotal * 0.05).toFixed(2); // 5% VAT/Surcharge mock
  const grandTotal = +(subtotal + tax).toFixed(2);

  const startSimulation = useSimulationStore((s) => s.startSimulation);
  const addToast = useToastStore((s) => s.addToast);

  const handlePrint = () => {
    startSimulation(
      `Preparing Statement Print for Invoice ${invoice.id}`,
      ['Accessing local database...', 'Generating clean printable document...', 'Connecting to default printer spooler...'],
      () => {
        window.print();
        addToast(`Sent Invoice ${invoice.id} print job to printer spooler.`, 'success');
      }
    );
  };

  const handleDownload = () => {
    startSimulation(
      `Compiling Invoice Receipt PDF`,
      ['Locating invoice records...', 'Generating cryptographic hash...', 'Structuring PDF content layout...', 'Initiating browser file download...'],
      () => {
        const textContent = `
========================================
INVOICE RECEIPT - FLUXTONX ESIM PLATFORM
========================================
Invoice ID: ${invoice.id}
Recipient: ${invoice.merchantName}
Issue Date: ${invoice.issueDate}
Due Date: ${invoice.dueDate}
Status: ${invoice.status}

LINE ITEMS:
----------------------------------------
1. Data Package Purchase
   Amount: $${invoice.amount.toFixed(2)}
2. Platform Surcharge (5% VAT)
   Amount: $${(invoice.amount * 0.05).toFixed(2)}

----------------------------------------
TOTAL PAID: $${(invoice.amount * 1.05).toFixed(2)}
========================================
Thank you for using FluxtonX eSIM Services.
        `;
        downloadPDF(`Invoice_${invoice.id}`, textContent);
        addToast(`Invoice PDF receipt for ${invoice.id} downloaded successfully!`, 'success');
      }
    );
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
          Back to Invoices
        </button>
      </div>

      {/* Main title and actions row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Invoice Details</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">{invoice.id}</p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(invoice.status)}>
            {invoice.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Statement
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Invoice Information Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" />
                Invoice Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-semibold">
                
                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Invoice ID</span>
                  <span className="font-mono text-slate-800 dark:text-white">{invoice.id}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Reseller Corporate Merchant</span>
                  <span className="text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-blue-500" />
                    {invoice.merchantName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Issue Settlement Date</span>
                  <span className="text-slate-800 dark:text-white">{invoice.issueDate}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Due Date Limit</span>
                  <span className="text-slate-800 dark:text-white">{invoice.dueDate}</span>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Line Items Table Card */}
          <Card className="border-slate-100/90 shadow-sm overflow-hidden">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Line Items Breakdown
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Item Description</TableHead>
                  <TableHead className="text-center w-20">Quantity</TableHead>
                  <TableHead className="text-right w-28">Unit Price</TableHead>
                  <TableHead className="text-right pr-6 w-28">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 font-bold text-xs text-slate-800 dark:text-white">
                      {item.desc}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-600">
                      {item.qty}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-600">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-6 font-bold text-slate-850 dark:text-white">
                      ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

        </div>

        {/* Right Column (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Payment Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                Invoice Settlement Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal Amount:</span>
                  <span className="text-slate-700 dark:text-white">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VAT/Taxes (5%):</span>
                  <span className="text-slate-700 dark:text-white">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-slate-50 pt-3 dark:border-slate-900/50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Grand Total Due:</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-4 dark:border-slate-900/50 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Settling Ledger:</span>
                  <span className="text-slate-800 font-bold dark:text-white">res_balance</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Reference ID:</span>
                  <span className="font-mono text-slate-800 dark:text-white">tx_inv_8902{invoice.id.slice(-3)}</span>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
