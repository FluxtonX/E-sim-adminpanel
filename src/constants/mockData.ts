import { Merchant, eSIMItem, Package, Order, Invoice, ActivityLog, SalesDataPoint } from '@/types';

export const MOCK_DASHBOARD_METRICS = {
  totalInventory: {
    value: 45230,
    subtext: 'Available SIMs',
    change: '+12.5% vs last month',
    trend: 'up' as const,
  },
  activeESIMs: {
    value: 12847,
    subtext: 'Currently Active',
    change: '+8.3% vs last month',
    trend: 'up' as const,
  },
  totalRevenue: {
    value: 284920,
    subtext: 'This Month',
    change: '+23.1% vs last month',
    trend: 'up' as const,
  },
  totalOrders: {
    value: 3241,
    subtext: 'All Time Orders',
    change: '+15.7% vs last month',
    trend: 'up' as const,
  },
  merchantAccounts: {
    value: 156,
    subtext: 'Active Resellers',
    change: '+4.2% vs last month',
    trend: 'up' as const,
  },
  dataUsage: {
    value: 847, // TB
    subtext: 'Consumed Globally',
    change: '+18.9% vs last month',
    trend: 'up' as const,
  },
};

export const MOCK_ESIM_INVENTORY = {
  total: 45230,
  available: 28450, // 63%
  reserved: 8230,   // 18%
  assigned: 6890,   // 15%
  expired: 1660,    // 4%
};

