import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";


const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Dim AI | Generate AI Videos, Upscale Images, Remove Background, Dubbing Videos",
  description: "Create stunning AI-generated videos, upscale images, remove backgrounds, and dub videos effortlessly with Dim AI. Transform your content with cutting-edge AI tools!",
  icons: {
    icon: "/favicon.png",
  },
};
export default function RootLayout({ children }) {

  return (
    <ClerkProvider appearance={{ elements: { avatarBox: "w-20 h-20" } }}>
      <html lang="en">
        <body
          className={`${outfit.className}`}
        >
          <Provider>
            {children}
          </Provider>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
