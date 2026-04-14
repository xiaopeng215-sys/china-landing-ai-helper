import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'China Transport Guide — Metro, Didi & High-Speed Rail',
  description: "Complete transport guide for China. Metro, Didi, high-speed rail, and airport transfers in Beijing, Shanghai, Chengdu, Xi'an, Guangzhou.",
  openGraph: {
    title: 'China Transport Guide for Travelers',
    description: 'Navigate China like a local. Metro, Didi, high-speed rail, and airport transfers explained.',
    url: 'https://www.travelerlocal.ai/transport',
  },
};

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
