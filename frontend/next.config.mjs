/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-storage-domain.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // For Cloudinary images
      }
    ],
    unoptimized: true // Add this if you want to skip image optimization
  },
};

export default nextConfig;





