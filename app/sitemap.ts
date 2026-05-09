const baseUrl : string =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dimnai.com";

export default function sitemap() {
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

