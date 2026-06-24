'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ShoppingCart, Percent, TrendingUp, Landmark, Loader2 } from 'lucide-react';
import { Package as PackageType } from '@/types';

interface SellPackageModalProps {
  pkg: PackageType | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    pkgId: string,
    quantitySold: number,
    resellerId: string,
    invoicePrice: number,
    netProfit: number,
    marginPercent: number
  ) => void;
}

const RESELLERS = [
  { id: 'mer-001', name: 'TravelTech Solutions' },
  { id: 'mer-002', name: 'GlobalConnect Ltd' },
  { id: 'mer-003', name: 'NomadSIM' },
  { id: 'mer-004', name: 'RoamEasy Inc' },
  { id: 'mer-005', name: 'AsiaTel Partners' },
  { id: 'mer-006', name: 'AlpsSIM Co' }
];

export default function SellPackageModal({ pkg, isOpen, onClose, onConfirm }: SellPackageModalProps) {
  const [resellerId, setResellerId] = useState(RESELLERS[0].id);
  const [quantity, setQuantity] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSelling, setIsSelling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [prevPkgId, setPrevPkgId] = useState<string | null>(null);
  if (pkg && pkg.id !== prevPkgId) {
    setPrevPkgId(pkg.id);
    setResellerId(RESELLERS[0].id);
    setQuantity(100);
    setDiscountPercent(0);
    setErrors({});
  }

  if (!isOpen || !pkg) return null;

  const wholesaleRate = pkg.wholesalePrice ?? Math.round(pkg.price * 0.75);
  const retailRate = pkg.price;

  // Calculators
  const totalWholesale = quantity * wholesaleRate;
  const totalRetail = quantity * retailRate;
  const discountAmount = (totalRetail * discountPercent) / 100;
  const finalInvoicePrice = totalRetail - discountAmount;
  const profitMargin = finalInvoicePrice - totalWholesale;
  const profitMarginPercent = finalInvoicePrice > 0 ? (profitMargin / finalInvoicePrice) * 100 : 0;

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (quantity <= 0) newErrors.quantity = 'Quantity must be at least 1';
    if (discountPercent < 0 || discountPercent > 100) newErrors.discount = 'Discount must be between 0% and 100%';
    if (finalInvoicePrice < totalWholesale) {
      newErrors.discount = 'Discount is too high; selling below wholesale cost!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSelling(true);
    // Simulate transaction submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    onConfirm(pkg.id, quantity, resellerId, finalInvoicePrice, profitMargin, profitMarginPercent);
    
    setIsSelling(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-lg shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-450">
              <ShoppingCart className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Allocate & Sell Package</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{pkg.name} ({pkg.dataGb}GB)</span>
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

        {/* Form body */}
        <form onSubmit={handleSell} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Select Reseller */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Reseller Merchant
            </label>
            <select
              value={resellerId}
              onChange={(e) => setResellerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
            >
              {RESELLERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Discount Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity of eSIMs"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(Math.max(1, Number(e.target.value)));
                if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: '' }));
              }}
              error={errors.quantity}
            />
            <Input
              label="Discount Percentage (%)"
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => {
                setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))));
                if (errors.discount) setErrors((prev) => ({ ...prev, discount: '' }));
              }}
              error={errors.discount}
            />
          </div>

          {/* Pricing Telemetry Calculations Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-850 space-y-3.5 text-xs font-semibold">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1.5">
              Transaction Financial Breakdown
            </h4>

            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Wholesale Unit Price</span>
              <span className="text-slate-850 dark:text-white">${wholesaleRate.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Retail Unit Price</span>
              <span className="text-slate-850 dark:text-white">${retailRate.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-t border-slate-100 dark:border-slate-800/80 pt-2">
              <span className="text-slate-400 flex items-center gap-1"><Landmark className="h-3.5 w-3.5" /> Total Wholesale Cost</span>
              <span className="text-slate-800 dark:text-slate-200">${totalWholesale.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400 flex items-center gap-1"><Percent className="h-3.5 w-3.5" /> Invoice Subtotal (Retail)</span>
              <span className="text-slate-800 dark:text-slate-200">${totalRetail.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <span className="text-slate-400">Discount Amount ({discountPercent}%)</span>
              <span className="text-rose-500 font-bold">-${discountAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>

            {/* Total invoice row */}
            <div className="flex items-center justify-between py-0.5 text-sm font-bold">
              <span className="text-slate-850 dark:text-white">Net Invoice Price</span>
              <span className="text-blue-650 dark:text-blue-400">${finalInvoicePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {/* Platform Margin row */}
            <div className="flex items-center justify-between py-1 bg-emerald-50/50 dark:bg-emerald-950/10 px-2.5 rounded-xl text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Expected Net Profit
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                +${profitMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitMarginPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSelling}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSelling}
              className="min-w-24 shadow-md shadow-blue-500/10 bg-blue-600 hover:bg-blue-700"
            >
              {isSelling ? (
                <div className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </div>
              ) : (
                'Allocate & Sell'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
