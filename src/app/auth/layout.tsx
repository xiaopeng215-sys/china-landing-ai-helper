import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Sign In | China AI Helper',
    template: '%s | China AI Helper',
  },
  description: 'Sign in or create an account to save your China travel itineraries and preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
