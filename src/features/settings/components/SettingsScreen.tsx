'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const settingsSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().email('Invalid email address'),
  markupPercent: zod.number().min(0, 'Markup cannot be negative').max(100, 'Markup cannot exceed 100%'),
  systemAlertEmail: zod.string().email('Invalid alert email address'),
});

type SettingsFields = zod.infer<typeof settingsSchema>;

export default function SettingsScreen() {
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFields>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || 'Khalid Al-Rashid',
      email: user?.email || 'khalid.alrashid@union.com',
      markupPercent: 12.5,
      systemAlertEmail: 'alerts@union.com',
    },
  });

  const onSubmit = async (data: SettingsFields) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('Saved settings configuration:', data);
    alert('Settings updated successfully!');
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Configure platform preferences, core pricing margins, and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-slate-100">
              <CardHeader className="border-slate-100/50">
                <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
                  Platform Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Profile settings */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Administrator Name"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Corporate Email"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                {/* Pricing / Alert settings */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Global Markup Percent (%)"
                    type="number"
                    step="0.1"
                    error={errors.markupPercent?.message}
                    {...register('markupPercent', { valueAsNumber: true })}
                  />
                  <Input
                    label="System Critical Alerts Email"
                    type="email"
                    error={errors.systemAlertEmail?.message}
                    {...register('systemAlertEmail')}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-900/50">
                  <Button type="submit" isLoading={isSubmitting} className="shadow-md shadow-blue-500/10">
                    Save Configuration
                  </Button>
                </div>

              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sidebar Info Panel */}
        <div>
          <Card className="border-slate-100 bg-slate-50/50 dark:bg-slate-900/10 h-full">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                System Metadata
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Service Version:</span>
                  <span className="font-bold text-slate-700 dark:text-white">v1.1.2-stable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Gateway Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Environment:</span>
                  <span className="font-bold text-slate-700 dark:text-white">Production (US-East)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Mock Databases:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
