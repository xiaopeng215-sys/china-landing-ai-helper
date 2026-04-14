import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI China Travel Assistant — Chat',
  description: 'Chat with our AI travel assistant for instant answers about China travel — itineraries, transport, food, Alipay setup, SIM cards, and more.',
  openGraph: {
    title: 'AI China Travel Assistant',
    description: 'Get instant AI-powered travel advice for China. Ask about itineraries, transport, food, payments, and more.',
    url: 'https://www.travelerlocal.ai/chat',
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
