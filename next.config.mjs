/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/football-stats-without-gps",
        destination: "/blog/track-football-stats-without-gps-vest",
        statusCode: 301,
      },
      {
        source: "/football-highlights-app",
        destination: "/technology",
        statusCode: 301,
      },
      {
        source: "/best-football-stats-apps",
        destination: "/tools",
        statusCode: 301,
      },
      {
        source: "/sunday-league-football",
        destination: "/tools-for-sunday-league-football",
        statusCode: 301,
      },
      {
        source: "/how-pitchside-ai-works",
        destination: "/technology/how-pitchside-ai-works",
        statusCode: 301,
      },
      {
        source: "/best-way-to-track-5aside-stats",
        destination: "/blog/what-stats-matter-in-5-a-side-football",
        statusCode: 301,
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
