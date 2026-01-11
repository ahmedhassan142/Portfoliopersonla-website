/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Suppress Mongoose warnings
  //@ts-ignore
  // webpack: (config :any, { isServer  }) => {
  //   config.ignoreWarnings = [
  //     { module: /node_modules\/mongoose/ },
  //     { module: /node_modules\/resend/ },
  //     { message: /Duplicate schema index/ },
  //   ];
  //   return config;
  // },
  
  // Continue build even with warnings
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
}

module.exports = nextConfig