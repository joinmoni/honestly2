export type UserNavKey = "saved_vendors" | "review" | "my_reviews" | "preferences" | "none";

export function getUserNavLinks(activeKey: UserNavKey) {
  return [
    { label: "Review", href: "/reviews/new", active: activeKey === "review" },
    { label: "Saved Vendors", href: "/lists", active: activeKey === "saved_vendors" },
    { label: "My Reviews", href: "/me/reviews", active: activeKey === "my_reviews" },
    { label: "Preferences", href: "/preferences", active: activeKey === "preferences" }
  ];
}
