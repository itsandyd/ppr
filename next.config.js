/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
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
    ],
  },
};

module.exports = nextConfig;
