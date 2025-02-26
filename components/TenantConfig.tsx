'use client';

import { useState } from 'react';
import { z } from 'zod';
import { TenantConfigSchema } from '@/lib/types';

// Extract the form schema from our TenantConfigSchema
const FormSchema = z.object({
  tenantId: TenantConfigSchema.shape.tenantId,
  companyName: TenantConfigSchema.shape.companyName,
  taxJurisdiction: TenantConfigSchema.shape.taxJurisdiction,
  currency: TenantConfigSchema.shape.currency,
  colorPrimary: z.string().regex(/^#([0-9A-F]{6})$/i),
  colorSecondary: z.string().regex(/^#([0-9A-F]{6})$/i),
});

type FormData = z.infer<typeof FormSchema>;

export default function TenantConfig() {
  const [form, setForm] = useState<FormData>({
    tenantId: '',
    taxJurisdiction: 'US',
    currency: 'USD',
    colorPrimary: '#1E40AF',
    colorSecondary: '#60A5FA',
    companyName: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [result, setResult] = useState<{success?: boolean, url?: string, error?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when it's changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name as keyof FormData];
        return updated;
      });
    }
  };
  
  const validateForm = (): boolean => {
    try {
      FormSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof FormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: form.tenantId,
          config: {
            companyName: form.companyName,
            taxJurisdiction: form.taxJurisdiction,
            currency: form.currency,
            colors: {
              primary: form.colorPrimary,
              secondary: form.colorSecondary
            }
          }
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tenant');
      }
      
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Your Wealth Management Platform</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Subdomain ID</label>
          <input
            type="text"
            name="tenantId"
            value={form.tenantId}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.tenantId ? 'border-red-500' : ''}`}
            placeholder="your-company"
          />
          {errors.tenantId && (
            <p className="text-red-500 text-sm mt-1">{errors.tenantId}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            This will be your URL: {form.tenantId || 'subdomain'}.yourdomain.com
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.companyName ? 'border-red-500' : ''}`}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tax Jurisdiction</label>
          <select
            name="taxJurisdiction"
            value={form.taxJurisdiction}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="EU">European Union</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center">
            <input
              type="color"
              name="colorPrimary"
              value={form.colorPrimary}
              onChange={handleChange}
              className="mr-2"
            />
            <input
              type="text"
              value={form.colorPrimary}
              onChange={handleChange}
              name="colorPrimary"
              className={`w-full p-2 border rounded ${errors.colorPrimary ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.colorPrimary && (
            <p className="text-red-500 text-sm mt-1">{errors.colorPrimary}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Secondary Color</label>
          <div className="flex items-center">
            <input
              type="color"
              name="colorSecondary"
              value={form.colorSecondary}
              onChange={handleChange}
              className="mr-2"
            />
            <input
              type="text"
              value={form.colorSecondary}
              onChange={handleChange}
              name="colorSecondary"
              className={`w-full p-2 border rounded ${errors.colorSecondary ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.colorSecondary && (
            <p className="text-red-500 text-sm mt-1">{errors.colorSecondary}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Platform'}
        </button>
      </form>
      
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
    </div>
  );
}
