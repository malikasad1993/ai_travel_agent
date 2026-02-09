"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ContactUsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string>("");

  const canSend = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!isValidEmail(form.email)) return false;
    if (!form.subject.trim()) return false;
    if (form.message.trim().length < 10) return false;
    return true;
  }, [form]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSend) {
      setError("Please fill all fields correctly (message must be 10+ chars).");
      return;
    }

    try {
      setStatus("sending");

      // ✅ For now: demo submit (replace with your API call later)
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(form) })
      await new Promise((r) => setTimeout(r, 800));

      setStatus("sent");
      setForm(initialState);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="w-full border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Need help planning a trip, booking, or have feedback for our AI
              Travel Agent? Send us a message and we’ll get back to you.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm">
                <MessageCircle className="h-4 w-4 text-primary" />
                Support & Feedback
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm">
                <Clock className="h-4 w-4 text-primary" />
                Response within 24–48h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="rounded-3xl border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold">
                We’d love to hear from you
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether it’s a bug report, feature request, partnership inquiry,
                or travel question — drop a message.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Email</p>
                    <p className="text-sm text-muted-foreground">
                      MalikAsad9221@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Location</p>
                    <p className="text-sm text-muted-foreground">
                      Remote — Pakistan / Canada (update as needed)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon–Sat, 10:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/pricing">
                  <Button variant="secondary">View Pricing</Button>
                </Link>
                <Link href="/create-new-trip">
                  <Button>Plan a Trip</Button>
                </Link>
              </div>
            </div>

            {/* FAQ mini card */}
            <div className="rounded-3xl border p-6 sm:p-8">
              <h3 className="text-lg font-semibold">Quick help</h3>
              <ul className="mt-3 space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>• Include your travel dates and destination for faster help.</li>
                <li>• Mention your budget range (modest / mid / luxury).</li>
                <li>• Tell us if you need halal-friendly options.</li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-3xl border p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold">Send a message</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Fill the form below — we’ll respond by email.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Trip help / Bug report / Partnership"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  className="min-h-[140px] rounded-xl"
                  placeholder="Tell us what you need… (include dates, budget, and preferences)"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Mention your departure city + destination for faster replies.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
                  {error}
                </div>
              ) : null}

              {status === "sent" ? (
                <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
                  Message sent ✅ We’ll get back to you soon.
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={!canSend || status === "sending"}
              >
                {status === "sending" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
