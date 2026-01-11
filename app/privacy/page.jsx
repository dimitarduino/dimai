"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../_context/ThemeContext";

export default function PrivacyPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky px-3 top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl tracking-tight">
              <Image src={`/logo.png`} width={120} height={20} alt="DimnAI Logo" />
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
              className="text-sm font-medium text-foreground"
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Dimn AI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI toolkit platform and services.
            </p>
            <p className="text-muted-foreground">
              By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Account Information:</strong> Name, email address, profile picture, and authentication credentials</li>
              <li><strong>Content:</strong> Images, videos, text, and other content you upload or generate using our Service</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through third-party payment processors)</li>
              <li><strong>Communications:</strong> Messages, feedback, and support requests you send to us</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">When you use our Service, we automatically collect certain information:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Usage Data:</strong> How you interact with the Service, features used, and time spent</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, and IP address</li>
              <li><strong>Log Data:</strong> Server logs, error reports, and performance data</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to track activity and hold certain information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Third-Party Authentication</h3>
            <p className="text-muted-foreground">
              We use Clerk for authentication. When you sign in through Clerk, we receive your email address, name, and profile picture. Please review Clerk's privacy policy for information about how they handle your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the collected information for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>To provide, maintain, and improve our Service</li>
              <li>To process transactions and manage your account</li>
              <li>To process your content through our AI models and generate requested outputs</li>
              <li>To communicate with you about your account, updates, and customer support</li>
              <li>To send promotional materials (with your consent) and important notices</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
              <li>To train and improve our AI models using anonymized and aggregated data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Processing and AI Models</h2>
            <p className="text-muted-foreground mb-4">
              When you use our AI tools, your content is processed through various AI models and services. We may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Store your content temporarily to process your requests</li>
              <li>Use third-party AI services (such as OpenAI, Google, Hugging Face, Replicate) to process your content</li>
              <li>Use anonymized, aggregated data to improve our AI models and services</li>
              <li>Retain generated content in your account for your access and convenience</li>
            </ul>
            <p className="text-muted-foreground">
              We do not use your personal content to train AI models without your explicit consent. Any data used for model improvement is anonymized and aggregated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share your information only in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Service Providers</h3>
            <p className="text-muted-foreground mb-4">
              We share information with third-party service providers who perform services on our behalf, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Cloud hosting and storage providers</li>
              <li>Payment processors</li>
              <li>AI model providers and APIs</li>
              <li>Analytics and monitoring services</li>
              <li>Email and communication services</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Legal Requirements</h3>
            <p className="text-muted-foreground mb-4">
              We may disclose your information if required by law or in response to valid requests by public authorities.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Business Transfers</h3>
            <p className="text-muted-foreground">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            <p className="text-muted-foreground">
              We use encryption, secure authentication, and regular security assessments to safeguard your data. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. Specifically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Account information is retained while your account is active</li>
              <li>Generated content is stored in your account until you delete it</li>
              <li>We may retain certain information after account deletion as required by law or for legitimate business purposes</li>
              <li>Log data and analytics are typically retained for up to 12 months</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Cookie Preferences:</strong> Manage cookie settings through your browser</li>
            </ul>
            <p className="text-muted-foreground">
              To exercise these rights, please contact us at support@dimnai.com. We will respond to your request within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives adequate protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. California Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Right to know what personal information is collected, used, and shared</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. GDPR Rights (EU Users)</h2>
            <p className="text-muted-foreground mb-4">
              If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Right to access, rectify, or erase your personal data</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and store certain information. Types of cookies we use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
              <Image src={`/logo.png`} width={100} height={20} alt="DimnAI Logo" />
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
