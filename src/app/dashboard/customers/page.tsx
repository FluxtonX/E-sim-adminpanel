import CustomerScreen from '@/features/customers/components/CustomerScreen';

export const metadata = {
  title: 'Customers | United Union',
  description: 'Manage individual eSIM customers, their usage, and purchase history.',
};

export default function CustomersPage() {
  return <CustomerScreen />;
}
