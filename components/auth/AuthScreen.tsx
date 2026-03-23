"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import type { AuthPageCopy } from "@/lib/types/auth-page";
import { DARK_SURFACE_HEADING_TEXT, DARK_SURFACE_MUTED_TEXT } from "@/lib/dark-surface";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import { cn } from "@/lib/utils";
import { setMockUserSession } from "@/lib/mock-auth-state.client";
import { getBrowserSupabaseSession, signInWithEmailOtp, signInWithGoogle } from "@/lib/supabase/auth";

type AuthScreenProps = {
  copy: AuthPageCopy;
  nextPath?: string;
};

export function AuthScreen({ copy, nextPath = "/vendors" }: AuthScreenProps) {
  const supabaseConfigured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState<"google" | "email" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const router = useRouter();

  const clearFocusBeforeRedirect = () => {
    if (typeof document === "undefined") return;
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;

    const syncExistingSession = async () => {
      try {
        const session = await getBrowserSupabaseSession();

        if (!cancelled && session) {
          clearFocusBeforeRedirect();
          router.replace(nextPath);
        }
      } catch {
        // Leave the sign-in screen available if the local session cannot be read.
      }
    };

    void syncExistingSession();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  const handleGoogleSignIn = async () => {
    if (!supabaseConfigured) {
      setMockUserSession();
      clearFocusBeforeRedirect();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      router.replace(nextPath);
      router.refresh();
      return;
    }

    setSubmitting("google");
    setErrorMessage(null);
    setEmailSuccess(null);

    try {
      await signInWithGoogle(nextPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in could not be started right now.";
      setErrorMessage(message);
      setSubmitting(null);
    }
  };

  const handleEmailContinue = async () => {
    if (!supabaseConfigured) {
      setMockUserSession();
      clearFocusBeforeRedirect();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      router.replace(nextPath);
      router.refresh();
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setErrorMessage("Enter your email address to continue.");
      setEmailSuccess(null);
      return;
    }

    setSubmitting("email");
    setErrorMessage(null);
    setEmailSuccess(null);

    try {
      await signInWithEmailOtp(normalizedEmail, nextPath);
      setEmailSuccess(`Check ${normalizedEmail} for your sign-in link.`);
      setSubmitting(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Email sign-in could not be started right now.";
      setErrorMessage(message);
      setSubmitting(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="flex min-h-[600px] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-stone-200/60 md:flex-row md:rounded-[2.5rem]"
      >
        <div className="relative min-h-[280px] overflow-hidden bg-stone-100 md:min-h-0 md:w-1/2">
          <Image src={copy.heroImageUrl} alt="Login visual" fill className="object-cover opacity-90" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
            <div className={cn("mb-2 text-xl italic md:text-2xl", DARK_SURFACE_HEADING_TEXT)}>{copy.quoteText}</div>
            <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", DARK_SURFACE_MUTED_TEXT)}>{copy.quoteAuthor}</p>
          </div>

          <Link href="/" className="serif-italic absolute left-6 top-6 text-3xl text-white md:left-8 md:top-8 md:text-4xl">
            honestly<span className="text-amber-400">.</span>
          </Link>
        </div>

        <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-16">
          <div className="mb-8 md:mb-10">
            <h1 className="mb-3 text-3xl md:text-4xl">{copy.heading}</h1>
            <p className="text-sm text-stone-500">{copy.subheading}</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={submitting !== null}
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 py-4 font-bold text-stone-700 transition-all hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {submitting === "google" ? "Connecting..." : copy.googleCta}
            </motion.button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-stone-100" />
              <span className="mx-4 flex-shrink text-[10px] font-bold uppercase tracking-widest text-stone-300">{copy.dividerLabel}</span>
              <div className="flex-grow border-t border-stone-100" />
            </div>

            <div className="space-y-3">
              <input
                type="email"
                aria-label="Email address"
                placeholder={copy.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-base transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={submitting !== null}
                onClick={handleEmailContinue}
                className="w-full rounded-2xl bg-stone-900 py-4 font-bold text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting === "email" ? "Sending link..." : copy.continueCta}
              </motion.button>
            </div>
            {errorMessage ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}
            {emailSuccess ? <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{emailSuccess}</p> : null}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-stone-400">
              {copy.termsPrefix}
              <br />
              <a href="#" className="text-stone-900 underline decoration-stone-200">
                {copy.termsLabel}
              </a>{" "}
              and{" "}
              <a href="#" className="text-stone-900 underline decoration-stone-200">
                {copy.privacyLabel}
              </a>
              .
            </p>
          </div>

          <div className="mt-auto border-t border-stone-50 pt-8 text-center">
            <p className="text-xs font-bold text-stone-600">
              {copy.professionalPrompt}
              <Link href="/login?next=%2Freviews%2Fnew" className="ml-1 text-amber-700 underline decoration-amber-200">
                {copy.listBusinessLabel}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
