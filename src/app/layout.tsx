import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import NetworkStatus from '@/components/NetworkStatus';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'China Landing AI Helper - Your China Travel Companion',
  description: 'AI-powered China travel planning assistant for itineraries, food recommendations, and transport guidance',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'China AI Helper',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10B981' },
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
  ],
  keywords: ['China travel', 'AI assistant', 'travel planning', ' itinerary', 'food guide', 'transport'],
  authors: [{ name: 'China Landing AI Helper' }],
  openGraph: {
    title: 'China Landing AI Helper',
    description: 'Your AI-powered China travel companion',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'China AI Helper',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="application-name" content="China AI Helper" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <Providers>
          <NetworkStatus />
          <div className="safe-top safe-bottom">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
