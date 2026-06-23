// import { apiClient } from '@/services/api-client';
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_ESIM_INVENTORY,
  MOCK_SALES_ANALYTICS,
  MOCK_ACTIVITY_LOGS
} from '@/constants/mockData';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  getMetrics: async () => {
    await delay(500); // Simulate API latency
    // Ready for future endpoint: return (await apiClient.get('/dashboard/metrics')).data;
    return MOCK_DASHBOARD_METRICS;
  },

  getInventoryBreakdown: async () => {
    await delay(400);
    // Ready for future endpoint: return (await apiClient.get('/dashboard/inventory-breakdown')).data;
    return MOCK_ESIM_INVENTORY;
  },

  getSalesAnalytics: async (range: 'today' | '7days' | '30days' | '12months') => {
    await delay(600);
    console.log('Simulating fetch sales analytics for range:', range);
    // Ready for future endpoint: return (await apiClient.get(`/dashboard/sales-analytics?range=${range}`)).data;
    return MOCK_SALES_ANALYTICS;
  },

  getActivityLogs: async () => {
    await delay(300);
    // Ready for future endpoint: return (await apiClient.get('/dashboard/activity-logs')).data;
    return MOCK_ACTIVITY_LOGS;
  },
};
