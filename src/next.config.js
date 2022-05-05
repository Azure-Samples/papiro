/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  future: {
    webpack5: true
  },
  i18n,
  images: {
    domains: ['avatars.githubusercontent.com', 'localhost']
  }
};

module.exports = nextConfig;
