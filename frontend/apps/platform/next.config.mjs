/** @type {import('next').NextConfig} */
const mintlifySubdomain = process.env.MINTLIFY_SUBDOMAIN?.trim();
const mintlifyHostsSuffix = mintlifySubdomain
  ? ' https://*.mintlify.dev https://*.mintlify.app'
  : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@core3/ui-components'],
  serverExternalPackages: ['next-seo'],
  turbopack: {},
  ...(mintlifySubdomain
    ? {
        async rewrites() {
          const base = `https://${mintlifySubdomain}.mintlify.dev`;
          return [
            { source: '/docs', destination: `${base}/docs` },
            { source: '/docs/:path*', destination: `${base}/docs/:path*` },
          ];
        },
      }
    : {}),
  webpack(config) {
    // Configure SVGR for ?react imports
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /react/,
      use: ['@svgr/webpack'],
    });

    // Handle regular SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: { not: [/react/] },
      type: 'asset/resource',
    });
    
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net" +
              mintlifyHostsSuffix,
              "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com" +
              mintlifyHostsSuffix,
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:" + mintlifyHostsSuffix,
              "connect-src 'self' https://pro-api.coingecko.com https://api-landing.core3.io https://hcaptcha.com https://*.hcaptcha.com https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://horizon.stellar.org https://horizon-testnet.stellar.org https://api.openai.com https://assets.unicorn.studio https://*.unicorn.studio" +
              mintlifyHostsSuffix,
              "frame-src https://hcaptcha.com https://*.hcaptcha.com https://assets.unicorn.studio https://unicorn.studio https://*.unicorn.studio" +
              mintlifyHostsSuffix,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.core3.io',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.staticimg.com',
      },
      {
        protocol: 'https',
        hostname: 'x4t.com',
      },
      {
        protocol: 'https',
        hostname: 'btxpro.com',
      },
    ],
  },
};

export default nextConfig;
