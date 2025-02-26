// app/[domain]/page.tsx
import { db } from '@/lib/db';
import { tenants } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import WealthDashboard from '@/components/WealthDashboard';
import { notFound } from 'next/navigation';
import type { TenantConfig } from '@/lib/types';

interface DomainPageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = await params;

  // Query the tenant configuration from Neon via Drizzle
  const result = await db
    .select()
    .from(tenants)
    .where(eq(tenants.tenantId, domain));

  const tenantRow = result[0];
  
  if (!tenantRow) {
    notFound();
  }

  // Map the result to your TenantConfig type
  const tenantConfig: TenantConfig = {
    tenantId: tenantRow.tenantId,
    companyName: tenantRow.companyName,
    taxJurisdiction: tenantRow.taxJurisdiction as "US" | "UK" | "EU" | "CA" | "AU",
    currency: tenantRow.currency as "USD" | "EUR" | "GBP" | "CAD" | "AUD",
    colors: tenantRow.colors, // assuming colors is stored as a JSON object with primary & secondary keys
  };

  return <WealthDashboard config={tenantConfig} />;
}
