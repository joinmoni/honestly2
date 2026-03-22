/**
 * Label shown in admin chrome (top nav avatar). Google OAuth uses first name; email / magic-link uses a fixed label.
 */
export function getAdminNavDisplayName(user: {
  name: string;
  authProvider?: "google" | "password";
}): string {
  if (user.authProvider === "google") {
    const first = user.name.trim().split(/\s+/)[0];
    return first.length ? first : "Admin user";
  }

  return "Admin user";
}
