/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_EMPR_TOKEN: process.env.NEXT_PUBLIC_EMPR_TOKEN,
    EMPR_TOKEN: process.env.EMPR_TOKEN,
  },
}

module.exports = nextConfig