import { tenants } from '@/lib/db';
import WealthDashboard from '@/components/WealthDashboard';
import { notFound } from 'next/navigation';

interface DomainPageProps {
    params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = await params;
  const tenantConfig = tenants.get(domain);
  
  // If tenant doesn't exist, show 404
  if (!tenantConfig) {
    notFound();
  }
  
  return <WealthDashboard config={tenantConfig} />;
}
