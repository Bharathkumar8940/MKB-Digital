/** @type {import('next').NextStyle}.Config */
const nextConfig = {
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,
  basePath: process.env.GITHUB_ACTIONS ? '/MKB-Digital' : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
