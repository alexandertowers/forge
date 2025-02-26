import { z } from 'zod';

// Zod schema for tenant configuration
export const TenantConfigSchema = z.object({
  tenantId: z.string()
    .min(3, { message: "Subdomain must be at least 3 characters" })
    .max(63, { message: "Subdomain must be less than 63 characters" })
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, { 
      message: "Subdomain can only contain lowercase letters, numbers, and hyphens (cannot start or end with hyphens)"
    }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  taxJurisdiction: z.enum(['US', 'UK', 'EU', 'CA', 'AU']),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']),
  colors: z.object({
    primary: z.string().regex(/^#([0-9A-F]{6})$/i, { message: "Must be a valid hex color" }),
    secondary: z.string().regex(/^#([0-9A-F]{6})$/i, { message: "Must be a valid hex color" })
  })
});

export type TenantConfig = z.infer<typeof TenantConfigSchema>;