export const MOCK_MERCHANTS: Merchant[] = [
  { id: 'mer-001', name: 'TravelTech Solutions', email: 'info@traveltech.ae', salesCount: 1240, revenue: 84200, countryCode: 'UAE', status: 'Active', joinedDate: '2025-01-10' },
  { id: 'mer-002', name: 'GlobalConnect Ltd', email: 'sales@globalconnect.co.uk', salesCount: 987, revenue: 62400, countryCode: 'UK', status: 'Active', joinedDate: '2025-02-14' },
  { id: 'mer-003', name: 'NomadSIM', email: 'contact@nomadsim.de', salesCount: 756, revenue: 48900, countryCode: 'Germany', status: 'Active', joinedDate: '2025-03-01' },
  { id: 'mer-004', name: 'RoamEasy Inc', email: 'support@roameasy.com', salesCount: 634, revenue: 41200, countryCode: 'USA', status: 'Active', joinedDate: '2025-04-18' },
  { id: 'mer-005', name: 'AsiaTel Partners', email: 'partner@asiatel.sg', salesCount: 525, revenue: 33800, countryCode: 'Singapore', status: 'Active', joinedDate: '2025-05-22' },
  { id: 'mer-006', name: 'EuroTravel Mobile', email: 'hello@eurotravel.fr', salesCount: 412, revenue: 26700, countryCode: 'France', status: 'Active', joinedDate: '2025-06-05' },
  { id: 'mer-007', name: 'AlpsSIM Co', email: 'info@alpssim.ch', salesCount: 180, revenue: 12300, countryCode: 'Switzerland', status: 'Pending', joinedDate: '2026-01-02' },
  { id: 'mer-008', name: 'Oceania Roaming', email: 'ops@oceaniaroam.nz', salesCount: 90, revenue: 6500, countryCode: 'New Zealand', status: 'Inactive', joinedDate: '2025-11-12' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-2024-001', customerName: 'James Wilson', customerEmail: 'j.wilson@email.com', packageName: 'Europe 10GB', region: 'Europe', amount: 24.99, status: 'Completed', date: 'Dec 20, 2026' },
  { id: 'ORD-2024-002', customerName: 'Sarah Chen', customerEmail: 's.chen@email.com', packageName: 'Asia Pacific 10GB', region: 'Asia Pacific', amount: 14.99, status: 'Active', date: 'Dec 20, 2026' },
  { id: 'ORD-2024-003', customerName: 'Marco Rossi', customerEmail: 'm.rossi@email.com', packageName: 'Global Explorer 50GB', region: 'Global', amount: 59.99, status: 'Pending', date: 'Dec 20, 2026' },
  { id: 'ORD-2024-004', customerName: 'Aisha Patel', customerEmail: 'a.patel@email.com', packageName: 'North America 20GB', region: 'North America', amount: 34.99, status: 'Completed', date: 'Dec 19, 2026' },
  { id: 'ORD-2024-005', customerName: 'Lucas Müller', customerEmail: 'l.muller@email.com', packageName: 'Middle East 5GB', region: 'Middle East', amount: 9.99, status: 'Failed', date: 'Dec 19, 2026' },
  { id: 'ORD-2024-006', customerName: 'Emma Thompson', customerEmail: 'e.thompson@email.com', packageName: 'Japan Premium 10GB', region: 'Asia', amount: 29.99, status: 'Completed', date: 'Dec 18, 2026' },
  { id: 'ORD-2024-007', customerName: 'Carlos Garcia', customerEmail: 'c.garcia@email.com', packageName: 'Latin America 8GB', region: 'Latin America', amount: 19.99, status: 'Active', date: 'Dec 18, 2026' },
  { id: 'ORD-2024-008', customerName: 'Yuki Tanaka', customerEmail: 'y.tanaka@email.com', packageName: 'Europe 10GB', region: 'Europe', amount: 24.99, status: 'Expired', date: 'Dec 17, 2026' },
  { id: 'ORD-2024-009', customerName: 'Ali Hassan', customerEmail: 'a.hassan@email.com', packageName: 'Africa Connect 5GB', region: 'Africa', amount: 12.99, status: 'Completed', date: 'Dec 17, 2026' },
  { id: 'ORD-2024-010', customerName: 'Priya Sharma', customerEmail: 'p.sharma@email.com', packageName: 'India 10GB', region: 'Asia', amount: 11.99, status: 'Pending', date: 'Dec 16, 2026' },
];

export const MOCK_PACKAGES: Package[] = [
  { id: 'pkg-001', name: 'Europe Travel', region: 'Europe', dataGb: 10, validityDays: 30, price: 24.99, tag: 'Bestseller', activeCount: 4621 },
  { id: 'pkg-002', name: 'Asia Premium', region: 'Asia Pacific', dataGb: 20, validityDays: 30, price: 34.99, tag: 'Popular', activeCount: 3245 },
  { id: 'pkg-003', name: 'Global Explorer', region: 'Global', dataGb: 50, validityDays: 90, price: 79.99, tag: 'Trending', activeCount: 1816 },
  { id: 'pkg-004', name: 'North America Business', region: 'North America', dataGb: 30, validityDays: 30, price: 49.99, tag: 'Popular', activeCount: 2120 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2026-089', merchantName: 'TravelTech Solutions', amount: 12450.00, status: 'Paid', dueDate: '2026-07-01', issueDate: '2026-06-01' },
  { id: 'INV-2026-090', merchantName: 'GlobalConnect Ltd', amount: 8900.00, status: 'Paid', dueDate: '2026-07-01', issueDate: '2026-06-01' },
  { id: 'INV-2026-091', merchantName: 'NomadSIM', amount: 4890.00, status: 'Unpaid', dueDate: '2026-07-05', issueDate: '2026-06-05' },
  { id: 'INV-2026-092', merchantName: 'RoamEasy Inc', amount: 6200.00, status: 'Overdue', dueDate: '2026-06-15', issueDate: '2026-05-15' },
  { id: 'INV-2026-093', merchantName: 'AsiaTel Partners', amount: 3380.00, status: 'Paid', dueDate: '2026-06-30', issueDate: '2026-05-30' },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act-1', user: 'Khalid Al-Rashid (Super Admin)', action: 'Approved new reseller AlpsSIM Co profile onboarding', time: '10 mins ago' },
  { id: 'act-2', user: 'System Agent', action: 'Provisioned batch of 5,000 new European eSIM profiles', time: '42 mins ago' },
  { id: 'act-3', user: 'Khalid Al-Rashid (Super Admin)', action: 'Issued $2,500 billing refund to RoamEasy Inc for failed transactions', time: '2 hours ago' },
  { id: 'act-4', user: 'Merchant Manager', action: 'Created new pricing promo rule Asia Premium (10% off)', time: '5 hours ago' },
  { id: 'act-5', user: 'System Agent', action: 'Reconciled billing invoice INV-2026-089 for TravelTech Solutions', time: '1 day ago' },
];

// Coordinate chart data matching the figma diagram (Dec 24 - Dec 30)
export const MOCK_SALES_ANALYTICS: SalesDataPoint[] = [
  { date: 'Dec 24', orders: 200, activations: 310, revenue: 1500 },
  { date: 'Dec 25', orders: 400, activations: 550, revenue: 2600 },
  { date: 'Dec 26', orders: 150, activations: 680, revenue: 1000 },
  { date: 'Dec 27', orders: 350, activations: 200, revenue: 2300 },
  { date: 'Dec 28', orders: 600, activations: 660, revenue: 4100 },
  { date: 'Dec 29', orders: 300, activations: 500, revenue: 2000 },
  { date: 'Dec 30', orders: 480, activations: 700, revenue: 3493 }, // Matches revenue in screenshot: 3,493
];

// Mock database eSIM numbers list
export const MOCK_ESIM_INVENTORY_ITEMS: eSIMItem[] = [
  {
    iccid: '8988234000000001234',
    status: 'Active',
    provider: 'EE',
    allocatedTo: 'James Wilson',
    dataLimitGb: 10,
    dataUsedGb: 7.2,
    packageName: 'Europe 10GB',
    country: 'United Kingdom',
    network: 'EE',
    activationDate: 'Dec 1, 2024',
    expiryDate: 'Dec 31, 2024'
  },
  {
    iccid: '8988234000000002345',
    status: 'Available',
    provider: 'NTT Docomo',
    dataLimitGb: 5,
    dataUsedGb: 0,
    packageName: 'Japan Premium 5GB',
    country: 'Japan',
    network: 'NTT Docomo'
  },
  {
    iccid: '8988234000000003456',
    status: 'Active',
    provider: 'T-Mobile',
    allocatedTo: 'Sarah Chen',
    dataLimitGb: 20,
    dataUsedGb: 18.4,
    packageName: 'North America 20GB',
    country: 'United States',
    network: 'T-Mobile',
    activationDate: 'Nov 20, 2024',
    expiryDate: 'Dec 20, 2024'
  },
  {
    iccid: '8988234000000004567',
    status: 'Expired',
    provider: 'Deutsche Telekom',
    allocatedTo: 'Lucas Müller',
    dataLimitGb: 10,
    dataUsedGb: 10,
    packageName: 'Europe 10GB',
    country: 'Germany',
    network: 'Deutsche Telekom',
    activationDate: 'Nov 30, 2024',
    expiryDate: 'Dec 30, 2024'
  },
  {
    iccid: '8988234000000005678',
    status: 'Available',
    provider: 'Multiple',
    dataLimitGb: 50,
    dataUsedGb: 0,
    packageName: 'Global Explorer 50GB',
    country: 'Global',
    network: 'Multiple'
  },
  {
    iccid: '8988234000000006789',
    status: 'Assigned',
    provider: 'Singtel',
    allocatedTo: 'AsiaTel Partners',
    dataLimitGb: 15,
    dataUsedGb: 0,
    packageName: 'Asia Premium 15GB',
    country: 'Singapore',
    network: 'Singtel'
  },
  {
    iccid: '8988234000000007890',
    status: 'Active',
    provider: 'Telcel',
    allocatedTo: 'Carlos Garcia',
    dataLimitGb: 8,
    dataUsedGb: 3.1,
    packageName: 'Latin America 8GB',
    country: 'Mexico',
    network: 'Telcel',
    activationDate: 'Jan 10, 2025',
    expiryDate: 'Feb 10, 2025'
  },
  {
    iccid: '8988234000000008901',
    status: 'Suspended',
    provider: 'Etisalat',
    allocatedTo: 'Ali Hassan',
    dataLimitGb: 5,
    dataUsedGb: 2.3,
    packageName: 'Middle East 5GB',
    country: 'UAE',
    network: 'Etisalat',
    activationDate: 'Jan 5, 2025',
    expiryDate: 'Feb 5, 2025'
  },
  {
    iccid: '8988234000000009012',
    status: 'Available',
    provider: 'Airtel',
    dataLimitGb: 3,
    dataUsedGb: 0,
    packageName: 'India 3GB',
    country: 'India',
    network: 'Airtel'
  },
  {
    iccid: '8988234000000010123',
    status: 'Active',
    provider: 'Telstra',
    allocatedTo: 'Emma Thompson',
    dataLimitGb: 20,
    dataUsedGb: 12.7,
    packageName: 'Asia Pacific 20GB',
    country: 'Australia',
    network: 'Telstra',
    activationDate: 'Jan 8, 2025',
    expiryDate: 'Feb 8, 2025'
  }
];
