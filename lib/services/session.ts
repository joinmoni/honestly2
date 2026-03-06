import { getDataLayer } from "@/lib/services/data-layer";
import type { MockSession } from "@/lib/types/domain";

export async function getMockSession(): Promise<MockSession> {
  return getDataLayer().getMockSession();
}

export async function getAnonymousSession(): Promise<MockSession> {
  return getDataLayer().getAnonymousSession();
}

export async function getMockAdminSession(): Promise<MockSession> {
  return getDataLayer().getMockAdminSession();
}
