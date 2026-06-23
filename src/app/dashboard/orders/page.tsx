import OrderScreen from '@/features/orders/components/OrderScreen';

export const metadata = {
  title: 'Orders | United Union',
  description: 'Manage sales orders, check eSIM profile provisioning statuses and transaction pricing.',
};

export default function OrdersPage() {
  return <OrderScreen />;
}
