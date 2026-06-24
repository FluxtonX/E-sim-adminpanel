'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package as PackageType, PaymentCard } from '@/types';
import {
  Plus,
  Search,
  Loader2,
  CreditCard,
  SquarePen,
  Copy as CopyIcon,
  ShoppingCart,
  Globe,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

import EditPackageModal from './EditPackageModal';
import SellPackageModal from './SellPackageModal';
import PackageBuilderForm from './PackageBuilderForm';
import AddPaymentMethodModal from '@/features/payments/components/AddPaymentMethodModal';

// Mock Flags components
const EUFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#003399]">
    <svg viewBox="0 0 12 8" className="w-full h-full">
      <rect width="12" height="8" fill="#003399" />
      <g fill="#ffcc00" transform="translate(6,4) scale(0.6)">
        <circle cx="0" cy="-3" r="0.4" />
        <circle cx="1.5" cy="-2.6" r="0.4" />
        <circle cx="2.6" cy="-1.5" r="0.4" />
        <circle cx="3" cy="0" r="0.4" />
        <circle cx="2.6" cy="1.5" r="0.4" />
        <circle cx="1.5" cy="2.6" r="0.4" />
        <circle cx="0" cy="3" r="0.4" />
        <circle cx="-1.5" cy="2.6" r="0.4" />
        <circle cx="-2.6" cy="1.5" r="0.4" />
        <circle cx="-3" cy="0" r="0.4" />
        <circle cx="-2.6" cy="-1.5" r="0.4" />
        <circle cx="-1.5" cy="-2.6" r="0.4" />
      </g>
    </svg>
  </div>
);

const USFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-150 bg-[#b22234]">
    <svg viewBox="0 0 19 10" className="w-full h-full">
      <rect width="19" height="10" fill="#fff" />
      <rect y="0" width="19" height="1" fill="#b22234" />
      <rect y="2" width="19" height="1" fill="#b22234" />
      <rect y="4" width="19" height="1" fill="#b22234" />
      <rect y="6" width="19" height="1" fill="#b22234" />
      <rect y="8" width="19" height="1" fill="#b22234" />
      <rect width="7.6" height="5.4" fill="#3c3b6e" />
    </svg>
  </div>
);

const JapanFlag = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-200 bg-white">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.6" fill="#bc002d" />
    </svg>
  </div>
);

const RegionGlobeFlag = ({ color = '#3b82f6' }) => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Globe className="h-3.5 w-3.5" style={{ color }} />
  </div>
);

// Initial Payment cards
const INITIAL_PAYMENT_CARDS: PaymentCard[] = [
  { id: 'pcard-1', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'pcard-2', brand: 'Mastercard', last4: '5555', expiry: '08/25', isDefault: false }
];

// Initial 8 figma packages
const INITIAL_PACKAGES: PackageType[] = [
  { id: 'pkg-001', name: 'Europe Travel', region: 'Europe', dataGb: 10, validityDays: 30, price: 24.99, tag: 'Bestseller', activeCount: 4821 },
  { id: 'pkg-002', name: 'Asia Premium', region: 'Asia Pacific', dataGb: 20, validityDays: 30, price: 34.99, tag: 'Popular', activeCount: 3245 },
  { id: 'pkg-003', name: 'Global Explorer', region: 'Global', dataGb: 50, validityDays: 90, price: 79.99, tag: 'Trending', activeCount: 1876 },
  { id: 'pkg-004', name: 'North America Business', region: 'North America', dataGb: 30, validityDays: 30, price: 49.99, tag: 'Popular', activeCount: 2134 },
  { id: 'pkg-005', name: 'Japan Premium', region: 'Japan', dataGb: 15, validityDays: 30, price: 39.99, tag: 'Bestseller', activeCount: 1542 },
  { id: 'pkg-006', name: 'Middle East Connect', region: 'Middle East', dataGb: 5, validityDays: 30, price: 19.99, tag: 'New', activeCount: 876 },
  { id: 'pkg-007', name: 'Latin America', region: 'Latin America', dataGb: 8, validityDays: 30, price: 22.99, tag: 'Popular', activeCount: 1234 },
  { id: 'pkg-008', name: 'Africa Connect', region: 'Africa', dataGb: 5, validityDays: 30, price: 14.99, tag: 'New', activeCount: 654 }
];

interface PackageWithWholesale extends PackageType {
  wholesalePrice?: number;
}

let globalUniqueCounter = 1000;
const generateUniqueId = (prefix: string) => {
  globalUniqueCounter += 1;
  return `${prefix}-${globalUniqueCounter}`;
};

