import TenantConfig from '@/components/TenantConfig';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Create Your Custom Wealth Management Platform
        </h1>
        <TenantConfig />
      </div>
    </div>
  );
}