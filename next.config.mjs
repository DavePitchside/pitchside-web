/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/football-stats-without-gps",
        destination: "/blog/track-football-stats-without-gps-vest",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', 
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
      },
      {
        protocol: 'https',
        hostname: 'pitchside.ai', 
      },
      {
        protocol: 'https',
        hostname: 'www.pitchside.ai',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Added to allow Firebase Storage images
      }
    ],
  },
};

export default nextConfig;