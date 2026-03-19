import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminRatingCriteriaScreen } from "@/components/admin/AdminRatingCriteriaScreen";
import {
  createAdminRatingCriterion,
  reorderAdminRatingCriteria,
  toggleAdminRatingCriterion,
  updateAdminRatingCriterion
} from "@/lib/admin-rating-criteria.client";
import { getAdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";

vi.mock("@/lib/admin-rating-criteria.client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-rating-criteria.client")>("@/lib/admin-rating-criteria.client");
  return {
    ...actual,
    createAdminRatingCriterion: vi.fn(actual.createAdminRatingCriterion),
    updateAdminRatingCriterion: vi.fn(actual.updateAdminRatingCriterion),
    toggleAdminRatingCriterion: vi.fn(actual.toggleAdminRatingCriterion),
    reorderAdminRatingCriteria: vi.fn(actual.reorderAdminRatingCriteria)
  };
});

describe("AdminRatingCriteriaScreen", () => {
  it("adds, edits, toggles, and reorders criteria locally", async () => {
    const user = userEvent.setup();
    const data = await getAdminRatingCriteriaData();

    render(<AdminRatingCriteriaScreen data={data} />);

    expect(screen.getByText("Communication")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Add Criterion/i }));
    expect(await screen.findByText("New Criterion 4")).toBeInTheDocument();
    expect(createAdminRatingCriterion).toHaveBeenCalled();

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]!);
    const editInput = screen.getByDisplayValue("Communication");
    await user.clear(editInput);
    await user.type(editInput, "Client Communication");
    await user.tab();
    expect(await screen.findByText("Client Communication")).toBeInTheDocument();
    expect(updateAdminRatingCriterion).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Toggle Professionalism" }));
    const professionalismHeading = screen.getByText("Professionalism");
    const professionalismRow = professionalismHeading.closest("article");
    if (!professionalismRow) throw new Error("expected professionalism row");
    expect(within(professionalismRow).getByText("Active")).toBeInTheDocument();
    expect(toggleAdminRatingCriterion).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Move Professionalism" }));
    const headings = screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent);
    expect(headings[1]).toBe("Professionalism");
    expect(reorderAdminRatingCriteria).toHaveBeenCalled();
  });
});
