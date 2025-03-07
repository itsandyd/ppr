/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  output: "standalone",
  experimental: {
    serverActions: true,
    runtime: "nodejs",
  },
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io",
      "res.cloudinary.com",
      "replicate.com",
      "replicate.delivery",
      "pbxt.replicate.delivery",
      "oaidalleapiprodscus.blob.core.windows.net",
      "googleusercontent.com",
      "mqxcvzhanbisvevjcnwu.supabase.co",
      "example.com",
      "i.scdn.co",
      "i.scdn.co",
      "static.kvraudio.com",
      "www.audiority.com",
      "www.audiority.com",
      "img.clerk.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
