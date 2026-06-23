'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PACKAGES } from '@/constants/mockData';
import { motion } from 'framer-motion';

// High-fidelity vector flag graphics matching the figma screenshot
const EUMapSvg = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#003399]">
    <svg viewBox="0 0 24 16" className="w-full h-full">
      <rect width="24" height="16" fill="#003399" />
      <g fill="#ffcc00" transform="translate(12, 8) scale(0.4)">
        <circle cx="0" cy="-6" r="0.8" />
        <circle cx="3" cy="-5" r="0.8" />
        <circle cx="5" cy="-3" r="0.8" />
        <circle cx="6" cy="0" r="0.8" />
        <circle cx="5" cy="3" r="0.8" />
        <circle cx="3" cy="5" r="0.8" />
        <circle cx="0" cy="6" r="0.8" />
        <circle cx="-3" cy="5" r="0.8" />
        <circle cx="-5" cy="3" r="0.8" />
        <circle cx="-6" cy="0" r="0.8" />
        <circle cx="-5" cy="-3" r="0.8" />
        <circle cx="-3" cy="-5" r="0.8" />
      </g>
    </svg>
  </div>
);

const USMapSvg = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 24 14" className="w-full h-full">
      <rect width="24" height="14" fill="#fff" />
      <rect y="0" width="24" height="1" fill="#B22234" />
      <rect y="2" width="24" height="1" fill="#B22234" />
      <rect y="4" width="24" height="1" fill="#B22234" />
      <rect y="6" width="24" height="1" fill="#B22234" />
      <rect y="8" width="24" height="1" fill="#B22234" />
      <rect y="10" width="24" height="1" fill="#B22234" />
      <rect y="12" width="24" height="1" fill="#B22234" />
      <rect width="11" height="8" fill="#3C3B6E" />
      <g fill="#fff" transform="scale(0.7) translate(1, 0.5)">
        <circle cx="2" cy="2" r="0.4" />
        <circle cx="5" cy="2" r="0.4" />
        <circle cx="8" cy="2" r="0.4" />
        <circle cx="3.5" cy="4" r="0.4" />
        <circle cx="6.5" cy="4" r="0.4" />
        <circle cx="2" cy="6" r="0.4" />
        <circle cx="6" cy="6" r="0.4" />
        <circle cx="10" cy="6" r="0.4" />
      </g>
    </svg>
  </div>
);

const APACMapSvg = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100">
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="1" fill="#EF3340" />
      <rect y="1" width="3" height="1" fill="#FFF" />
      <circle cx="0.6" cy="0.5" r="0.25" fill="#FFF" />
      <circle cx="0.7" cy="0.5" r="0.25" fill="#EF3340" />
      <g fill="#FFF" transform="translate(0.5, 0.45) scale(0.035)">
        <circle cx="0" cy="-3" r="1.2" />
        <circle cx="2.8" cy="-1" r="1.2" />
        <circle cx="1.7" cy="2.3" r="1.2" />
        <circle cx="-1.7" cy="2.3" r="1.2" />
        <circle cx="-2.8" cy="-1" r="1.2" />
      </g>
    </svg>
  </div>
);

const GlobalMapSvg = () => (
  <div className="h-5 w-8 shrink-0 rounded overflow-hidden shadow-sm border border-slate-100 bg-[#003399] flex items-center justify-center p-0.5">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" className="w-full h-full opacity-90">
      <circle cx="12" cy="12" r="9" stroke="#93c5fd" strokeWidth="0.8" />
      <path d="M12 3a9 9 0 0 0 0 18" stroke="#93c5fd" strokeWidth="0.8" />
      <path d="M12 3c-2 0-3.5 4-3.5 9s1.5 9 3.5 9" stroke="#93c5fd" strokeWidth="0.8" />
      <path d="M12 3c2 0 3.5 4 3.5 9s-1.5 9-3.5 9" stroke="#93c5fd" strokeWidth="0.8" />
      <path d="M3 12h18" stroke="#93c5fd" strokeWidth="0.8" />
    </svg>
  </div>
);

export default function PopularPackages() {
  const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller': return 'warning';
      case 'popular': return 'info';
      case 'trending': return 'success';
      default: return 'neutral';
    }
  };

  const getPackageFlag = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('europe')) return EUMapSvg;
    if (norm.includes('asia')) return APACMapSvg;
    if (norm.includes('global')) return GlobalMapSvg;
    return USMapSvg;
  };

  return (
    <div className="space-y-3 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-1 px-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Popular Packages</h3>
        <Link href="/dashboard/packages" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
          Manage all →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_PACKAGES.map((pkg) => {
          const FlagGraphic = getPackageFlag(pkg.name);
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-slate-100 flex flex-col justify-between overflow-hidden hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-5">
                  
                  {/* Top: Flag + Badge */}
                  <div className="flex items-start justify-between">
                    <FlagGraphic />
                    {pkg.tag !== 'None' && (
                      <Badge variant={getTagVariant(pkg.tag)}>{pkg.tag}</Badge>
                    )}
                  </div>

                  {/* Middle: Title & Region */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{pkg.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{pkg.region}</span>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-50 py-3 dark:border-slate-900/50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Data</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{pkg.dataGb}GB</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Validity</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{pkg.validityDays}d</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Price</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">${pkg.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Bottom: Active count */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Active eSIMs</span>
                    <span className="text-slate-700 font-bold dark:text-slate-300">{pkg.activeCount.toLocaleString()}</span>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
