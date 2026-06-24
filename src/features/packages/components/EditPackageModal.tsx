'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Package, Loader2 } from 'lucide-react';
import { Package as PackageType } from '@/types';

interface EditPackageModalProps {
  pkg: PackageType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPkg: PackageType) => void;
}

const REGIONS = ['Europe', 'Asia Pacific', 'Global', 'North America', 'Middle East', 'Latin America', 'Africa'];
const TAGS = ['Bestseller', 'Popular', 'Trending', 'New', 'None'];

export default function EditPackageModal({ pkg, isOpen, onClose, onSave }: EditPackageModalProps) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Europe');
  const [dataGb, setDataGb] = useState<number>(10);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [price, setPrice] = useState<number>(24.99);
  const [wholesale, setWholesale] = useState<number>(18.00);
  const [tag, setTag] = useState<PackageType['tag']>('None');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevPkgId, setPrevPkgId] = useState<string | null>(null);

  if (pkg && pkg.id !== prevPkgId) {
    setPrevPkgId(pkg.id);
    setName(pkg.name);
    setRegion(pkg.region);
    setDataGb(pkg.dataGb);
    setValidityDays(pkg.validityDays);
    setPrice(pkg.price);
    const derivedWholesale = pkg.wholesalePrice ?? Math.round(pkg.price * 0.75);
    setWholesale(derivedWholesale);
    setTag(pkg.tag || 'None');
    setErrors({});
  }

  if (!isOpen || !pkg) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Package name is required';
    if (dataGb <= 0) newErrors.dataGb = 'Must be greater than 0';
    if (validityDays <= 0) newErrors.validityDays = 'Must be greater than 0';
    if (price <= 0) newErrors.price = 'Must be greater than 0';
    if (wholesale <= 0) newErrors.wholesale = 'Must be greater than 0';
    if (wholesale >= price) newErrors.wholesale = 'Wholesale cost must be less than sell price';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    // Simulate API update delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    onSave({
      ...pkg,
      name,
      region,
      dataGb,
      validityDays,
      price,
      tag,
      activeCount: pkg.activeCount, // keep active count
      wholesalePrice: wholesale
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal box */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Edit Package</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{pkg.id}</span>
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
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Package Name */}
          <Input
            label="Package Name"
            placeholder="Europe Premium"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
          />

          {/* Region selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Geographic Region
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data & Validity Row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Pool (GB)"
              type="number"
              value={dataGb}
              onChange={(e) => {
                setDataGb(Number(e.target.value));
                if (errors.dataGb) setErrors((prev) => ({ ...prev, dataGb: '' }));
              }}
              error={errors.dataGb}
            />
            <Input
              label="Validity (Days)"
              type="number"
              value={validityDays}
              onChange={(e) => {
                setValidityDays(Number(e.target.value));
                if (errors.validityDays) setErrors((prev) => ({ ...prev, validityDays: '' }));
              }}
              error={errors.validityDays}
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Retail Sell Price ($)"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
              }}
              error={errors.price}
            />
            <Input
              label="Wholesale Cost ($)"
              type="number"
              step="0.01"
              value={wholesale}
              onChange={(e) => {
                setWholesale(Number(e.target.value));
                if (errors.wholesale) setErrors((prev) => ({ ...prev, wholesale: '' }));
              }}
              error={errors.wholesale}
            />
          </div>

          {/* Tag Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Marketing Tag Badge
            </label>
            <div className="relative">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as PackageType['tag'])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t === 'None' ? 'No Badge' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              className="min-w-24 shadow-md shadow-blue-500/10"
            >
              {isSaving ? (
                <div className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
