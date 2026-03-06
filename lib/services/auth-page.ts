import { getDataLayer } from "@/lib/services/data-layer";
import type { AuthPageCopy } from "@/lib/types/auth-page";

export async function getAuthPageCopy(): Promise<AuthPageCopy> {
  return getDataLayer().getAuthPageCopy();
}
