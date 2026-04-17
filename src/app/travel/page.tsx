'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TravelPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?tab=transport');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5a5f] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
