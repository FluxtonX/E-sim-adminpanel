'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { MOCK_INVOICES } from '@/constants/mockData';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export default function BillingScreen() {
  
  // Calculate metric aggregates
  const totalAmount = MOCK_INVOICES.reduce((acc, inv) => acc + inv.amount, 0);
  const paidAmount = MOCK_INVOICES.filter(i => i.status === 'Paid').reduce((acc, inv) => acc + inv.amount, 0);
  const pendingAmount = MOCK_INVOICES.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Billing & Invoices</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Monitor merchant credit accounts, invoicing settlements, and payment transactions.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Invoiced</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">${totalAmount.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Settled Payments</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">${paidAmount.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Invoices</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">${pendingAmount.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white pl-1">Invoices</h3>
        <Card className="border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="pr-6 font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="pl-6 font-bold text-slate-800 dark:text-white">
                    {inv.id}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                    {inv.merchantName}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-500">{inv.issueDate}</TableCell>
                  <TableCell className="font-semibold text-slate-500">{inv.dueDate}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={getStatusVariant(inv.status)}>{inv.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
