import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Silence Prisma "Can't reach database" during static generation
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}

export default nextConfig
