import TransactionsScreen from '@/features/transactions/components/TransactionsScreen';

export const metadata = {
  title: 'Transactions | United Union',
  description: 'Track credits, debits, billing payouts, and order ledger entries.',
};

export default function TransactionsPage() {
  return <TransactionsScreen />;
}
