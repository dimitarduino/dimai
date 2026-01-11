"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "../_context/ThemeContext";

export default function PricingPage() {
  const { isDark, toggleTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out our AI tools",
      features: [
        "30 credits to start",
        "Access to all AI tools",
        "Generate Shorts",
        "Upscale Images",
        "Remove Background",
        "Expand Images",
        "Face Swap",
        "Emoji Generator",
        "Video Dubbing",
        "Image to Video",
        "Edit Images",
        "AI Chat",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 190 },
      description: "For creators and professionals",
      features: [
        "500 credits per month",
        "All Free features",
        "Priority processing",
        "Higher quality outputs",
        "Advanced AI models",
        "Extended video length",
        "Commercial license",
        "Email support",
        "Early access to new features",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: { monthly: 99, yearly: 990 },
      description: "For teams and businesses",
      features: [
        "Unlimited credits",
        "All Pro features",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Custom training",
        "On-premise deployment options",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

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
              className="text-sm font-medium text-foreground"
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

      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. All plans include access to our full suite of AI tools.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 bg-primary rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : ""
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/sign-up"}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What are credits?</h3>
              <p className="text-muted-foreground">
                Credits are used to generate content using our AI tools. Each operation (image generation, video processing, etc.) consumes a certain number of credits based on complexity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Do unused credits roll over?</h3>
              <p className="text-muted-foreground">
                Unused credits from paid plans do not roll over to the next billing cycle. Free plan credits are one-time only.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and PayPal. Enterprise customers can also pay via invoice.
              </p>
            </div>
          </div>
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
