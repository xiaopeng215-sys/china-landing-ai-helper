import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default async function OnboardingPage() {
  const session = await auth();

  // 未登录 → 去登录
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/onboarding');
  }

  const userId = (session.user as { id?: string }).id ?? session.user.email ?? '';

  return <OnboardingFlow userId={userId} />;
}
