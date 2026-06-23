'use client';

import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Menu, Search, Bell, CreditCard, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  // Resolve breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Home', active: true }];
    
    return [
      { label: 'Home', href: '/dashboard' },
      ...paths.slice(1).map((p, idx) => {
        const label = p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
        return {
          label,
          active: idx === paths.length - 2,
        };
      }),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-950 shrink-0 select-none">
      
      {/* Left side: Hamburger (mobile/tablet) + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
              <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-bold' : ''}>
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Middle: Search bar */}
      <div className="hidden sm:block w-72 max-w-xs relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
        />
      </div>

      {/* Right side: Balance + Notifications + Avatar */}
      <div className="flex items-center gap-4">
        {/* Balance Display - matching figma green theme */}
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CreditCard className="h-4 w-4 shrink-0" />
          <span>$24,580.00</span>
        </div>

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm dark:border-slate-800">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'KA'}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-800 leading-none dark:text-slate-200">
              {user?.name || 'Khalid Al-Rashid'}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
