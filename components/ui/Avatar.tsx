"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

type AvatarProps = {
  name?: string | null;
  imageUrl?: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: {
    frame: "h-8 w-8 text-[10px]",
    inner: "h-7 w-7"
  },
  md: {
    frame: "h-10 w-10 text-xs",
    inner: "h-9 w-9"
  }
};

function getInitials(name?: string | null): string {
  if (!name) return "HU";
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "HU";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function Avatar({ name, imageUrl, size = "sm", className }: AvatarProps) {
  const initials = getInitials(name);
  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-stone-200 bg-stone-100 font-sans font-black uppercase tracking-widest text-stone-600",
        classes.frame,
        className
      )}
      aria-label={name ? `${name} avatar` : "Profile avatar"}
    >
      {imageUrl ? (
        <div className={cn("relative overflow-hidden rounded-full", classes.inner)}>
          <Image src={imageUrl} alt={name ? `${name} avatar` : "Profile avatar"} fill className="object-cover" sizes={size === "sm" ? "32px" : "40px"} />
        </div>
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
