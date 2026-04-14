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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-ai-helper.com';

export const metadata: Metadata = {
  // SEO
  title: {
    default: 'China Landing AI Helper - Your AI Travel Assistant for China',
    template: '%s | China AI Helper',
  },
  description: 'AI-powered travel assistant for visiting China — smart itinerary planning, authentic food recommendations, and transportation guides for Beijing, Shanghai, Xi\'an, Chengdu, Guilin, and Hangzhou.',
  keywords: [
    'China travel',
    'AI travel assistant',
    'itinerary planning',
    'food recommendations',
    'transportation guide',
    'Beijing travel',
    'Shanghai travel',
    'Xian travel',
    'Chengdu travel',
    'Guilin travel',
    'Hangzhou travel',
    'China tourism',
    'travel planning',
  ],
  authors: [
    { name: 'China Landing AI Helper', url: SITE_URL },
  ],
  creator: 'China Landing AI Helper',
  publisher: 'China Landing AI Helper',
  
  // 规范 URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
      'en-US': '/en-US',
      'ko-KR': '/ko-KR',
    },
  },
  
  // PWA 配置
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'China AI Helper',
  },
  
  // 图标
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icons/icon-192.png',
  },
  
  // 主题色
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10B981' },
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
  ],
  
  // Open Graph - 社交媒体分享优化
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'ko_KR', 'ja_JP'],
    url: SITE_URL,
    siteName: 'China AI Helper',
    title: 'China Landing AI Helper - Your AI Travel Assistant for China',
    description: 'AI-powered travel assistant for visiting China — smart itinerary planning, authentic food recommendations, and transportation guides.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'China Landing AI Helper - AI Travel Assistant',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'China AI Helper Logo',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    site: '@ChinaAIHelper',
    creator: '@ChinaAIHelper',
    title: 'China Landing AI Helper - Your AI Travel Assistant for China',
    description: 'AI-powered travel assistant for visiting China — smart itinerary planning, authentic food recommendations, and transportation guides.',
    images: ['/og-image.png'],
  },
  
  // 其他验证
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // 可添加其他搜索引擎验证
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
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
          {/* 结构化数据 - Schema.org JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'China Landing AI Helper',
                alternateName: ['China AI Helper', 'China Travel AI Assistant'],
                url: SITE_URL,
                description: 'AI-powered China travel planning assistant - smart itinerary customization, authentic food recommendations, transportation guides',
                applicationCategory: 'TravelApplication',
                operatingSystem: 'All',
                browserRequirements: 'Requires JavaScript',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'CNY',
                },
                author: {
                  '@type': 'Organization',
                  name: 'China Landing AI Helper',
                  url: SITE_URL,
                },
                keywords: 'China travel, AI assistant, itinerary planning, food recommendations, transportation guide, Beijing, Shanghai, Xian, Chengdu, Guilin, Hangzhou',
                featureList: 'AI itinerary planning, food recommendations, transportation guide, offline mode, multilingual support',
                screenshot: `${SITE_URL}/screenshots/home.png`,
                sameAs: [
                  'https://twitter.com/ChinaAIHelper',
                  'https://www.facebook.com/ChinaAIHelper',
                ],
              }),
            }}
          />
          {/* 旅行服务结构化数据 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'TravelAgency',
                name: 'China Landing AI Helper',
                description: 'AI-powered China travel planning service',
                url: SITE_URL,
                priceRange: '¥¥',
                currenciesAccepted: 'CNY',
                paymentAccepted: 'Cash, Credit Card, Alipay, WeChat Pay',
                areaServed: [
                  {
                    '@type': 'City',
                    name: 'Beijing',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                  {
                    '@type': 'City',
                    name: 'Shanghai',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                  {
                    '@type': 'City',
                    name: 'Xian',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                  {
                    '@type': 'City',
                    name: 'Chengdu',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                  {
                    '@type': 'City',
                    name: 'Guilin',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                  {
                    '@type': 'City',
                    name: 'Hangzhou',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'CN',
                    },
                  },
                ],
              }),
            }}
          />
          <div className="safe-top safe-bottom">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
