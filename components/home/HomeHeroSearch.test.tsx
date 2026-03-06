import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import type { HomepageSearchIndex } from "@/lib/types/search";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push
  })
}));

const searchIndex: HomepageSearchIndex = {
  categories: [
    { id: "cat-photo", name: "Photography", slug: "photography", emoji: "📸", href: "/category/photography" },
    { id: "cat-floral", name: "Floral Design", slug: "floral-design", emoji: "🌿", href: "/category/floral-design" }
  ],
  vendors: [
    {
      id: "ven-wildflower-archive",
      name: "Wildflower Archive",
      slug: "wildflower-archive",
      imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=100",
      categoryLabel: "Floral Design",
      locationLabel: "Hudson Valley, NY"
    }
  ],
  locations: [
    { id: "brooklyn-ny", city: "Brooklyn", region: "NY", country: "USA", label: "Brooklyn, NY" },
    { id: "london-uk", city: "London", country: "UK", label: "London, UK" }
  ]
};

describe("HomeHeroSearch", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("shows who suggestions and supports keyboard selection", async () => {
    const user = userEvent.setup();

    render(<HomeHeroSearch searchWhoPlaceholder="Photography, Venues..." searchWherePlaceholder="London, UK" searchIndex={searchIndex} />);

    const whoInput = screen.getByLabelText("Who");
    await user.click(whoInput);
    await user.type(whoInput, "flo");

    await screen.findByText("Suggested Categories");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByDisplayValue("Floral Design")).toBeInTheDocument();
  });

  it("submits a combined homepage search to the vendors page", async () => {
    const user = userEvent.setup();

    render(<HomeHeroSearch searchWhoPlaceholder="Photography, Venues..." searchWherePlaceholder="London, UK" searchIndex={searchIndex} />);

    await user.type(screen.getByLabelText("Who"), "photography");
    await user.type(screen.getByLabelText("Where"), "London");

    await waitFor(() => expect(screen.getByText("Matching Locations")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Search vendors" }));

    expect(push).toHaveBeenCalledWith("/vendors?q=photography&where=London");
  });
});
