import { MetadataRoute } from 'next';

/**
 * China Landing AI Helper - Robots.txt 动态生成
 * 最后更新：2026-04-12
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-ai-helper.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/_next/',
          '/api/auth/',
          '/api/health/',
          '/*.sql$',
          '/*.log$',
          '/*.env$',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: '360Spider',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Sogou web spider',
        allow: '/',
        disallow: '/admin/',
      },
      // 社交媒体爬虫
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      // 阻止 SEO 工具爬虫
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
