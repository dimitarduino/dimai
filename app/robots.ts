const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dimnai.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block internal / non-SEO routes
        disallow: [
          "/api/",
          "/app/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

