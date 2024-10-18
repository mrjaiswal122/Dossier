/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol:'https',
        hostname:'dossier-portfolio-builder.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;

