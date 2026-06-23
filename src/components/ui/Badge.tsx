import { HTMLAttributes } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className = '', variant = 'neutral', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold';
  
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
    error: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
}

// Helper to resolve status to badge variant
export function getStatusVariant(status: string): BadgeVariant {
  const norm = status.toLowerCase();
  if (['completed', 'active', 'paid', 'success', 'available'].includes(norm)) return 'success';
  if (['pending', 'reserved', 'unpaid'].includes(norm)) return 'warning';
  if (['failed', 'expired', 'overdue', 'inactive'].includes(norm)) return 'error';
  if (['assigned'].includes(norm)) return 'info';
  return 'neutral';
}
