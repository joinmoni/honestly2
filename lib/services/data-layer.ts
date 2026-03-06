import type { AppDataLayer } from "@/lib/services/contracts";
import { mockDataLayer } from "@/lib/services/mock-data-layer";

let activeDataLayer: AppDataLayer = mockDataLayer;

export function getDataLayer(): AppDataLayer {
  return activeDataLayer;
}

export function setDataLayer(dataLayer: AppDataLayer): void {
  activeDataLayer = dataLayer;
}

export function resetDataLayer(): void {
  activeDataLayer = mockDataLayer;
}
