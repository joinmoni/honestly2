import React from "react";
import { render, screen, within } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addAdminSubcategory,
  createAdminCategory,
  deleteAdminCategory,
  removeAdminSubcategory,
  reorderAdminHomepageCategories,
  toggleAdminHomepageCategory
} from "@/lib/admin-categories.client";
import { AdminTaxonomyScreen } from "@/components/admin/AdminTaxonomyScreen";
import { getAdminTaxonomyData } from "@/lib/services/admin-categories";

vi.mock("@/lib/admin-categories.client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-categories.client")>("@/lib/admin-categories.client");
  return {
    ...actual,
    createAdminCategory: vi.fn(actual.createAdminCategory),
    deleteAdminCategory: vi.fn(actual.deleteAdminCategory),
    addAdminSubcategory: vi.fn(actual.addAdminSubcategory),
    removeAdminSubcategory: vi.fn(actual.removeAdminSubcategory),
    toggleAdminHomepageCategory: vi.fn(actual.toggleAdminHomepageCategory),
    reorderAdminHomepageCategories: vi.fn(actual.reorderAdminHomepageCategories)
  };
});

describe("AdminTaxonomyScreen", () => {
  it("creates categories and manages homepage merchandising locally", async () => {
    const user = userEvent.setup();
    const data = await getAdminTaxonomyData();

    render(<AdminTaxonomyScreen data={data} />);

    await user.click(screen.getAllByRole("button", { name: "Add Sub" })[0]!);
    expect(await screen.findByText("New Sub 6")).toBeInTheDocument();
    expect(addAdminSubcategory).toHaveBeenCalled();

    const layoutPanel = screen.getByText("Arrange Featured Rows").closest("aside");
    if (!layoutPanel) throw new Error("expected homepage layout panel");
    expect(within(layoutPanel).getByText("Home Row 1")).toBeInTheDocument();
    expect(within(layoutPanel).getByText("Venues")).toBeInTheDocument();

    const featuredRowsBefore = within(layoutPanel).getAllByText(/Home Row \d/i);
    expect(featuredRowsBefore[0]).toHaveTextContent("Home Row 1");
    expect(featuredRowsBefore[1]).toHaveTextContent("Home Row 2");
    expect(featuredRowsBefore[2]).toHaveTextContent("Home Row 3");

    const venuesCard = within(layoutPanel).getByText("Venues").closest("div[draggable='true']");
    const floralCard = within(layoutPanel).getByText("Floral Design").closest("div[draggable='true']");
    if (!venuesCard || !floralCard) throw new Error("expected draggable featured cards");

    fireEvent.dragStart(floralCard);
    fireEvent.dragOver(venuesCard);
    fireEvent.drop(venuesCard);
    fireEvent.dragEnd(floralCard);
    expect(reorderAdminHomepageCategories).toHaveBeenCalled();

    const featuredRowsAfter = within(layoutPanel).getAllByText(/Home Row \d/i);
    expect(featuredRowsAfter[0]).toHaveTextContent("Home Row 1");
    expect(featuredRowsAfter[1]).toHaveTextContent("Home Row 2");
    expect(within(layoutPanel).getAllByText("Floral Design")[0]).toBeInTheDocument();

    const photographyCard = screen
      .getAllByRole("article")
      .find((card) => within(card).queryByRole("heading", { name: "Photography" }));
    if (!photographyCard) throw new Error("expected photography taxonomy card");
    await user.click(within(photographyCard).getByRole("button", { name: "Featured on Home" }));
    expect(toggleAdminHomepageCategory).toHaveBeenCalled();
    expect(screen.getByText("Not on Homepage")).toBeInTheDocument();
    expect(within(layoutPanel).queryByText("Photography")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /New Primary Category/i }));
    await user.type(screen.getByPlaceholderText("e.g., Event Planning"), "Catering");
    await user.click(screen.getByRole("button", { name: "Create Category" }));

    expect(await screen.findByText("Catering")).toBeInTheDocument();
    expect(createAdminCategory).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete Venues" }));
    expect(deleteAdminCategory).toHaveBeenCalled();
    expect(screen.queryByText("Venues")).not.toBeInTheDocument();
  }, 10000);
});
