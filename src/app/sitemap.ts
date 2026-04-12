import { MetadataRoute } from 'next';

/**
 * China Landing AI Helper - Sitemap
 * 动态生成网站地图，支持 SEO 优化
 * 最后更新：2026-04-12
 */

// 基础 URL - 生产环境
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-ai-helper.com';

// 静态页面路由
const STATIC_ROUTES = [
  {
    path: '/',
    priority: 1.0,
    changeFrequency: 'daily' as const,
    description: 'China Landing AI Helper - AI 驱动的中国旅行规划助手',
  },
  {
    path: '/install-guide',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    description: '安装指南 - 如何将 China AI Helper 添加到您的设备',
  },
  {
    path: '/profile',
    priority: 0.7,
    changeFrequency: 'weekly' as const,
    description: '用户个人资料和设置',
  },
  {
    path: '/compare',
    priority: 0.7,
    changeFrequency: 'weekly' as const,
    description: '旅行方案对比工具',
  },
  {
    path: '/offline',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
    description: '离线页面 - 无网络连接时的提示',
  },
  // 法律页面
  {
    path: '/legal/privacy',
    priority: 0.6,
    changeFrequency: 'yearly' as const,
    description: '隐私政策',
  },
  {
    path: '/legal/terms',
    priority: 0.6,
    changeFrequency: 'yearly' as const,
    description: '服务条款',
  },
  {
    path: '/legal/cookies',
    priority: 0.6,
    changeFrequency: 'yearly' as const,
    description: 'Cookie 政策',
  },
  // 认证页面
  {
    path: '/auth/signin',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
    description: '登录',
  },
  {
    path: '/auth/signup',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
    description: '注册账户',
  },
  {
    path: '/auth/verify-request',
    priority: 0.4,
    changeFrequency: 'monthly' as const,
    description: '验证请求',
  },
  {
    path: '/auth/error',
    priority: 0.3,
    changeFrequency: 'monthly' as const,
    description: '认证错误页面',
  },
];

// 中国热门旅行城市 - 用于生成目的地页面
const DESTINATIONS = [
  { slug: 'beijing', name: '北京', priority: 0.9 },
  { slug: 'shanghai', name: '上海', priority: 0.9 },
  { slug: 'xian', name: '西安', priority: 0.8 },
  { slug: 'chengdu', name: '成都', priority: 0.8 },
  { slug: 'guilin', name: '桂林', priority: 0.7 },
  { slug: 'hangzhou', name: '杭州', priority: 0.7 },
];

/**
 * 生成网站地图
 * 包含所有静态页面和动态目的地页面
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 静态页面
  const staticPages = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 动态目的地页面
  const destinationPages = DESTINATIONS.map((dest) => ({
    url: `${BASE_URL}/destinations/${dest.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: dest.priority,
  }));

  // 城市行程页面
  const cityItineraryPages = DESTINATIONS.map((dest) => ({
    url: `${BASE_URL}/trips/${dest.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: dest.priority - 0.1,
  }));

  return [...staticPages, ...destinationPages, ...cityItineraryPages];
}
