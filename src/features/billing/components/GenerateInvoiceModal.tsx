import { useState } from 'react';
import { Invoice } from '@/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (invoice: Invoice) => void;
}

export default function GenerateInvoiceModal({ isOpen, onClose, onGenerate }: GenerateInvoiceModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Invoice['status']>('Pending');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      merchantName: customerName,
      amount: parseFloat(amount) || 0,
      status,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    onGenerate(newInvoice);
    onClose();
    setCustomerName('');
    setAmount('');
    setStatus('Pending');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Generate New Invoice
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe / Alpha Reseller"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Amount (USD)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 250.00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Invoice['status'])}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Generate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
