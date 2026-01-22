import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/app(.*)']);

const isPublicRoute = createRouteMatcher(['/sign-in(.*)',
  '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  if (hostname.includes('dimnai.com')) {
    // Redirect www to non-www (canonical: dimnai.com)
    if (hostname.startsWith('www.')) {
      url.hostname = hostname.replace('www.', '');
      return NextResponse.redirect(url, 301); // 301 = permanent redirect for SEO
    }

    // // Redirect HTTP to HTTPS (if not already HTTPS)
    // if (url.protocol === 'http:') {
    //   url.protocol = 'https:';
    //   return NextResponse.redirect(url, 301);
    // }
  }

  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};