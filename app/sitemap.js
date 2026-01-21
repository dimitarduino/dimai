const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Next.js App Router sitemap route
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#sitemaps
 */
export default function sitemap() {
  /** Core marketing / public pages to index */
  const staticRoutes = [
    "/",
    "/about",
    "/pricing",
    "/support",
    "/privacy",
    "/terms",
    "/refund",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}

