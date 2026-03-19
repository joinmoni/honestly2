"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { completeBrowserAuthCallback } from "@/lib/supabase/auth";
import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";

export function AuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeSignIn = async () => {
      try {
        const nextPath = await completeBrowserAuthCallback(new URLSearchParams(searchParams.toString()));

        if (!cancelled) {
          router.replace(nextPath);
          router.refresh();
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "This sign-in link could not be completed.");
        }
      }
    };

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (!errorMessage) {
    return <RouteLoadingScreen title="Finishing your sign-in" subtitle="Securing your session and returning you to the app." />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-6 py-16 text-stone-900 md:px-12">
      <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-stone-200 bg-white px-8 py-14 text-center shadow-xl shadow-stone-200/30 md:px-12">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Sign-in issue</p>
        <h1 className="mt-4 text-4xl md:text-5xl">We couldn&apos;t finish signing you in</h1>
        <p className="mt-5 text-base leading-relaxed text-stone-500">{errorMessage}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="rounded-full bg-stone-900 px-8 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white">
            Back to login
          </Link>
          <Link href="/" className="rounded-full border border-stone-200 px-8 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-700">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
