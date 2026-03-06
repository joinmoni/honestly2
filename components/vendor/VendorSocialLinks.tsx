import Link from "next/link";
import type { VendorSocial } from "@/lib/types/domain";

type VendorSocialLinksProps = {
  socials: VendorSocial[];
};

export function VendorSocialLinks({ socials }: VendorSocialLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {socials.map((social) => (
        <Link key={`${social.platform}:${social.url}`} href={social.url} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-1.5 text-xs capitalize text-muted hover:text-ink">
          {social.platform}
        </Link>
      ))}
    </div>
  );
}
