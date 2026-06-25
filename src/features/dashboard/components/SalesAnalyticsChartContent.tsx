'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SalesDataPoint } from '@/types';

interface SalesAnalyticsChartContentProps {
  data: SalesDataPoint[] | undefined;
}

export default function SalesAnalyticsChartContent({ data }: SalesAnalyticsChartContentProps) {
  return (
    <div className="h-[250px] w-full text-[10px] font-bold">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
          barGap={4}
        >
          {/* Dashed horizontal gridlines only */}
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
          
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            dy={8}
          />
          
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            dx={-8}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#0f172a',
              fontWeight: 650,
            }}
          />
          
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-slate-500 font-semibold lowercase capitalize pl-1 pr-4">
                {value}
              </span>
            )}
          />
          
          {/* Orders - Pastel blue bar */}
          <Bar 
            dataKey="orders" 
            fill="#bad7fb" 
            radius={[3, 3, 0, 0]} 
            barSize={24} 
            name="Orders" 
          />
          
          {/* Activations - Pastel green bar */}
          <Bar 
            dataKey="activations" 
            fill="#aeeed1" 
            radius={[3, 3, 0, 0]} 
            barSize={24} 
            name="Activations" 
          />
          
          {/* Revenue - Plotted as an invisible line (strokeWidth=0) so it appears in the legend but does not render on the chart canvas */}
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={0} 
            dot={false} 
            activeDot={false} 
            legendType="line" 
            name="Revenue" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
