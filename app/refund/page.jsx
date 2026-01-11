"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../_context/ThemeContext";

export default function RefundPage() {
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
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="text-muted-foreground mb-4">
              At Dimn AI, we strive to provide excellent service and ensure customer satisfaction. This Refund Policy outlines the terms and conditions under which refunds may be issued for our subscription services and credit purchases.
            </p>
            <p className="text-muted-foreground">
              By purchasing a subscription or credits from Dimn AI, you acknowledge that you have read, understood, and agree to this Refund Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Subscription Refunds</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Monthly Subscriptions</h3>
            <p className="text-muted-foreground mb-4">
              For monthly subscription plans, you may request a full refund within <strong>7 days</strong> of your initial purchase or upgrade. After this period, refunds are not available for the current billing cycle, but you may cancel your subscription to prevent future charges.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Annual Subscriptions</h3>
            <p className="text-muted-foreground mb-4">
              For annual subscription plans, you may request a full refund within <strong>30 days</strong> of your initial purchase. After 30 days, refunds will be prorated based on the remaining unused portion of your subscription period.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Subscription Cancellation</h3>
            <p className="text-muted-foreground mb-4">
              You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. You will continue to have access to paid features until the end of the billing cycle, but no refund will be issued for the current period.
            </p>
            <p className="text-muted-foreground">
              To cancel your subscription, please visit your account settings or contact our support team at support@dimnai.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Credit Purchases</h2>
            <p className="text-muted-foreground mb-4">
              Credits are non-refundable once purchased and used. However, we understand that exceptional circumstances may arise:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li><strong>Unused Credits:</strong> If you have unused credits and request a refund within 7 days of purchase, we may issue a refund at our discretion.</li>
              <li><strong>Technical Issues:</strong> If you experience technical issues that prevent you from using purchased credits, please contact support. We will investigate and may issue a refund or credit replacement.</li>
              <li><strong>Service Outages:</strong> If our Service is unavailable for an extended period (more than 48 hours), we may offer credit extensions or refunds on a case-by-case basis.</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Note:</strong> Credits do not expire, so you can use them at any time. We encourage you to use your credits rather than request refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Refund Eligibility</h2>
            <p className="text-muted-foreground mb-4">To be eligible for a refund, the following conditions must be met:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>The refund request is made within the applicable time period (7 days for monthly, 30 days for annual)</li>
              <li>The request is for an initial purchase or upgrade, not a renewal</li>
              <li>You have not violated our Terms of Service</li>
              <li>The refund is not for credits that have been used</li>
              <li>You provide a valid reason for the refund request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Non-Refundable Items</h2>
            <p className="text-muted-foreground mb-4">The following are not eligible for refunds:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Used credits or credits that have been consumed</li>
              <li>Subscription renewals (you must cancel before renewal to avoid charges)</li>
              <li>Free trial periods (no charge, therefore no refund)</li>
              <li>Accounts that have been suspended or terminated for violation of Terms of Service</li>
              <li>Refund requests made after the applicable refund period</li>
              <li>Third-party fees (payment processing fees, bank fees, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. How to Request a Refund</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Contact our support team at <strong>support@dimnai.com</strong> with the subject line "Refund Request"</li>
              <li>Include your account email address and the transaction details (date, amount, subscription plan)</li>
              <li>Provide a brief explanation for your refund request</li>
              <li>Allow 5-7 business days for us to review and process your request</li>
            </ol>
            <p className="text-muted-foreground">
              We reserve the right to request additional information to verify your identity and process your refund request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Refund Processing</h2>
            <p className="text-muted-foreground mb-4">
              Once your refund request is approved:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Refunds will be processed within <strong>5-10 business days</strong> after approval</li>
              <li>Refunds will be issued to the original payment method used for the purchase</li>
              <li>If the original payment method is no longer available, we will work with you to find an alternative refund method</li>
              <li>Your subscription will be cancelled immediately upon refund approval</li>
              <li>You will lose access to paid features immediately upon refund processing</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Note:</strong> The time it takes for the refund to appear in your account depends on your payment provider. Credit card refunds typically appear within 5-10 business days, while PayPal refunds may appear sooner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Chargebacks and Disputes</h2>
            <p className="text-muted-foreground mb-4">
              If you initiate a chargeback or dispute with your payment provider instead of contacting us first, we reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Immediately suspend or terminate your account</li>
              <li>Dispute the chargeback with your payment provider</li>
              <li>Provide evidence of service delivery and Terms of Service acceptance</li>
            </ul>
            <p className="text-muted-foreground">
              We strongly encourage you to contact us directly at support@dimnai.com before initiating a chargeback, as we can often resolve issues more quickly and amicably.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Special Circumstances</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">9.1 Service Downtime</h3>
            <p className="text-muted-foreground mb-4">
              If our Service experiences extended downtime (more than 48 consecutive hours), we may offer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Credit extensions to affected users</li>
              <li>Prorated refunds for subscription time lost</li>
              <li>Additional credits as compensation</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.2 Billing Errors</h3>
            <p className="text-muted-foreground mb-4">
              If you are charged incorrectly due to a billing error on our part, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Immediately issue a full refund for the incorrect charge</li>
              <li>Correct the billing issue to prevent future errors</li>
              <li>Provide compensation if the error caused significant inconvenience</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.3 Duplicate Charges</h3>
            <p className="text-muted-foreground">
              If you are charged multiple times for the same subscription or purchase, please contact us immediately. We will refund all duplicate charges and ensure the issue is resolved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Pro-Rated Refunds</h2>
            <p className="text-muted-foreground mb-4">
              For annual subscriptions refunded after the initial 30-day period, refunds will be calculated as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>Total amount paid minus the prorated amount for the time you used the Service</li>
              <li>Any applicable processing fees may be deducted</li>
              <li>Refund amount = (Remaining days / Total days) × Original payment amount</li>
            </ul>
            <p className="text-muted-foreground">
              Example: If you paid $190 for an annual plan and request a refund after 6 months, you would receive a refund for the remaining 6 months (approximately $95).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Refund Denials</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to deny refund requests in the following situations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              <li>The refund request is made outside the applicable refund period</li>
              <li>You have violated our Terms of Service</li>
              <li>You have used a significant portion of the Service (more than 50% of credits or subscription period)</li>
              <li>The request appears to be fraudulent or abusive</li>
              <li>You have previously received multiple refunds for similar reasons</li>
            </ul>
            <p className="text-muted-foreground">
              If your refund request is denied, we will provide an explanation and may offer alternative solutions, such as account credits or extended subscription time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on this page. We will notify users of material changes via email or through the Service. Your continued use of the Service after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Refund Policy or need to request a refund, please contact us:
            </p>
            <p className="text-muted-foreground">
              Email: support@dimnai.com<br />
              Subject: Refund Request<br />
              Website: <Link href="/" className="text-primary hover:underline">www.dimnai.com</Link>
            </p>
            <p className="text-muted-foreground mt-4">
              We aim to respond to all refund requests within 24-48 hours during business days.
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
