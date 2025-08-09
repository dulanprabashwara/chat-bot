/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable, no need for experimental flag
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

module.exports = nextConfig;
