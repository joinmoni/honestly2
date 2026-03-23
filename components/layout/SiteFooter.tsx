import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import { DARK_SURFACE_MUTED_TEXT } from "@/lib/dark-surface";
import { cn } from "@/lib/utils";
import type { FooterContent } from "@/lib/types/footer";

type SiteFooterProps = {
  content: FooterContent;
  variant?: "dark" | "light";
};

export function SiteFooter({ content, variant = "dark" }: SiteFooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      className={cn(
        "mt-14 px-4 py-12 md:mt-20 md:px-6 md:py-20",
        isDark ? cn("bg-stone-900", DARK_SURFACE_MUTED_TEXT) : "border-t border-stone-100 bg-white text-stone-500"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-4 md:gap-12">
          <div className="col-span-1 space-y-4 md:space-y-6 md:col-span-1">
            <Link
              href="/"
              className={cn(
                "serif-italic inline-block text-3xl md:text-4xl",
                isDark ? "text-white" : "text-stone-900"
              )}
            >
              {content.brand}
              <span className={isDark ? "text-amber-500" : "text-amber-600"}>{content.brandAccent}</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed md:text-sm">{content.tagline}</p>
            <div className="flex gap-4">
              {content.socials.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:text-white" : "hover:text-stone-900"
                  )}
                >
                  {social.id === "instagram" ? <Instagram size={18} /> : <Twitter size={18} />}
                </Link>
              ))}
            </div>
          </div>

          {content.sections.map((section) => (
            <div key={section.id} className="space-y-3 md:space-y-6">
              <h4
                className={cn(
                  "ui-meta",
                  isDark ? "text-white" : "text-stone-900"
                )}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-sm md:space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "transition-colors",
                        link.highlighted
                          ? isDark
                            ? "font-bold text-amber-500 hover:text-amber-400"
                            : "font-bold text-amber-700 hover:text-amber-600"
                          : isDark
                            ? "hover:text-white"
                            : "hover:text-stone-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex flex-col items-center justify-between gap-4 border-t pt-6 md:gap-6 md:pt-8 md:flex-row",
            isDark ? "border-stone-800" : "border-stone-200"
          )}
        >
          <p className="text-center font-sans text-[9px] font-bold uppercase tracking-[0.22em] md:text-[10px] md:tracking-[0.3em]">{content.copyright}</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] md:text-[10px] md:tracking-[0.2em]">{content.statusLabel}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
