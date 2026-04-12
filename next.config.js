/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for service worker
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\..*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // 移除 X-Powered-By 头
  compress: true, // 启用 Gzip/Brotli 压缩
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'radix-ui', '@supabase/supabase-js', 'next-auth'],
    webpackBuildWorker: true,
    optimizeCss: true,
  },
  // 启用 React Server Components 优化
  serverExternalPackages: ['bcryptjs'],
  // Webpack 优化
  webpack: (config, { isServer, dev, isClient }) => {
    if (!isServer && !dev) {
      config.optimization.minimize = true;
      
      // 更细粒度的代码分割
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 分离 React 核心包
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          // 分离 Next.js 和 next-auth
          next: {
            test: /[\\/]node_modules[\\/](next|next-auth)[\\/]/,
            name: 'next',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // 分离 Supabase
          supabase: {
            test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // 分离 UI 组件库
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|radix-ui)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true,
          },
          // 分离 Sentry
          sentry: {
            test: /[\\/]node_modules[\\/](@sentry)[\\/]/,
            name: 'sentry',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // 通用代码
          common: {
            minChunks: 2,
            name: 'common',
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          // 默认 vendor
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 1,
            reuseExistingChunk: true,
          },
        },
      };
      
      // 优化 chunk 大小
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      
      // 移除未使用的代码
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // 压缩配置
      if (config.optimization.minimizer) {
        for (const minimizer of config.optimization.minimizer) {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              compress: {
                dead_code: true,
                unused: true,
                drop_console: true,
                drop_debugger: true,
              },
            };
          }
        }
      }
    }
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withSentryConfig(withPWA(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "china-landing-ai-helper",
  project: "pwa",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",

  // Hides the source map upload process from the build output
  hideSourceMaps: true,

  // Disable server-side auto-instrumentation for edge runtime
  disableServerWebpackPlugin: process.env.DISABLE_SENTRY_SERVER_PLUGIN === 'true',

  // Disable client-side auto-instrumentation
  disableClientWebpackPlugin: process.env.DISABLE_SENTRY_CLIENT_PLUGIN === 'true',
}));
