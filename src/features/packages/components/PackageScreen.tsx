'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_PACKAGES } from '@/constants/mockData';
import { Award, Plane, Compass, Globe, Plus, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PackageScreen() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Europe' | 'Asia Pacific' | 'Global' | 'North America'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPackages = MOCK_PACKAGES.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) || 
                          pkg.region.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || pkg.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading eSIM packages...</span>
        </div>
      </div>
    );
  }

  const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller': return 'warning';
      case 'popular': return 'info';
      case 'trending': return 'success';
      default: return 'neutral';
    }
  };

  const getPackageIcon = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('europe')) return Award;
    if (norm.includes('asia')) return Plane;
    if (norm.includes('global')) return Compass;
    return Globe;
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Packages</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Configure geographic zones, data pools, retail price levels, and validity limits.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => alert('Creating new eSIM package...')}>
          <Plus className="mr-1.5 h-4 w-4" /> Create Package
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-100/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="w-full sm:w-72 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          {/* Region filter pills */}
          <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-xl dark:bg-slate-900 w-full sm:w-auto overflow-x-auto">
            {(['All', 'Europe', 'Asia Pacific', 'Global', 'North America'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setRegionFilter(region)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  regionFilter === region
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-850 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
          No packages found matching the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => {
            const Icon = getPackageIcon(pkg.name);
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-slate-100 flex flex-col justify-between overflow-hidden hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                    
                    {/* Top: Icon + Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      {pkg.tag !== 'None' && (
                        <Badge variant={getTagVariant(pkg.tag)}>{pkg.tag}</Badge>
                      )}
                    </div>

                    {/* Middle: Title & Region */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{pkg.name}</h4>
                      <span className="text-xs text-slate-400 font-semibold">{pkg.region}</span>
                    </div>

                    {/* Pricing grid */}
                    <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 dark:border-slate-900/50">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Data Limit</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{pkg.dataGb} GB</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Validity</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{pkg.validityDays} days</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Wholesale Price</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${pkg.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Bottom: Active count + Manage */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-1">
                      <span>Active reseller activations:</span>
                      <span className="text-slate-800 font-bold dark:text-white">{pkg.activeCount.toLocaleString()}</span>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
