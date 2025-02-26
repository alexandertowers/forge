import { NextResponse } from 'next/server';
import { tenants } from '@/lib/db';
import { TenantConfigSchema } from '@/lib/types';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Define the expected request schema
    const RequestSchema = z.object({
      tenantId: z.string(),
      config: TenantConfigSchema.omit({ tenantId: true })
    });
    
    // Validate the incoming data
    const validatedData = RequestSchema.parse(data);
    
    // Store tenant config with full validation
    const fullConfig = TenantConfigSchema.parse({
      tenantId: validatedData.tenantId,
      ...validatedData.config,
      createdAt: new Date().toISOString()
    });
    
    // Store in our mock database
    tenants.set(validatedData.tenantId, fullConfig);
    
    // Generate URLs for different environments
    let url: string;
    
    // Check if we're in a Vercel environment
    if (process.env.VERCEL_URL) {
      // On Vercel, we use the project's deployment URL
      url = `https://${validatedData.tenantId}.${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === 'development') {
      // For local development, use localhost with path-based approach
      url = `http://localhost:3000/${validatedData.tenantId}`;
    } else {
      // Production with custom domain
      url = `https://${validatedData.tenantId}.yourdomain.com`;
    }
    
    // Return success with subdomain URL
    return NextResponse.json({ 
      success: true, 
      url
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    // Handle other errors
    console.error('Error creating tenant:', error);
    return NextResponse.json({ 
      error: 'Failed to create tenant' 
    }, { status: 500 });
  }
}