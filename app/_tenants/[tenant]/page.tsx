import { tenants } from '@/lib/db';
import WealthDashboard from '@/components/WealthDashboard';
import { notFound } from 'next/navigation';

interface TenantPageProps {
  params: {
    tenant: string;
  };
}

export default function TenantPage({ params }: TenantPageProps) {
  const { tenant } = params;
  const tenantConfig = tenants.get(tenant);
  
  // If tenant doesn't exist, show 404
  if (!tenantConfig) {
    notFound();
  }
  
  return <WealthDashboard config={tenantConfig} />;
}