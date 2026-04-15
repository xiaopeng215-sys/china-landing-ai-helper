import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import NetworkStatus from '@/components/NetworkStatus';
import PushNotificationPrompt from '@/components/notifications/PushNotificationPrompt';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travelerlocal.ai';

export const metadata: Metadata = {
  // SEO
  title: {
    default: 'China Landing AI Helper - Your AI Travel Assistant for China',
    template: '%s | China AI Helper',
  },
  description: 'AI-powered travel assistant for visiting China — smart itinerary planning, authentic food recommendations, and transportation guides for Beijing, Shanghai, Xi\'an, Chengdu, Guilin, and Hangzhou.',
  keywords: [
    'China travel', 'China travel guide', 'AI travel assistant', 'visit China',
    'China itinerary', 'China tourism', 'Beijing travel', 'Shanghai travel',
    'Chengdu travel', 'Xian travel', 'Guangzhou travel', 'Shenzhen travel',
    'Alipay guide', 'WeChat Pay foreigner', 'China SIM card', 'eSIM China',
    'China food guide', 'Chinese food', 'China transport guide', 'Didi China',
    'China metro guide', 'high speed rail China', 'China airport transfer',
    'travel China tips', 'China travel app',
  ],
  authors: [
    { name: 'China Landing AI Helper', url: SITE_URL },
  ],
  creator: 'China Landing AI Helper',
  publisher: 'China Landing AI Helper',
  
  // 规范 URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: 'https://www.travelerlocal.ai',
    languages: {
      'en-US': 'https://www.travelerlocal.ai',
      'zh-CN': 'https://www.travelerlocal.ai',
      'zh-TW': 'https://www.travelerlocal.ai',
      'ko-KR': 'https://www.travelerlocal.ai',
      'ja-JP': 'https://www.travelerlocal.ai',
      'es-ES': 'https://www.travelerlocal.ai',
      'pt-BR': 'https://www.travelerlocal.ai',
      'ar-SA': 'https://www.travelerlocal.ai',
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.svg',
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
    <html lang="en" dir="ltr" className={inter.variable}>
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
        {/* Schema.org JSON-LD - SEO/GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.travelerlocal.ai/#website",
                  "url": "https://www.travelerlocal.ai",
                  "name": "China Landing AI Helper",
                  "description": "AI-powered travel assistant for international visitors to China",
                  "inLanguage": ["en-US","zh-CN","zh-TW","ko-KR","ja-JP","es-ES","pt-BR","ar-SA"],
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": { "@type": "EntryPoint", "urlTemplate": "https://www.travelerlocal.ai/chat?q={search_term_string}" },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.travelerlocal.ai/#app",
                  "name": "China Landing AI Helper",
                  "applicationCategory": "TravelApplication",
                  "operatingSystem": "Web, iOS, Android",
                  "description": "AI travel assistant for international visitors to China. Get help with itineraries, transport, food, payments, SIM cards, and emergency contacts.",
                  "url": "https://www.travelerlocal.ai",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                  "featureList": [
                    "AI-powered travel itinerary planning",
                    "China transport guide (metro, Didi, high-speed rail)",
                    "Chinese food guide with 150+ dishes",
                    "Payment setup guide (Alipay, WeChat Pay)",
                    "SIM card and eSIM recommendations",
                    "Emergency contacts and embassy information",
                    "Hotel booking via Trip.com",
                    "8 language support"
                  ],
                  "availableLanguage": ["English","Chinese","Korean","Japanese","Spanish","Portuguese","Arabic"]
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.travelerlocal.ai/#organization",
                  "name": "TravelerLocal",
                  "url": "https://www.travelerlocal.ai",
                  "logo": { "@type": "ImageObject", "url": "https://www.travelerlocal.ai/icons/icon-512x512.png" },
                  "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "email": "support@travelerlocal.ai", "availableLanguage": ["English","Chinese"] }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://www.travelerlocal.ai/#faq",
                  "mainEntity": [
                    { "@type": "Question", "name": "How do I get a SIM card in China as a foreigner?", "acceptedAnswer": { "@type": "Answer", "text": "You can get a local SIM card at the airport from China Unicom, China Mobile, or China Telecom. Bring your passport. Alternatively, buy an eSIM before arrival for instant connectivity. Prices range from ¥69-199 for 7-30 day plans." } },
                    { "@type": "Question", "name": "How do I set up Alipay as a foreigner in China?", "acceptedAnswer": { "@type": "Answer", "text": "Download Alipay, register with your phone number, then link an international Visa/Mastercard. Since 2023, foreigners can use Alipay without a Chinese bank account. You can also use WeChat Pay the same way." } },
                    { "@type": "Question", "name": "What is the best way to get from the airport to the city in China?", "acceptedAnswer": { "@type": "Answer", "text": "Most major Chinese cities have airport express trains (fastest, ¥25-35). Metro is cheapest (¥5-10). Didi (Chinese Uber) is convenient if you have the app set up. Avoid unlicensed taxis at the airport." } },
                    { "@type": "Question", "name": "Do I need a VPN in China?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Google, Facebook, Instagram, WhatsApp, and most Western apps are blocked in China. Download a VPN before arriving. Popular options include ExpressVPN, NordVPN, and Astrill. Set it up before you land." } },
                    { "@type": "Question", "name": "What are the must-try foods in China?", "acceptedAnswer": { "@type": "Answer", "text": "Must-try dishes include Peking Duck (Beijing), Xiaolongbao soup dumplings (Shanghai), Mapo Tofu and Hot Pot (Chengdu), Biangbiang Noodles (Xi'an), and Dim Sum (Guangzhou). Our food guide covers 150+ dishes across 8 regions." } }
                  ]
                }
              ]
            })
          }}
        />
        <Providers>
          <NetworkStatus />
          <PushNotificationPrompt />
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
