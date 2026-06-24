'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardContent } from '@/components/ui/Card';
import { ArrowLeft, Globe, Database, DollarSign, Eye, Check, ChevronRight, Loader2 } from 'lucide-react';
import { Package as PackageType } from '@/types';

interface PackageBuilderFormProps {
  onCancel: () => void;
  onSave: (newPkg: Omit<PackageType, 'id' | 'activeCount'>) => void;
}

const REGIONS = ['Europe', 'Asia Pacific', 'Global', 'North America', 'Middle East', 'Latin America', 'Africa'];
const DATA_PRESETS = [1, 3, 5, 10, 15, 20, 30, 50, 100];
const VALIDITY_PRESETS = [7, 14, 30, 60, 90, 180, 365];

export default function PackageBuilderForm({ onCancel, onSave }: PackageBuilderFormProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [countryCoverage, setCountryCoverage] = useState('All countries in region');
  const [description, setDescription] = useState('');

  // Data & Validity states
  const [dataGb, setDataGb] = useState<number>(10);
  const [validityDays, setValidityDays] = useState<number>(30);

  // Pricing states
  const [wholesale, setWholesale] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);

  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Margin Calculations
  const netProfit = sellPrice - wholesale;
  const profitMarginPercent = sellPrice > 0 ? (netProfit / sellPrice) * 100 : 0;

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) newErrors.name = 'Package name is required';
      if (!region) newErrors.region = 'Please select a region';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (step === 2) {
      // Step 2 uses preset selectors, values are guaranteed to be valid
    } else if (step === 3) {
      if (wholesale <= 0) newErrors.wholesale = 'Wholesale cost must be greater than 0';
      if (sellPrice <= 0) newErrors.sellPrice = 'Retail price must be greater than 0';
      if (wholesale >= sellPrice && sellPrice > 0) {
        newErrors.sellPrice = 'Retail price must be higher than wholesale cost';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    // Simulate compilation / publish delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave({
      name,
      region,
      dataGb,
      validityDays,
      price: sellPrice,
      tag: 'New', // default tag
      wholesalePrice: wholesale
    });

    setIsPublishing(false);
    onCancel();
  };

  const stepsList = [
    { id: 1, label: 'Coverage', desc: 'Select countries and regions', icon: Globe },
    { id: 2, label: 'Data Plan', desc: 'Set data and validity', icon: Database },
    { id: 3, label: 'Pricing', desc: 'Configure wholesale & retail price', icon: DollarSign },
    { id: 4, label: 'Review', desc: 'Review and publish', icon: Eye }
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn max-w-4xl mx-auto">
      {/* Back to Packages link */}
      <div>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-max dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Packages
        </button>
      </div>

      {/* Header title */}
      <div className="pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Package Builder
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
          Manage your eSIM package catalog for resellers and direct customers.
        </p>
      </div>

      {/* Steps progress indicator */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex flex-row items-center justify-between min-w-[760px] gap-2">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            
            return (
              <div key={s.id} className="flex items-center gap-4 flex-1 last:flex-initial">
                <div className={`flex items-center gap-3 transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 rounded-2xl px-4 py-2.5 shadow-sm'
                    : 'px-2 py-2.5'
                }`}>
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all duration-150 shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isActive
                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                  }`}>
                    {isCompleted ? <Check className="h-4.5 w-4.5" /> : <Icon className="h-4.5 w-4.5" />}
                  </div>
                  <div className="text-left">
                    <h4 className={`text-xs font-bold leading-none ${
                      isActive ? 'text-blue-650 dark:text-blue-400' : isCompleted ? 'text-slate-850 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500'
                    }`}>{s.label}</h4>
                    <span className={`text-[10px] font-semibold block mt-1 whitespace-nowrap ${
                      isActive ? 'text-blue-600 dark:text-blue-450' : 'text-slate-400 dark:text-slate-500'
                    }`}>{s.desc}</span>
                  </div>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className="text-slate-300 dark:text-slate-750 shrink-0 mx-auto">
                    <ChevronRight className="h-4.5 w-4.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main wizard card wrapper */}
      <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-6 md:p-8">
          
          {/* Step 1: Coverage Area */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Select Coverage Area</h3>
              </div>
              
              <Input
                label="Package Name"
                placeholder="e.g. Europe Premium 10GB"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                error={errors.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      if (errors.region) setErrors(prev => ({ ...prev, region: '' }));
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-350"
                  >
                    <option value="">Select region</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.region}</span>
                  )}
                </div>

                <div className="space-y-1 w-full text-left">
                  <Input
                    label="Country Coverage"
                    value={countryCoverage}
                    onChange={(e) => setCountryCoverage(e.target.value)}
                    placeholder="All countries in region"
                  />
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block pl-0.5">
                    Comma-separated list of countries, or leave blank for all.
                  </span>
                </div>
              </div>

              <Input
                label="Description (optional)"
                placeholder="Package description for customers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {/* Step 2: Data Plan */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Configure Data Plan</h3>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Data Amount
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {DATA_PRESETS.map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setDataGb(gb)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        dataGb === gb
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {gb}GB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Validity (days)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {VALIDITY_PRESETS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setValidityDays(days)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        validityDays === days
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Configure Pricing</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1 w-full text-left">
                  <Input
                    label="Wholesale Price (USD)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={wholesale === 0 ? '' : wholesale}
                    onChange={(e) => {
                      setWholesale(Math.max(0, Number(e.target.value)));
                      if (errors.wholesale) setErrors(prev => ({ ...prev, wholesale: '' }));
                    }}
                    error={errors.wholesale}
                  />
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block pl-0.5">
                    What you pay to your eSIM provider.
                  </span>
                </div>
                <div className="space-y-1 w-full text-left">
                  <Input
                    label="Retail Price (USD)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={sellPrice === 0 ? '' : sellPrice}
                    onChange={(e) => {
                      setSellPrice(Math.max(0, Number(e.target.value)));
                      if (errors.sellPrice) setErrors(prev => ({ ...prev, sellPrice: '' }));
                    }}
                    error={errors.sellPrice}
                  />
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block pl-0.5">
                    What customers will pay.
                  </span>
                </div>
              </div>

              {/* Profit margin notification alert */}
              <div className="rounded-xl border border-emerald-250 bg-emerald-50/50 p-4.5 dark:border-emerald-800/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 space-y-1 text-left">
                <div className="text-xs font-extrabold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Profit margin: {profitMarginPercent.toFixed(1)}%
                </div>
                <div className="text-[11px] font-semibold opacity-90 pl-3">
                  Profit per sale: ${netProfit.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Review & Publish</h3>
              </div>

              <div className="border border-slate-150/80 dark:border-slate-850 rounded-xl overflow-hidden text-xs">
                {/* Review fields rows */}
                <div className="divide-y divide-slate-150/80 dark:divide-slate-850">
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Package Name</span>
                    <span className="text-slate-800 dark:text-white font-bold">{name}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Region</span>
                    <span className="text-slate-800 dark:text-white font-bold">{region}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Coverage</span>
                    <span className="text-slate-800 dark:text-white font-bold">{countryCoverage || 'All countries in region'}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Data</span>
                    <span className="text-slate-800 dark:text-white font-bold">{dataGb}GB</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Validity</span>
                    <span className="text-slate-800 dark:text-white font-bold">{validityDays} days</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Wholesale Price</span>
                    <span className="text-slate-800 dark:text-white font-bold">${wholesale.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Retail Price</span>
                    <span className="text-slate-800 dark:text-white font-bold">${sellPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/10">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Margin</span>
                    <span className="text-emerald-600 dark:text-emerald-455 font-black">{profitMarginPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Large Publish button */}
              <form onSubmit={handlePublish} className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isPublishing}
                  className="w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Publishing Package...
                    </>
                  ) : (
                    'Publish Package'
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-900">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={isPublishing}
                className="font-bold text-xs"
              >
                Back
              </Button>
            ) : (
              <div /> // spacing spacer
            )}

            {step < 4 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                className="font-bold text-xs shadow-sm shadow-blue-500/10"
              >
                Continue &gt;
              </Button>
            )}
          </div>

        </CardContent>
      </div>
    </div>
  );
}
