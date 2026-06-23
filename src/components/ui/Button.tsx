'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 rounded-xl outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-100 dark:focus:ring-blue-900',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
      outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900',
      ghost: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-100 dark:focus:ring-red-900',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-base',
    };

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as unknown as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
