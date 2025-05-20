// my-firebase-app/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // Enable SWC's styled-components transform
  },
};

export default nextConfig;