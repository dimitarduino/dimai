"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Subscribers } from "configs/schema";
import { db } from "configs/db";
import { Button } from "@/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronRight, Mail, MapPin, Menu, Phone, Star } from "lucide-react"

export default function ComingSoon() {
  const router = useRouter();

  const [email, setEmail] = useState();
  const { user } = useUser();
  const [development, setDevelopment] = useState(false);
  useEffect(() => {
    // console.log(!!user)
    if (!!user) {
      router.push("/app"); // Redirect programmatically
    }
  }, [user]);
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-06-01").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dodajCekanje = async () => {
    if (!!email) {
      let vrednost = {
        email: email
      }
      const dodaeno = await db.insert(Subscribers).values(vrednost);

      if (!!dodaeno) {
        alert("You have been added to the waitlist. Thank you!");
        setEmail(``);
      }
    } else {
      alert("Please enter your email address to join the waitlist.");
    }

  }

  return (!user) ?
    (
      <div className="flex items-center justify-center min-h-screen flex-col">
        {/* Navigation */}
        <header className="sticky px-3 top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="font-bold text-xl tracking-tight">
                <Image src={`/logo.png`} width={120} height={20} />
              </Link>
            </div>
            <nav className="hidden gap-8">
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Button asChild className="rounded-md py-2 px-4">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden">
                <span className="sr-only">Toggle menu</span>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_50%)]"></div>
            <div className="container px-4 md:px-6 relative">
              <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
                <motion-div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 1 }}>
                  <Badge className="px-4 py-2 rounded-full text-sm" variant="secondary">
                    Launching Soon — Join the Waitlist - Alpha version
                  </Badge>
                </motion-div>
                <div className="space-y-4 max-w-3xl">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    All-in-One AI Toolkit for Creators & Professionals
                  </h1>
                  <h2 className="mx-auto max-w-[700px] text-muted-foreground mt-3 text-lg md:text-xl">
                    DimnAI brings powerful AI tools together—generate videos, upscale images, remove backgrounds, and more, all in one place.
                  </h2>
                </div>
                <motion.div
                  className="mt-1 flex space-x-2 p-2 bg-neutral-100 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 1 }}
                >
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Join the waitlist..."
                    className="p-3 rounded-lg text-black w-60 outline-none"
                  />
                  <button onClick={dodajCekanje} className="bg-primary cursor-pointer text-white px-5 py-3 rounded-lg font-semibold transition duration-300">
                    Join
                  </button>
                </motion.div>
                <div className="flex flex-col hidden sm:flex-row gap-4">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="#pricing">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="rounded-full px-8">
                    <Link href="#about">Learn More</Link>
                  </Button>
                </div>
                <div className="relative hidden w-full max-w-4xl mt-8 md:mt-16">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl rounded-3xl"></div>
                  <div className="bg-card border rounded-3xl shadow-xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=1200"
                      width={1200}
                      height={600}
                      alt="Product Dashboard"
                      className="w-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Product Section */}
          <section id="about" className="w-full hidden py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-6">
                  <Badge className="px-3 py-1 rounded-full text-sm" variant="secondary">
                    About Our Product
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Designed for the way you work</h2>
                  <p className="text-muted-foreground text-lg">
                    Our platform adapts to your team's needs, providing the tools and insights necessary to excel in
                    today's fast-paced environment.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Streamlined Workflow",
                        description: "Automate repetitive tasks and focus on what matters most to your business.",
                      },
                      {
                        title: "Data-Driven Insights",
                        description: "Make informed decisions with comprehensive analytics and reporting.",
                      },
                      {
                        title: "Seamless Integration",
                        description: "Easily connect with your existing tools and systems for a unified experience.",
                      },
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="rounded-full p-2 bg-primary/10 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl rounded-3xl"></div>
                  <div className="bg-card border rounded-3xl shadow-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=500&width=500"
                      width={500}
                      height={500}
                      alt="Product Features"
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="w-full hidden py-12 md:py-24 lg:py-32 bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Badge className="px-3 py-1 rounded-full text-sm" variant="secondary">
                  Testimonials
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Loved by businesses worldwide</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                  Don't just take our word for it. Here's what our customers have to say.
                </p>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Alex Johnson",
                    role: "CTO, TechCorp",
                    image: "/placeholder.svg?height=100&width=100",
                    content:
                      "This platform has revolutionized how our team collaborates. The intuitive interface and powerful features have significantly boosted our productivity.",
                  },
                  {
                    name: "Sarah Williams",
                    role: "Marketing Director, GrowthLabs",
                    image: "/placeholder.svg?height=100&width=100",
                    content:
                      "The analytics capabilities are outstanding. We've gained insights that have directly contributed to our 40% growth this quarter. Highly recommended!",
                  },
                  {
                    name: "Michael Chen",
                    role: "Founder, StartupX",
                    image: "/placeholder.svg?height=100&width=100",
                    content:
                      "As a startup founder, I needed a solution that could scale with us. This platform has been the perfect fit, growing alongside our team without missing a beat.",
                  },
                ].map((testimonial, i) => (
                  <Card key={i} className="bg-card border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full overflow-hidden h-12 w-12 border-2 border-primary/20">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            width={100}
                            height={100}
                            alt={testimonial.name}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <CardDescription>{testimonial.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-4">
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-current text-yellow-500" />
                          ))}
                      </div>
                      <p className="text-muted-foreground">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full hidden py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Badge className="px-3 py-1 rounded-full text-sm" variant="secondary">
                  Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                  Choose the plan that's right for your business
                </p>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {[
                  {
                    title: "Starter",
                    price: "$29",
                    description: "Perfect for small businesses and startups",
                    features: ["Basic features", "Up to 5 users", "5GB storage", "Email support"],
                  },
                  {
                    title: "Professional",
                    price: "$79",
                    description: "Ideal for growing businesses",
                    features: [
                      "All Starter features",
                      "Up to 20 users",
                      "20GB storage",
                      "Priority support",
                      "Advanced analytics",
                    ],
                  },
                  {
                    title: "Enterprise",
                    price: "$149",
                    description: "For large organizations with complex needs",
                    features: [
                      "All Professional features",
                      "Unlimited users",
                      "100GB storage",
                      "24/7 phone support",
                      "Custom integrations",
                      "Dedicated account manager",
                    ],
                  },
                ].map((plan, i) => (
                  <Card key={i} className={`relative overflow-hidden ${i === 1 ? "border-primary shadow-lg" : "border"}`}>
                    {i === 1 && (
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.title}</CardTitle>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3 text-sm">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full rounded-full" variant={i === 1 ? "default" : "outline"}>
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="w-full hidden py-12 md:py-24 lg:py-32 bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-6">
                  <Badge className="px-3 py-1 rounded-full text-sm" variant="secondary">
                    Contact Us
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in touch with our team</h2>
                  <p className="text-muted-foreground text-lg">
                    Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as
                    possible.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Our Location</h3>
                        <p className="text-muted-foreground">
                          123 Innovation Drive, Suite 100
                          <br />
                          San Francisco, CA 94107
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Us</h3>
                        <p className="text-muted-foreground">
                          hello@nova.com
                          <br />
                          support@nova.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Call Us</h3>
                        <p className="text-muted-foreground">
                          +1 (555) 123-4567
                          <br />
                          Mon-Fri, 9am-5pm PST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                              Name
                            </label>
                            <Input id="name" placeholder="Enter your name" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                              Email
                            </label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </label>
                          <Input id="subject" placeholder="Enter subject" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message
                          </label>
                          <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full rounded-full">Send Message</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full hidden bg-background border-t">
          <div className="container py-12 md:py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="space-y-4">
                <Link href="/" className="font-bold text-xl tracking-tight inline-block">
                  nova<span className="text-primary">.</span>
                </Link>
                <p className="text-muted-foreground">
                  Empowering businesses with innovative solutions since 2023. Our mission is to simplify complex processes
                  and drive growth.
                </p>
                <div className="flex space-x-4">
                  {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                    <Link key={social} href="#" className="rounded-full p-2 bg-muted hover:bg-muted/80 transition-colors">
                      <span className="sr-only">{social}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        {social === "facebook" && (
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        )}
                        {social === "twitter" && (
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        )}
                        {social === "instagram" && (
                          <>
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </>
                        )}
                        {social === "linkedin" && (
                          <>
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </>
                        )}
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Product</h3>
                <ul className="space-y-2">
                  {["Features", "Pricing", "Integrations", "Updates", "Roadmap"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <ul className="space-y-2">
                  {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Legal</h3>
                <ul className="space-y-2">
                  {["Terms", "Privacy", "Cookies", "Licenses", "Settings"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Nova, Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  <div className="h-4 w-px bg-border"></div>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                  <div className="h-4 w-px bg-border"></div>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
    : (
      <h2>Redirecting...</h2>
    )
}

