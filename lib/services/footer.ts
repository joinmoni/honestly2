import { getDataLayer } from "@/lib/services/data-layer";
import type { FooterContent } from "@/lib/types/footer";

export async function getFooterContent(): Promise<FooterContent> {
  return getDataLayer().getFooterContent();
}
