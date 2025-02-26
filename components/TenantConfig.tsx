'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TenantConfigSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';

const FormSchema = z.object({
  tenantId: TenantConfigSchema.shape.tenantId,
  companyName: TenantConfigSchema.shape.companyName,
  taxJurisdiction: TenantConfigSchema.shape.taxJurisdiction,
  currency: TenantConfigSchema.shape.currency,
  colorPrimary: z.string().regex(/^#([0-9A-F]{6})$/i, { message: 'Must be a valid hex color' }),
  colorSecondary: z.string().regex(/^#([0-9A-F]{6})$/i, { message: 'Must be a valid hex color' }),
});

type FormData = z.infer<typeof FormSchema>;

export default function TenantConfigForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tenantId: '',
      companyName: '',
      taxJurisdiction: 'US',
      currency: 'USD',
      colorPrimary: '#1E40AF',
      colorSecondary: '#60A5FA',
    },
  });

  const [result, setResult] = useState<{
    success?: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: data.tenantId,
          config: {
            companyName: data.companyName,
            taxJurisdiction: data.taxJurisdiction,
            currency: data.currency,
            colors: {
              primary: data.colorPrimary,
              secondary: data.colorSecondary,
            },
          },
        }),
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to create tenant');
      }
      setResult(resData);
    } catch (error) {
      if (error instanceof Error) {
        setResult({ error: error.message });
      } else {
        setResult({ error: 'An unknown error occurred' });
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Custom Wealth Management Platform</CardTitle>
        <CardDescription>Deploy in one click</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subdomain ID */}
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain ID</FormLabel>
                  <FormControl>
                    <Input placeholder="your-company" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your URL: {`${field.value ? field.value : 'subdomain'}.forgewealth.app`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tax Jurisdiction */}
            <FormField
              control={form.control}
              name="taxJurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Jurisdiction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Tax Jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Color */}
            <FormField
              control={form.control}
              name="colorPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="flex-shrink-0 w-12">
                        <Input type="color" 
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10 p-1"
                        />
                      </div>
                    </FormControl>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="#1E40AF" 
                        className="flex-grow"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Secondary Color */}
            <FormField
              control={form.control}
              name="colorSecondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="flex-shrink-0 w-12">
                        <Input type="color" 
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10 p-1"
                        />
                      </div>
                    </FormControl>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="#60A5FA"
                        className="flex-grow"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-8" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating...' : 'Create Platform'}
            </Button>
          </form>
        </Form>

        {result && (
          <div className={`mt-6 p-4 rounded ${result.error ? 'bg-red-100' : 'bg-green-100'}`}>
            {result.error ? (
              <p className="text-red-800">Error: {result.error}</p>
            ) : (
              <div>
                <p className="text-green-800 font-bold">Success!</p>
                <p className="mt-2">Your platform is ready at:</p>
                <a 
                  href={result.url} 
                  className="block mt-1 text-blue-600 underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {result.url}
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}