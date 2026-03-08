import { redirect } from "next/navigation";

import { getDataLayer } from "@/lib/services/data-layer";
import type { MockSession } from "@/lib/types/domain";

export async function getCurrentSession(): Promise<MockSession> {
  return getDataLayer().getCurrentSession();
}

export async function getAnonymousSession(): Promise<MockSession> {
  return getDataLayer().getAnonymousSession();
}

export async function getAdminSession(): Promise<MockSession> {
  return getDataLayer().getAdminSession();
}

export async function requireUserSession(): Promise<NonNullable<MockSession["user"]>> {
  const session = await getCurrentSession();

  if (!session.user) {
    redirect("/login");
  }

  return session.user;
}

export async function requireAdminSession(): Promise<NonNullable<MockSession["user"]>> {
  const session = await getAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session.user;
}
