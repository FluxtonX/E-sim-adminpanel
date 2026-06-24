'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Order } from '@/types';
import {
  ArrowLeft,
  Printer,
  Download,
  CreditCard,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
}

export default function OrderDetailView({ order, onBack }: OrderDetailViewProps) {
  
  // Calculate mock pricing details
  const tax = +(order.amount * 0.08).toFixed(2);
  const subtotal = +(order.amount - tax).toFixed(2);
  
  const handlePrint = () => {
    alert(`Printing invoice for order ${order.id}...`);
  };

  const handleDownload = () => {
    alert(`Downloading invoice receipt PDF for order ${order.id}...`);
  };

  // Determine timeline items based on status
  const getTimelineSteps = () => {
    const isCompleted = order.status === 'Completed' || order.status === 'Active';
    const isFailed = order.status === 'Failed';
    const isPending = order.status === 'Pending';
    const isExpired = order.status === 'Expired';

    return [
      {
        title: 'Order Created',
        desc: `Reseller system initiated purchase request for ${order.packageName}.`,
        time: `${order.date} - 10:14 AM`,
        status: 'done'
      },
      {
        title: 'Payment Processed',
        desc: isFailed 
          ? 'Transaction authorization failed at payment gateway.' 
          : `Settled via Reseller Corporate Balance ($${order.amount.toFixed(2)}).`,
        time: isFailed ? `${order.date} - 10:15 AM` : `${order.date} - 10:15 AM`,
        status: isFailed ? 'failed' : 'done'
      },
      {
        title: 'eSIM Profile Provisioned',
        desc: isFailed 
          ? 'Provisioning suspended due to payment failure.' 
          : isPending
          ? 'LPA code generation queued on SM-DP+ server.'
          : 'eSIM profile generated successfully. ICCID assigned.',
        time: isCompleted || isExpired ? `${order.date} - 10:16 AM` : isPending ? 'Processing...' : 'Cancelled',
        status: isFailed ? 'failed' : isPending ? 'pending' : 'done'
      },
      {
        title: 'eSIM Status Updates',
        desc: isCompleted 
          ? 'eSIM successfully activated on consumer device.' 
          : isExpired
          ? 'eSIM package limit reached or validity period expired.'
          : isFailed
          ? 'Order closed due to transaction failure.'
          : 'Waiting for device activation callback.',
        time: isCompleted ? `${order.date} - 11:32 AM` : isExpired ? `${order.date} - End of Validity` : 'Pending',
        status: isCompleted ? 'done' : isExpired ? 'failed' : 'pending'
      }
    ];
  };

  const timelineSteps = getTimelineSteps();

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Back button and breadcrumbs row */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-max"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </button>
      </div>

      {/* Main title and actions row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Order Details</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">{order.id}</p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(order.status)}>
            {order.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Invoice PDF
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Details Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-semibold">
                
                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Order ID</span>
                  <span className="font-mono text-slate-800 dark:text-white">{order.id}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Package Purchased</span>
                  <span className="text-slate-800 dark:text-white">{order.packageName}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Zone/Region</span>
                  <span className="text-slate-800 dark:text-white">{order.region}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Transaction Date</span>
                  <span className="text-slate-800 dark:text-white">{order.date}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50 md:border-none">
                  <span className="text-slate-400">Subtotal Amount</span>
                  <span className="text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-900/50 md:border-none">
                  <span className="text-slate-400">Sales Tax (8%)</span>
                  <span className="text-slate-800 dark:text-white">${tax.toFixed(2)}</span>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Payment & Settling Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100/40 dark:border-slate-900/20">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount Settled</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">${order.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-150 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350">
                  <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                   res_balance
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold pt-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Reseller Account</span>
                  <span className="text-slate-800 dark:text-white">AlpsSIM Resell Co.</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-900/50">
                  <span className="text-slate-400">Gateway Reference</span>
                  <span className="font-mono text-slate-800 dark:text-white">tx_82490{order.id.slice(-3)}</span>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-600" />
                Customer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold dark:bg-slate-900 dark:text-slate-400">
                  {order.customerName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{order.customerName}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{order.customerEmail}</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-3 dark:border-slate-900/50 flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Account status</span>
                <span className="text-emerald-600 font-bold">Verified</span>
              </div>

            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="border-slate-100/90 shadow-sm">
            <CardHeader className="border-slate-100/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                Processing Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              
              {/* Timeline layout */}
              <div className="relative border-l border-slate-150 ml-3.5 pl-5 space-y-6 text-xs dark:border-slate-850">
                {timelineSteps.map((step, idx) => {
                  let Icon = CheckCircle2;
                  let colorClass = 'text-slate-350 bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-850';
                  
                  if (step.status === 'done') {
                    Icon = CheckCircle2;
                    colorClass = 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50';
                  } else if (step.status === 'failed') {
                    Icon = AlertTriangle;
                    colorClass = 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50';
                  } else if (step.status === 'pending') {
                    Icon = Clock;
                    colorClass = 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50';
                  }

                  return (
                    <div key={idx} className="relative">
                      {/* Floating node dot */}
                      <span className={`absolute -left-[28.5px] top-0.5 rounded-full border p-1 flex items-center justify-center ${colorClass}`}>
                        <Icon className="h-3 w-3" />
                      </span>
                      
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 block dark:text-white">
                          {step.title}
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                          {step.desc}
                        </p>
                        <span className="text-[9px] font-mono text-slate-450 block pt-0.5">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
