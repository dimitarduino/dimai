import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@/ui": path.resolve("./components/ui"),
      "@": path.resolve("./"),
      configs: path.resolve("./configs"),
      app: path.resolve("./app"),
    };
    
    // Ignore canvas module warnings (used by pdf-parse)
    config.ignoreWarnings = [
      { module: /node_modules\/canvas/ },
    ];
    
    // Mark canvas as external for server builds to prevent build errors
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('canvas');
    }
    
    return config;
  },
};

export default nextConfig;