import PackageScreen from '@/features/packages/components/PackageScreen';

export const metadata = {
  title: 'Package Builder | United Union',
  description: 'Design and build custom eSIM cellular profile data packages.',
};

export default function PackageBuilderPage() {
  return <PackageScreen initialView="builder" />;
}
