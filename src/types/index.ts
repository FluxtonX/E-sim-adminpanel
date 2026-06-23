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
  tag: 'Bestseller' | 'Popular' | 'Trending' | 'None';
  activeCount: number;
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
  status: 'Paid' | 'Unpaid' | 'Overdue';
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
