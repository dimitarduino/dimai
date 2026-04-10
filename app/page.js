"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Moon, Sun, Menu, ArrowRight, TrendingUp, Sparkles, 
  Video, Mic, ImageIcon, MessageSquare, Zap, PlayCircle, Star
} from "lucide-react";
import { useTheme } from "./_context/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    if (!!user) {
      // Optional: automatically redirect logged in users to app
      // router.push("/app");
    }
  }, [user]);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out our AI tools",
      features: [
        "30 credits to start",
        "Generate Shorts",
        "Upscale Images",
        "Remove Background",
        "Video Dubbing",
        "AI Chat",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 190 },
      description: "For creators scaling faceless channels",
      features: [
        "100 credits per month",
        "All Free features",
        "Priority processing",
        "Advanced AI models",
        "Extended video length",
        "Commercial license",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Agency",
      price: { monthly: 99, yearly: 990 },
      description: "For teams and businesses",
      features: [
        "650 credits per month",
        "All Pro features",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "Custom training",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky px-3 top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl tracking-tight">
              <Image src={`/logo.png`} width={120} height={20} alt="DimnAI Logo" />
            </Link>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="bg-transparent dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer p-3 rounded-full">
              {isDark ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-black" />}
            </button>
            {!!user ? (
              <Button onClick={() => router.push("/app")} className="rounded-md">
                Dashboard
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Button onClick={() => router.push("/sign-up")} className="rounded-md py-2 px-4 shadow-lg hover:shadow-primary/20 transition-all">
                  Sign Up Free
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="sr-only">Toggle menu</span>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
          {/* Animated Background Shapes */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none"
          />
          <motion.div 
            animate={{ y: [0, -50, 0], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"
          />
          <div className="container mx-auto px-4 md:px-6 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-6 max-w-4xl mx-auto"
            >
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20">
                <Sparkles className="w-4 h-4 mr-2 inline-block" /> The Ultimate AI Toolkit for Creators
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Automate Your Faceless Channel. <br className="hidden md:block" />
                <span className="text-primary">
                  Earn $10k+ Monthly.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mt-4">
                Generate viral TikToks, Shorts, and Reels in minutes without ever showing your face. Script, voice, and visuals—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push("/sign-up")}>
                    Start Creating Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full cursor-pointer" asChild>
                  <Link href="#pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
              <div className="pt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-red-400 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-xs text-black">+2k</div>
                </div>
                <p>Join 2,000+ creators making extra income</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Feature Focus */}
        <section className="w-full py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" /> Viral Potential
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Build a profitable faceless brand on autopilot</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Social media algorithms are rewarding consistent, high-quality faceless content. With DimnAI, you can churn out engaging stories, Reddit recaps, and motivational shorts at scale.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">Captivating AI scripts that hook viewers instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">Ultra-realistic AI voiceovers in multiple languages.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">Dynamic auto-captions and vivid AI b-roll generation.</span>
                  </li>
                </ul>
              </motion.div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-black flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/4g4QFcXdee4?autoplay=0"
                  title="DimnAI Demo YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Other Tools Grid */}
        <section id="features" className="w-full py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Beyond shorts, DimnAI provides a comprehensive suite of AI tools to refine, enhance, and scale your creative output.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Video, title: "Image to Video", desc: "Turn static Midjourney or AI images into engaging cinematic videos." },
                { icon: Mic, title: "Video Dubbing", desc: "Easily dub your content into 30+ languages keeping the original tone." },
                { icon: ImageIcon, title: "AI Image Upscaler", desc: "Enhance and up-res images to 4K quality with unmatched detail." },
                { icon: Sparkles, title: "Background Removal", desc: "Instantly remove backgrounds from any image or subject." },
                { icon: MessageSquare, title: "AI Chat Assistant", desc: "Brainstorm ideas, write SEO descriptions, and research niches." },
                { icon: Zap, title: "Face Swap", desc: "Seamlessly replace faces in images for dynamic and fun thumbnails." },
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <Card className="bg-card h-full hover:bg-accent/50 hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer flex flex-col">
                    <CardHeader className="text-left flex-none">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-left text-muted-foreground flex-1">
                      {tool.desc}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-24 bg-muted/50 border-y border-border/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Creators are making bank.</h2>
              <p className="text-lg text-muted-foreground">Hear from users who turned faceless accounts into full-time businesses.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah J.",
                  handle: "@historyuncovered",
                  income: "$12,400/mo",
                  text: "DimnAI completely changed my workflow. I built a faceless history channel and hit my first $10k month in just 90 days. The voiceovers are insanely realistic!"
                },
                {
                  name: "Mike T.",
                  handle: "@stoicmindset_ai",
                  income: "$8,500/mo",
                  text: "I used to spend 4 hours editing one TikTok. Now I generate an entire week's worth of content in 30 minutes. The auto-captions and b-roll are a game changer."
                },
                {
                  name: "Elena R.",
                  handle: "@facts_daily",
                  income: "$15,200/mo",
                  text: "Managing 3 different niche pages is only possible because of DimnAI. Producing shorts, translating them, and upscaling covers all in one dashboard is magic."
                }
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="relative h-full bg-background border-border/50 shadow-sm hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300 cursor-default flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex text-yellow-400">
                           {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                         </div>
                         <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
                           {t.income}
                         </Badge>
                      </div>
                      <CardTitle className="text-lg">{t.name}</CardTitle>
                      <CardDescription>{t.handle}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground italic flex-1">
                      "{t.text}"
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-24">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">Simple, Transparent Pricing</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Choose Your Plan</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Start for free and confidently scale your faceless empire.
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
                  <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                    Save 17%
                  </Badge>
                )}
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${plan.popular ? "border-primary shadow-xl md:scale-105 z-10" : "border-border/50"}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0 shadow-sm">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-extrabold tracking-tight">
                        ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-muted-foreground font-medium ml-1">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full h-12 text-lg cursor-pointer"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => router.push(plan.name === "Agency" ? "/support" : "/sign-up")}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="w-full py-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-1/2 -right-1/4 w-full h-full bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"
           />
           <div className="container mx-auto px-4 md:px-6 relative text-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to print money with AI?</h2>
             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
               Stop wasting hours editing. Start generating engaging faceless content today and build a sustainable online income.
             </p>
             <Button onClick={() => router.push("/sign-up")} size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                Create Your Free Account <Zap className="w-5 h-5 ml-2 fill-current" />
             </Button>
           </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src={`/logo.png`} width={100} height={20} alt="DimnAI Logo" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/support" className="text-muted-foreground hover:text-foreground">Support</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link href="/refund" className="text-muted-foreground hover:text-foreground">Refund Policy</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Dimn AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
