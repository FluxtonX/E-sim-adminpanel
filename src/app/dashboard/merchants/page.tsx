import MerchantListScreen from '@/features/merchants/components/MerchantListScreen';

export const metadata = {
  title: 'Merchants | United Union',
  description: 'Manage active, pending, and inactive reseller profiles and settlement statistics.',
};

export default function MerchantsPage() {
  return <MerchantListScreen />;
}
