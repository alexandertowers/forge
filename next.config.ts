/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is important for Vercel deployments
  // It ensures static assets are correctly served
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // Optional: Add additional configuration for your project
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;