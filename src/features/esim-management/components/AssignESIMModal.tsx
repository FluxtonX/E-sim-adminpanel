import { useState } from 'react';
import { eSIMItem } from '@/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AssignESIMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (item: eSIMItem) => void;
}

export default function AssignESIMModal({ isOpen, onClose, onAssign }: AssignESIMModalProps) {
  const [allocatedTo, setAllocatedTo] = useState('');
  const [packageName, setPackageName] = useState('Global Premium Unlimited');
  const [country, setCountry] = useState('United Kingdom');
  const [provider, setProvider] = useState('Singtel');
  const [status, setStatus] = useState<eSIMItem['status']>('Assigned');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatedTo) return;

    const mockIccid = `890490320000${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newItem: eSIMItem = {
      iccid: mockIccid,
      status,
      provider,
      allocatedTo,
      dataLimitGb: 20,
      dataUsedGb: 0,
      packageName,
      country,
      network: '5G / LTE',
      activationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    onAssign(newItem);
    onClose();
    setAllocatedTo('');
    setPackageName('Global Premium Unlimited');
    setCountry('United Kingdom');
    setProvider('Singtel');
    setStatus('Assigned');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Assign eSIM Profile
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
              Allocate To (Customer / Merchant)
            </label>
            <input
              type="text"
              required
              value={allocatedTo}
              onChange={(e) => setAllocatedTo(e.target.value)}
              placeholder="e.g. John Doe / Reseller Alpha"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Package
            </label>
            <select
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            >
              <option value="Global Premium Unlimited">Global Premium Unlimited (20GB)</option>
              <option value="Europe Basic Pass">Europe Basic Pass (5GB)</option>
              <option value="Asia Speedy Lite">Asia Speedy Lite (10GB)</option>
              <option value="UK Local Connect">UK Local Connect (15GB)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Target Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Singapore">Singapore</option>
              <option value="Italy">Italy</option>
              <option value="India">India</option>
              <option value="Germany">Germany</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Carrier Profile Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            >
              <option value="Singtel">Singtel</option>
              <option value="Deutsche Telekom">Deutsche Telekom</option>
              <option value="Vodafone">Vodafone</option>
              <option value="Orange S.A.">Orange S.A.</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              eSIM Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as eSIMItem['status'])}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            >
              <option value="Assigned">Assigned</option>
              <option value="Active">Active</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Assign eSIM
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
