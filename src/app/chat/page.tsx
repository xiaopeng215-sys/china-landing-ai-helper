'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClientI18n } from '@/lib/i18n/client';

export default function ChatPage() {
  const router = useRouter();
  const { t } = useClientI18n();

  useEffect(() => {
    // Redirect to main app with chat tab
    router.replace('/?tab=chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5a5f] mx-auto mb-4"></div>
        <p className="text-gray-600">{t('Common.loading')}</p>
      </div>
    </div>
  );
}
