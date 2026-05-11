"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../_context/ThemeContext";

export default function TermsPage() : React.JSX.Element {
  const { isDark, toggleTheme } = useTheme();

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
              className="text-sm font-medium text-foreground"
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Dimn AI ("Service", "we", "us", or "our"), operated by <strong>DIMITAR KUZMANOVSKI</strong>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. About Dimn AI and Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Dimn AI</strong> is an all-in-one AI toolkit platform operated by <strong>DIMITAR KUZMANOVSKI</strong>, designed for creators, professionals, and businesses seeking powerful artificial intelligence tools in one integrated platform. Our service provides access to cutting-edge AI technology for content creation, image processing, video generation, and conversational AI capabilities.
            </p>
            <p className="text-muted-foreground mb-4">
              Dimn AI delivers a comprehensive suite of AI-powered tools and services that include, but are not limited to:
            </p>
            <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-3">Product Features & Deliverables Included with Purchase:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>AI-Powered Video Generation:</strong> Create and edit videos using text prompts or image inputs</li>
                <li><strong>Image Upscaling & Enhancement:</strong> Increase image resolution and improve image quality using AI technology</li>
                <li><strong>Background Removal:</strong> Automatically remove backgrounds from images with precision</li>
                <li><strong>Image Editing:</strong> AI-powered image modification, expansion, and transformation based on natural language prompts</li>
                <li><strong>Face Swapping:</strong> Advanced face swapping technology for images and videos</li>
                <li><strong>Emoji Generation:</strong> Create custom emojis and animated expressions</li>
                <li><strong>Video Dubbing & Translation:</strong> Translate and dub videos into multiple languages using AI voice synthesis</li>
                <li><strong>Image-to-Video Conversion:</strong> Transform static images into dynamic video content</li>
                <li><strong>AI Chat & Conversation:</strong> Advanced conversational AI with multiple model options for various use cases</li>
                <li><strong>Text-to-Speech:</strong> Convert text to natural-sounding speech in multiple voices and languages</li>
                <li><strong>Audio Extraction:</strong> Extract audio from video files</li>
                <li><strong>Caption Generation:</strong> Automatically generate captions for video content</li>
              </ul>
            </div>
            <p className="text-muted-foreground mb-4">
              <strong>Service Delivery:</strong> Upon subscription or credit purchase, you receive access to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Immediate access to all available AI tools and features within your plan tier</li>
              <li>A specified number of credits (depending on your plan) that can be used across all services</li>
              <li>Generated content that you can download, use, and in some cases, license commercially (based on your subscription plan)</li>
              <li>Ongoing access to platform updates and new features as they are released</li>
              <li>Storage for your generated content within reasonable limits based on your plan</li>
            </ul>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice. New features may be added or existing features may be updated to improve the service experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
            <p className="text-muted-foreground mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and identification</li>
              <li>Accept all responsibility for activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Credits and Subscription Plans</h2>
            <p className="text-muted-foreground mb-4">
              Our Service operates on a credit-based system. Credits are consumed when you use various AI tools and features. You understand that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Free accounts receive a limited number of credits to start</li>
              <li>Credits do not roll over between billing cycles for paid plans</li>
              <li>Unused credits from free accounts are one-time only</li>
              <li>Subscription fees are billed in advance on a monthly or yearly basis</li>
              <li>You can upgrade or downgrade your plan at any time</li>
              <li>Refunds are subject to our Refund Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Generate, upload, or share content that is illegal, harmful, threatening, abusive, or discriminatory</li>
              <li>Create deepfakes or misleading content intended to deceive</li>
              <li>Spam, harass, or harm other users</li>
              <li>Attempt to reverse engineer, decompile, or extract source code from the Service</li>
              <li>Use automated systems to access the Service in a manner that sends more requests than a human could reasonably produce</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The Service and its original content, features, and functionality are owned by <strong>DIMITAR KUZMANOVSKI</strong> operating as Dimn AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground mb-4">
              You retain ownership of content you create using the Service. However, by using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and process your content solely for the purpose of providing and improving the Service.
            </p>
            <p className="text-muted-foreground">
              Commercial use of generated content is permitted for Pro and Enterprise plan subscribers. Free plan users may use generated content for personal use only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Content and Data</h2>
            <p className="text-muted-foreground mb-4">
              You are solely responsible for the content you create, upload, or share through the Service. We do not claim ownership of your content, but you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>You have the right to upload and process the content you submit</li>
              <li>Your content does not violate any third-party rights</li>
              <li>We may store and process your content to provide the Service</li>
              <li>We may use anonymized, aggregated data to improve our AI models</li>
              <li>We reserve the right to remove content that violates these Terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Payment and Billing</h2>
            <p className="text-muted-foreground mb-4">
              For paid subscription plans:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>All fees are stated in USD unless otherwise specified</li>
              <li>Payments are processed securely through third-party payment processors</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You authorize us to charge your payment method for all fees</li>
              <li>We reserve the right to change our pricing with 30 days notice</li>
              <li>Price changes will not affect your current billing cycle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p className="text-muted-foreground mb-4">
              You may cancel your subscription at any time. Upon cancellation, you will continue to have access to paid features until the end of your current billing period. After cancellation, your account will revert to a free account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimers and Limitations of Liability</h2>
            <p className="text-muted-foreground mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. <strong>DIMITAR KUZMANOVSKI</strong> operating as Dimn AI does not warrant that the Service will be uninterrupted, error-free, or completely secure.
            </p>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, <strong>DIMITAR KUZMANOVSKI</strong> operating as Dimn AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless <strong>DIMITAR KUZMANOVSKI</strong> operating as Dimn AI, and its representatives, from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or relating to your use of the Service, your content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which <strong>DIMITAR KUZMANOVSKI</strong> operates Dimn AI, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Service Provider:</strong> <strong>DIMITAR KUZMANOVSKI</strong><br />
              Operating as: <strong>Dimn AI</strong>
            </p>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
        <div className="container mx-auto px-4 py-8">
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
