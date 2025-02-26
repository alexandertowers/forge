// app/tenants/[tenant]/page.tsx
import { db } from '@/lib/db';
import { tenants } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import WealthDashboard from '@/components/WealthDashboard';
// import { notFound } from 'next/navigation';
import type { TenantConfig } from '@/lib/types';

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;
  console.log('tenant', tenant);

  // Query the Neon DB via Drizzle ORM
  const result = await db
    .select()
    .from(tenants)
    .where(eq(tenants.tenantId, tenant));

  const tenantRow = result[0];

  // If no tenant configuration is found, show 404
  if (!tenantRow) {
    return <div>No configuration found for tenant: {tenant}</div>;
  }

  // Map the result to your TenantConfig type
  const tenantConfig: TenantConfig = {
    tenantId: tenantRow.tenantId,
    companyName: tenantRow.companyName,
    taxJurisdiction: tenantRow.taxJurisdiction as "US" | "UK" | "EU" | "CA" | "AU",
    currency: tenantRow.currency as "USD" | "EUR" | "GBP" | "CAD" | "AUD",
    colors: tenantRow.colors, // assuming colors is stored as a JSON object
  };

  return <WealthDashboard config={tenantConfig} />;
}
