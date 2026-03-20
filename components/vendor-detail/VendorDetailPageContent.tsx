"use client";

import { useState } from "react";

import { ProfessionalCtaBanner } from "@/components/public/ProfessionalCtaBanner";
import { VendorActionModal } from "@/components/vendor-detail/VendorActionModal";
import { VendorDetailAbout } from "@/components/vendor-detail/VendorDetailAbout";
import { VendorDetailGallery } from "@/components/vendor-detail/VendorDetailGallery";
import { VendorDetailHero } from "@/components/vendor-detail/VendorDetailHero";
import { VendorDetailReviewFlow } from "@/components/vendor-detail/VendorDetailReviewFlow";
import { VendorDetailSidebar } from "@/components/vendor-detail/VendorDetailSidebar";
import type { MockSession, RatingCriterion, Review, SavedList, Vendor } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailPageContentProps = {
  vendor: Vendor;
  profile: VendorProfile;
  initialLists: SavedList[];
  session: MockSession;
  criteria: RatingCriterion[];
  approvedReviews: Review[];
};

export function VendorDetailPageContent({ vendor, profile, initialLists, session, criteria, approvedReviews }: VendorDetailPageContentProps) {
  const [modalMode, setModalMode] = useState<"contact" | "share" | null>(null);

  return (
    <>
      <VendorDetailHero
        vendor={vendor}
        profile={profile}
        initialLists={initialLists}
        session={session}
        onOpenContact={() => setModalMode("contact")}
        onOpenShare={() => setModalMode("share")}
      />
      <VendorDetailGallery images={vendor.images} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.45fr)_330px]">
        <div className="space-y-6 md:space-y-8">
          <VendorDetailAbout profile={profile} />
          <VendorDetailReviewFlow
            vendorId={vendor.id}
            vendorName={vendor.name}
            profile={profile}
            criteria={criteria}
            initialReviews={approvedReviews}
            initialReviewCount={vendor.reviewCount}
            session={session}
          />
        </div>

        <VendorDetailSidebar vendor={vendor} profile={profile} onContactVendor={() => setModalMode("contact")} />
      </div>

      {!session.user ? <ProfessionalCtaBanner className="mt-8 md:mt-10" /> : null}

      <VendorActionModal open={modalMode !== null} mode={modalMode ?? "share"} vendor={vendor} onClose={() => setModalMode(null)} />
    </>
  );
}
