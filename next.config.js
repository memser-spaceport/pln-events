/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 deprecates images.domains. Same hosts (any protocol), as remotePatterns.
    remotePatterns: (process.env.ALLOWED_IMAGE_DOMAINS || "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
      .map((hostname) => ({ hostname })),
  },
  trailingSlash: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  // Every value in `env` is inlined into the client JavaScript at build time.
  // Never add a token or secret here: server code reads process.env at runtime.
  env: {
    WEB_API_BASE_URL: process.env.WEB_API_BASE_URL,
    SUBMIT_EVENT_URL: process.env.SUBMIT_EVENT_URL,
    REFRESH_DISABLED_EVENTS: process.env.REFRESH_DISABLED_EVENTS,
    REFRESH_ENABLED_EVENTS: process.env.REFRESH_ENABLED_EVENTS,
    EVENT_AGENDA_REFRESH_URL: process.env.EVENT_AGENDA_REFRESH_URL,
    ORIGIN_DOMAIN: process.env.ORIGIN_DOMAIN,
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
        destination: "/calendar",
        permanent: false,
      },
      {
        source: "/program",
        destination: "/calendar",
        permanent: false,
      },
      {
        source: "/embed/program",
        destination: "/embed/calendar",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
