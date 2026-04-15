'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/user-profile';

/**
 * 登录后中转页
 * - 新用户（无档案 / onboarding 未完成）→ /onboarding
 * - 老用户 → /
 */
export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.replace('/auth/signin');
      return;
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? '';

    getUserProfile(userId).then((profile) => {
      if (!profile || !profile.onboardingDone) {
        router.replace('/onboarding');
      } else {
        router.replace('/');
      }
    });
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#767676] text-sm">Setting up your experience...</p>
      </div>
    </div>
  );
}
