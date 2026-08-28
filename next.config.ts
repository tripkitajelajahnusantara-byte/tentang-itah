import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.serveousercontent.com',
    '*.lhr.life',
    'localhost:3000',
    '127.0.0.1:3000'
  ]
};

export default nextConfig;
