const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dimnai.com";

/**
 * Next.js App Router robots route
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#robots
 */
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

