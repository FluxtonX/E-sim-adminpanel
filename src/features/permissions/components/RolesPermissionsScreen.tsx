'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Role, PermissionKey } from '@/types';
import {
  Shield,
  Plus,
  Loader2,
  Check,
  X,
  Crown
} from 'lucide-react';

// ─── Predefined System Roles matching Figma Matrix ───────────────────────────
const INITIAL_ROLES: Role[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full unrestricted platform access. Reserved for platform owners only.',
    color: '#7c3aed',
    memberCount: 1,
    permissions: [
      'view_dashboard', 'export_data',
      'view_inventory', 'manage_inventory_activate', 'manage_inventory_suspend', 'manage_inventory_transfer',
      'view_orders', 'manage_orders_create', 'manage_orders_cancel', 'manage_orders_refund',
      'view_finance', 'manage_payments', 'view_transactions', 'manage_billing',
      'view_merchants', 'manage_merchants_add', 'manage_pricing_rules', 'manage_merchants_disable',
      'view_team', 'invite_team_members', 'manage_roles', 'manage_members_remove',
      'manage_api_keys', 'manage_api_keys_create', 'manage_api_keys_revoke'
    ] as PermissionKey[],
    isSystem: true,
  },
  {
    id: 'role-ops-manager',
    name: 'Operations Manager',
    description: 'Manages day-to-day operations including orders, inventory and customers.',
    color: '#0284c7',
    memberCount: 2,
    permissions: [
      'view_dashboard', 'export_data',
      'view_inventory', 'manage_inventory_activate', 'manage_inventory_suspend',
      'view_orders', 'manage_orders_create', 'manage_orders_cancel',
      'view_transactions',
      'view_merchants', 'manage_merchants_add',
      'view_team', 'invite_team_members'
    ] as PermissionKey[],
    isSystem: false,
  },
  {
    id: 'role-finance-manager',
    name: 'Finance Manager',
    description: 'Access to all financial modules: billing, payments and transactions.',
    color: '#059669',
    memberCount: 2,
    permissions: [
      'view_dashboard', 'export_data',
      'view_orders', 'manage_orders_refund',
      'view_finance', 'manage_payments', 'view_transactions', 'manage_billing',
      'view_merchants', 'manage_pricing_rules'
    ] as PermissionKey[],
    isSystem: false,
  },
  {
    id: 'role-support-agent',
    name: 'Support Agent',
    description: 'Read-only access to customer data and order status for support resolution.',
    color: '#0891b2',
    memberCount: 2,
    permissions: [
      'view_dashboard',
      'view_inventory', 'manage_inventory_activate',
      'view_orders', 'manage_orders_create'
    ] as PermissionKey[],
    isSystem: false,
  },
  {
    id: 'role-merchant-manager',
    name: 'Developer',
    description: 'Integration credential management and API testing environment.',
    color: '#d97706',
    memberCount: 1,
    permissions: [
      'view_dashboard',
      'view_inventory',
      'manage_api_keys', 'manage_api_keys_create'
    ] as PermissionKey[],
    isSystem: false,
  },
];

// ─── Permission Matrix Schema ───────────────────────────────────────────────
interface MatrixItem {
  label: string;
  key: string;
}

interface MatrixSection {
  category: string;
  items: MatrixItem[];
}

