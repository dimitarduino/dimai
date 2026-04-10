import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./_context/ThemeContext";
import ClerkWithThemeProvider from "./ClerkProvider";
import Script from "next/script";


const outfit = Outfit({
  subsets: ["latin"],
});


function ClerkWrapper({ children }) {
  const { isDark } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : neobrutalism,
        variables: { colorPrimary: "#059485" },
      }}
    >
      {children}
    </ClerkProvider>
  );
}


const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dimnai.com";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "Dimn AI | #1 Faceless Video & Viral Shorts Generator",
  description: "Automate your faceless channel and generate viral TikToks, YouTube Shorts, and Reels in minutes. Advanced AI Video Dubbing, Image Upscaler, and Background Remover.",
  keywords: [
    "AI Video Generator", "Faceless TikTok Generator", "YouTube Shorts AI", 
    "Viral Video Creator", "Faceless Channel", "AI Video Dubbing", 
    "Make Money with AI", "Image Upscaler", "Background Remover", "AI Chat", 
    "Content Automation"
  ],
  openGraph: {
    title: "Dimn AI | Generate Viral Faceless Content",
    description: "The ultimate AI toolkit to automate your online income. Generate viral TikToks & Shorts, upscale images, and dub videos effortlessly.",
    url: baseUrl,
    siteName: "Dimn AI",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Dimn AI Toolkit for Creators",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dimn AI | Ultimate Faceless AI Toolkit",
    description: "Generate viral TikToks and Shorts in seconds. Start automating your faceless brand today.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P3GN4RXL6E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P3GN4RXL6E');
          `}
        </Script>
      </head>
      <body
        className={`${outfit.className}`}
      >
        <ThemeProvider>
          <ClerkWithThemeProvider>

            <Provider>
              {children}
            </Provider>

            <Toaster />
          </ClerkWithThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
