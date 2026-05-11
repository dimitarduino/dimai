"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../_context/ThemeContext";
import React from "react";

export default function AboutPage() : React.JSX.Element {
  // const { isDark, toggleTheme } = useTheme() ?? { isDark: false, toggleTheme: () => {} };
  const isDark = false;
  const toggleTheme = () => {};
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky px-3 top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl tracking-tight">
              <Image src={`/logo.png`} loading="eager" width={120} height={20} alt="DimnAI Logo" />
            </Link>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="bg-transparent dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer p-2 rounded-full"
            >
              {isDark ? (
                <Moon size={20} className="text-white" />
              ) : (
                <Sun size={20} className="text-black" />
              )}
            </button>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">About Dimn AI</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Service</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Dimn AI</strong> is an all-in-one AI toolkit platform operated by <strong>DIMITAR KUZMANOVSKI</strong>, designed for creators, professionals, and businesses seeking powerful artificial intelligence tools in one integrated platform. Our service provides access to cutting-edge AI technology for content creation, image processing, video generation, and conversational AI capabilities.
            </p>
            <p className="text-muted-foreground">
              We bring together the most powerful AI tools available, making it easy for users to create professional-quality content without needing multiple subscriptions or complex workflows. Whether you're a content creator, marketer, designer, or business owner, Dimn AI provides the tools you need to bring your creative vision to life.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Product Features & Deliverables</h2>
            <p className="text-muted-foreground mb-4">
              When you subscribe to Dimn AI or purchase credits, you receive access to our comprehensive suite of AI-powered tools and services:
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">AI-Powered Video Generation</h3>
                <p className="text-muted-foreground">
                  Create and edit videos using text prompts or image inputs. Generate professional-quality video content for social media, marketing, or personal projects.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Image Upscaling & Enhancement</h3>
                <p className="text-muted-foreground">
                  Increase image resolution and improve image quality using advanced AI technology. Transform low-resolution images into high-quality, detailed visuals.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Background Removal</h3>
                <p className="text-muted-foreground">
                  Automatically remove backgrounds from images with precision. Perfect for product photography, portraits, and graphic design projects.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Image Editing</h3>
                <p className="text-muted-foreground">
                  AI-powered image modification, expansion, and transformation based on natural language prompts. Edit and enhance your images with simple text descriptions.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Face Swapping</h3>
                <p className="text-muted-foreground">
                  Advanced face swapping technology for images and videos. Create fun and creative content with realistic face replacement capabilities.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Emoji Generation</h3>
                <p className="text-muted-foreground">
                  Create custom emojis and animated expressions. Design unique emojis for your brand, project, or personal use.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Video Dubbing & Translation</h3>
                <p className="text-muted-foreground">
                  Translate and dub videos into multiple languages using AI voice synthesis. Reach global audiences with natural-sounding voiceovers.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Image-to-Video Conversion</h3>
                <p className="text-muted-foreground">
                  Transform static images into dynamic video content. Bring your photos to life with AI-powered animation.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">AI Chat & Conversation</h3>
                <p className="text-muted-foreground">
                  Advanced conversational AI with multiple model options for various use cases. Get intelligent assistance, content generation, and problem-solving capabilities.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Text-to-Speech</h3>
                <p className="text-muted-foreground">
                  Convert text to natural-sounding speech in multiple voices and languages. Perfect for narration, voiceovers, and accessibility.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Audio Extraction</h3>
                <p className="text-muted-foreground">
                  Extract audio from video files. Get high-quality audio tracks from your video content for editing or standalone use.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-primary">Caption Generation</h3>
                <p className="text-muted-foreground">
                  Automatically generate captions for video content. Make your videos accessible and engaging with AI-generated subtitles.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What You Receive</h2>
            <p className="text-muted-foreground mb-4">
              Upon subscription or credit purchase, you receive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Immediate Access:</strong> Full access to all available AI tools and features within your plan tier</li>
              <li><strong>Credit Allocation:</strong> A specified number of credits (depending on your plan) that can be used across all services</li>
              <li><strong>Download Rights:</strong> Generated content that you can download, use, and in some cases, license commercially (based on your subscription plan)</li>
              <li><strong>Platform Updates:</strong> Ongoing access to platform updates and new features as they are released</li>
              <li><strong>Content Storage:</strong> Storage for your generated content within reasonable limits based on your plan</li>
              <li><strong>Priority Support:</strong> Access to customer support with response times based on your subscription tier</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Who We Serve</h2>
            <p className="text-muted-foreground mb-4">
              Dimn AI is designed for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Content creators and social media managers</li>
              <li>Marketing professionals and agencies</li>
              <li>Graphic designers and artists</li>
              <li>Video producers and editors</li>
              <li>Businesses looking to enhance their content creation workflows</li>
              <li>Anyone seeking professional AI tools in an easy-to-use platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Service Provider:</strong> <strong>DIMITAR KUZMANOVSKI</strong><br />
              Operating as: <strong>Dimn AI</strong>
            </p>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our services or need assistance, please contact us:
            </p>
            <p className="text-muted-foreground">
              Email: support@dimnai.com<br />
              Website: <Link href="/" className="text-primary hover:underline">www.dimnai.com</Link>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src={`/logo.png`} loading="eager" width={100} height={20} alt="DimnAI Logo" />
              <span className="text-sm text-muted-foreground">© 2025 Dimn AI. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/refund" className="text-muted-foreground hover:text-foreground">
                Refund Policy
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
