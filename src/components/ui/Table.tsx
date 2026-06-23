import { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className = '', ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400 ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 ${className}`} {...props} />;
}

export function TableBody({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-slate-100 dark:divide-slate-900 ${className}`} {...props} />;
}

export function TableRow({ className = '', ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/20 ${className}`} {...props} />;
}

export function TableHead({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-6 py-3.5 font-bold dark:text-slate-300 ${className}`} {...props} />;
}

export function TableCell({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-6 py-4.5 text-slate-700 dark:text-slate-300 align-middle ${className}`} {...props} />;
}
