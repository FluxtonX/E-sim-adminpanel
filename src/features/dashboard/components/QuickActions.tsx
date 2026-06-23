'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Database, Package, UserPlus, FileText, Percent, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}

export default function QuickActions() {
  const actions: ActionItem[] = [
    {
      title: 'Buy eSIM Inventory',
      desc: 'Purchase bulk eSIM packages',
      icon: Database,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
      href: '/dashboard/inventory',
    },
    {
      title: 'Create Package',
      desc: 'Build a new reseller bundle',
      icon: Package,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400',
      href: '/dashboard/packages',
    },
    {
      title: 'Add Merchant',
      desc: 'Onboard a new reseller',
      icon: UserPlus,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
      href: '/dashboard/merchants',
    },
    {
      title: 'Generate Invoice',
      desc: 'Create & send invoices',
      icon: FileText,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400',
      href: '/dashboard/billing',
    },
    {
      title: 'Create Promo',
      desc: 'Set up pricing promotions',
      icon: Percent,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 dark:text-cyan-400',
      href: '/dashboard/packages',
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white pl-1">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.a
              key={act.title}
              href={act.href}
              whileHover={{ y: -3 }}
              className="group block"
            >
              <Card className="h-full border-slate-100 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none">
                <CardContent className="p-5 flex flex-col items-center text-center justify-between h-full gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${act.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">{act.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-1" />
                </CardContent>
              </Card>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
