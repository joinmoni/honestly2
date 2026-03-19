import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CollectionsOverviewScreen } from "@/components/collections/CollectionsOverviewScreen";
import { persistCreateEmptyList, persistToggleVendorInList } from "@/lib/lists.client";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push
  })
}));

vi.mock("@/lib/lists.client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/lists.client")>("@/lib/lists.client");
  return {
    ...actual,
    persistCreateEmptyList: vi.fn(),
    persistToggleVendorInList: vi.fn()
  };
});

const baseCopy = {
  brandLabel: "honestly.",
  pageTitle: "Your Collections",
  pageDescription: "Organize your favorite vendors into shared lists for your projects and events.",
  createListLabel: "Create new list",
  newMoodboardLabel: "New Moodboard",
  allSavedVendorsTitle: "All Saved Vendors",
  addToListLabel: "Add to list",
  visibilityPrivateLabel: "Private",
  visibilitySharedLabel: "Shared"
};

describe("CollectionsOverviewScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new list from the header CTA and routes into it", async () => {
    const user = userEvent.setup();
    vi.mocked(persistCreateEmptyList).mockResolvedValue({
      id: "list-new-3",
      userId: "usr-001",
      name: "Create new list",
      isPublic: false,
      items: []
    });

    render(
      <CollectionsOverviewScreen
        userId="usr-001"
        copy={baseCopy}
        initialLists={[]}
        initialSavedLists={[]}
        savedRows={[]}
      />
    );

    await user.click(screen.getByRole("button", { name: /create new list/i }));

    await waitFor(() => {
      expect(persistCreateEmptyList).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/lists/list-new-3");
    });
  });

  it("creates a new list from the New Moodboard card and routes into it", async () => {
    const user = userEvent.setup();
    vi.mocked(persistCreateEmptyList).mockResolvedValue({
      id: "list-new-4",
      userId: "usr-001",
      name: "New Moodboard",
      isPublic: false,
      items: []
    });

    render(
      <CollectionsOverviewScreen
        userId="usr-001"
        copy={baseCopy}
        initialLists={[]}
        initialSavedLists={[]}
        savedRows={[]}
      />
    );

    await user.click(screen.getByRole("button", { name: "New Moodboard" }));

    await waitFor(() => {
      expect(persistCreateEmptyList).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/lists/list-new-4");
    });
  });

  it("opens the save modal from a saved vendor row and toggles a list", async () => {
    const user = userEvent.setup();
    vi.mocked(persistToggleVendorInList).mockResolvedValue([
      {
        id: "list-1",
        userId: "usr-001",
        name: "Summer Wedding 2026",
        isPublic: false,
        items: [{ vendorId: "ven-1", createdAt: "2026-03-09T10:00:00.000Z" }]
      }
    ]);

    render(
      <CollectionsOverviewScreen
        userId="usr-001"
        copy={baseCopy}
        initialLists={[
          {
            id: "list-1",
            name: "Summer Wedding 2026",
            href: "/lists/list-1",
            visibility: "private",
            vendorCount: 0,
            previewImageUrls: [],
            extraCount: 0
          }
        ]}
        initialSavedLists={[
          {
            id: "list-1",
            userId: "usr-001",
            name: "Summer Wedding 2026",
            isPublic: false,
            items: []
          }
        ]}
        savedRows={[
          {
            vendorId: "ven-1",
            vendorName: "Wildflower Archive",
            vendorSlug: "wildflower-archive",
            imageUrl: "/wildflower.jpg",
            categoryLabel: "Floral Design",
            locationLabel: "Hudson Valley, NY"
          }
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /add to list/i }));

    expect(screen.getByRole("heading", { name: /add to list/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /summer wedding 2026/i }));

    await waitFor(() => {
      expect(persistToggleVendorInList).toHaveBeenCalledWith(
        [
          {
            id: "list-1",
            userId: "usr-001",
            name: "Summer Wedding 2026",
            isPublic: false,
            items: []
          }
        ],
        "list-1",
        "ven-1"
      );
    });
  });
});
