import React from "react";
import { render, screen } from "@testing-library/react";

import { ListDetailScreen } from "@/components/collections/ListDetailScreen";
import type { ListDetailPageData } from "@/lib/types/collections";

const listDetailData: ListDetailPageData = {
  id: "list-1",
  name: "Summer Wedding 2026",
  description: "Ceremony and reception vendor shortlist",
  visibility: "private",
  vendorCount: 1,
  itemCountLabel: "1 vendor saved",
  shareSlug: undefined,
  sourceList: {
    id: "list-1",
    userId: "usr-001",
    name: "Summer Wedding 2026",
    isPublic: false,
    items: [{ vendorId: "ven-1", createdAt: "2026-02-20T00:00:00.000Z" }]
  },
  vendors: [
    {
      vendorId: "ven-1",
      vendorSlug: "wildflower-archive",
      vendorName: "Wildflower Archive",
      categoryLabel: "Floral Design",
      locationLabel: "Hudson Valley, NY",
      savedAtLabel: "20 Feb 2026",
      imageUrl: "https://images.example.com/vendor.jpg",
      note: ""
    }
  ],
  copy: {
    backHref: "/lists",
    backLabel: "Back to lists",
    visibilityPrivateLabel: "Private",
    visibilitySharedLabel: "Shared",
    shareLabel: "Shareable link ready",
    emptyTitle: "Nothing saved yet",
    emptyDescription: "Start collecting vendors here.",
    notesHeading: "Notes"
  }
};

describe("ListDetailScreen", () => {
  it("makes the vendor row clickable and shows the shortlist status as a pill", () => {
    render(<ListDetailScreen data={listDetailData} />);

    expect(screen.getByRole("link", { name: "Open Wildflower Archive" })).toHaveAttribute("href", "/vendor/wildflower-archive");
    expect(screen.queryByRole("link", { name: "View vendor" })).not.toBeInTheDocument();
    expect(screen.getByText("In shortlist").closest("div")).toHaveClass("bg-amber-100");
  });
});
