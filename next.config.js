const nextConfig = {
  env: {
    REVALIDATE_TOKEN: process.env.REVALIDATE_TOKEN,
    AUTH_API_BASE_RU: process.env.AUTH_API_BASE_URL,
  },
  async redirects() {
    return[
      {
        source: "/",
        destination: "/index",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ]

  }
};