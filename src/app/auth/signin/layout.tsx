import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your China AI Helper account to access your saved trips and preferences.',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
