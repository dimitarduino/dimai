"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // freemius.checkout.getSandboxParams().then((params) => {
    //   console.log(params);
    // });
  }, []);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message.");
      }

      toast.success("Your message has been sent. We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="DimnAI Logo" width={120} height={30} />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Support</h1>
          <p className="text-muted-foreground mb-8">
            Have a question, need help with your account, or want to report an issue?
            Send us a message and our team will reach out to you at{" "}
            <span className="font-medium">info@dimnai.com</span>.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
                placeholder="How can we help?"
                rows={5}
              />
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto dark:text-white cursor-pointer"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
