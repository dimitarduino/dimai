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
import { CheckCircle2, ChevronRight, Mail, MapPin, Menu, Moon, Phone, Star, Sun } from "lucide-react"
import { useTheme } from "./_context/ThemeContext";

export default function ComingSoon() {
  const router = useRouter();

  const [email, setEmail] = useState();
  const { user } = useUser();
  const [development, setDevelopment] = useState(false);
  const [theme, setTheme] = useState();
  const { isDark, toggleTheme } = useTheme();


  useEffect(() => {
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
                <Image src={`/logo.png`} width={120} height={20} alt="DimnAI Logo image" />
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
              <button onClick={toggleTheme} className="bg-transparent dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer p-4 rounded-full">
                {
                  isDark ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-black" />
                }
              </button>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Button asChild className="rounded-md dark:text-white py-2 px-4">
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
                  <Badge className="px-4 py-2 rounded-full text-sm dark:text-white" variant="secondary">
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
                  className="mt-1 flex space-x-2 p-2 dark:bg-neutral-800 bg-neutral-100 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 1 }}
                >
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Join the waitlist..."
                    className="p-3 rounded-lg dark:text-white text-black w-60 outline-none"
                  />
                  <button onClick={dodajCekanje} className="bg-primary dark:text-white cursor-pointer text-white px-5 py-3 rounded-lg font-semibold transition duration-300">
                    Join
                  </button>
                </motion.div>

              </div>
            </div>
          </section>

        </main>
      </div>
    )
    : (
      <h2>Redirecting...</h2>
    )
}

