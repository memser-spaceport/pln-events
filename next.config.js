/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.ALLOWED_IMAGE_DOMAINS
      && process.env.ALLOWED_IMAGE_DOMAINS.split(',')
  },
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  env: {
    WEB_API_BASE_URL: process.env.WEB_API_BASE_URL,
    WEB_API_TOKEN: process.env.WEB_API_TOKEN,
    EVENT_CLIENT_SECRET: process.env.EVENT_CLIENT_SECRET,
    SUBMIT_EVENT_URL: process.env.SUBMIT_EVENT_URL,
    REFRESH_DISABLED_EVENTS: process.env.REFRESH_DISABLED_EVENTS,
    REFRESH_ENABLED_EVENTS: process.env.REFRESH_ENABLED_EVENTS,
    EVENT_AGENDA_REFRESH_URL: process.env.EVENT_AGENDA_REFRESH_URL,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/program",
        permanent: false,
      }
    ];
  },
};

module.exports = nextConfig;
