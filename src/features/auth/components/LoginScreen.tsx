'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFields = zod.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setAuthError(null);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setAuthError('Invalid credentials. Use admin@esim.com and admin123');
      }
    } catch {
      setAuthError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="relative w-full max-w-md">
        
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 shadow-md">
              <Image
                src="/esimlogo.png"
                alt="e-SIM Platform Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              United Union
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              E-SIM Management Platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register('register' in register ? 'email' : 'email')}
                  className={`block w-full rounded-xl border ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  } bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`block w-full rounded-xl border ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  } bg-slate-50 py-3 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Mock Credentials Alert */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-900">
            <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-900/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Super Admin Account Demo
              </span>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium">Email:</span> admin@esim.com
                <span className="mx-2">|</span>
                <span className="font-medium">Pass:</span> admin123
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
