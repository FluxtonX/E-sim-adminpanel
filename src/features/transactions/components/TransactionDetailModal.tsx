'use client';

import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TransactionRecord } from '@/types';
import { X, Receipt, Copy, Download, User, Calendar, ShieldCheck } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { downloadPDF } from '@/services/mockDownloadService';

interface TransactionDetailModalProps {
  transaction: TransactionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}


export default function TransactionDetailModal({ transaction, isOpen, onClose }: TransactionDetailModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const startSimulation = useSimulationStore((s) => s.startSimulation);

  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'Credit';

  
  // Custom mock reference and audit trails based on transaction ID
  const auditLogs: Record<string, { time: string; event: string }[]> = {
    'TXN-001': [
      { time: '10:00 AM', event: 'Payout batch compiled and approved by Super Admin' },
      { time: '09:45 AM', event: 'Ledger reconciliation check passed successfully' },
      { time: '09:00 AM', event: 'Monthly payout billing run scheduled' }
    ],
    'TXN-002': [
      { time: '04:30 PM', event: 'eSIM profile inventory batch provisioned in registry' },
      { time: '04:29 PM', event: 'Payment debit completed from Mastercard card default' },
      { time: '04:15 PM', event: 'Inventory batch requisition created by System Agent' }
    ],
    'TXN-004': [
      { time: '01:10 PM', event: 'Carrier queue acknowledgment pending response' },
      { time: '01:05 PM', event: 'Debit transaction hold applied for invoice batch' }
    ],
    'TXN-007': [
      { time: '11:42 AM', event: 'Reversed payment authorization from gateway' },
      { time: '11:40 AM', event: 'Failed carrier API allocation connection timeout' }
    ]
  };

  const currentLogs = auditLogs[transaction.id] || [
    { time: '09:00 AM', event: 'Ledger reconciliation completed successfully' },
    { time: '08:45 AM', event: 'Transaction authorization cleared' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`tx_ref_${transaction.id.toLowerCase()}_98042`);
    addToast('Reference ID copied to clipboard!', 'success');
  };

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
              <Receipt className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Transaction Audit</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{transaction.id}</span>
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
        <div className="p-6 space-y-5 overflow-y-auto max-h-[68vh]">
          
          {/* Amount Box */}
          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Transaction Value
              </span>
              <h2 className={`text-3xl font-black mt-1 ${
                isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'
              }`}>
                {isCredit ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant={isCredit ? 'success' : 'neutral'} className="text-[10px] uppercase tracking-wider">
                {isCredit ? 'Credit' : 'Debit'}
              </Badge>
              <Badge variant={getStatusVariant(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 text-xs font-semibold">
            <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900/50 pb-2">
              <span className="text-slate-400 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Merchant / Entity</span>
              <span className="text-slate-850 dark:text-white">{transaction.merchant}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900/50 pb-2">
              <span className="text-slate-400 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date Recorded</span>
              <span className="text-slate-850 dark:text-white">{transaction.date}</span>
            </div>

            <div className="col-span-2 flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900/50 pb-2">
              <span className="text-slate-400">Description</span>
              <span className="text-slate-850 dark:text-white">{transaction.description}</span>
            </div>

            <div className="col-span-2 flex flex-col gap-1 border-b border-slate-50 dark:border-slate-900/50 pb-2">
              <span className="text-slate-400">Reference ID</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  tx_ref_{transaction.id.toLowerCase()}_98042
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-blue-600 hover:text-blue-750 dark:text-blue-400 p-0.5 outline-none"
                  title="Copy Reference ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-50 dark:border-slate-900 pb-1.5 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Reconciliation Audit Trail
            </h4>

            <div className="relative border-l border-slate-100 dark:border-slate-900 ml-2.5 pl-5 space-y-4">
              {currentLogs.map((log, idx) => (
                <div key={idx} className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-950" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">
                      {log.time}
                    </span>
                    <p className="text-xs font-semibold text-slate-650 dark:text-slate-350 mt-1">
                      {log.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-100 dark:border-slate-900">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close Audit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              startSimulation(
                `Downloading Ledger Audit PDF for ${transaction.id}`,
                ['Fetching blockchain audit records...', 'Securing transaction credentials...', 'Structuring PDF ledger statement...', 'Streaming output file...'],
                () => {
                  const logContent = `
========================================
TRANSACTION LEDGER AUDIT LOG - FLUXTONX
========================================
Transaction ID: ${transaction.id}
Merchant/Partner: ${transaction.merchant}
Type: ${transaction.type}
Amount: $${transaction.amount.toFixed(2)}
Status: ${transaction.status}
Date: ${transaction.date}

AUDIT LOG RECORDS:
${currentLogs.map((log) => `- [${log.time}] ${log.event}`).join('\n')}

Reconciled and certified by United Union E-SIM audit node.
========================================
                  `;
                  downloadPDF(`Ledger_Audit_${transaction.id}`, logContent);
                  addToast(`Audit log PDF for ${transaction.id} downloaded successfully!`, 'success');
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
