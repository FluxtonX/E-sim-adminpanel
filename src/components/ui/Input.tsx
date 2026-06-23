import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-xl border ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 dark:border-slate-800'
          } bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900 ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
