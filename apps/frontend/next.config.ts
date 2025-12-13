import type { NextConfig } from 'next';

// Regex pattern for vitest config files (defined at top level for performance)
const VITEST_CONFIG_REGEX = /vitest\.config\.(js|ts|mts)$/;

const nextConfig: NextConfig = {
  output: 'standalone',
  // Exclude test config files from being processed by Next.js
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // biome-ignore lint/suspicious/useAwait: _
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/:path*`,
      },
    ];
  },

  // biome-ignore lint/suspicious/useAwait: _
  async headers() {
    return [
      {
        source: '/(.*)',
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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Webpack config for production builds (when using --webpack flag)
  // Turbopack is used by default for dev, webpack for production builds
  webpack: (config) => {
    // Exclude Vitest config files from webpack processing during build
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: VITEST_CONFIG_REGEX,
      })
    );
    return config;
  },
};

export default nextConfig;
