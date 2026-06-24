'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import Image from 'next/image';
import {
  LayoutDashboard,
  BarChart3,
  Database,
  Cpu,
  ShoppingCart,
  Users,
  Store,
  TrendingUp,
  FileText,
  CreditCard,
  ArrowLeftRight,
  Package,
  Percent,
  Terminal,
  UserCheck,
  Shield,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Crown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  subItems?: { name: string; href: string }[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const [packagesExpanded, setPackagesExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setSidebarOpen(false);
  };

  const sections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Business',
      items: [
        { name: 'Inventory', href: '/dashboard/inventory', icon: Database },
        { name: 'eSIM Management', href: '/dashboard/esim-management', icon: Cpu },
        { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Merchants', href: '/dashboard/merchants', icon: Store, disabled: true },
      ],
    },
    {
      title: 'Finance',
      items: [
        { name: 'Finance', href: '/dashboard/finance', icon: TrendingUp },
        { name: 'Billing', href: '/dashboard/billing', icon: FileText },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Packages',
          href: '/dashboard/packages',
          icon: Package,
          subItems: [
            { name: 'All Packages', href: '/dashboard/packages' },
            { name: 'Package Builder', href: '/dashboard/packages/builder' }
          ]
        },
        { name: 'Pricing Rules', href: '/dashboard/pricing-rules', icon: Percent },
        { name: 'API Management', href: '/dashboard/api-management', icon: Terminal },
        { name: 'Team Members', href: '/dashboard/team-members', icon: UserCheck },
        { name: 'Roles & Permissions', href: '/dashboard/permissions', icon: Shield },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
        { name: 'Help Center', href: '/dashboard/help-center', icon: HelpCircle },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-[#131926] text-slate-400 border-r border-[#1f293d] select-none">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-[#1f293d] flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 shadow-sm overflow-hidden">
            <Image
              src="/esimlogo.png"
              alt="e-SIM Platform Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">United Union</h1>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">E-SIM Platform</span>
          </div>
        </div>

        {/* Account Active Badge */}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#14232c] border border-[#1b3d3a] px-3 py-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#4ade80] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            Account Active
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {section.title}
            </h3>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg opacity-40 cursor-not-allowed text-slate-500 select-none group"
                    >
                      <Icon className="h-4.5 w-4.5 text-slate-500" />
                      {item.name}
                    </div>
                  );
                }
                
                if (item.subItems) {
                  const isAnySubActive = item.subItems.some((sub) => pathname === sub.href);
                  const isExpanded = item.name === 'Packages' ? packagesExpanded : false;
                  
                  return (
                    <div key={item.name} className="space-y-0.5">
                      <button
                        onClick={() => {
                          if (item.name === 'Packages') {
                            setPackagesExpanded(!packagesExpanded);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 group ${
                          isAnySubActive && !isExpanded
                            ? 'bg-blue-600/10 text-white font-bold border-l-2 border-blue-500'
                            : 'hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4.5 w-4.5 transition-colors ${
                              isAnySubActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="pl-4.5 pr-2 py-0.5 space-y-0.5 border-l border-slate-800/40 ml-5">
                          {item.subItems.map((sub) => {
                            const subActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`block px-3 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${
                                  subActive
                                    ? 'text-blue-500 font-bold bg-blue-500/5'
                                    : 'text-slate-400 hover:text-slate-250 hover:bg-slate-800/20'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 group ${
                      active
                        ? 'bg-blue-600/10 text-white font-bold border-l-2 border-blue-500'
                        : 'hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        active ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Settings at the bottom of list */}
        <div className="space-y-1.5 pt-4 border-t border-[#1f293d]/50">
          <Link
            href="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all group ${
              isActive('/dashboard/settings')
                ? 'bg-blue-600/10 text-white font-bold border-l-2 border-blue-500'
                : 'hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Settings className={`h-4.5 w-4.5 ${isActive('/dashboard/settings') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            Settings
          </Link>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-[#1f293d] bg-[#0c101a] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'KA'}
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                {user?.name || 'Khalid Al-Rashid'}
              </h4>
              <span className="text-[10px] text-slate-500 font-semibold">{user?.role || 'Admin'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/40 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Enterprise Upgrade Box */}
        <div className="mt-1 rounded-lg bg-slate-900/60 border border-[#1f293d]/50 p-2.5 flex items-start gap-2 text-left">
          <div className="rounded bg-blue-500/10 p-1 text-blue-400 shrink-0 mt-0.5">
            <Crown className="h-3.5 w-3.5" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-white leading-none">Enterprise Plan</h5>
            <span className="text-[9px] text-slate-500 mt-1 block">Unlimited eSIMs</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
