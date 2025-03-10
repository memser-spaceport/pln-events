module.exports = {
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
