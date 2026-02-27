/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Agar aur hostnames add karne hain to yahan karein
      // {
      //   protocol: 'https',
      //   hostname: 'plus.unsplash.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
   env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_GROK_MODEL: process.env.NEXT_PUBLIC_GROK_MODEL,
  },
};

module.exports = nextConfig;