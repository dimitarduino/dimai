import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
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
