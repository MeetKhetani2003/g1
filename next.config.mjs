/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/?login=true",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
