import Link from "next/link";

const links = [
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/claims", label: "Claims" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/rating-criteria", label: "Rating Criteria" }
];

export function AdminSidebar() {
  return (
    <aside className="surface h-fit w-full p-4 md:w-64">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-[#f6f3ec] hover:text-ink">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
