// pages/error.tsx
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Oops, something went wrong</h1>
      {message && <p>Error details: {message}</p>}
    </div>
  );
}
