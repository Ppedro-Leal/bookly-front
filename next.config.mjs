/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'parsefiles.back4app.com',
        port: '',
        pathname: '/**',
      },
     
    ],
  },
  
};


export default nextConfig;
