export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Manager' | 'Finance Manager' | 'Merchant Manager' | 'Support Agent';
  avatarUrl?: string;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  salesCount: number;
  revenue: number;
  countryCode: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
}

export interface eSIMItem {
  iccid: string;
  status: 'Available' | 'Reserved' | 'Assigned' | 'Expired' | 'Active' | 'Suspended';
  alias?: string;
  provider: string;
  allocatedTo?: string; // Merchant ID/Name or Customer Name
  dataLimitGb: number;
  dataUsedGb?: number;
  packageName?: string;
  country?: string;
  network?: string;
  activationDate?: string;
  expiryDate?: string;
}

export interface Package {
  id: string;
  name: string;
  region: string;
  dataGb: number;
  validityDays: number;
  price: number;
  tag: 'Bestseller' | 'Popular' | 'Trending' | 'New' | 'None';
  activeCount: number;
  wholesalePrice?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  region: string;
  amount: number;
  status: 'Completed' | 'Active' | 'Pending' | 'Failed' | 'Expired';
  date: string;
}

export interface Invoice {
  id: string;
  merchantName: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Completed' | 'Pending' | 'Expired';
  dueDate: string;
  issueDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface SalesDataPoint {
  date: string;
  orders: number;
  activations: number;
  revenue: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  esimsCount: number;
  totalSpend: number;
  joined: string;
  status: 'Active' | 'Inactive';
}

export interface PaymentCard {
  id: string;
  brand: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface PaymentHistoryRecord {
  id: string;
  description: string;
  method: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface TransactionRecord {
  id: string;
  type: 'Credit' | 'Debit';
  description: string;
  merchant: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface PricingRule {
  id: string;
  name: string;
  type: 'Percentage' | 'Fixed Discount' | 'Fixed Markup';
  value: number;
  appliesTo: string;
  status: 'active' | 'inactive';
  priority: number;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  role: 'Full Access' | 'Read-only' | 'Billing Admin';
  createdBy: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  createdDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Manager' | 'Finance Manager' | 'Merchant Manager' | 'Support Agent';
  lastActive: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export type PermissionKey =
  | 'view_dashboard'
  | 'manage_packages'
  | 'create_packages'
  | 'delete_packages'
  | 'view_orders'
  | 'manage_orders'
  | 'view_customers'
  | 'manage_customers'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_finance'
  | 'manage_billing'
  | 'view_payments'
  | 'manage_payments'
  | 'view_transactions'
  | 'manage_pricing_rules'
  | 'manage_api_keys'
  | 'invite_team_members'
  | 'manage_roles'
  | 'manage_settings'
  | 'view_analytics'
  | 'export_data'
  | 'send_messages';

export interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  memberCount: number;
  permissions: PermissionKey[];
  isSystem?: boolean;
}
