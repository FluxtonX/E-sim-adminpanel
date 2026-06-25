'use client';

import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentHistoryRecord } from '@/types';
import { X, FileText, Printer, Download, Building, Landmark, CreditCard } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadPDF } from '@/services/mockDownloadService';

interface PaymentDetailModalProps {
  payment: PaymentHistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}


export default function PaymentDetailModal({ payment, isOpen, onClose }: PaymentDetailModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);

  if (!isOpen || !payment) return null;


  const normMethod = payment.method.toLowerCase();
  const isCard = normMethod.includes('visa') || normMethod.includes('mastercard');
  const isBank = normMethod.includes('bank') || normMethod.includes('transfer');

  // Reusable transaction reference IDs
  const txRefs: Record<string, string> = {
    'PAY-001': 'ch_3N98A2b7810C24',
    'PAY-002': 'ch_3N82J4c6792A11',
    'PAY-003': 'ch_3N71K9d4234B90',
    'PAY-004': 'ch_3N60F3e1985F88'
  };
  const refId = txRefs[payment.id] || `ch_local_${payment.id.toLowerCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-lg shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Payment Receipt</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{payment.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main summary row */}
          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Amount Paid
              </span>
              <h2 className="text-3xl font-black text-slate-850 dark:text-white mt-1">
                ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <Badge variant={getStatusVariant(payment.status)}>
              {payment.status}
            </Badge>
          </div>

          {/* Audit breakdown */}
          <div className="space-y-3.5 text-xs font-semibold">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-50 dark:border-slate-900 pb-1.5 pl-0.5">
              Billing Audit Particulars
            </h4>
            
            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
              <span className="text-slate-400 font-semibold">Description</span>
              <span className="text-slate-800 dark:text-slate-200">{payment.description}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
              <span className="text-slate-400 font-semibold">Payment Method</span>
              <span className="flex items-center gap-1.5 text-slate-850 dark:text-white">
                {isCard ? (
                  <CreditCard className="h-4 w-4 text-slate-500" />
                ) : isBank ? (
                  <Landmark className="h-4 w-4 text-slate-500" />
                ) : (
                  <FileText className="h-4 w-4 text-slate-500" />
                )}
                {payment.method}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
              <span className="text-slate-400 font-semibold">Date Settled</span>
              <span className="text-slate-800 dark:text-slate-200">{payment.date}, 2024</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
              <span className="text-slate-400 font-semibold">Transaction Reference</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{refId}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/50">
              <span className="text-slate-400 font-semibold">Platform Entity</span>
              <span className="flex items-center gap-1 text-slate-850 dark:text-white">
                <Building className="h-3.5 w-3.5 text-blue-600" />
                United Union E-SIM
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-100 dark:border-slate-900">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startSimulation(
                `Printing Statement for Payment ${payment.id}`,
                ['Reading transaction records...', 'Compiling layout templates...', 'Sending to print buffer...'],
                () => {
                  window.print();
                  addToast(`Payment statement ${payment.id} print job sent!`, 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              startSimulation(
                `Downloading Receipt PDF for ${payment.id}`,
                ['Verifying payment provider response...', 'Creating digital stamp...', 'Structuring PDF receipt page...', 'Initiating file stream download...'],
                () => {
                  const textContent = `
========================================
PAYMENT RECEIPT STATEMENT - FLUXTONX
========================================
Payment ID: ${payment.id}
Description: ${payment.description}
Payment Method: ${payment.method}
Amount: $${payment.amount.toFixed(2)}
Date: ${payment.date}
Status: ${payment.status}

Transaction Reference: ${refId}
Thank you for your transaction!
========================================
                  `;
                  downloadPDF(`Payment_${payment.id}_Receipt`, textContent);
                  addToast(`Payment receipt PDF for ${payment.id} downloaded!`, 'success');
                }
              );
            }}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
