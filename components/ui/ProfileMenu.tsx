"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, LogOut, Plus, Settings, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { usePreferredAvatar } from "@/lib/profile-avatar.client";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import { setMockAnonymousSession } from "@/lib/mock-auth-state.client";
import { signOut } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  name?: string | null;
  email?: string | null;
  imageUrl?: string;
  size?: "sm" | "md";
  className?: string;
};

type ProfileMenuItem = {
  label: string;
  href: string;
  icon: typeof Heart;
};

const menuItems: ProfileMenuItem[] = [
  {
    label: "New List",
    href: "/lists?create=1",
    icon: Plus
  },
  {
    label: "Saved Vendors",
    href: "/lists",
    icon: Heart
  },
  {
    label: "My Reviews",
    href: "/me/reviews",
    icon: Star
  },
  {
    label: "Preferences",
    href: "/preferences",
    icon: Settings
  }
];

export function ProfileMenu({ name, email, imageUrl, size = "sm", className }: ProfileMenuProps) {
  const preferredAvatarUrl = usePreferredAvatar(imageUrl);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);

    if (!isSupabaseConfigured()) {
      setMockAnonymousSession();
      setOpen(false);
      router.push("/login");
      router.refresh();
      setSigningOut(false);
      return;
    }

    try {
      await signOut();
      setOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout could not be completed right now.";
      setSignOutError(message);
      setSigningOut(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-stone-900 px-2 py-2 text-white shadow-lg shadow-stone-200/40 transition-colors hover:bg-stone-800"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <Avatar name={name} imageUrl={preferredAvatarUrl} size={size} />
        <span className="hidden text-[11px] font-black uppercase tracking-[0.18em] sm:block">{name ?? "Account"}</span>
        <ChevronDown size={14} className={cn("hidden text-white/70 transition-transform sm:block", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full z-[80] mt-3 w-64 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-2xl shadow-stone-200/40"
            role="menu"
          >
            <div className="border-b border-stone-100 px-5 py-4">
              <p className="text-sm font-semibold text-stone-900">{name ?? "Guest User"}</p>
              {email ? <p className="mt-1 text-xs text-stone-400">{email}</p> : null}
            </div>

            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                    onClick={() => setOpen(false)}
                    role="menuitem"
                  >
                    <Icon size={15} className="text-stone-400" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {signOutError ? <p className="px-5 pb-2 text-xs text-rose-600">{signOutError}</p> : null}

            <div className="border-t border-stone-100 p-2">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                onClick={handleSignOut}
                role="menuitem"
                disabled={signingOut}
              >
                <LogOut size={15} className="text-stone-400" />
                {signingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
