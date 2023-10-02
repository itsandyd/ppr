/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io",
      "res.cloudinary.com",
      "replicate.com",
      "pbxt.replicate.delivery",
    ],
  },
};

module.exports = nextConfig;
