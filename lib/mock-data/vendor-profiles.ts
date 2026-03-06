import type { VendorProfile } from "@/lib/types/vendor-profile";

export const mockVendorProfiles: VendorProfile[] = [
  {
    vendorId: "ven-wildflower-archive",
    aboutTitle: "About the Studio",
    aboutParagraphs: [
      "Wildflower Archive is a boutique floral design studio specializing in fine-art, seasonally inspired arrangements. Founded by Elena Vance in 2018, we focus on the intersection of Dutch Master still-lifes and the wild, unstructured beauty of the Hudson Valley landscape.",
      "We prioritize local growers and sustainable foraging, ensuring that every stem tells a story of the time and place in which it bloomed."
    ],
    serviceDetails: {
      categoryLabel: "Floral Design",
      priceRangeLabel: "$$$ — $$$$",
      availabilityLabel: "Now Booking 2026"
    },
    ctas: {
      saveLabel: "Save",
      shareLabel: "Share List",
      contactLabel: "Contact Vendor",
      leaveReviewLabel: "Leave a review",
      claimLabel: "Claim this page"
    }
  },
  {
    vendorId: "ven-golden-hour-stills",
    aboutTitle: "About",
    aboutParagraphs: ["Golden Hour Stills creates warm documentary imagery for weddings and destination celebrations."],
    serviceDetails: {
      categoryLabel: "Photography",
      priceRangeLabel: "$$ — $$$",
      availabilityLabel: "Now Booking"
    },
    ctas: {
      saveLabel: "Save",
      shareLabel: "Share List",
      contactLabel: "Contact Vendor",
      leaveReviewLabel: "Leave a review",
      claimLabel: "Claim this page"
    }
  },
  {
    vendorId: "ven-the-glass-house",
    aboutTitle: "About",
    aboutParagraphs: ["A design-forward venue with flexible indoor and outdoor settings in the desert."],
    serviceDetails: {
      categoryLabel: "Venues",
      priceRangeLabel: "$$$ — $$$$",
      availabilityLabel: "Now Booking"
    },
    ctas: {
      saveLabel: "Save",
      shareLabel: "Share List",
      contactLabel: "Contact Vendor",
      leaveReviewLabel: "Leave a review",
      claimLabel: "Claim this page"
    }
  }
];
