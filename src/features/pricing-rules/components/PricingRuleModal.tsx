'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Percent, Loader2 } from 'lucide-react';
import { PricingRule } from '@/types';

interface PricingRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: PricingRule) => void;
  rule: PricingRule | null;
}

const RULE_TYPES = [
  { id: 'Percentage', label: 'Percentage Markup/Discount (%)' },
  { id: 'Fixed Discount', label: 'Fixed Unit Discount ($)' },
  { id: 'Fixed Markup', label: 'Fixed Unit Markup ($)' }
];

export default function PricingRuleModal({ isOpen, onClose, onSave, rule }: PricingRuleModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PricingRule['type']>('Percentage');
  const [value, setValue] = useState<number>(0);
  const [appliesTo, setAppliesTo] = useState('');
  const [status, setStatus] = useState<PricingRule['status']>('active');
  const [priority, setPriority] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevRuleId, setPrevRuleId] = useState<string | null>(null);

  // Sync state with rule prop when it changes
  if (rule && rule.id !== prevRuleId) {
    setPrevRuleId(rule.id);
    setName(rule.name);
    setType(rule.type);
    setValue(rule.value);
    setAppliesTo(rule.appliesTo);
    setStatus(rule.status);
    setPriority(rule.priority);
    setErrors({});
  } else if (!rule && prevRuleId !== null) {
    // Reset form for "Add Rule"
    setPrevRuleId(null);
    setName('');
    setType('Percentage');
    setValue(0);
    setAppliesTo('');
    setStatus('active');
    setPriority(1);
    setErrors({});
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Rule name is required';
    if (!appliesTo.trim()) newErrors.appliesTo = 'Applies to scope is required';
    if (priority <= 0) newErrors.priority = 'Priority must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    // Simulate short saving delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    onSave({
      id: rule?.id || `rule-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      value,
      appliesTo,
      status,
      priority
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal dialog */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <Percent className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">
                {rule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">
                {rule ? `Modifying Rule: ${rule.id}` : 'Create a new pricing markup or discount'}
              </span>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Rule Name */}
          <Input
            label="Rule Name"
            placeholder="e.g. Standard 25% Markup"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <Input
              label="Priority Order"
              type="number"
              value={priority}
              onChange={(e) => {
                setPriority(Number(e.target.value));
                if (errors.priority) setErrors((prev) => ({ ...prev, priority: '' }));
              }}
              error={errors.priority}
            />

            {/* Status selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Activation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PricingRule['status'])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-350"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Rule Type selection */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Rule Calculation Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PricingRule['type'])}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-350"
            >
              {RULE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rule Value Rate */}
          <Input
            label={type === 'Percentage' ? 'Rate Percentage Value (%)' : 'Rate Fixed Value ($)'}
            type="number"
            step="0.01"
            placeholder={type === 'Percentage' ? 'e.g. 25 or -5' : 'e.g. 1.50 or -2.00'}
            value={value === 0 ? '' : value}
            onChange={(e) => setValue(Number(e.target.value))}
            error={errors.value}
          />

          {/* Applies To Scope */}
          <Input
            label="Applies To Scope"
            placeholder="e.g. All packages, Orders > 100 SIMs, Enterprise merchants"
            value={appliesTo}
            onChange={(e) => {
              setAppliesTo(e.target.value);
              if (errors.appliesTo) setErrors((prev) => ({ ...prev, appliesTo: '' }));
            }}
            error={errors.appliesTo}
          />

          {/* Footer Controls */}
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
                'Save Rule'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
