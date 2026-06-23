// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

export interface RegionActivation {
  region: string;
  count: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
  revenueFormatted: string;
  color: string;
}

export interface CountrySale {
  country: string;
  flag: string;
  sales: number;
  percentage: number;
}

export const MOCK_REVENUE_TREND: RevenueTrendPoint[] = [
  { date: 'Dec 1', revenue: 460 },
  { date: 'Dec 2', revenue: 605 },
  { date: 'Dec 3', revenue: 580 },
  { date: 'Dec 4', revenue: 540 },
  { date: 'Dec 5', revenue: 720 },
  { date: 'Dec 6', revenue: 690 },
  { date: 'Dec 7', revenue: 550 },
  { date: 'Dec 8', revenue: 490 },
  { date: 'Dec 9', revenue: 760 },
  { date: 'Dec 11', revenue: 580 },
  { date: 'Dec 13', revenue: 575 },
  { date: 'Dec 15', revenue: 380 },
  { date: 'Dec 17', revenue: 700 },
  { date: 'Dec 19', revenue: 640 },
  { date: 'Dec 21', revenue: 690 },
  { date: 'Dec 23', revenue: 480 },
  { date: 'Dec 25', revenue: 710 },
  { date: 'Dec 27', revenue: 490 },
  { date: 'Dec 30', revenue: 560 }
];

export const MOCK_REGION_ACTIVATIONS: RegionActivation[] = [
  { region: 'Europe', count: 4800 },
  { region: 'Asia Pacific', count: 3200 },
  { region: 'North America', count: 2100 },
  { region: 'Middle East', count: 1500 },
  { region: 'Latin America', count: 1100 },
  { region: 'Africa', count: 800 }
];

export const MOCK_REGION_REVENUE: RegionRevenue[] = [
  { region: 'Europe', revenue: 120500, revenueFormatted: '$120.5k', color: '#2563eb' },
  { region: 'Asia Pacific', revenue: 91400, revenueFormatted: '$91.4k', color: '#06b6d4' },
  { region: 'North America', revenue: 74700, revenueFormatted: '$74.7k', color: '#10b981' },
  { region: 'Middle East', revenue: 54000, revenueFormatted: '$54.0k', color: '#f59e0b' },
  { region: 'Latin America', revenue: 30200, revenueFormatted: '$30.2k', color: '#8b5cf6' },
  { region: 'Africa', revenue: 18600, revenueFormatted: '$18.6k', color: '#ec4899' }
];

export const MOCK_COUNTRY_SALES: CountrySale[] = [
  { country: 'United Kingdom', flag: '🇬🇧', sales: 1823, percentage: 18.2 },
  { country: 'Germany', flag: '🇩🇪', sales: 1456, percentage: 14.5 },
  { country: 'Japan', flag: '🇯🇵', sales: 1234, percentage: 12.3 },
  { country: 'United States', flag: '🇺🇸', sales: 1098, percentage: 10.9 },
  { country: 'Singapore', flag: '🇸🇬', sales: 876, percentage: 8.7 },
  { country: 'Australia', flag: '🇦🇺', sales: 765, percentage: 7.6 }
];

export const analyticsService = {
  getMetrics: async () => {
    await delay(300);
    return {
      revenueGrowth: { value: '+23.1%', subtext: 'vs last month' },
      totalActivations: { value: '12,847', subtext: 'this month' },
      newCustomers: { value: '1,243', subtext: 'this month' },
      countriesActive: { value: '94', subtext: 'active markets' }
    };
  },

  getRevenueTrend: async () => {
    await delay(400);
    return MOCK_REVENUE_TREND;
  },

  getRegionActivations: async () => {
    await delay(300);
    return MOCK_REGION_ACTIVATIONS;
  },

  getRegionRevenue: async () => {
    await delay(300);
    return MOCK_REGION_REVENUE;
  },

  getCountrySales: async () => {
    await delay(400);
    return MOCK_COUNTRY_SALES;
  }
};
