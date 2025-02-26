import TenantConfig from '@/components/TenantConfig';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="container mx-auto">
        <TenantConfig />
      </div>
    </div>
  );
}