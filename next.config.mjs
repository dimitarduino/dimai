import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is the important one:
  output: 'standalone',
  /** Native deps that should not be bundled on the server */
  serverExternalPackages: [
    "canvas",
    "@google-cloud/text-to-speech",
    "google-gax",
    "@grpc/grpc-js",
    "@grpc/proto-loader",
    "protobufjs",
  ],
  images: {
    unoptimized: true,
    qualities: [40, 55, 65, 75, 82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "/**",
      },
    ],
    /** Seconds the image optimizer caches remote fetches; drives `Cache-Control` on `/_next/image` (30d). */
    minimumCacheTTL: 2592000,
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.dimnai.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://firebasestorage.googleapis.com https://replicate.delivery https://img.clerk.com; font-src 'self' data:; connect-src 'self' https://api.replicate.com https://api.openai.com https://clerk.dimnai.com https://*.clerk.accounts.dev https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://challenges.cloudflare.com; media-src 'self' https://cdn.pixabay.com https://incompetech.com https://firebasestorage.googleapis.com blob:;",
          },
        ],
      },
    ];
  },
  turbopack: {
    /** Avoid wrong workspace root when multiple lockfiles exist on the machine */
    root: __dirname,
    resolveAlias: {
      "@/ui": path.join(__dirname, "components/ui"),
      "@": __dirname,
      configs: path.join(__dirname, "configs"),
      app: path.join(__dirname, "app"),
    },
  },
  webpack: (config, { isServer }) => {
    /** Match tsconfig/jsconfig paths so Docker/webpack resolve the same imports as IDE */
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@/ui": path.resolve("./components/ui"),
      "@": path.resolve("./"),
      configs: path.resolve("./configs"),
      app: path.resolve("./app"),
    };

    // Ignore canvas module warnings (used by pdf-parse)
    config.ignoreWarnings = [{ module: /node_modules\/canvas/ }];

    // Mark canvas as external for server builds to prevent build errors
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("canvas");
    }

    return config;
  },
};

export default nextConfig;
