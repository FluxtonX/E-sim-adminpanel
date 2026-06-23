'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  themeColor?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'indigo';
}

export default function StatsCard({
  title,
  value,
  subtext,
  change,
  icon: Icon,
  themeColor = 'blue',
}: StatsCardProps) {
  
  const iconColors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400',
    cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full border-slate-100 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {title}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                {value}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">{subtext}</p>
            </div>
            
            {/* Metric Icon */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColors[themeColor]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          {/* Trend Tag */}
          <div className="mt-4 flex items-center gap-1">
            <span className="flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {change.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold pl-1">
              {change.substring(change.indexOf(' ') + 1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
