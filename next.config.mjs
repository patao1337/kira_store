/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed invalid fetchCache option for Next.js 15
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dthqgvtykoysreyryryy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
