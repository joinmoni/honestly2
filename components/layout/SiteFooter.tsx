import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
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
        "mt-20 px-6 py-20",
        isDark ? "bg-stone-900 text-stone-400" : "border-t border-stone-100 bg-white text-stone-500"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 space-y-6 md:col-span-1">
            <Link
              href="/"
              className={cn(
                "serif-italic inline-block text-4xl",
                isDark ? "text-white" : "text-stone-900"
              )}
            >
              {content.brand}
              <span className={isDark ? "text-amber-500" : "text-amber-600"}>{content.brandAccent}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">{content.tagline}</p>
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
            <div key={section.id} className="space-y-6">
              <h4
                className={cn(
                  "ui-meta",
                  isDark ? "text-white" : "text-stone-900"
                )}
              >
                {section.title}
              </h4>
              <ul className="space-y-4 text-sm">
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
            "flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row",
            isDark ? "border-stone-800" : "border-stone-200"
          )}
        >
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em]">{content.copyright}</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em]">{content.statusLabel}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
