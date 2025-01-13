import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/uploads/**',
      },
    ],
    domains: ['localhost'],
  },
  reactStrictMode: true,
}

export default config
