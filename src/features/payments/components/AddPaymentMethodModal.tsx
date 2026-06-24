'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, CreditCard, Check, Loader2 } from 'lucide-react';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: { brand: 'Visa' | 'Mastercard'; last4: string; expiry: string; isDefault: boolean }) => void;
}

export default function AddPaymentMethodModal({ isOpen, onClose, onSave }: AddPaymentMethodModalProps) {
  const [brand, setBrand] = useState<'Visa' | 'Mastercard'>('Visa');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 4);
    if (val.length > 2) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setExpiry(val);
    }
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: '' }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(val);
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (expiry.length !== 5) {
      newErrors.expiry = 'Use MM/YY format';
    } else {
      const [mm] = expiry.split('/').map(Number);
      if (mm < 1 || mm > 12) {
        newErrors.expiry = 'Invalid month';
      }
    }
    if (cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API registration
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    onSave({
      brand,
      last4: cleanNum.substring(12),
      expiry,
      isDefault
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Add Payment Method</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Register credit or debit cards</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Card Brand selection Grid */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Card Brand
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Visa', 'Mastercard'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    brand === b
                      ? 'border-blue-600 bg-blue-50/10 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400'
                  }`}
                >
                  <span>{b}</span>
                  {brand === b && <Check className="h-4 w-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Cardholder Name */}
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value);
              if (errors.cardholderName) setErrors((prev) => ({ ...prev, cardholderName: '' }));
            }}
            error={errors.cardholderName}
          />

          {/* Card Number */}
          <Input
            label="Card Number"
            placeholder="•••• •••• •••• ••••"
            value={cardNumber}
            onChange={handleCardNumberChange}
            error={errors.cardNumber}
          />

          {/* Expiry & CVV Row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              error={errors.expiry}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
              error={errors.cvv}
            />
          </div>

          {/* Set as Default Checkbox */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="setDefaultCheck"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-350 text-blue-650 focus:ring-blue-100 cursor-pointer"
            />
            <label
              htmlFor="setDefaultCheck"
              className="text-xs font-semibold text-slate-550 dark:text-slate-400 select-none cursor-pointer"
            >
              Set as default payment method
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="min-w-24 shadow-md shadow-blue-500/10"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Card'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
