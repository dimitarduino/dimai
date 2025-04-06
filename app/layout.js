import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./_context/ThemeContext";
import ClerkWithThemeProvider from "./ClerkProvider";


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


export const metadata = {
  title: "Dimn AI | Generate AI Videos, Upscale Images, Remove Background, Dubbing Videos",
  description: "Create stunning AI-generated videos, upscale images, remove backgrounds, and dub videos effortlessly with Dimn AI. Transform your content with cutting-edge AI tools!",
  icons: {
    icon: "/favicon.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

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
