import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid dev warnings when mixing http://localhost:3000 and http://127.0.0.1:3000
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc"
      },
      // Google OAuth profile photos (lh3.googleusercontent.com, etc.)
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