interface PackageScreenProps {
  initialView?: 'list' | 'builder';
}

export default function PackageScreen({ initialView = 'list' }: PackageScreenProps) {
  const [view, setView] = useState<'list' | 'builder'>(initialView);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize view state on prop changes without useEffect
  const [prevInitialView, setPrevInitialView] = useState(initialView);
  if (initialView !== prevInitialView) {
    setPrevInitialView(initialView);
    setView(initialView);
  }

  const handleSwitchView = (newView: 'list' | 'builder') => {
    setIsLoading(true);
    setView(newView);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Stateful package list
  const [packages, setPackages] = useState<PackageType[]>(INITIAL_PACKAGES);

  // Shared Cards State
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_PAYMENT_CARDS);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingPkg, setEditingPkg] = useState<PackageType | null>(null);
  const [sellingPkg, setSellingPkg] = useState<PackageType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sellSuccessData, setSellSuccessData] = useState<{
    pkgName: string;
    quantity: number;
    resellerName: string;
    invoicePrice: number;
    netProfit: number;
    marginPercent: number;
  } | null>(null);

  // Form states for Create Modal (blank card addition)
  const [newName, setNewName] = useState('');
  const [newRegion, setNewRegion] = useState('Europe');
  const [newDataGb, setNewDataGb] = useState<number>(10);
  const [newValidityDays, setNewValidityDays] = useState<number>(30);
  const [newPrice, setNewPrice] = useState<number>(19.99);
  const [newWholesale, setNewWholesale] = useState<number>(14.00);
  const [newTag, setNewTag] = useState<'Bestseller' | 'Popular' | 'Trending' | 'New' | 'None'>('New');
  const [isCreating, setIsCreating] = useState(false);

  // Payment method handlers
  const handleSetDefaultCard = (cardId: string) => {
    setCards(cards.map((c) => ({ ...c, isDefault: c.id === cardId })));
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const handleAddCard = (newCard: { brand: 'Visa' | 'Mastercard'; last4: string; expiry: string; isDefault: boolean }) => {
    const cardItem: PaymentCard = {
      id: generateUniqueId('pcard'),
      brand: newCard.brand,
      last4: newCard.last4,
      expiry: newCard.expiry,
      isDefault: newCard.isDefault
    };
    if (newCard.isDefault) {
      setCards(cards.map((c) => ({ ...c, isDefault: false })).concat(cardItem));
    } else {
      setCards([...cards, cardItem]);
    }
  };

  // Duplicate handler
  const handleDuplicate = (pkgId: string) => {
    const target = packages.find((p) => p.id === pkgId);
    if (!target) return;
    const duplicated: PackageType = {
      ...target,
      id: generateUniqueId('pkg'),
      name: `${target.name} (Copy)`,
      activeCount: 0
    };
    setPackages([...packages, duplicated]);
    alert(`Duplicated "${target.name}" package successfully!`);
  };

  // Edit handler
  const handleSaveEdit = (updatedPkg: PackageType) => {
    setPackages(packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  // Sell confirm handler
  const handleConfirmSell = (
    pkgId: string,
    quantitySold: number,
    resellerId: string,
    invoicePrice: number,
    netProfit: number,
    marginPercent: number
  ) => {
    const pkg = packages.find((p) => p.id === pkgId);
    const lookupResellers = [
      { id: 'mer-001', name: 'TravelTech Solutions' },
      { id: 'mer-002', name: 'GlobalConnect Ltd' },
      { id: 'mer-003', name: 'NomadSIM' },
      { id: 'mer-004', name: 'RoamEasy Inc' },
      { id: 'mer-005', name: 'AsiaTel Partners' },
      { id: 'mer-006', name: 'AlpsSIM Co' }
    ];
    const resellerName = lookupResellers.find((r) => r.id === resellerId)?.name || 'Reseller';

    setPackages(
      packages.map((p) =>
        p.id === pkgId ? { ...p, activeCount: p.activeCount + quantitySold } : p
      )
    );

    setSellSuccessData({
      pkgName: pkg?.name || 'eSIM Package',
      quantity: quantitySold,
      resellerName,
      invoicePrice,
      netProfit,
      marginPercent
    });
  };

  // Builder save handler
  const handleBuilderSave = (newBuiltPkg: Omit<PackageType, 'id' | 'activeCount'>) => {
    const pkgItem: PackageType = {
      ...newBuiltPkg,
      id: generateUniqueId('pkg'),
      activeCount: 0
    };
    setPackages([pkgItem, ...packages]);
  };

  // Direct creation handler
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Package name is required');
      return;
    }
    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newPkgItem: PackageWithWholesale = {
      id: generateUniqueId('pkg'),
      name: newName,
      region: newRegion,
      dataGb: newDataGb,
      validityDays: newValidityDays,
      price: newPrice,
      tag: newTag,
      activeCount: 0,
      wholesalePrice: newWholesale
    };

    setPackages([newPkgItem, ...packages]);
    setIsCreating(false);
    setIsCreateModalOpen(false);
    
    // reset form
    setNewName('');
    setNewRegion('Europe');
    setNewDataGb(10);
    setNewValidityDays(30);
    setNewPrice(19.99);
    setNewWholesale(14.00);
    setNewTag('New');
  };

  const getRegionFlag = (region: string) => {
    const rNorm = region.toLowerCase();
    if (rNorm === 'europe') return <EUFlag />;
    if (rNorm === 'north america' || rNorm === 'usa' || rNorm === 'united states') return <USFlag />;
    if (rNorm === 'japan') return <JapanFlag />;
    if (rNorm === 'asia pacific' || rNorm === 'asia') return <RegionGlobeFlag color="#3b82f6" />;
    if (rNorm === 'middle east') return <RegionGlobeFlag color="#e2b714" />;
    if (rNorm === 'latin america') return <RegionGlobeFlag color="#10b981" />;
    if (rNorm === 'africa') return <RegionGlobeFlag color="#f59e0b" />;
    return <RegionGlobeFlag color="#64748b" />;
  };

  const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller': return 'warning';
      case 'popular': return 'info';
      case 'trending': return 'success';
      case 'new': return 'info';
      default: return 'neutral';
    }
  };

  // Filter package items
  const filteredPackages = packages.filter((pkg) => {
    return (
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">
            {view === 'builder' ? 'Opening Package Builder...' : 'Loading eSIM packages...'}
          </span>
        </div>
      </div>
    );
  }

  if (view === 'builder') {
    return (
      <PackageBuilderForm
        onCancel={() => handleSwitchView('list')}
        onSave={handleBuilderSave}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Packages</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage your eSIM package catalog for resellers and direct customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSwitchView('builder')}
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            Package Builder
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            New Package
          </Button>
        </div>
      </div>

      {/* Cards Grid (Payment Card Methods Row) */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id}>
            <Card
              className={`h-full border transition-all duration-300 ${
                card.isDefault
                  ? 'border-blue-600 shadow-md ring-4 ring-blue-50/50 dark:border-blue-500 dark:ring-blue-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-350 dark:border-slate-800'
              }`}
            >
              <CardContent className="p-5 flex flex-col justify-between h-40">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                      <CreditCard className="h-4.5 w-4.5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-850 dark:text-white block">
                        {card.brand}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold block">
                        Expires {card.expiry}
                      </span>
                    </div>
                  </div>

                  {card.isDefault && (
                    <Badge variant="info" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-xs tracking-wider text-slate-650 dark:text-slate-350">
                    •••• •••• •••• {card.last4}
                  </div>

                  <div className="flex items-center gap-4.5 text-[10px] font-bold">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefaultCard(card.id)}
                        className="text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="text-red-500 hover:text-red-750 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Dotted Card Slot */}
        <div
          onClick={() => setIsAddCardOpen(true)}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-blue-500 hover:bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center h-40 text-slate-400 hover:text-blue-500 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/30"
        >
          <Plus className="h-6 w-6 mb-1.5" />
          <span className="text-xs font-bold tracking-tight">Add new payment method</span>
        </div>
      </div>

      {/* Search merchants input bar */}
      <div className="w-full relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search merchants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9.5 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        />
      </div>

      {/* Packages Listing Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
          No eSIM packages found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPackages.map((pkg) => {
            const wholesaleValue = (pkg as PackageWithWholesale).wholesalePrice ?? Math.round(pkg.price * 0.75);
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-slate-100 flex flex-col justify-between overflow-hidden hover:shadow-lg dark:border-slate-900 shadow-sm">
                  <CardContent className="p-5 flex flex-col justify-between h-full gap-5">
                    {/* Top flag and Tag */}
                    <div className="flex items-start justify-between">
                      {getRegionFlag(pkg.region)}
                      {pkg.tag !== 'None' && (
                        <Badge variant={getTagVariant(pkg.tag)} className="text-[9px] uppercase font-bold tracking-wider py-0 px-2.5">
                          {pkg.tag}
                        </Badge>
                      )}
                    </div>

                    {/* Title & region */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white tracking-tight">{pkg.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{pkg.region}</span>
                    </div>

                    {/* Spec details row */}
                    <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100/60 py-3.5 dark:border-slate-900/60">
                      <div className="bg-blue-50/50 dark:bg-slate-900/30 rounded-xl py-2.5 text-center">
                        <span className="text-[10px] text-slate-700 dark:text-slate-200 font-black block leading-none">{pkg.dataGb}GB</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold block mt-1">Data</span>
                      </div>
                      <div className="bg-blue-50/50 dark:bg-slate-900/30 rounded-xl py-2.5 text-center">
                        <span className="text-[10px] text-slate-700 dark:text-slate-200 font-black block leading-none">{pkg.validityDays}d</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold block mt-1">Days</span>
                      </div>
                      <div className="bg-blue-50/50 dark:bg-slate-900/30 rounded-xl py-2.5 text-center">
                        <span className="text-[10px] text-slate-700 dark:text-slate-200 font-black block leading-none">${pkg.price.toFixed(2)}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold block mt-1">Price</span>
                      </div>
                    </div>

                    {/* Wholesale cost and activations */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-450 border-b border-slate-100/40 pb-2.5 dark:border-slate-900/30">
                      <span>Wholesale: <strong className="text-slate-700 dark:text-slate-300 font-bold">${wholesaleValue}</strong></span>
                      <span>{pkg.activeCount.toLocaleString()} active</span>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-slate-500">
                      <button
                        onClick={() => setEditingPkg(pkg)}
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                        title="Edit properties"
                      >
                        <SquarePen className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDuplicate(pkg.id)}
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                        title="Duplicate package"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                        Dup
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSellingPkg(pkg)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-7 py-0 px-3.5 rounded-lg flex items-center gap-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals & Overlays */}
      <AddPaymentMethodModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onSave={handleAddCard}
      />

      <EditPackageModal
        isOpen={!!editingPkg}
        pkg={editingPkg}
        onClose={() => setEditingPkg(null)}
        onSave={handleSaveEdit}
      />

      <SellPackageModal
        isOpen={!!sellingPkg}
        pkg={sellingPkg}
        onClose={() => setSellingPkg(null)}
        onConfirm={handleConfirmSell}
      />

      {/* Success Modal Dialogue Box */}
      {sellSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setSellSuccessData(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            
            {/* Header / Success Indicator */}
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-450 animate-bounce">
              <Check className="h-6 w-6" />
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">eSIM Allocation Successful</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Reseller transaction completed successfully.
              </p>
            </div>

            {/* Summary Details */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 text-xs font-semibold space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Package Title</span>
                <span className="text-slate-800 dark:text-white font-bold">{sellSuccessData.pkgName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity Sold</span>
                <span className="text-slate-800 dark:text-white font-bold">{sellSuccessData.quantity.toLocaleString()} eSIMs</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/85 pb-2.5">
                <span className="text-slate-400">Appointed Reseller</span>
                <span className="text-slate-800 dark:text-white font-bold">{sellSuccessData.resellerName}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Net Invoice Price</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">${sellSuccessData.invoicePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-450">
                <span className="text-slate-400">Expected Net Profit</span>
                <span className="font-bold">+${sellSuccessData.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({sellSuccessData.marginPercent.toFixed(1)}%)</span>
              </div>
            </div>

            {/* Button action */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSellSuccessData(null)}
                className="w-full font-bold shadow-md shadow-blue-500/10"
              >
                Done
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Direct Create Package Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
                  <Plus className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Create eSIM Package</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Publish new package into catalog</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="p-6 space-y-4">
              <Input
                label="Package Name"
                placeholder="Global High Data"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                  >
                    {['Europe', 'Asia Pacific', 'Global', 'North America', 'Middle East', 'Latin America', 'Africa'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Tag Badge</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as PackageType['tag'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                  >
                    {['None', 'Bestseller', 'Popular', 'Trending', 'New'].map((t) => (
                      <option key={t} value={t}>{t === 'None' ? 'No Badge' : t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Data Pool (GB)" type="number" value={newDataGb} onChange={(e) => setNewDataGb(Number(e.target.value))} />
                <Input label="Validity (Days)" type="number" value={newValidityDays} onChange={(e) => setNewValidityDays(Number(e.target.value))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Retail Sell Price ($)" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} />
                <Input label="Wholesale Cost ($)" type="number" step="0.01" value={newWholesale} onChange={(e) => setNewWholesale(Number(e.target.value))} />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)} disabled={isCreating}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" disabled={isCreating} className="min-w-24 shadow-md shadow-blue-500/10">
                  {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Publish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
