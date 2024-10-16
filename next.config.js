/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minifier
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig