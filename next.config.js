/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    EMPR_TOKEN: process.env.EMPR_TOKEN,
  },
};

module.exports = nextConfig;
