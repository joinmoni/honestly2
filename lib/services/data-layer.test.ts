import { afterEach, describe, expect, it } from "vitest";

import type { AppDataLayer } from "@/lib/services/contracts";
import { getDataLayer, resetDataLayer, setDataLayer } from "@/lib/services/data-layer";
import { getVendorBySlug } from "@/lib/services/vendors";

describe("data layer registry", () => {
  afterEach(() => {
    resetDataLayer();
  });

  it("defaults to the mock data layer", async () => {
    const vendor = await getVendorBySlug("wildflower-archive");
    expect(vendor?.name).toBe("Wildflower Archive");
  });

  it("allows swapping the active implementation without changing service consumers", async () => {
    const baseLayer = getDataLayer();
    const overrideLayer: AppDataLayer = {
      ...baseLayer,
      async getVendorBySlug(slug) {
        if (slug !== "wildflower-archive") return null;
        return {
          ...(await baseLayer.getVendorBySlug(slug))!,
          name: "Override Studio"
        };
      }
    };

    setDataLayer(overrideLayer);

    const vendor = await getVendorBySlug("wildflower-archive");
    expect(vendor?.name).toBe("Override Studio");
  });
});
