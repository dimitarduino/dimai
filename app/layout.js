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
  title: "Dimn AI | Generate AI Videos, Upscale Images, Remove Background, Dubbing Videos",
  description: "Create stunning AI-generated videos, upscale images, remove backgrounds, and dub videos effortlessly with Dimn AI. Transform your content with cutting-edge AI tools!",
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
