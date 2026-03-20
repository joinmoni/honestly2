"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, Instagram, Link as LinkIcon, Mail, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Vendor, VendorSocial } from "@/lib/types/domain";

type VendorActionModalProps = {
  open: boolean;
  mode: "contact" | "share";
  vendor: Vendor;
  onClose: () => void;
};

function getSocialIcon(platform: VendorSocial["platform"]) {
  if (platform === "instagram") return Instagram;
  if (platform === "website") return Globe;
  return LinkIcon;
}

export function VendorActionModal({ open, mode, vendor, onClose }: VendorActionModalProps) {
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const primaryLocation = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const locationLabel = primaryLocation
    ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}${primaryLocation.country ? `, ${primaryLocation.country}` : ""}`
    : undefined;

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/vendor/${vendor.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: vendor.name,
          text: vendor.headline ?? vendor.description ?? `View ${vendor.name} on Honestly.`,
          url
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-stone-900/40 p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{mode === "contact" ? "Contact Vendor" : "Share Vendor"}</p>
                <h3 className="mt-3 text-3xl leading-tight">{vendor.name}</h3>
                {locationLabel ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                    <MapPin size={12} />
                    {locationLabel}
                  </p>
                ) : null}
              </div>
              <button type="button" className="rounded-full p-2 text-stone-300 transition-colors hover:bg-stone-100 hover:text-stone-900" onClick={onClose} aria-label="Close vendor action modal">
                <X size={20} />
              </button>
            </div>

            {mode === "share" ? (
              <div className="mt-6">
                <p className="text-sm leading-relaxed text-stone-500">Copy or share this vendor profile.</p>
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white"
                  onClick={handleShare}
                >
                  <LinkIcon size={14} />
                  {shareState === "copied" ? "Link copied" : "Share"}
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {vendor.socials.length ? (
                  vendor.socials.map((social) => {
                    const Icon = getSocialIcon(social.platform);
                    return (
                      <Link
                        key={`${vendor.id}-${social.platform}`}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-[1.5rem] border border-stone-200 px-4 py-4 transition-colors hover:border-stone-900"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-stone-100 p-2 text-stone-700">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold capitalize text-stone-900">{social.platform}</p>
                            <p className="text-xs text-stone-400">{social.url.replace(/^https?:\/\//, "")}</p>
                          </div>
                        </div>
                        <LinkIcon size={16} className="text-stone-400" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">No direct contact links have been added for this vendor yet.</p>
                  </div>
                )}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Inquiry for ${vendor.name}`)}&body=${encodeURIComponent(`Hi,\n\nI'm interested in learning more about ${vendor.name}.\n`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-700"
                >
                  <Mail size={14} />
                  Draft email
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
