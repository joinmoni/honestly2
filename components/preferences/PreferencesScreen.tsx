"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound, Trash2, Upload } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { BodyText, CardTitle, Eyebrow, PageTitle } from "@/components/ui/Typography";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import { clearProfileAvatarOverride, saveProfileAvatarOverride, usePreferredAvatar } from "@/lib/profile-avatar.client";
import { updatePassword, updateProfileAvatar } from "@/lib/supabase/auth";
import type { MockSession } from "@/lib/types/domain";

type PreferencesScreenProps = {
  session: NonNullable<MockSession["user"]>;
};

export function PreferencesScreen({ session }: PreferencesScreenProps) {
  const persistedAvatarUrl = usePreferredAvatar(session.avatarUrl);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(persistedAvatarUrl);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(persistedAvatarUrl);
  }, [persistedAvatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <main className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Eyebrow>Account Preferences</Eyebrow>
            <PageTitle className="mt-3">Profile & Photo</PageTitle>
            <BodyText className="mt-4 max-w-2xl">
              Manage the avatar that appears in menus, saved lists, reviews, and future account surfaces across the app.
            </BodyText>
          </div>
          <Link href="/lists" className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
            Back to lists
          </Link>
        </div>

        <section className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm">
          <Eyebrow>Profile Photo</Eyebrow>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar name={session.name} imageUrl={previewUrl} size="md" className="h-24 w-24 text-2xl" />
            <div className="min-w-0 flex-1">
              <CardTitle>{session.name}</CardTitle>
              <p className="mt-2 text-sm text-stone-500">{session.email}</p>
              <BodyText className="mt-4">Choose the photo you want to use across Honestly.</BodyText>
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
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1024 * 1024) {
                    setErrorMessage("Choose an image under 2 MB for now.");
                    setSaveMessage(null);
                    return;
                  }

                  const nextPreviewUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
                    reader.onerror = () => reject(new Error("This image could not be loaded."));
                    reader.readAsDataURL(file);
                  }).catch(() => "");

                  if (!nextPreviewUrl) {
                    setErrorMessage("This image could not be loaded.");
                    setSaveMessage(null);
                    return;
                  }

                  try {
                    const persistedAvatarUrl = isSupabaseConfigured()
                      ? await updateProfileAvatar({
                          userId: session.id,
                          email: session.email,
                          name: session.name,
                          role: session.role,
                          authProvider: session.authProvider,
                          avatarUrl: nextPreviewUrl
                        })
                      : nextPreviewUrl;

                    setPreviewUrl(persistedAvatarUrl ?? nextPreviewUrl);
                    saveProfileAvatarOverride(persistedAvatarUrl ?? nextPreviewUrl);
                    setSelectedFileName(file.name);
                    setSaveMessage("Profile photo updated.");
                    setErrorMessage(null);
                    event.target.value = "";
                  } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : "Profile photo could not be saved.");
                    setSaveMessage(null);
                  }
                }}
              />
            </label>

            <button
              type="button"
              className="rounded-[1.6rem] border border-dashed border-stone-200 bg-white px-5 py-5 text-sm font-semibold text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-900"
              onClick={async () => {
                try {
                  const fallbackAvatarUrl = isSupabaseConfigured()
                    ? await updateProfileAvatar({
                        userId: session.id,
                        email: session.email,
                        name: session.name,
                        role: session.role,
                        authProvider: session.authProvider,
                        avatarUrl: null
                      })
                    : session.avatarUrl;

                  if (fallbackAvatarUrl) {
                    saveProfileAvatarOverride(fallbackAvatarUrl);
                  } else {
                    clearProfileAvatarOverride();
                  }

                  setPreviewUrl(fallbackAvatarUrl);
                  setSelectedFileName(null);
                  setSaveMessage("Profile photo reset.");
                  setErrorMessage(null);
                } catch (error) {
                  setErrorMessage(error instanceof Error ? error.message : "Profile photo could not be reset.");
                  setSaveMessage(null);
                }
              }}
            >
              Reset photo
            </button>
          </div>

          {saveMessage ? <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{saveMessage}</div> : null}
          {errorMessage ? <div className="mt-5 rounded-[1.5rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div> : null}
          {selectedFileName ? (
            <div className="mt-5 rounded-[1.5rem] bg-stone-50 px-4 py-3 text-sm text-stone-600">
              Selected file: <span className="font-semibold text-stone-900">{selectedFileName}</span>
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-stone-100 p-3 text-stone-700">
                <KeyRound size={18} />
              </div>
              <div>
                <Eyebrow>Security</Eyebrow>
                <CardTitle className="mt-2">Reset Password</CardTitle>
              </div>
            </div>
            <BodyText className="mt-5 max-w-md">
              Create a new password for your account without leaving this page.
            </BodyText>
            {!passwordFormOpen ? (
              <button
                type="button"
                className="mt-6 inline-flex rounded-full border border-stone-200 bg-stone-50 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:bg-white"
                onClick={() => {
                  setPasswordFormOpen(true);
                  setPasswordMessage(null);
                  setPasswordError(null);
                }}
              >
                Set new password
              </button>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setPasswordMessage(null);
                  setPasswordError(null);

                  if (nextPassword.length < 8) {
                    setPasswordError("Use at least 8 characters.");
                    return;
                  }

                  if (nextPassword !== confirmPassword) {
                    setPasswordError("Passwords do not match.");
                    return;
                  }

                  if (!isSupabaseConfigured()) {
                    setPasswordError("Password updates are not connected yet.");
                    return;
                  }

                  setPasswordPending(true);

                  try {
                    await updatePassword(nextPassword);
                    setPasswordMessage("Password updated.");
                    setNextPassword("");
                    setConfirmPassword("");
                    setPasswordFormOpen(false);
                  } catch (error) {
                    setPasswordError(error instanceof Error ? error.message : "Password update failed.");
                  } finally {
                    setPasswordPending(false);
                  }
                }}
              >
                <input
                  type="password"
                  value={nextPassword}
                  onChange={(event) => setNextPassword(event.target.value)}
                  placeholder="New password"
                  className="w-full rounded-[1.25rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-colors focus:border-stone-900"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-[1.25rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-colors focus:border-stone-900"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={passwordPending}
                    className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passwordPending ? "Saving..." : "Update password"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex rounded-full border border-stone-200 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-900"
                    onClick={() => {
                      setPasswordFormOpen(false);
                      setNextPassword("");
                      setConfirmPassword("");
                      setPasswordError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {passwordMessage ? <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</div> : null}
            {passwordError ? <div className="mt-5 rounded-[1.5rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{passwordError}</div> : null}
          </div>

          <div className="rounded-[2rem] border border-rose-200 bg-rose-50/50 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-3 text-rose-700">
                <Trash2 size={18} />
              </div>
              <div>
                <Eyebrow className="text-rose-400">Danger Zone</Eyebrow>
                <CardTitle className="mt-2 text-stone-900">Delete Account</CardTitle>
              </div>
            </div>
            <BodyText className="mt-5 max-w-md">
              Permanently remove your account, saved vendors, lists, and review history from Honestly.
            </BodyText>
            {!deleteConfirmOpen ? (
              <button
                type="button"
                className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800"
                onClick={() => {
                  setDeleteConfirmOpen(true);
                  setDeleteMessage(null);
                }}
              >
                Delete account
              </button>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-white/80 p-5">
                <p className="text-sm leading-relaxed text-stone-700">
                  Confirm your request and we&apos;ll open an email draft to <span className="font-semibold">support@honestly.com</span> with your account details.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`mailto:support@honestly.com?subject=${encodeURIComponent("Delete my Honestly account")}&body=${encodeURIComponent(
                      `Please delete my Honestly account.\n\nName: ${session.name}\nEmail: ${session.email}\n\nI understand this removes my account data.`
                    )}`}
                    className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800"
                    onClick={() => {
                      setDeleteMessage("Deletion request draft opened in your email app.");
                      setDeleteConfirmOpen(false);
                    }}
                  >
                    Open deletion request
                  </a>
                  <button
                    type="button"
                    className="inline-flex rounded-full border border-stone-200 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-900"
                    onClick={() => setDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {deleteMessage ? <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{deleteMessage}</div> : null}
          </div>
        </section>
      </main>
    </div>
  );
}
