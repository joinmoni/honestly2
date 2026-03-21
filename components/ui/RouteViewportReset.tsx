"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function RouteViewportReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    if (typeof document !== "undefined") {
      const active = document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    }
  }, [pathname, searchParams]);

  return null;
}
