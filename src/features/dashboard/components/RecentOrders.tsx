'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { MOCK_ORDERS } from '@/constants/mockData';

export default function RecentOrders() {
  // Take first 6 orders for the dashboard widget
  const orders = MOCK_ORDERS.slice(0, 6);

  return (
    <Card className="border-slate-100 select-none">
      <CardHeader className="border-slate-100/50 pb-3">
        <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">Recent Orders</CardTitle>
        <Link href="/dashboard/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
          View all →
        </Link>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((ord) => (
              <TableRow key={ord.id} className="group">
                <TableCell className="pl-6">
                  <Link href="/dashboard/orders" className="font-normal text-blue-600 hover:underline dark:text-blue-400">
                    {ord.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-normal text-slate-800 dark:text-slate-200">{ord.customerName}</span>
                    <span className="text-[10px] font-normal text-slate-400 mt-0.5">{ord.customerEmail}</span>
                  </div>
                </TableCell>
                <TableCell className="font-normal text-slate-700 dark:text-slate-300">
                  {ord.packageName}
                </TableCell>
                <TableCell className="text-slate-500 font-normal">{ord.region}</TableCell>
                <TableCell className="font-normal text-slate-800 dark:text-white">
                  ${ord.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(ord.status)}>{ord.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
