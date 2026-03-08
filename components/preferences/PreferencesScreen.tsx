"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImagePlus, Link2, Upload } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import type { MockSession } from "@/lib/types/domain";

type PreferencesScreenProps = {
  session: NonNullable<MockSession["user"]>;
};

export function PreferencesScreen({ session }: PreferencesScreenProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(session.avatarUrl);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const providerLabel = session.authProvider === "google" ? "Google" : "Email + Password";

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Account Preferences</p>
            <h1 className="mt-3 text-5xl">Profile & Photo</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-500">
              Manage the avatar that appears in menus, saved lists, reviews, and future account surfaces across the app.
            </p>
          </div>
          <Link href="/lists" className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
            Back to lists
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-8">
            <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Profile Photo</p>
              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
                <Avatar name={session.name} imageUrl={previewUrl} size="md" className="h-24 w-24 text-2xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-3xl">{session.name}</h2>
                  <p className="mt-2 text-sm text-stone-500">{session.email}</p>
                  <p className="mt-4 text-sm leading-relaxed text-stone-500">
                    {session.authProvider === "google"
                      ? "Your current avatar is synced from Google. You can upload a custom photo here to override it inside Honestly."
                      : "You signed up with email and password, so this is where you upload the profile photo used throughout Honestly."}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.6rem] border border-stone-200 bg-stone-50 px-5 py-5 text-sm font-semibold text-stone-700 transition-colors hover:border-amber-300 hover:bg-amber-50">
                  <Upload size={18} />
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;

                      setPreviewUrl((current) => {
                        if (current && current.startsWith("blob:")) {
                          URL.revokeObjectURL(current);
                        }
                        return URL.createObjectURL(file);
                      });
                      setSelectedFileName(file.name);
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="rounded-[1.6rem] border border-dashed border-stone-200 bg-white px-5 py-5 text-sm font-semibold text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-900"
                  onClick={() => {
                    setPreviewUrl(session.avatarUrl);
                    setSelectedFileName(null);
                  }}
                >
                  Reset to account default
                </button>
              </div>

              {selectedFileName ? (
                <div className="mt-5 rounded-[1.5rem] bg-stone-50 px-4 py-3 text-sm text-stone-600">
                  Selected file: <span className="font-semibold text-stone-900">{selectedFileName}</span>
                </div>
              ) : null}
            </div>

            <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <ImagePlus size={18} className="text-amber-700" />
                <h2 className="text-3xl">Avatar Rules</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.6rem] bg-stone-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Google Sign-In</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    When a user authenticates with Google, Honestly should hydrate their avatar from the provider profile and use it as the default app image.
                  </p>
                </div>
                <div className="rounded-[1.6rem] bg-stone-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Email Sign-Up</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    Users without a provider avatar should be able to upload a first-party photo that the app stores and reuses across account surfaces.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2.25rem] border border-stone-200 bg-stone-900 p-6 text-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Account Source</p>
            <p className="mt-4 text-3xl">{providerLabel}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              This mock account is currently treated as a {session.authProvider === "google" ? "provider-linked" : "direct email"} profile.
              The avatar shown in the top navigation now comes from this account record instead of a placeholder image.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-stone-800 bg-stone-950/40 p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Next Integration</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">
                When Supabase auth is wired, this screen should save uploaded images to storage and persist the resulting URL on the user profile row.
              </p>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
              <Link2 size={14} />
              Avatar now used in app nav
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
