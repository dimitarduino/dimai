import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/about",
  "/pricing",
  "/privacy",
  "/terms",
  "/support",
  "/refund",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.png",
  "/api/process-video-job(.*)",
  "/api/get-video-script(.*)",
  "/api/generate-audio(.*)",
  "/api/generate-caption(.*)",
  "/api/generate-image(.*)",
  "/api/oauth/youtube/callback",
  "/api/oauth/tiktok/callback",
]);

export const proxy = clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  if (hostname.includes("dimnai.com")) {
    if (hostname.startsWith("www.")) {
      url.hostname = hostname.replace("www.", "").split(":")[0];
      url.port = "";
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }

    if (url.protocol === "http:") {
      url.protocol = "https:";
      url.port = "";
      return NextResponse.redirect(url, 301);
    }
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
