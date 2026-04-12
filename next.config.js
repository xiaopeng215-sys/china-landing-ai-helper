/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// next-intl 配置
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

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
      
      // 更细粒度的代码分割 - P1 优化
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000, // 最小 chunk 大小 20KB
        maxSize: 244000, // 最大 chunk 大小 244KB
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // 分离 React 核心包 - 最高优先级
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-is)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 50,
            reuseExistingChunk: true,
            enforce: true,
          },
          // 分离 Next.js 核心
          next: {
            test: /[\\/]node_modules[\\/](next|next-intl)[\\/]/,
            name: 'next',
            chunks: 'all',
            priority: 45,
            reuseExistingChunk: true,
          },
          // 分离 next-auth 相关
          auth: {
            test: /[\\/]node_modules[\\/](next-auth|@auth|@supabase)[\\/]/,
            name: 'auth',
            chunks: 'all',
            priority: 40,
            reuseExistingChunk: true,
          },
          // 分离 Sentry - 独立打包便于缓存
          sentry: {
            test: /[\\/]node_modules[\\/](@sentry)[\\/]/,
            name: 'sentry',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          // 分离 lucide-react 图标库
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          // 分离其他 UI 组件
          ui: {
            test: /[\\/]node_modules[\\/](radix-ui|@radix-ui)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // 分离 workbox 和 PWA 相关
          pwa: {
            test: /[\\/]node_modules[\\/](workbox|next-pwa|@upstash)[\\/]/,
            name: 'pwa',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // 通用代码 - 被 2 个以上模块引用
          common: {
            minChunks: 2,
            name: 'common',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true,
          },
          // 默认 vendor - 兜底分组
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // 默认 fallback
          default: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
      
      // 优化 chunk 大小 - 使用确定性 ID 便于长期缓存
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      config.optimization.nodeEnv = 'production';
      
      // 移除未使用的代码 - Tree Shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.concatenateModules = true;
      
      // 移除空的 chunk
      config.optimization.removeEmptyChunks = true;
      config.optimization.mergeDuplicateChunks = true;
      
      // 压缩配置优化
      if (config.optimization.minimizer) {
        for (const minimizer of config.optimization.minimizer) {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              compress: {
                dead_code: true,
                unused: true,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.debug', 'console.info'],
                passes: 2, // 多遍压缩优化
                pure_getters: true,
                keep_fargs: false,
              },
              mangle: {
                safari10: true,
                reserved: ['exports', '_stream_readable'],
              },
              output: {
                comments: false,
                ascii_only: true,
              },
            };
            minimizer.options.extractComments = false;
          }
        }
      }
      
      // 限制 chunk 数量，避免过多小文件
      config.optimization.runtimeChunk = {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      };
    }
    
    // 生产环境启用模块并化
    if (!dev) {
      config.performance = {
        hints: 'warning',
        maxAssetSize: 244000, // 244KB
        maxEntrypointSize: 512000, // 512KB
      };
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
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.minimaxi.com https://*.supabase.co https://*.upstash.io https://*.ingest.us.sentry.io https://dashscope.aliyuncs.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
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
