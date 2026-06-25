import { useState } from 'react';
import { Customer } from '@/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: Customer) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onAdd }: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newCustomer: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      country,
      esimsCount: 0,
      totalSpend: 0,
      joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status,
    };

    onAdd(newCustomer);
    onClose();
    setName('');
    setEmail('');
    setCountry('United Kingdom');
    setStatus('Active');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Add New Customer
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Liam Smith"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. liam@domain.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Country
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
              <option value="Mexico">Mexico</option>
              <option value="Japan">Japan</option>
              <option value="UAE">UAE</option>
              <option value="Oman">Oman</option>
              <option value="France">France</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="accent-blue-600"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="accent-blue-600"
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
