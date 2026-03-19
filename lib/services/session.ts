import { redirect } from "next/navigation";

import { getDataLayer } from "@/lib/services/data-layer";
import type { MockSession } from "@/lib/types/domain";

export function normalizeRedirectPath(path?: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/vendors";
  }

  return path;
}

export function buildLoginRedirect(path?: string): string {
  const next = normalizeRedirectPath(path);
  return `/login?next=${encodeURIComponent(next)}`;
}

export async function getCurrentSession(): Promise<MockSession> {
  return getDataLayer().getCurrentSession();
}

export async function getAnonymousSession(): Promise<MockSession> {
  return getDataLayer().getAnonymousSession();
}

export async function getAdminSession(): Promise<MockSession> {
  return getDataLayer().getAdminSession();
}

export async function requireUserSession(path?: string): Promise<NonNullable<MockSession["user"]>> {
  const session = await getCurrentSession();

  if (!session.user) {
    redirect(buildLoginRedirect(path));
  }

  return session.user;
}

export async function requireAdminSession(path = "/admin"): Promise<NonNullable<MockSession["user"]>> {
  const session = await getAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect(buildLoginRedirect(path));
  }

  return session.user;
}
