'use client';

import { useEffect } from 'react';
import { TenantConfig } from '@/lib/types';

interface WealthDashboardProps {
  config: TenantConfig;
}

export default function WealthDashboard({ config }: WealthDashboardProps) {
  useEffect(() => {
    // Apply theme colors dynamically
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
  }, [config]);

  // Currency formatter based on tenant config
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-white" style={{ backgroundColor: config.colors.primary }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{config.companyName} Wealth Management</h1>
          <div className="flex items-center space-x-4">
            <span>Tax Jurisdiction: {config.taxJurisdiction}</span>
            <span>Currency: {config.currency}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
            <div className="text-3xl font-bold" style={{ color: config.colors.primary }}>
              {formatCurrency(1250000)}
            </div>
            <p className="text-green-500 mt-2">+2.4% today</p>
            <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
              [Portfolio Chart Placeholder]
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
            <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
              [Asset Allocation Chart Placeholder]
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Stocks</span>
                <span>60%</span>
              </div>
              <div className="flex justify-between">
                <span>Bonds</span>
                <span>25%</span>
              </div>
              <div className="flex justify-between">
                <span>Cash</span>
                <span>10%</span>
              </div>
              <div className="flex justify-between">
                <span>Alternative</span>
                <span>5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tax Summary</h2>
            <div className="text-lg font-semibold">
              Jurisdiction: <span className="font-normal">{config.taxJurisdiction}</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span>Capital Gains (YTD)</span>
                <span>{formatCurrency(45000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dividend Income (YTD)</span>
                <span>{formatCurrency(12500)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax Liability</span>
                <span>{formatCurrency(14375)}</span>
              </div>
            </div>
            <button 
              className="mt-6 w-full py-2 px-4 rounded text-white" 
              style={{ backgroundColor: config.colors.secondary }}
            >
              View Tax Details
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">2025-02-24</td>
                <td className="py-3">AAPL Stock Purchase</td>
                <td className="py-3">Buy</td>
                <td className="py-3 text-right">{formatCurrency(-25000)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">2025-02-20</td>
                <td className="py-3">MSFT Dividend</td>
                <td className="py-3">Dividend</td>
                <td className="py-3 text-right text-green-500">{formatCurrency(1250)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">2025-02-15</td>
                <td className="py-3">NVDA Stock Sale</td>
                <td className="py-3">Sell</td>
                <td className="py-3 text-right text-green-500">{formatCurrency(35000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-12 bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 {config.companyName} Wealth Management</p>
        <p className="text-sm mt-1">Tax Jurisdiction: {config.taxJurisdiction} | Currency: {config.currency}</p>
      </footer>
    </div>
  );
}