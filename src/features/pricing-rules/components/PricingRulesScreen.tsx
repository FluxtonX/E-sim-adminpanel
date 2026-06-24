'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PricingRule } from '@/types';
import { 
  Plus, 
  Tag, 
  Percent, 
  Trash2, 
  Edit3, 
  Loader2, 
  AlertTriangle
} from 'lucide-react';
import PricingRuleModal from './PricingRuleModal';

const INITIAL_PRICING_RULES: PricingRule[] = [
  { id: 'rule-1', name: 'Standard Markup', type: 'Percentage', value: 25, appliesTo: 'All packages', status: 'active', priority: 1 },
  { id: 'rule-2', name: 'Volume Discount — 100+', type: 'Percentage', value: -5, appliesTo: 'Orders > 100 SIMs', status: 'active', priority: 2 },
  { id: 'rule-3', name: 'VIP Merchant Tier', type: 'Fixed Discount', value: -2.00, appliesTo: 'Enterprise merchants', status: 'active', priority: 3 },
  { id: 'rule-4', name: 'New Customer Promo', type: 'Percentage', value: -10, appliesTo: 'First order', status: 'inactive', priority: 4 },
  { id: 'rule-5', name: 'Asia Bundle Premium', type: 'Fixed Markup', value: 1.50, appliesTo: 'Asia Pacific region', status: 'active', priority: 5 }
];

export default function PricingRulesScreen() {
  const [rules, setRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Delete confirm state
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  // Simulated Loader Effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddClick = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (rule: PricingRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (ruleId: string) => {
    setDeletingRuleId(ruleId);
  };

  const handleConfirmDelete = () => {
    if (deletingRuleId) {
      setRules(rules.filter((r) => r.id !== deletingRuleId).map((r, idx) => ({ ...r, priority: idx + 1 })));
      setDeletingRuleId(null);
    }
  };

  const handleSaveRule = (savedRule: PricingRule) => {
    const exists = rules.some((r) => r.id === savedRule.id);
    if (exists) {
      // update
      setRules(rules.map((r) => (r.id === savedRule.id ? savedRule : r)));
    } else {
      // add
      setRules([...rules, savedRule]);
    }
  };

  // Metrics calculators
  const activeCount = rules.filter(r => r.status === 'active').length;
  // promotions matching 'promo' or negative discount rules
  const promotionsCount = rules.filter(r => r.name.toLowerCase().includes('promo') || r.value < 0).length;
  // merchant tiers rule count
  const merchantTiersCount = rules.filter(r => r.appliesTo.toLowerCase().includes('merchant') || r.appliesTo.toLowerCase().includes('tier')).length;

  const formatValueCell = (rule: PricingRule) => {
    const val = rule.value;
    if (rule.type === 'Percentage') {
      const isPositive = val >= 0;
      return (
        <span className={`font-bold ${isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-450'}`}>
          {isPositive ? `+${val}%` : `${val}%`}
        </span>
      );
    } else if (rule.type === 'Fixed Discount') {
      return (
        <span className="font-bold text-emerald-600 dark:text-emerald-455">
          {val < 0 ? `-$${Math.abs(val).toFixed(2)}` : `-$${val.toFixed(2)}`}
        </span>
      );
    } else {
      // Fixed Markup
      return (
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`}
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">
            Loading pricing rules...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/40 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pricing Rules
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
            Configure markup rules, volume discounts, and promotional pricing.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 font-bold shadow-md shadow-blue-500/10 text-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Rules
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                {activeCount}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <Tag className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg. Margin
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                32%
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-450">
              <Tag className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Promotions
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                {promotionsCount}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950/20 dark:text-amber-450">
              <Tag className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Merchant Tiers
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                {merchantTiersCount}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/20 dark:text-purple-400">
              <Tag className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Registry Table Card */}
      <Card className="border-slate-100/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/10 px-5 py-4 border-b border-slate-100/80 dark:border-slate-900 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="h-4 w-4 text-blue-600" />
            Pricing Rules catalog
          </h3>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40 dark:bg-slate-900/5 select-none">
                  <th className="px-6 py-4 w-20">Priority</th>
                  <th className="px-6 py-4">Rule Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Applies To</th>
                  <th className="px-6 py-4 w-28">Status</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {rules.map((rule) => {
                  const isActiveStatus = rule.status === 'active';
                  
                  return (
                    <tr 
                      key={rule.id}
                      className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      {/* Priority circular badge */}
                      <td className="px-6 py-4.5">
                        <div className="h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {rule.priority}
                        </div>
                      </td>

                      {/* Rule Name */}
                      <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-white">
                        {rule.name}
                      </td>

                      {/* Rule Type */}
                      <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 font-semibold">
                        {rule.type}
                      </td>

                      {/* Value rate */}
                      <td className="px-6 py-4.5">
                        {formatValueCell(rule)}
                      </td>

                      {/* Applies To scope */}
                      <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 font-semibold">
                        {rule.appliesTo}
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                          isActiveStatus
                            ? 'bg-emerald-50/70 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
                            : 'bg-slate-50 border-slate-200 text-slate-450 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500'
                        }`}>
                          {rule.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleEditClick(rule)}
                            title="Edit Rule"
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(rule.id)}
                            title="Delete Rule"
                            className="p-1 rounded text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Rule modal */}
      <PricingRuleModal
        isOpen={isModalOpen}
        rule={editingRule}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
      />

      {/* Delete Rule Confirmation Overlay */}
      {deletingRuleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setDeletingRuleId(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-sm shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center dark:bg-red-950/20 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Delete Pricing Rule?</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Are you sure you want to remove this pricing markup rule? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setDeletingRuleId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 font-bold"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
