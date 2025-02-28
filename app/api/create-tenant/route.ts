import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants } from '@/lib/schema';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';

// Define a schema for your tenant configuration
const RequestSchema = z.object({
  tenantId: z.string(),
  config: z.object({
    companyName: z.string(),
    taxJurisdiction: z.enum(['US', 'UK', 'EU', 'CA', 'AU']),
    currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']),
    colors: z.object({
      primary: z.string().regex(/^#([0-9A-F]{6})$/i),
      secondary: z.string().regex(/^#([0-9A-F]{6})$/i)
    })
  })
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = RequestSchema.parse(data);

    const clerk = await clerkClient();
    const org = await clerk.organizations.createOrganization({
      name: validatedData.tenantId,
    });
    
    // Insert into Neon using Drizzle ORM
    await db.insert(tenants).values({
      tenantId: validatedData.tenantId,
      companyName: validatedData.config.companyName,
      taxJurisdiction: validatedData.config.taxJurisdiction,
      currency: validatedData.config.currency,
      colors: {
        primary: validatedData.config.colors.primary,
        secondary: validatedData.config.colors.secondary,
      },
      orgId: org.id
    });
    
    // Build the tenant URL based on environment
    let url: string;
    if (process.env.NODE_ENV === 'development') {
      url = `http://localhost:3000/${validatedData.tenantId}`;
    } else {
      url = `https://${validatedData.tenantId}.forgewealth.app`;
    }
    
    return NextResponse.json({ success: true, url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating tenant:', error);
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}