const MATRIX_SECTIONS: MatrixSection[] = [
  {
    category: 'DASHBOARD',
    items: [
      { label: 'View Dashboard', key: 'view_dashboard' },
      { label: 'Export Reports', key: 'export_data' },
    ]
  },
  {
    category: 'ESIM MANAGEMENT',
    items: [
      { label: 'View eSIMs', key: 'view_inventory' },
      { label: 'Activate eSIMs', key: 'manage_inventory_activate' },
      { label: 'Suspend eSIMs', key: 'manage_inventory_suspend' },
      { label: 'Transfer eSIMs', key: 'manage_inventory_transfer' },
    ]
  },
  {
    category: 'ORDERS',
    items: [
      { label: 'View Orders', key: 'view_orders' },
      { label: 'Create Orders', key: 'manage_orders_create' },
      { label: 'Cancel Orders', key: 'manage_orders_cancel' },
      { label: 'Refund Orders', key: 'manage_orders_refund' },
    ]
  },
  {
    category: 'FINANCE',
    items: [
      { label: 'View Finance', key: 'view_finance' },
      { label: 'Process Payments', key: 'manage_payments' },
      { label: 'View Transactions', key: 'view_transactions' },
      { label: 'Manage Invoices', key: 'manage_billing' },
    ]
  },
  {
    category: 'MERCHANTS',
    items: [
      { label: 'View Merchants', key: 'view_merchants' },
      { label: 'Add Merchants', key: 'manage_merchants_add' },
      { label: 'Edit Commission', key: 'manage_pricing_rules' },
      { label: 'Disable Merchants', key: 'manage_merchants_disable' },
    ]
  },
  {
    category: 'TEAM',
    items: [
      { label: 'View Team', key: 'view_team' },
      { label: 'Invite Members', key: 'invite_team_members' },
      { label: 'Edit Roles', key: 'manage_roles' },
      { label: 'Remove Members', key: 'manage_members_remove' },
    ]
  },
  {
    category: 'API',
    items: [
      { label: 'View API Keys', key: 'manage_api_keys' },
      { label: 'Create API Keys', key: 'manage_api_keys_create' },
      { label: 'Revoke API Keys', key: 'manage_api_keys_revoke' },
    ]
  }
];

export default function RolesPermissionsScreen() {
  const [roles] = useState<Role[]>(INITIAL_ROLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">Loading permissions...</span>
        </div>
      </div>
    );
  }

  // Format header display labels
  const getRoleHeaderLabel = (name: string) => {
    if (name === 'Super Admin') return 'ADMIN';
    if (name === 'Operations Manager') return 'MANAGER';
    if (name === 'Finance Manager') return 'FINANCE';
    if (name === 'Support Agent') return 'SUPPORT';
    return 'DEVELOPER';
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/40 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Roles &amp; Permissions
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
            Define what each role can access and manage on the platform.
          </p>
        </div>
        <Button
          onClick={() => {}}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 font-bold shadow-md shadow-blue-500/10 text-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Permission Matrix Large Card */}
      <Card className="border-slate-100/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/10 px-5 py-4 border-b border-slate-100/80 dark:border-slate-900 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
            <Crown className="h-4 w-4 text-blue-600" />
            Permission Matrix
          </h3>
        </div>
        
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/5 select-none text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4.5 w-1/3">Permission</th>
                {roles.map((role) => (
                  <th key={role.id} className="px-6 py-4.5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-blue-500 mb-0.5" style={{ color: role.color }} />
                      <span className="text-[9px] font-black tracking-widest text-slate-800 dark:text-slate-200">
                        {getRoleHeaderLabel(role.name)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {MATRIX_SECTIONS.map((section) => (
                <tr key={section.category} className="contents">
                  {/* Category Header Row */}
                  <tr className="bg-slate-50/60 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-900/80 select-none">
                    <td colSpan={roles.length + 1} className="px-6 py-2 text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-wider">
                      {section.category}
                    </td>
                  </tr>

                  {/* Permission Rows */}
                  {section.items.map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition-colors border-b border-slate-100 dark:border-slate-900/50">
                      <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-350">
                        {item.label}
                      </td>
                      {roles.map((role) => {
                        const hasPerm = role.permissions.includes(item.key as PermissionKey);
                        return (
                          <td key={role.id} className="px-6 py-3.5 text-center">
                            <div className="flex justify-center items-center">
                              {hasPerm ? (
                                <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center dark:bg-emerald-950/20 dark:border-emerald-900/40 shrink-0">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-red-50 text-red-400 border border-red-100 flex items-center justify-center dark:bg-red-950/20 dark:border-red-900/40 shrink-0">
                                  <X className="h-3 w-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
