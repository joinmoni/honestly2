import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorSaveButton } from "@/components/lists/VendorSaveButton";
import type { SavedList, Vendor } from "@/lib/types/domain";

const vendor: Vendor = {
  id: "ven-1",
  slug: "wildflower-archive",
  name: "Wildflower Archive",
  verified: true,
  claimed: true,
  status: "active",
  ratingAvg: 4.9,
  reviewCount: 12,
  priceTier: "$$$",
  primaryCategory: { id: "cat-1", name: "Florals", slug: "florals" },
  subcategories: [],
  categories: [{ id: "cat-1", name: "Florals", slug: "florals" }],
  locations: [{ id: "loc-1", city: "Hudson Valley", region: "NY", isPrimary: true }],
  images: [{ id: "img-1", url: "https://images.unsplash.com/photo-1", kind: "cover", alt: "Wildflower Archive" }],
  socials: []
};

const lists: SavedList[] = [
  {
    id: "list-1",
    userId: "usr-001",
    name: "Summer Wedding",
    isPublic: false,
    items: []
  }
];

describe("VendorSaveButton", () => {
  it("opens the save modal and updates the button state when a list is selected", async () => {
    const user = userEvent.setup();

    render(
      <VendorSaveButton
        vendor={vendor}
        label="Save"
        initialLists={lists}
        currentUserId="usr-001"
      />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Save to list")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /summer wedding/i }));
    expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByText("Save to list")).not.toBeInTheDocument();
    });
  });
});
