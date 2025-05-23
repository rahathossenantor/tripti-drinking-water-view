/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
  //output: "export", 
};

export default nextConfig;
