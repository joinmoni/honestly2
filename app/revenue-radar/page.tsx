import type { Metadata } from "next";

import { RevenueRadarPage } from "@/components/revenue-radar/RevenueRadarPage";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Revenue Radar | Honestly",
  description: "Public-sector opportunities identified and reviewed by Tender Radar.",
  path: "/revenue-radar"
});

export default function RevenueRadarRoutePage() {
  return <RevenueRadarPage />;
}
